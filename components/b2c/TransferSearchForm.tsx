"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LocationField } from "@/components/b2c/LocationField";
import { PassengerField } from "@/components/b2c/PassengerField";
import { SEARCH } from "@/lib/b2c/copy";
import { locationById } from "@/lib/b2c/demo/locations";
import { toISODate } from "@/lib/b2c/locale";
import {
  EMPTY_SEARCH,
  searchFromParams,
  searchToQuery,
  timeLabel,
  validateSearch,
  type SearchErrors,
  type TransferSearch,
} from "@/lib/b2c/transfer-search";

/** Fired by destination shortcuts elsewhere on the page. */
export const PREFILL_EVENT = "swt:transfer-prefill";
export type PrefillDetail = Partial<Pick<TransferSearch, "from" | "to">>;

export function TransferSearchForm({
  initial,
  onSearch,
  submitLabel = SEARCH.submit,
  readUrl = false,
}: {
  initial?: TransferSearch;
  /** Called with a valid search. Defaults to navigating to the results. */
  onSearch?: (search: TransferSearch) => void;
  submitLabel?: string;
  /** Restore a search from the page's own query string on mount. */
  readUrl?: boolean;
}) {
  const router = useRouter();
  const formId = useId();
  const [s, setS] = useState<TransferSearch>(initial ?? EMPTY_SEARCH);
  const [errors, setErrors] = useState<SearchErrors>({});
  const [submitted, setSubmitted] = useState(false);
  // `min` on the date inputs is set after mount: the page is statically
  // exported, so "today" at build time would be wrong by the time it is
  // served.
  const [today, setToday] = useState<string | undefined>();
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const returnRef = useRef<HTMLInputElement>(null);

  useEffect(() => setToday(toISODate(new Date())), []);

  useEffect(() => {
    if (!readUrl) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("from") || params.has("to")) setS(searchFromParams(params));
  }, [readUrl]);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<PrefillDetail>).detail;
      setS((prev) => ({ ...prev, ...detail }));
      setErrors({});
      // Route filled in, so the next thing to ask for is the date.
      requestAnimationFrame(() => dateRef.current?.focus({ preventScroll: true }));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const from = locationById(s.from);
  const to = locationById(s.to);

  // Once a submit has failed, re-validate as the visitor fixes things so
  // each message disappears the moment it no longer applies.
  useEffect(() => {
    if (submitted) setErrors(validateSearch(s));
  }, [s, submitted]);

  const update = (patch: Partial<TransferSearch>) =>
    setS((prev) => ({ ...prev, ...patch }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateSearch(s);
    setSubmitted(true);
    setErrors(found);
    const order: [keyof SearchErrors, React.RefObject<HTMLInputElement>][] = [
      ["from", fromRef],
      ["to", toRef],
      ["date", dateRef],
      ["returnDate", returnRef],
    ];
    const first = order.find(([k]) => found[k]);
    if (first) {
      first[1].current?.focus();
      return;
    }
    if (onSearch) onSearch(s);
    else router.push(`/transfers/results?${searchToQuery(s)}`);
  };

  const errorCount = Object.keys(errors).length;
  const isReturn = s.trip === "return";

  return (
    <form onSubmit={submit} noValidate aria-describedby={`${formId}-summary`}>
      <fieldset className="mb-4 flex items-end justify-between gap-4">
        <legend className="sr-only">{SEARCH.tripLegend}</legend>
        <div className="flex">
          {(["oneway", "return"] as const).map((trip) => (
            <label
              key={trip}
              className={`relative cursor-pointer border-b-2 px-1 pb-2 pr-6 font-sans text-small uppercase tracking-[0.12em] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 ${
                s.trip === trip
                  ? "border-brand-amber text-ink"
                  : "border-transparent text-graphite hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name={`${formId}-trip`}
                value={trip}
                checked={s.trip === trip}
                onChange={() => update({ trip })}
                className="sr-only"
              />
              {trip === "oneway" ? SEARCH.oneWay : SEARCH.roundTrip}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,1.05fr)_auto] lg:gap-0">
        <div className="relative col-span-2 lg:col-span-1">
          <LocationField
            label={SEARCH.from}
            placeholder={SEARCH.fromPlaceholder}
            value={s.from}
            onChange={(id) => update({ from: id })}
            other={to}
            error={errors.from}
            inputRef={fromRef}
            cellClassName="lg:pr-7"
          />
          <button
            type="button"
            aria-label={SEARCH.swap}
            onClick={() => update({ from: s.to, to: s.from })}
            className="absolute right-4 top-full z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-graphite/30 bg-ivory text-ink transition-colors hover:border-ink lg:right-0 lg:top-[2.125rem] lg:h-7 lg:w-7 lg:translate-x-1/2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="rotate-90 lg:rotate-0">
              <path d="M4 8h14l-4-4M20 16H6l4 4" />
            </svg>
          </button>
        </div>
        <LocationField
          label={SEARCH.to}
          placeholder={SEARCH.toPlaceholder}
          value={s.to}
          onChange={(id) => update({ to: id })}
          other={from}
          error={errors.to}
          inputRef={toRef}
          cellClassName="lg:pl-7"
          className="col-span-2 lg:col-span-1 lg:-ml-px"
        />
        <DateField
          label={SEARCH.date}
          value={s.date}
          min={today}
          onChange={(date) => update({ date })}
          error={errors.date}
          inputRef={dateRef}
          className="lg:-ml-px"
        />
        <TimeField
          label={timeLabel(from)}
          value={s.time}
          onChange={(time) => update({ time })}
          className="lg:-ml-px"
        />
        <PassengerField
          adults={s.adults}
          childCount={s.children}
          onChange={(p) => update(p)}
          className="order-1 col-span-2 lg:order-none lg:col-span-1 lg:-ml-px"
        />
        <button type="submit" className="btn-action order-1 col-span-2 min-h-[4.25rem] lg:order-none lg:col-span-1 lg:ml-2">
          {submitLabel}
          <span aria-hidden="true">→</span>
        </button>

        {isReturn && (
          <>
            <p className="col-span-2 mt-4 flex items-center gap-2 font-sans text-small text-graphite lg:mt-2 lg:pr-6 lg:text-right lg:justify-end">
              <span className="font-medium uppercase tracking-[0.12em] text-ink">{SEARCH.roundTrip}</span>
              {to && from ? (
                <span className="truncate">
                  {to.name} → {from.code ?? from.name}
                </span>
              ) : null}
            </p>
            <DateField
              label={SEARCH.returnDate}
              value={s.returnDate}
              min={s.date || today}
              onChange={(returnDate) => update({ returnDate })}
              error={errors.returnDate}
              inputRef={returnRef}
              className="lg:-ml-px lg:mt-2"
            />
            <TimeField
              label={to?.kind === "airport" ? timeLabel(to) : SEARCH.returnTime}
              value={s.returnTime}
              onChange={(returnTime) => update({ returnTime })}
              className="lg:-ml-px lg:mt-2"
            />
          </>
        )}
      </div>

      <p
        id={`${formId}-summary`}
        aria-live="polite"
        className={`font-sans text-small text-[#B4471A] ${errorCount ? "mt-4" : "sr-only"}`}
      >
        {errorCount ? SEARCH.errorSummary(errorCount) : ""}
      </p>
    </form>
  );
}

function DateField({
  label,
  value,
  min,
  onChange,
  error,
  inputRef,
  className = "",
}: {
  label: string;
  value: string;
  min?: string;
  onChange: (v: string) => void;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <div className="sf-cell" data-invalid={error ? "true" : undefined}>
        <label htmlFor={id} className="sf-label">
          {label}
        </label>
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="sf-input [color-scheme:light]"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="sf-error">
          {error}
        </p>
      )}
    </div>
  );
}

function TimeField({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <div className="sf-cell">
        <label htmlFor={id} className="sf-label flex items-baseline justify-between gap-2">
          <span className="truncate">{label}</span>
          <span className="sr-only">({SEARCH.timeOptional})</span>
        </label>
        <input
          id={id}
          type="time"
          value={value}
          step={300}
          onChange={(e) => onChange(e.target.value)}
          className="sf-input [color-scheme:light]"
        />
      </div>
    </div>
  );
}

export function prefillTransfer(detail: PrefillDetail) {
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail }));
}

