"use client";

import { forwardRef, useId, useRef, useState } from "react";
import { IconCheck, IconInfo } from "@/components/b2c/Icons";
import { TimeField } from "@/components/b2c/TransferSearchForm";
import { EQUIPMENT_NOTE, EQUIPMENT_OPTIONS } from "@/lib/b2c/business";
import { BOOKING, SERVICES } from "@/lib/b2c/copy";
import { locationLabel, type TransferLocation } from "@/lib/b2c/demo/locations";
import { formatDate } from "@/lib/b2c/locale";
import type { TransferSearch } from "@/lib/b2c/transfer-search";

type ServiceId = "shared" | "private";

type Leg = {
  key: "out" | "ret";
  label: string;
  from: TransferLocation;
  to: TransferLocation;
  date: string;
};

type FlightBlock = {
  id: string;
  kind: "arrival" | "departure";
  leg: Leg;
  airport: TransferLocation;
};

type Values = Record<string, string>;

const NOTES_MAX = 300;
const FLIGHT_RE = /^[A-Z0-9]{2}\s?\d{1,4}[A-Z]?$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The traveller details a real booking needs, shaped by the journey:
 * an arrival flight for every leg that starts at an airport, a departure
 * flight for every leg that ends at one, the hotel, every passenger and
 * the operational requests.
 *
 * It validates like the real form will and then shows a review. It does
 * not send anything anywhere: there is no booking system behind this
 * prototype, and the panel says so in plain words before and after.
 */
