"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconArrow, IconInfo } from "@/components/b2c/Icons";
import { TransferSearchForm } from "@/components/b2c/TransferSearchForm";
import { BookingStepper } from "@/components/b2c/booking/BookingStepper";
import { DetailsStep } from "@/components/b2c/booking/DetailsStep";
import { ExtrasStep } from "@/components/b2c/booking/ExtrasStep";
import { Notice } from "@/components/b2c/booking/Fields";
import { JourneySummary } from "@/components/b2c/booking/JourneySummary";
import { PaymentStep } from "@/components/b2c/booking/PaymentStep";
import { PreviewComplete } from "@/components/b2c/booking/PreviewComplete";
import { ReviewStep } from "@/components/b2c/booking/ReviewStep";
import { TransferOptionCard } from "@/components/b2c/booking/TransferOptionCard";
import { ExploreDestination } from "@/components/b2c/discovery/ExploreDestination";
import { FLIGHT_MONITORING } from "@/lib/b2c/business";
import { RESULTS, SEARCH } from "@/lib/b2c/copy";
import { FLOW } from "@/lib/b2c/copy-booking";
import { locationById } from "@/lib/b2c/demo/locations";
import {
  EMPTY_DRAFT,
  F,
  STEPS,
  arrivalTerminal,
  toBookingRequest,
  validateDetails,
  validateExtras,
  validatePayment,
  validateTransfer,
  type BookingDraft,
  type FieldErrors,
  type StepId,
} from "@/lib/b2c/booking/draft";
import { accommodationArea, flightRequirements, legsFromSearch, passengerCounts } from "@/lib/b2c/booking/itinerary";
import { deskPaymentEligibility } from "@/lib/b2c/booking/payment-eligibility";
import { bookingSource } from "@/lib/b2c/booking/source";
import { searchFromParams, searchToQuery, validateSearch, type TransferSearch } from "@/lib/b2c/transfer-search";

/** Tab-scoped draft storage. Never the URL, never a server. */
const DRAFT_KEY = "swt:booking-draft:v1";

const loadDraft = (): BookingDraft => {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_DRAFT;
    return { ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<BookingDraft>) };
  } catch {
    return EMPTY_DRAFT;
  }
};
const saveDraft = (d: BookingDraft | null) => {
  try {
    if (d) window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    else window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable: the flow still works in memory */
  }
};

/**
 * Every state renders inside a block at least one screen tall. The page
 * is statically exported and reads its journey from the URL in the
 * browser, so the first paint is a placeholder that is then replaced;
 * a shorter placeholder made the footer jump (CLS 0.27-0.30 measured on
 * the former results page).
 */
const FRAME = "min-h-[100svh]";

/**
 * The step-by-step booking flow at /transfers/results.
 *
 * The journey (route, dates, passengers) stays in the URL, as before, so
 * it can be reloaded or shared. Everything entered after that is held in
 * component state, mirrored to sessionStorage for this tab only, and
 * never put in the URL.
 */
