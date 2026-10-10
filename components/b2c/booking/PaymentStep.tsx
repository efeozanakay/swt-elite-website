"use client";

import { IconCheck, IconInfo, IconPin } from "@/components/b2c/Icons";
import { Notice } from "@/components/b2c/booking/Fields";
import { AIRPORT_DESK_PAYMENT } from "@/lib/b2c/business";
import { RESULTS } from "@/lib/b2c/copy";
import { FLOW } from "@/lib/b2c/copy-booking";
import { DESK_INELIGIBLE_COPY } from "@/lib/b2c/booking/payment-eligibility";
import type { DeskPaymentEligibility, Leg, PaymentMethod } from "@/lib/b2c/booking/types";

/**
 * Step 5. Payment method only: nothing is charged and no card data is
 * collected. "Pay at the airport desk" is offered only when the
 * itinerary qualifies (see payment-eligibility.ts); otherwise it is
 * shown as unavailable with the reason, so the rule is visible rather
 * than silently missing.
 */
export function PaymentStep({
  legs,
  eligibility,
  value,
  error,
  onChange,
  radioRef,
}: {
  legs: Leg[];
  eligibility: DeskPaymentEligibility;
  value: PaymentMethod | null;
  error?: string;
  onChange: (m: PaymentMethod) => void;
  radioRef: (el: HTMLElement | null) => void;
}) {
  const isReturn = legs.length > 1;
  const desk = eligibility.eligible ? eligibility : null;
  const firstEnabled: PaymentMethod = desk ? "airport_desk" : "online_card";

  return (
    <fieldset aria-describedby={error ? "payment-error" : undefined}>
      <legend className="sr-only">{FLOW.payment.legend}</legend>
      <div className="grid gap-4">
        {/* ---- Airport desk ---- */}
        <label
          className={`relative block border p-5 transition-colors sm:p-6 ${
            !desk
              ? "cursor-not-allowed border-dashed border-graphite/30 bg-bone/30"
              : value === "airport_desk"
                ? "cursor-pointer border-ink bg-white/70 shadow-[0_0_0_1px_theme(colors.ink)]"
                : "cursor-pointer border-graphite/25 bg-white/60 hover:border-graphite/50"
          } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2`}
        >
          <div className="flex items-start gap-4">
            <input
              ref={firstEnabled === "airport_desk" ? radioRef : undefined}
              type="radio"
              name="payment-method"
              value="airport_desk"
              disabled={!desk}
              checked={value === "airport_desk"}
              onChange={() => onChange("airport_desk")}
              aria-describedby="pay-desk-desc"
              className="mt-1.5 h-5 w-5 shrink-0 accent-[#1D1B15]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-display text-[1.5rem] leading-tight text-ink">{FLOW.payment.desk.title}</span>
                <span className="demo-tag border-graphite/40 text-graphite">{desk ? FLOW.payment.desk.badge : FLOW.payment.desk.unavailable}</span>
              </div>
              <div id="pay-desk-desc" className="mt-2 font-sans text-small text-graphite">
                {desk ? FLOW.payment.desk.body : DESK_INELIGIBLE_COPY[eligibility.eligible ? "no_arrival_leg" : eligibility.reason]}
              </div>
            </div>
          </div>

          {desk && (
            <div className="mt-5 grid gap-5 border-t border-graphite/15 pt-5 sm:pl-9 md:grid-cols-2">
              <div>
                <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{FLOW.payment.desk.accepted}</p>
                <ul className="mt-2 space-y-1.5 font-sans text-small text-ink">
                  {AIRPORT_DESK_PAYMENT.methods.map((m) => (
                    <li key={m} className="flex gap-2">
                      <IconCheck size={16} className="mt-0.5 shrink-0 text-brand-navy" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{FLOW.payment.desk.where}</p>
                {desk.paymentPoint ? (
                  <p className="mt-2 flex gap-2 font-sans text-small text-ink">
                    <IconPin size={16} className="mt-0.5 shrink-0 text-brand-navy" />
                    <span>
                      <strong className="font-medium">{desk.paymentPoint.desk}</strong>, {desk.paymentPoint.label}
                      {desk.paymentPoint.note && <span className="block text-graphite">{desk.paymentPoint.note}</span>}
                    </span>
                  </p>
                ) : (
                  <>
                    <p className="mt-2 font-sans text-small text-graphite">{FLOW.payment.desk.whereUnknown}</p>
                    <ul className="mt-2 space-y-1 font-sans text-small text-ink">
                      {AIRPORT_DESK_PAYMENT.points.map((p) => (
                        <li key={p.terminal}>
                          {p.label}: <strong className="font-medium">{p.desk}</strong>
                          {"note" in p && <span className="text-graphite"> (escorted by a representative)</span>}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              {isReturn && (
                <div className="md:col-span-2">
                  <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">Round trip</p>
                  <dl className="mt-2 divide-y divide-graphite/15 border-y border-graphite/15 font-sans text-small">
                    {legs.map((l) => (
                      <div key={l.id} className="flex justify-between gap-4 py-2">
                        <dt className="text-graphite">
                          {l.id === "out" ? RESULTS.outbound : RESULTS.return}: {l.from.name} → {l.to.name}
                        </dt>
                        <dd className="shrink-0 text-ink">{l.id === "out" ? "Paid on arrival" : "Included in the same payment"}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-2 font-sans text-small text-ink">{FLOW.payment.desk.roundTrip}</p>
                </div>
              )}
            </div>
          )}
        </label>

        {/* ---- Online (prototype) ---- */}
        <label
          className={`relative block cursor-pointer border p-5 transition-colors sm:p-6 ${
            value === "online_card" ? "border-ink bg-white/70 shadow-[0_0_0_1px_theme(colors.ink)]" : "border-graphite/25 bg-white/60 hover:border-graphite/50"
          } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2`}
        >
          <div className="flex items-start gap-4">
            <input
              ref={firstEnabled === "online_card" ? radioRef : undefined}
              type="radio"
              name="payment-method"
              value="online_card"
              checked={value === "online_card"}
              onChange={() => onChange("online_card")}
              aria-describedby="pay-online-desc"
              className="mt-1.5 h-5 w-5 shrink-0 accent-[#1D1B15]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-display text-[1.5rem] leading-tight text-ink">{FLOW.payment.online.title}</span>
                <span className="demo-tag border-[#9A3A12]/50 text-[#9A3A12]">{FLOW.payment.online.badge}</span>
              </div>
              <p id="pay-online-desc" className="mt-2 font-sans text-small text-graphite">{FLOW.payment.online.body}</p>
            </div>
          </div>
        </label>
      </div>

      {error && (
        <p id="payment-error" className="sf-error">
          {error}
        </p>
      )}
      <div className="mt-6">
        <Notice icon={<IconInfo size={18} className="mt-0.5 shrink-0" />}>{FLOW.payment.statusNote}</Notice>
      </div>
    </fieldset>
  );
}