export const BookingDetails = forwardRef<HTMLElement, {
  search: TransferSearch;
  from: TransferLocation;
  to: TransferLocation;
  service: ServiceId;
}>(function BookingDetails({ search, from, to, service }, ref) {
  const formId = useId();
  const isReturn = search.trip === "return" && Boolean(search.returnDate);
  const legs: Leg[] = [
    { key: "out", label: isReturn ? "Outbound" : "Your journey", from, to, date: search.date },
    ...(isReturn ? [{ key: "ret" as const, label: "Return", from: to, to: from, date: search.returnDate }] : []),
  ];
  const flights: FlightBlock[] = legs.flatMap((leg) => [
    ...(leg.from.kind === "airport" ? [{ id: `${leg.key}-arr`, kind: "arrival" as const, leg, airport: leg.from }] : []),
    ...(leg.to.kind === "airport" ? [{ id: `${leg.key}-dep`, kind: "departure" as const, leg, airport: leg.to }] : []),
  ]);
  // Airport to airport has no hotel leg to ask about.
  const hotelSide = from.kind !== "airport" ? from : to.kind !== "airport" ? to : null;

  // Passenger rows: lead adult, other adults, then children (ages come
  // from the search, where they are validated against the fare rules).
  const others = [
    ...Array.from({ length: Math.max(0, search.adults - 1) }, (_, i) => ({ key: `a${i + 2}`, label: `Adult ${i + 2}`, age: null as number | null })),
    ...search.ages.map((age, i) => ({ key: `c${i + 1}`, label: `Child ${i + 1}`, age })),
  ];

  const [v, setV] = useState<Values>({});
  const [seats, setSeats] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [errors, setErrors] = useState<Values>({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>({});
  const reviewRef = useRef<HTMLDivElement>(null);

  const validate = (values: Values) => {
    const e: Values = {};
    const req = (k: string, msg: string) => {
      if (!values[k]?.trim()) e[k] = msg;
    };
    req("lead-first", "Enter the lead passenger’s first name.");
    req("lead-last", "Enter the lead passenger’s last name.");
    if (!values.email?.trim()) e.email = "Enter an email address for the booking.";
    else if (!EMAIL_RE.test(values.email.trim())) e.email = "Enter a valid email address.";
    const digits = (values.phone ?? "").replace(/\D/g, "");
    if (!values.phone?.trim()) e.phone = "Enter a mobile number we can reach on the day.";
    else if (digits.length < 7 || !/^\+?[\d\s()-]+$/.test(values.phone.trim())) e.phone = "Enter the number with its country code, e.g. +44 7700 900123.";
    for (const f of flights) {
      const k = `${f.id}-number`;
      if (!values[k]?.trim()) e[k] = "Enter the flight number.";
      else if (!FLIGHT_RE.test(values[k].trim())) e[k] = "Use the airline code and number, e.g. TK 2412.";
      if (f.kind === "departure" && !values[`${f.id}-time`]) e[`${f.id}-time`] = "Enter the scheduled departure time.";
    }
    if (hotelSide) req("hotel", "Enter the name of your hotel or accommodation.");
    if ((values.notes ?? "").length > NOTES_MAX) e.notes = `Please keep notes under ${NOTES_MAX} characters.`;
    return e;
  };

  const set = (k: string, value: string) => {
    const next = { ...v, [k]: value };
    setV(next);
    setReviewing(false);
    if (submitted) setErrors(validate(next));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(v);
    setSubmitted(true);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      fieldRefs.current[first]?.focus();
      setReviewing(false);
      return;
    }
    setReviewing(true);
    requestAnimationFrame(() => {
      reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      reviewRef.current?.focus({ preventScroll: true });
    });
  };

  const field = (k: string, label: string, opts: { type?: string; hint?: string; optional?: boolean; autoComplete?: string; inputMode?: "text" | "email" | "tel"; placeholder?: string } = {}) => (
    <TextField
      key={k}
      id={`${formId}-${k}`}
      label={label}
      value={v[k] ?? ""}
      onChange={(x) => set(k, x)}
      error={errors[k]}
      hint={opts.hint}
      optional={opts.optional}
      type={opts.type}
      autoComplete={opts.autoComplete}
      inputMode={opts.inputMode}
      placeholder={opts.placeholder}
      ref={(el) => {
        fieldRefs.current[k] = el;
      }}
    />
  );

  const errorCount = Object.keys(errors).length;

  return (
    <section ref={ref} id="booking-details" aria-labelledby={`${formId}-title`} className="scroll-mt-[calc(var(--header-h)+16px)] border-t border-graphite/20 pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">{BOOKING.step}</p>
          <h2 id={`${formId}-title`} className="font-display text-display-sm">{BOOKING.title}</h2>
        </div>
        <p className="font-sans text-small text-graphite">{SERVICES[service].name}</p>
      </div>
      <p className="mt-3 flex max-w-2xl gap-2 border-l-2 border-brand-amber bg-bone/70 p-3 font-sans text-small text-ink">
        <IconInfo size={18} className="mt-0.5 shrink-0" />
        {BOOKING.prototype}
      </p>

      <form noValidate onSubmit={submit} className="mt-8 space-y-10" aria-describedby={`${formId}-summary`}>
        {/* ---- Lead passenger ---- */}
        <Group title={BOOKING.lead} hint={BOOKING.leadHint}>
          <div className="grid gap-3 sm:grid-cols-2">
            {field("lead-first", "First name", { autoComplete: "given-name" })}
            {field("lead-last", "Last name", { autoComplete: "family-name" })}
            {field("email", "Email", { type: "email", inputMode: "email", autoComplete: "email", hint: BOOKING.emailHint })}
            {field("phone", "Mobile phone", { type: "tel", inputMode: "tel", autoComplete: "tel", hint: BOOKING.phoneHint, placeholder: "+44 7700 900123" })}
          </div>
        </Group>

        {/* ---- Other passengers ---- */}
        {others.length > 0 && (
          <Group title={BOOKING.others} hint={BOOKING.othersHint}>
            <ul className="space-y-3">
              {others.map((o) => (
                <li key={o.key} className="grid gap-3 sm:grid-cols-[8rem_1fr_1fr] sm:items-start">
                  <p className="pt-2 font-sans text-small text-ink sm:pt-6">
                    {o.label}
                    {o.age !== null && (
                      <span className="block text-graphite">
                        {o.age === 0 ? "Under 1" : `Age ${o.age}`}
                        {service === "shared" && ` · ${o.age < 3 ? BOOKING.under3 : BOOKING.child}`}
                      </span>
                    )}
                  </p>
                  {field(`${o.key}-first`, "First name", { optional: true, autoComplete: "off" })}
                  {field(`${o.key}-last`, "Last name", { optional: true, autoComplete: "off" })}
                </li>
              ))}
            </ul>
            {search.children > 0 && <p className="mt-3 font-sans text-[0.8125rem] text-graphite">{BOOKING.agesNote}</p>}
          </Group>
        )}

        {/* ---- Flights ---- */}
        {flights.length > 0 && (
          <Group title={BOOKING.flights} hint={BOOKING.flightsHint}>
            <div className="space-y-6">
              {flights.map((f) => (
                <fieldset key={f.id} className="border border-graphite/15 bg-white/40 p-4 sm:p-5">
                  <legend className="px-1 font-sans text-small font-medium text-ink">
                    {f.kind === "arrival" ? BOOKING.arrival : BOOKING.departure}
                    <span className="font-normal text-graphite">
                      {" "}
                      · {locationLabel(f.airport)} · {formatDate(f.leg.date, "short")}
                      {isReturn ? ` · ${f.leg.label}` : ""}
                    </span>
                  </legend>
                  <div className="mt-2 grid gap-3 sm:grid-cols-3">
                    {field(`${f.id}-number`, "Flight number", { placeholder: "TK 2412", autoComplete: "off" })}
                    {field(`${f.id}-airline`, "Airline", { optional: true, autoComplete: "off" })}
                    {f.kind === "arrival"
                      ? field(`${f.id}-origin`, "Flying in from", { optional: true, autoComplete: "off" })
                      : (
                        <TimeField
                          label="Departure time"
                          required
                          value={v[`${f.id}-time`] ?? ""}
                          onChange={(x) => set(`${f.id}-time`, x)}
                          error={errors[`${f.id}-time`]}
                          hint={BOOKING.departureTimeHint}
                          hourRef={(el) => {
                            fieldRefs.current[`${f.id}-time`] = el;
                          }}
                        />
                      )}
                  </div>
                </fieldset>
              ))}
            </div>
          </Group>
        )}

        {/* ---- Hotel ---- */}
        {hotelSide && (
          <Group title={BOOKING.hotel} hint={BOOKING.hotelHint(hotelSide.name)}>
            <div className="grid gap-3 sm:grid-cols-2">
              {field("hotel", "Hotel or accommodation name", { autoComplete: "off" })}
              {field("hotel-address", "Address or directions", { optional: true, autoComplete: "street-address" })}
            </div>
          </Group>
        )}

        {/* ---- Requests ---- */}
        <Group title={BOOKING.requests}>
          {search.children > 0 && (
            <div className="flex items-center justify-between gap-4 border-b border-graphite/15 pb-4">
              <div>
                <p className="font-sans text-small text-ink" id={`${formId}-seats`}>Child seats</p>
                <p className="font-sans text-[0.8125rem] text-graphite">{BOOKING.seatsHint}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="One fewer child seat" disabled={seats <= 0} onClick={() => setSeats(seats - 1)} className="flex h-11 w-11 items-center justify-center border border-graphite/30 disabled:opacity-35">−</button>
                <output aria-labelledby={`${formId}-seats`} className="w-5 text-center font-sans text-body tabular-nums">{seats}</output>
                <button type="button" aria-label="One more child seat" disabled={seats >= search.children} onClick={() => setSeats(seats + 1)} className="flex h-11 w-11 items-center justify-center border border-graphite/30 disabled:opacity-35">+</button>
              </div>
            </div>
          )}
          <fieldset className="mt-4">
            <legend className="font-sans text-small text-ink">Items to declare</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map((o) => {
                const on = items.includes(o.id);
                return (
                  <label key={o.id} className={`chip cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${on ? "border-ink bg-ink text-ivory" : ""}`}>
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => { setItems(on ? items.filter((i) => i !== o.id) : [...items, o.id]); setReviewing(false); }} />
                    {o.label}
                  </label>
                );
              })}
            </div>
            <p className="mt-2 font-sans text-[0.8125rem] text-graphite">{EQUIPMENT_NOTE}</p>
          </fieldset>
          <div className="mt-4">
            <TextArea
              id={`${formId}-notes`}
              label="Notes for our operations team"
              hint={BOOKING.notesHint}
              value={v.notes ?? ""}
              onChange={(x) => set("notes", x)}
              error={errors.notes}
              max={NOTES_MAX}
              ref={(el) => {
                fieldRefs.current.notes = el;
              }}
            />
          </div>
        </Group>

        <div>
          <p id={`${formId}-summary`} aria-live="polite" className={`font-sans text-small text-[#9A3A12] ${errorCount ? "mb-3" : "sr-only"}`}>
            {errorCount ? (errorCount === 1 ? "One detail needs attention." : `${errorCount} details need attention.`) : ""}
          </p>
          <button type="submit" className="btn-outline w-full border-ink py-4 sm:w-auto">
            {BOOKING.review}
          </button>
        </div>
      </form>

      {/* ---- Review (no submission) ---- */}
      {reviewing && (
        <div ref={reviewRef} tabIndex={-1} className="mt-8 scroll-mt-[calc(var(--header-h)+16px)] border border-ink bg-white/60 p-5 focus:outline-none sm:p-6" aria-labelledby={`${formId}-review`}>
          <h3 id={`${formId}-review`} className="flex items-center gap-2 font-sans text-small font-medium uppercase tracking-[0.12em] text-ink">
            <IconCheck size={16} className="text-brand-navy" />
            {BOOKING.reviewTitle}
          </h3>
          <dl className="mt-4 divide-y divide-graphite/15 font-sans text-small">
            <Row term="Service" value={SERVICES[service].name} />
            {legs.map((l) => (
              <Row key={l.key} term={l.label} value={`${locationLabel(l.from)} → ${locationLabel(l.to)}, ${formatDate(l.date, "long")}`} />
            ))}
            <Row term="Lead passenger" value={`${v["lead-first"]} ${v["lead-last"]} · ${v.email} · ${v.phone}`} />
            {flights.map((f) => (
              <Row
                key={f.id}
                term={f.kind === "arrival" ? `Arrival flight (${f.airport.code})` : `Departure flight (${f.airport.code})`}
                value={[v[`${f.id}-number`]?.toUpperCase(), v[`${f.id}-airline`], f.kind === "departure" ? v[`${f.id}-time`] : v[`${f.id}-origin`] && `from ${v[`${f.id}-origin`]}`].filter(Boolean).join(" · ")}
              />
            ))}
            {hotelSide && <Row term="Hotel" value={[v.hotel, v["hotel-address"]].filter(Boolean).join(", ")} />}
            {(seats > 0 || items.length > 0) && (
              <Row
                term="Requests"
                value={[seats ? `${seats} child ${seats === 1 ? "seat" : "seats"}` : "", ...items.map((i) => EQUIPMENT_OPTIONS.find((o) => o.id === i)!.label)].filter(Boolean).join(", ")}
              />
            )}
            {v.notes?.trim() && <Row term="Notes" value={v.notes.trim()} />}
          </dl>
          <p className="mt-4 flex gap-2 font-sans text-small text-ink">
            <IconInfo size={18} className="mt-0.5 shrink-0" />
            {BOOKING.notSent}
          </p>
        </div>
      )}
    </section>
  );
});

function Group({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="font-display text-[1.375rem] leading-snug text-ink">{title}</legend>
      {hint && <p className="mt-1 max-w-2xl font-sans text-small text-graphite">{hint}</p>}
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-graphite">{term}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

const TextField = forwardRef<HTMLInputElement, {
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
}>(function TextField({ id, label, value, onChange, error, hint, optional, type = "text", autoComplete, inputMode, placeholder }, ref) {
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
          className="sf-input [color-scheme:light]"
        />
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 font-sans text-[0.8125rem] text-graphite">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="sf-error">{error}</p>
      )}
    </div>
  );
});

const TextArea = forwardRef<HTMLTextAreaElement, {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  max: number;
}>(function TextArea({ id, label, hint, value, onChange, error, max }, ref) {
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
        aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        className="mt-2 w-full border border-graphite/25 bg-white/70 p-3 font-sans text-small text-ink focus:border-ink"
      />
      <p className={`text-right font-sans text-[0.75rem] ${value.length > max ? "text-[#9A3A12]" : "text-graphite"}`}>
        {value.length}/{max}
      </p>
      {error && <p id={`${id}-error`} className="sf-error">{error}</p>}
    </div>
  );
});
