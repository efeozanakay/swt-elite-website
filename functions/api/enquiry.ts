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

/* Email palette, taken from the site's own tokens. Kept here as literals
   because an email cannot read the Tailwind config at runtime, and every
   value has to be inlined into the markup anyway. */
const CHARCOAL = "#15130F";
const INK = "#1D1B15";
const MUTED = "#6E6656";
const BONE = "#EAE2D0";
const WASH = "#FAF7F0";
const HAIRLINE = "#E3DCCB";
const ACCENT = "#D2601F";

/* Websafe only. No webfont can be relied on in Outlook, and loading one
   would be an external request in an email client. */
const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',Times,serif";

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

  // Turnstile, when configured. Verified here rather than trusted from
  // the client, which is the entire point: a token is only meaningful
  // once Cloudflare has confirmed it, once, server-side.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = typeof payload.turnstileToken === "string" ? payload.turnstileToken : "";
    if (!token) {
      return json({ message: "Please try again." }, 400);
    }

    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET_KEY);
    form.append("response", token);
    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) form.append("remoteip", ip);

    try {
      const verify = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        { method: "POST", body: form }
      );
      const outcome = (await verify.json()) as { success?: boolean; "error-codes"?: string[] };
      if (!outcome.success) {
        console.error("enquiry: turnstile rejected", JSON.stringify(outcome["error-codes"] ?? []));
        return json({ message: "We could not verify that request." }, 403);
      }
    } catch (error) {
      console.error("enquiry: turnstile verification failed", error);
      return json({ message: "We could not verify that request." }, 502);
    }
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
    ["Name", fields.name.trim()],
    ["Company", fields.company.trim()],
    ["Business Email", fields.email.trim()],
    ["Country", fields.country.trim()],
    ["Service", fields.service.trim()],
  ];

  const text = [
    "SWT ELITE — NEW PARTNERSHIP ENQUIRY",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    fields.message.trim(),
    "",
    "—",
    "Sent from the swtelite.com partnership enquiry form.",
  ].join("\n");

  /* Label and value are separate table rows rather than a styled <strong>
     on one line. The previous version leaned on display:inline-block with
     a min-width, both of which Gmail and Outlook strip, so the label
     collapsed straight into the value and arrived as "NameEfe Ozan Akay".

     Everything below is table-based with inline styles, websafe fonts and
     no external assets, which is what survives Outlook's Word renderer. */

  const emailRow = (label: string, valueHtml: string) =>
    [
      `<tr><td style="padding:0 0 6px 0;font-family:${SANS};font-size:11px;line-height:1.3;letter-spacing:0.16em;text-transform:uppercase;color:${MUTED};">${escapeHtml(
        label
      ).toUpperCase()}</td></tr>`,
      `<tr><td style="padding:0 0 26px 0;font-family:${SANS};font-size:16px;line-height:1.5;color:${INK};">${valueHtml}</td></tr>`,
    ].join("");

  const emailAddress = escapeHtml(fields.email.trim());

  const html = [
    `<body style="margin:0;padding:0;background-color:${BONE};">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BONE};margin:0;padding:0;">`,
    '<tr><td align="center" style="padding:32px 16px;">',

    `<table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:620px;max-width:620px;background-color:#FFFFFF;border:1px solid ${HAIRLINE};">`,

    // Header
    '<tr><td style="padding:38px 40px 0 40px;">',
    `<div style="font-family:${SANS};font-size:11px;line-height:1;letter-spacing:0.24em;text-transform:uppercase;color:${MUTED};">SWT Elite</div>`,
    `<div style="font-family:${SERIF};font-size:23px;line-height:1.25;letter-spacing:0.05em;text-transform:uppercase;color:${CHARCOAL};padding-top:15px;">New Partnership Enquiry</div>`,
    '</td></tr>',

    // Single short accent rule, drawn as a table cell so Outlook honours it
    '<tr><td style="padding:20px 40px 0 40px;">',
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="44" height="2" style="width:44px;height:2px;background-color:${ACCENT};font-size:0;line-height:0;">&nbsp;</td></tr></table>`,
    '</td></tr>',

    // Fields
    '<tr><td style="padding:34px 40px 0 40px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">',
    ...rows.map(([label, value]) =>
      label === "Business Email"
        ? emailRow(
            label,
            `<a href="mailto:${emailAddress}" style="color:${INK};text-decoration:underline;">${emailAddress}</a>`
          )
        : emailRow(label, escapeHtml(value))
    ),
    '</table>',
    '</td></tr>',

    // Message, set apart on its own warm ground
    '<tr><td style="padding:6px 40px 0 40px;">',
    `<div style="font-family:${SANS};font-size:11px;line-height:1.3;letter-spacing:0.16em;text-transform:uppercase;color:${MUTED};padding-bottom:10px;">Message</div>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${WASH};border:1px solid ${HAIRLINE};"><tr><td style="padding:20px 22px;font-family:${SANS};font-size:16px;line-height:1.65;color:${INK};">${escapeHtml(
      fields.message.trim()
    ).replace(/\r?\n/g, "<br>")}</td></tr></table>`,
    '</td></tr>',

    // Footer
    '<tr><td style="padding:34px 40px 36px 40px;">',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="height:1px;background-color:${HAIRLINE};font-size:0;line-height:0;">&nbsp;</td></tr></table>`,
    `<div style="font-family:${SANS};font-size:12px;line-height:1.6;color:${MUTED};padding-top:18px;">Sent from the swtelite.com partnership enquiry form.</div>`,
    '</td></tr>',

    '</table>',
    '</td></tr>',
    '</table>',
    '</body>',
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

