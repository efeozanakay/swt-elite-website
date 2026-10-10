"use client";

import { forwardRef, type ReactNode } from "react";
import type { Tone } from "@/lib/b2c/booking/status-copy";

/**
 * Form and display primitives for the booking steps. Extracted from the
 * original single-page BookingDetails form so every step uses the same
 * boxed `sf-cell` field as the search panel.
 */

export function Group({ title, hint, children, id }: { title: string; hint?: string; children: ReactNode; id?: string }) {
  return (
    <fieldset id={id} className="scroll-mt-[calc(var(--header-h)+16px)]">
      <legend className="font-display text-[1.375rem] leading-snug text-ink">{title}</legend>
      {hint && <p className="mt-1 max-w-2xl font-sans text-small text-graphite">{hint}</p>}
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

export function Row({ term, value, children }: { term: string; value?: string; children?: ReactNode }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-graphite">{term}</dt>
      <dd className="text-ink">{children ?? value}</dd>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  placeholder?: string;
  min?: string;
  max?: string;
};

export const TextField = forwardRef<HTMLInputElement, FieldProps>(function TextField(
  { id, label, value, onChange, error, hint, optional, type = "text", autoComplete, inputMode, placeholder, min, max },
  ref
) {
  const describedBy = (error ? `${id}-error` : hint ? `${id}-hint` : "") || undefined;
  return (
    <div>
      <div className="sf-cell min-h-[3.75rem]" data-invalid={error ? "true" : undefined}>
        <label htmlFor={id} className="sf-label flex justify-between gap-2">
          <span>{label}</span>
          {optional && <span className="normal-case tracking-normal text-graphite/80">Optional</span>}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={optional ? undefined : true}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          min={min}
          max={max}
          className="sf-input [color-scheme:light]"
        />
      </div>
      {hint && !error && <p id={`${id}-hint`} className="mt-1 font-sans text-[0.8125rem] text-graphite">{hint}</p>}
      {error && <p id={`${id}-error`} className="sf-error">{error}</p>}
    </div>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  Omit<FieldProps, "type" | "inputMode" | "placeholder" | "autoComplete" | "min" | "max"> & {
    options: { value: string; label: string }[];
    emptyLabel: string;
  }
>(function SelectField({ id, label, value, onChange, error, hint, optional, options, emptyLabel }, ref) {
  const describedBy = (error ? `${id}-error` : hint ? `${id}-hint` : "") || undefined;
  return (
    <div>
      <div className="sf-cell min-h-[3.75rem]" data-invalid={error ? "true" : undefined}>
        <label htmlFor={id} className="sf-label flex justify-between gap-2">
          <span>{label}</span>
          {optional && <span className="normal-case tracking-normal text-graphite/80">Optional</span>}
        </label>
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="sf-input cursor-pointer"
        >
          <option value="">{emptyLabel}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      {hint && !error && <p id={`${id}-hint`} className="mt-1 font-sans text-[0.8125rem] text-graphite">{hint}</p>}
      {error && <p id={`${id}-error`} className="sf-error">{error}</p>}
    </div>
  );
});

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  { id: string; label: string; hint?: string; value: string; onChange: (v: string) => void; error?: string; max: number }
>(function TextArea({ id, label, hint, value, onChange, error, max }, ref) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-small text-ink">{label}</label>
      {hint && <p id={`${id}-hint`} className="font-sans text-[0.8125rem] text-graphite">{hint}</p>}
      <textarea
        ref={ref}
        id={id}
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-error` : "", `${id}-count`].filter(Boolean).join(" ")}
        className="mt-2 w-full border border-graphite/25 bg-white/70 p-3 font-sans text-small text-ink focus:border-ink"
      />
      <p id={`${id}-count`} className={`text-right font-sans text-[0.75rem] ${value.length > max ? "text-[#9A3A12]" : "text-graphite"}`}>
        {value.length}/{max}
      </p>
      {error && <p id={`${id}-error`} className="sf-error">{error}</p>}
    </div>
  );
});

const TONE: Record<Tone, string> = {
  neutral: "border-graphite/30 text-graphite",
  pending: "border-graphite/40 bg-bone text-ink",
  positive: "border-brand-navy/50 text-brand-navy",
  attention: "border-[#9A3A12]/60 text-[#9A3A12]",
};

/** A status pill. Colour is secondary: the text always names the state. */
export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-sans text-[0.75rem] font-medium ${TONE[tone]}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tone === "pending" ? "border border-current" : "bg-current"}`} />
      {label}
    </span>
  );
}

/** Callout used for prototype and operational notices. */
export function Notice({ children, tone = "info", icon }: { children: ReactNode; tone?: "info" | "warn"; icon?: ReactNode }) {
  return (
    <div
      className={`flex gap-2.5 border-l-2 p-3 font-sans text-small text-ink ${
        tone === "warn" ? "border-[#9A3A12] bg-bone/70" : "border-brand-amber bg-bone/70"
      }`}
    >
      {icon}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
