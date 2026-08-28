"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  SERVICES,
  validateEnquiry,
  type EnquiryFields,
  type EnquiryErrors,
} from "@/lib/enquiry";

const EMPTY: EnquiryFields = {
  name: "",
  company: "",
  email: "",
  country: "",
  service: "",
  message: "",
};

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Partnership enquiry drawer.
 *
 * Right-hand panel from lg, full screen below it, on the site's charcoal
 * ground with the same hairline rules used elsewhere. Deliberately not a
 * card: no radius, no shadow, no elevation, no accent fill beyond the
 * orange the design system already reserves for micro-marks.
 *
 * The whole dialog is a client island rendered once by EnquiryProvider.
 */
export function EnquiryDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  const [fields, setFields] = useState<EnquiryFields>(EMPTY);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  /* Escape, focus trap, initial focus, and background scroll lock. All
     torn down together so nothing leaks if the drawer unmounts mid-state. */
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    // Focus the first control rather than the panel itself, so a screen
    // reader lands on something actionable and the heading is announced
    // via aria-labelledby.
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;

      // Wrap at both ends so Tab can never reach the page behind.
      if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus();
      } else if (event.shiftKey && active === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (active && !panel.contains(active)) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Lock the background. Compensating for the scrollbar keeps the page
    // behind from jumping sideways as it is hidden.
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [isOpen, onClose]);

  /* The panel stays mounted so it can slide, which would otherwise leave
     eight focusable controls sitting inside an aria-hidden subtree: an
     invisible tab stop and a contradiction for assistive technology.
     The inert attribute takes the whole panel out of the tab order and
     the accessibility tree while closed. Applied through a ref because
     React 18 does not accept it as a prop. */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (isOpen) panel.removeAttribute("inert");
    else panel.setAttribute("inert", "");
  }, [isOpen]);

  /* Reset back to a blank form once the drawer has closed, so reopening
     never shows a stale success panel or old validation errors. */
  useEffect(() => {
    if (isOpen) return;
    const timer = window.setTimeout(() => {
      setFields(EMPTY);
      setErrors({});
      setStatus("idle");
      setServerMessage(null);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const update = (key: keyof EnquiryFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as the visitor edits it, rather than
    // making them resubmit to find out whether they fixed it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validateEnquiry(fields);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Move the visitor to the first problem rather than leaving them to
      // hunt for it.
      const firstKey = Object.keys(found)[0];
      panelRef.current
        ?.querySelector<HTMLElement>(`[name="${firstKey}"]`)
        ?.focus();
      return;
    }

    setStatus("submitting");
    setServerMessage(null);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        if (response.status === 400 && payload?.errors) {
          setErrors(payload.errors as EnquiryErrors);
          setStatus("idle");
          return;
        }
        throw new Error(payload?.message ?? `Request failed (${response.status})`);
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setServerMessage(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong."
      );
    }
  };

  const submitting = status === "submitting";

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
    >
      {/* Backdrop. Dims the page rather than obscuring it, so the drawer
          reads as part of the site and not as a separate surface. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-charcoal/70 transition-opacity duration-500 ease-editorial ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className={`on-dark absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto border-ivory/15 bg-charcoal transition-transform duration-500 ease-editorial lg:w-[44vw] lg:min-w-[460px] lg:max-w-[680px] lg:border-l ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-6 pt-8 sm:px-10 lg:px-12 lg:pt-10">
          <p className="eyebrow">Partnership Enquiry</p>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-eyebrow uppercase tracking-[0.2em] text-ivory/70 transition-colors duration-300 hover:text-ivory"
          >
            Close
          </button>
        </div>

        <div className="px-6 pb-12 pt-6 sm:px-10 lg:px-12">
          <h2
            id={headingId}
            className="max-w-md font-display text-display-sm text-ivory"
          >
            Let&rsquo;s talk about your operation in Türkiye.
          </h2>

          <div className="mt-8 border-t border-ivory/15 pt-8">
            {status === "success" ? (
              <div role="status" aria-live="polite">
                <p className="max-w-md font-sans text-body-lg text-ivory/85">
                  Thank you. Our operations team will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost mt-10"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
                <Field
                  name="name"
                  label="Name"
                  value={fields.name}
                  error={errors.name}
                  onChange={update}
                  autoComplete="name"
                />
                <Field
                  name="company"
                  label="Company"
                  value={fields.company}
                  error={errors.company}
                  onChange={update}
                  autoComplete="organization"
                />
                <Field
                  name="email"
                  label="Business Email"
                  type="email"
                  value={fields.email}
                  error={errors.email}
                  onChange={update}
                  autoComplete="email"
                  inputMode="email"
                />
                <Field
                  name="country"
                  label="Country"
                  value={fields.country}
                  error={errors.country}
                  onChange={update}
                  autoComplete="country-name"
                />

                <SelectField
                  value={fields.service}
                  error={errors.service}
                  onChange={update}
                />

                <Field
                  name="message"
                  label="Message"
                  multiline
                  value={fields.message}
                  error={errors.message}
                  onChange={update}
                />

                {status === "error" && (
                  <p role="alert" className="field-error">
                    {serverMessage ?? "Something went wrong."} Please try again,
                    or email info@swtelite.com directly.
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send Enquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  value,
  error,
  onChange,
  type = "text",
  multiline = false,
  autoComplete,
  inputMode,
}: {
  name: keyof EnquiryFields;
  label: string;
  value: string;
  error?: string;
  onChange: (key: keyof EnquiryFields, value: string) => void;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  inputMode?: "email" | "text";
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    required: true,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: "field-control",
  };

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={4}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (key: keyof EnquiryFields, value: string) => void;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        What do you need?
      </label>
      <div className="relative">
        <select
          id={id}
          name="service"
          value={value}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange("service", e.target.value)}
          className="field-control pr-8"
        >
          {/* The list is OS-rendered, so its colours are set here rather
              than left to inherit a dark ground the platform ignores. */}
          <option value="" disabled className="bg-charcoal text-ivory">
            Select a service
          </option>
          {SERVICES.map((service) => (
            <option key={service} value={service} className="bg-charcoal text-ivory">
              {service}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute bottom-4 right-0 text-ivory/50"
        >
          <path d="m5 9 7 7 7-7" />
        </svg>
      </div>
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