export function BookingFlow() {
  const params = useSearchParams();
  const router = useRouter();
  const search = useMemo(() => searchFromParams(new URLSearchParams(params.toString())), [params]);
  const from = locationById(search.from);
  const to = locationById(search.to);
  const complete = Boolean(from && to && search.date);
  const searchErrors = useMemo(() => (complete ? validateSearch(search) : {}), [complete, search]);
  const invalid = Object.keys(searchErrors).length > 0;
  const legs = useMemo(() => (complete && !invalid ? legsFromSearch(search) : []), [complete, invalid, search]);

  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [step, setStep] = useState<StepId>("transfer");
  const [reached, setReached] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState<Partial<Record<StepId, boolean>>>({});
  const [editing, setEditing] = useState(false);
  const [done, setDone] = useState(false);

  const flowTopRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const focusOnStepChange = useRef(false);

  useEffect(() => {
    setDraft(loadDraft());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveDraft(draft);
  }, [draft, mounted]);

  // Prefill what the search already knows: the landing time typed in
  // the search, and the transfer date as the departure flight's date.
  // Only empty fields are filled, so nothing the customer typed is lost.
  const legsKey = legs.map((l) => `${l.id}:${l.from.id}>${l.to.id}@${l.date} ${l.time}`).join("|");
  useEffect(() => {
    if (!mounted || !legs.length) return;
    setDraft((d) => {
      const fields = { ...d.fields };
      for (const f of flightRequirements(legs)) {
        const leg = legs.find((l) => l.id === f.legId)!;
        if (f.kind === "arrival" && !fields[F.flight(f.key, "time")] && leg.time) fields[F.flight(f.key, "time")] = leg.time;
        if (f.kind === "departure" && !fields[F.flight(f.key, "date")]) fields[F.flight(f.key, "date")] = f.legDate;
      }
      return { ...d, fields, childSeats: Math.min(d.childSeats, search.children) };
    });
    // legsKey captures every leg change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legsKey, mounted, search.children]);

  useEffect(() => {
    if (invalid) setEditing(true);
  }, [invalid]);

  const terminal = arrivalTerminal(draft, legs);
  const eligibility = useMemo(() => deskPaymentEligibility(legs, terminal), [legs, terminal]);

  // A desk choice made for an itinerary that no longer qualifies (after
  // editing the journey) is cleared rather than carried forward.
  useEffect(() => {
    if (!eligibility.eligible && draft.paymentMethod === "airport_desk") setDraft((d) => ({ ...d, paymentMethod: null }));
  }, [eligibility.eligible, draft.paymentMethod]);

  const validateStep = useCallback(
    (s: StepId, d: BookingDraft): FieldErrors => {
      switch (s) {
        case "transfer":
          return validateTransfer(d);
        case "extras":
          return validateExtras(d, search);
        case "details":
          return validateDetails(d, legs);
        case "review":
          return {};
        case "payment":
          return validatePayment(d, eligibility.eligible);
      }
    },
    [search, legs, eligibility.eligible]
  );

  // Once Continue has been pressed on a step, re-validate as the
  // customer types so each message clears the moment it is fixed.
  useEffect(() => {
    if (attempted[step]) setErrors(validateStep(step, draft));
  }, [draft, step, attempted, validateStep]);

  // Move focus to the new step's heading, and bring the stepper into
  // view, after a step change made by the customer.
  useEffect(() => {
    if (!focusOnStepChange.current) return;
    focusOnStepChange.current = false;
    flowTopRef.current?.scrollIntoView({ block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, done]);

  const update = (patch: Partial<BookingDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const setField = (k: string, value: string) => setDraft((d) => ({ ...d, fields: { ...d.fields, [k]: value } }));
  const registerField = useCallback((k: string) => (el: HTMLElement | null) => {
    fieldRefs.current[k] = el;
  }, []);

  const go = (s: StepId) => {
    focusOnStepChange.current = true;
    setErrors(attempted[s] ? validateStep(s, draft) : {});
    setStep(s);
  };

  const index = STEPS.indexOf(step);

  const next = () => {
    const found = validateStep(step, draft);
    setAttempted((a) => ({ ...a, [step]: true }));
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      const target = fieldRefs.current[first] ?? (first === "service" ? document.getElementById("svc-shared") : null);
      requestAnimationFrame(() => {
        if (target) {
          target.scrollIntoView({ block: "center" });
          if ("focus" in target) (target as HTMLElement).focus({ preventScroll: true });
        }
      });
      return;
    }
    if (step === "payment") {
      focusOnStepChange.current = true;
      setDone(true);
      return;
    }
    const nextStep = STEPS[index + 1];
    setReached((r) => Math.max(r, index + 1));
    go(nextStep);
  };

  const back = () => {
    if (index > 0) go(STEPS[index - 1]);
  };

  const applySearch = (nextSearch: TransferSearch) => {
    router.replace(`/transfers/results?${searchToQuery(nextSearch)}`, { scroll: false });
    setEditing(false);
    // Route or passengers changed: start again from the transfer choice,
    // keeping everything already typed.
    setStep("transfer");
    setReached(0);
    setDone(false);
    setAttempted({});
    setErrors({});
  };

  if (!mounted) return <div className={`${FRAME} bg-charcoal`} aria-busy="true" />;

  if (!complete) {
    return (
      <section className={`${FRAME} bg-ivory pb-24 pt-[calc(var(--header-h)+3rem)]`}>
        <div className="edge wrap">
          <p className="eyebrow mb-6">{FLOW.eyebrow}</p>
          <h1 className="font-display text-display text-ink">{RESULTS.missing.title}</h1>
          <p className="mt-4 max-w-xl font-sans text-body-lg text-graphite">{RESULTS.missing.body}</p>
          <div className="mt-10 border border-graphite/15 bg-ivory p-5 shadow-[0_40px_80px_-40px_rgba(21,19,15,0.35)] sm:p-7">
            <TransferSearchForm initial={search} onSearch={applySearch} />
          </div>
        </div>
      </section>
    );
  }

  const request = toBookingRequest(search, legs, draft);
  const hotelArea = accommodationArea(legs);
  const errorCount = Object.keys(errors).length;
  const quote = (id: "shared" | "private") => bookingSource.quote(id, legs, passengerCounts(search));

  return (
    <div className={FRAME}>
      {/* ---------------- Journey header ---------------- */}
      <section
        aria-labelledby="flow-title"
        className="on-dark bg-charcoal pb-5 pt-[calc(var(--header-h)+1rem)] text-ivory sm:pb-7 sm:pt-[calc(var(--header-h)+1.75rem)]"
      >
        <div className="edge wrap flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow mb-2">{FLOW.eyebrow}</p>
            <h1 id="flow-title" className="font-display text-[1.5rem] leading-tight sm:text-[2rem]">
              <span className="sr-only">Transfer from </span>
              {from!.name}
              <IconArrow size={20} className="mx-2 inline-block align-middle text-brand-amber" />
              <span className="sr-only"> to </span>
              <span className="italic">{to!.name}</span>
            </h1>
            <p className="mt-1 font-sans text-small text-ivory/75">
              {search.trip === "return" ? SEARCH.roundTrip : SEARCH.oneWay} · {RESULTS.passengers(search.adults, search.children)}
            </p>
          </div>
          {!done && (
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-expanded={editing}
              aria-controls="edit-search"
              className="btn-outline shrink-0 px-4 py-2.5"
            >
              {editing ? FLOW.closeEdit : FLOW.editSearch}
            </button>
          )}
        </div>
      </section>

      <div id="edit-search" hidden={!editing} className="border-b border-graphite/15 bg-bone">
        <div className="edge wrap py-8">
          {invalid && (
            <div role="alert" className="mb-6 border-l-2 border-[#9A3A12] bg-ivory p-4">
              <p className="font-display text-[1.25rem] text-ink">{RESULTS.invalid.title}</p>
              <p className="mt-1 font-sans text-small text-graphite">{RESULTS.invalid.body}</p>
            </div>
          )}
          <TransferSearchForm key={params.toString()} initial={search} onSearch={applySearch} submitLabel={SEARCH.update} showErrors={invalid} />
        </div>
      </div>

      {invalid ? (
        <section className="bg-ivory py-12">
          <div className="edge wrap">
            <Notice tone="warn" icon={<IconInfo size={18} className="mt-0.5 shrink-0" />}>
              {RESULTS.invalid.blocked}
            </Notice>
          </div>
        </section>
      ) : done && request ? (
        <>
          <div ref={flowTopRef} className="scroll-mt-[var(--header-h)]" />
          <PreviewComplete
            request={request}
            onBack={() => {
              setDone(false);
              go("payment");
            }}
            onRestart={() => {
              saveDraft(null);
              setDraft(EMPTY_DRAFT);
              router.push("/transfers#search");
            }}
          />
          {hotelArea && <ExploreDestination areaId={hotelArea.id} />}
        </>
      ) : (
        <section aria-labelledby="step-title" className="bg-ivory pb-16 text-ink">
          {/* ---- Stepper ---- */}
          <div ref={flowTopRef} className="scroll-mt-[var(--header-h)] border-b border-graphite/15 bg-ivory">
            <div className="edge wrap pb-3 pt-5 sm:pt-6">
              <BookingStepper current={step} reached={reached} onGo={go} />
            </div>
          </div>

          <div className="edge wrap grid gap-8 pt-6 sm:pt-8 lg:grid-cols-12 lg:gap-10">
            <div className="min-w-0 lg:col-span-8">
              {/* Mobile journey summary, collapsed by default. */}
              <details className="group mb-6 border border-graphite/20 bg-white/60 lg:hidden">
                <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-sans text-small font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {FLOW.showSummary}
                  <svg width="12" height="12" viewBox="0 0 10 10" aria-hidden="true" className="transition-transform group-open:rotate-180">
                    <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.25" />
                  </svg>
                </summary>
                <div className="border-t border-graphite/15 p-4">
                  <JourneySummary search={search} legs={legs} draft={draft} />
                </div>
              </details>

              <p className="eyebrow mb-2">{FLOW.stepOf(index + 1, STEPS.length)}</p>
              <h2 id="step-title" ref={headingRef} tabIndex={-1} className="font-display text-display-sm focus:outline-none sm:text-[2rem]">
                {FLOW.steps[step].title}
              </h2>
              {step === "transfer" && (
                <div className="mt-4">
                  <Notice icon={<IconInfo size={18} className="mt-0.5 shrink-0" />}>{FLOW.prototype}</Notice>
                </div>
              )}

              <div className="mt-6">
                {step === "transfer" && (
                  <>
                    <div className="grid gap-6 md:grid-cols-2" role="group" aria-label="Transfer options" aria-describedby={errors.service ? "service-error" : undefined}>
                      {(["shared", "private"] as const).map((id) => (
                        <TransferOptionCard
                          key={id}
                          id={id}
                          search={search}
                          quote={quote(id)}
                          selected={draft.service === id}
                          onSelect={() => update({ service: id })}
                        />
                      ))}
                    </div>
                    {errors.service && (
                      <p id="service-error" className="sf-error">
                        {errors.service}
                      </p>
                    )}
                    <p className="mt-6 font-sans text-small text-graphite">{FLOW.priceNote} {FLIGHT_MONITORING}</p>
                  </>
                )}
                {step === "extras" && (
                  <ExtrasStep search={search} draft={draft} errors={errors} onChange={update} registerField={registerField} />
                )}
                {step === "details" && draft.service && (
                  <DetailsStep
                    search={search}
                    legs={legs}
                    service={draft.service}
                    draft={draft}
                    errors={errors}
                    setField={setField}
                    registerField={registerField}
                    onEditExtras={() => go("extras")}
                  />
                )}
                {step === "review" && request && (
                  <ReviewStep
                    search={search}
                    request={request}
                    onEdit={(s) => {
                      if (s === "search") {
                        setEditing(true);
                        requestAnimationFrame(() => document.getElementById("edit-search")?.scrollIntoView({ block: "start" }));
                      } else go(s);
                    }}
                  />
                )}
                {step === "payment" && (
                  <PaymentStep
                    legs={legs}
                    eligibility={eligibility}
                    value={draft.paymentMethod}
                    error={errors.payment}
                    onChange={(paymentMethod) => update({ paymentMethod })}
                    radioRef={registerField("payment")}
                  />
                )}
              </div>

              {/* ---- Step navigation ---- */}
              <div className="mt-10 border-t border-graphite/20 pt-6">
                <p aria-live="polite" className={`font-sans text-small text-[#9A3A12] ${errorCount ? "mb-4" : "sr-only"}`}>
                  {errorCount ? FLOW.errors(errorCount) : ""}
                </p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {index > 0 ? (
                    <button type="button" onClick={back} className="btn-outline py-4">
                      <IconArrow size={16} className="rotate-180" />
                      {FLOW.back}
                    </button>
                  ) : (
                    <span />
                  )}
                  <div className="flex flex-col items-stretch gap-2 sm:items-end">
                    <button type="button" onClick={next} className="btn-action py-4">
                      {step === "payment" ? FLOW.finish : FLOW.continueTo(FLOW.steps[STEPS[index + 1]].label)}
                      <IconArrow size={16} />
                    </button>
                    {step === "payment" && <p className="font-sans text-[0.8125rem] text-graphite">{FLOW.finishNote}</p>}
                  </div>
                </div>
              </div>
            </div>

            <aside aria-labelledby="summary-title" className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-[calc(var(--header-h)+24px)] border border-graphite/20 bg-white/60 p-6">
                <h2 id="summary-title" className="eyebrow mb-4 text-ink">{FLOW.summary}</h2>
                <JourneySummary search={search} legs={legs} draft={draft} />
              </div>
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}
