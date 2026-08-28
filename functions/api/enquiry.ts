import { validateEnquiry, type EnquiryFields } from "../../lib/enquiry";

/**
 * POST /api/enquiry — Cloudflare Pages Function.
 *
 * The site is a static export, so a Next.js API route is not available;
 * Pages Functions run as a Worker alongside the static output and are the
 * supported way to add a server endpoint here.
 *
 * Every secret is read from the environment. Nothing is defaulted to a
 * literal, so a missing binding fails loudly at request time rather than
 * silently sending from, or to, the wrong place.
 */

/**
 * Minimal local shape for the handler. The real signature comes from
 * @cloudflare/workers-types, but that would be a dependency added purely
 * to name one type, so the two fields this file actually uses are
 * declared here instead.
 */
type PagesFunctionContext<E> = { request: Request; env: E };
type Handler<E> = (ctx: PagesFunctionContext<E>) => Promise<Response>;

type Env = {
  RESEND_API_KEY: string;
  ENQUIRY_TO: string;
  ENQUIRY_FROM: string;
  TURNSTILE_SECRET_KEY?: string;
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

/** Keeps header-injection out of the subject line and stops a pasted
 *  novel from becoming an unreadable one. */
const clean = (value: string, max = 200) =>
  value.replace(/[\r\n]+/g, " ").trim().slice(0, max);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const onRequestPost: Handler<Env> = async ({ request, env }) => {
  let payload: Partial<EnquiryFields> & { turnstileToken?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ message: "Malformed request." }, 400);
  }

  const fields: EnquiryFields = {
    name: String(payload.name ?? ""),
    company: String(payload.company ?? ""),
    email: String(payload.email ?? ""),
    country: String(payload.country ?? ""),
    service: String(payload.service ?? ""),
    message: String(payload.message ?? ""),
  };

  // The browser checks the same rules, but anything the browser checks can
  // be skipped by posting here directly, so this is the copy that decides.
  const errors = validateEnquiry(fields);
  if (Object.keys(errors).length > 0) {
    return json({ message: "Please check the form.", errors }, 400);
  }

  if (!env.RESEND_API_KEY || !env.ENQUIRY_TO || !env.ENQUIRY_FROM) {
    // Deliberately explicit in the log and vague to the caller: the
    // visitor cannot act on a misconfiguration and should not be told
    // which bindings a deployment is missing.
    console.error(
      "enquiry: missing environment bindings",
      JSON.stringify({
        RESEND_API_KEY: Boolean(env.RESEND_API_KEY),
        ENQUIRY_TO: Boolean(env.ENQUIRY_TO),
        ENQUIRY_FROM: Boolean(env.ENQUIRY_FROM),
      })
    );
    return json({ message: "The enquiry service is unavailable." }, 503);
  }

  const subject = `New Partnership Enquiry — ${clean(fields.company, 80)} — ${clean(
    fields.service,
    40
  )}`;

  const rows: Array<[string, string]> = [
    ["Name", fields.name],
    ["Company", fields.company],
    ["Business Email", fields.email],
    ["Country", fields.country],
    ["Service", fields.service],
  ];

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value.trim()}`),
    "",
    "Message:",
    fields.message.trim(),
    "",
    "—",
    "Sent from the swtelite.com partnership enquiry form.",
  ].join("\n");

  const html = [
    '<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1D1B15">',
    ...rows.map(
      ([label, value]) =>
        `<p style="margin:0 0 6px"><strong style="display:inline-block;min-width:130px;color:#4A4638">${label}</strong>${escapeHtml(
          value.trim()
        )}</p>`
    ),
    '<p style="margin:18px 0 6px"><strong style="color:#4A4638">Message</strong></p>',
    `<p style="margin:0;white-space:pre-wrap">${escapeHtml(fields.message.trim())}</p>`,
    '<hr style="border:0;border-top:1px solid #C7BEA7;margin:24px 0">',
    '<p style="margin:0;font-size:13px;color:#4A4638">Sent from the swtelite.com partnership enquiry form.</p>',
    "</div>",
  ].join("");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.ENQUIRY_FROM,
        to: [env.ENQUIRY_TO],
        // So hitting reply in the inbox answers the enquirer directly
        // rather than the no-reply sending address.
        reply_to: fields.email.trim(),
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("enquiry: resend rejected", response.status, detail.slice(0, 500));
      return json({ message: "We could not send your enquiry." }, 502);
    }
  } catch (error) {
    console.error("enquiry: resend request failed", error);
    return json({ message: "We could not send your enquiry." }, 502);
  }

  return json({ ok: true }, 200);
};

