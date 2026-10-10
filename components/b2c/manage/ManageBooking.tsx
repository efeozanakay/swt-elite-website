"use client";

import { useEffect, useId, useState } from "react";
import { AirportMeeting } from "@/components/b2c/AirportMeeting";
import { IconArrow, IconCheck, IconInfo, IconPin, IconPlane } from "@/components/b2c/Icons";
import { StatusBadge } from "@/components/b2c/booking/Fields";
import { ExploreDestination } from "@/components/b2c/discovery/ExploreDestination";
import { AIRPORT_DESK_PAYMENT, DEPARTURE_PICKUP, EQUIPMENT_OPTIONS, SUPPORT } from "@/lib/b2c/business";
import { RESULTS, SERVICES } from "@/lib/b2c/copy";
import { MANAGE } from "@/lib/b2c/copy-booking";
import { locationLabel } from "@/lib/b2c/demo/locations";
import { formatDate } from "@/lib/b2c/locale";
import { reminderFor } from "@/lib/b2c/booking/reminder";
import { bookingSource } from "@/lib/b2c/booking/source";
import {
  BOOKING_STATUS,
  EXTRAS_STATUS,
  LEG_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  RECONFIRMATION,
} from "@/lib/b2c/booking/status-copy";
import type { AytTerminal, BookingLegView, CustomerBookingView, LegId, ReconfirmationStatus } from "@/lib/b2c/booking/types";

/** AYT meeting-point labels in airport-meeting.ts, by terminal id. */
const MEETING_TERMINAL: Record<AytTerminal, string> = {
  int_t1: "International Terminal 1",
  int_t2: "International Terminal 2",
  domestic: "Domestic Terminal",
};

/**
 * My Transfer, as a design prototype over fictional demo bookings.
 *
 * It renders a CustomerBookingView, the shape a future backend would
 * return for an authenticated customer. There is no lookup form on
 * purpose: a booking reference alone must never reveal personal data,
 * and a fake sign-in would suggest security that does not exist.
 */
export function ManageBooking() {
  const [today, setToday] = useState<Date | null>(null);
  const [scenario, setScenario] = useState("reminder");
  useEffect(() => setToday(new Date()), []);

  // Dates are relative to the visitor's day and formatted with their
  // Intl data, so nothing is rendered before mount.
  if (!today) return <div className="min-h-[100svh] bg-ivory" aria-busy="true" />;

  const scenarios = bookingSource.demoBookings(today);
  const current = scenarios.find((s) => s.id === scenario) ?? scenarios[0];

  return (
    <>
      <section className="bg-ivory pb-14 pt-[calc(var(--header-h)+2rem)] text-ink sm:pt-[calc(var(--header-h)+3rem)]">
        <div className="edge wrap">
          <div role="note" className="flex gap-3 border border-[#9A3A12]/50 bg-bone p-4 font-sans text-small text-ink">
            <IconInfo size={20} className="mt-0.5 shrink-0 text-[#9A3A12]" />
            <p>
              <strong className="font-medium">{MANAGE.demoLabel}</strong> {MANAGE.demoBanner}
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-3">{MANAGE.eyebrow}</p>
              <h1 className="font-display text-display">{MANAGE.title}</h1>
            </div>
            <fieldset className="lg:col-span-4">
              <legend className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-graphite">{MANAGE.scenario}</legend>
              <div className="mt-2 grid gap-2">
                {scenarios.map((s) => (
                  <label
                    key={s.id}
                    className={`cursor-pointer border px-3 py-2 font-sans text-small transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                      s.id === current.id ? "border-ink bg-ink text-ivory" : "border-graphite/25 bg-white/60 hover:border-ink"
                    }`}
                  >
                    <input type="radio" name="demo-scenario" className="sr-only" checked={s.id === current.id} onChange={() => setScenario(s.id)} />
                    <span className="block font-medium">{s.label}</span>
                    <span className={`block text-[0.8125rem] ${s.id === current.id ? "text-ivory/75" : "text-graphite"}`}>{s.description}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Remount per scenario so demo reconfirmations reset. */}
          <BookingView key={current.id} booking={current.booking} />

          <section aria-labelledby="access-title" className="mt-10 border-t border-graphite/20 pt-6">
            <h2 id="access-title" className="font-display text-[1.375rem]">{MANAGE.access.title}</h2>
            <p className="mt-2 max-w-3xl font-sans text-body text-graphite">{MANAGE.access.body}</p>
          </section>
        </div>
      </section>

      {/* Discovery comes after the booking information, never instead of it. */}
      {current.booking.legs[0].accommodation && <ExploreDestination areaId={current.booking.legs[0].accommodation.areaId} />}
    </>
  );
}

function BookingView({ booking }: { booking: CustomerBookingView }) {
  const [confirmed, setConfirmed] = useState<Partial<Record<LegId, ReconfirmationStatus>>>({});
  const status = BOOKING_STATUS[booking.status];
  const pay = PAYMENT_STATUS[booking.payment.status];
  const isReturn = booking.legs.length > 1;
  const paidAll = booking.payment.status === "paid" && booking.payment.coversLegs.length === booking.legs.length;
  const extras = [
    booking.extras.childSeats ? `${booking.extras.childSeats} child ${booking.extras.childSeats === 1 ? "seat" : "seats"}` : "",
    ...booking.extras.equipment.map((e) => EQUIPMENT_OPTIONS.find((o) => o.id === e)?.label ?? e),
  ].filter(Boolean);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        {/* ---- Overview ---- */}
        <section aria-labelledby="overview-title" className="border border-graphite/20 bg-white/60 p-5 sm:p-6">
          <h2 id="overview-title" className="sr-only">Booking overview</h2>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{MANAGE.reference}</p>
              <p className="mt-1 font-display text-[1.75rem] leading-none tracking-wide">{booking.reference}</p>
              <p className="mt-2 font-sans text-small text-graphite">
                {SERVICES[booking.service].name} · {isReturn ? "Round trip" : "One way"} ·{" "}
                {RESULTS.passengers(booking.passengers.adults, booking.passengers.children)}
                {booking.passengers.childAges.length > 0 && ` (ages ${booking.passengers.childAges.join(", ")})`}
              </p>
            </div>
            <dl className="grid grid-cols-[auto_auto] items-center gap-x-3 gap-y-2 font-sans text-small">
              <dt className="text-graphite">{MANAGE.bookingStatus}</dt>
              <dd><StatusBadge label={status.label} tone={status.tone} /></dd>
              <dt className="text-graphite">{MANAGE.payment}</dt>
              <dd><StatusBadge label={pay.label} tone={pay.tone} /></dd>
            </dl>
          </div>
        </section>

        {/* ---- Legs ---- */}
        {booking.legs.map((view) => {
          const legStatus = confirmed[view.leg.id] ?? view.reconfirmation.status;
          return (
            <LegCard
              key={view.leg.id}
              view={view}
              title={
                view.leg.id === "ret"
                  ? MANAGE.returnJourney
                  : view.leg.direction === "arrival"
                    ? MANAGE.outbound
                    : MANAGE.outboundGeneric
              }
              reconfirmation={legStatus}
              onConfirm={(s) => setConfirmed((c) => ({ ...c, [view.leg.id]: s }))}
              paidHere={booking.payment.status === "paid" && booking.payment.coversLegs.includes(view.leg.id)}
              paidOnArrival={view.leg.id === "ret" && paidAll && booking.payment.method === "airport_desk"}
              booking={booking}
            />
          );
        })}

        {/* ---- Extras and notes ---- */}
        <section aria-labelledby="extras-title" className="border border-graphite/20 bg-white/60 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="extras-title" className="font-display text-[1.375rem]">{MANAGE.extras}</h2>
            {extras.length > 0 && <StatusBadge {...EXTRAS_STATUS[booking.extras.confirmation]} />}
          </div>
          <p className="mt-2 font-sans text-small text-ink">{extras.length ? extras.join(", ") : "None requested"}</p>
          <p className="mt-3 font-sans text-[0.8125rem] text-graphite">
            {MANAGE.notes}: {booking.extras.operationalNotes || booking.specialRequests || "None"}
          </p>
        </section>
      </div>

      <aside className="space-y-6 lg:col-span-4">
        <PaymentPanel booking={booking} />
        <section aria-labelledby="sos-title" className="border border-graphite/20 bg-charcoal p-5 text-ivory on-dark">
          <h2 id="sos-title" className="font-sans text-small font-medium uppercase tracking-[0.12em]">{MANAGE.emergency}</h2>
          <p className="mt-2 font-sans text-small text-ivory/75">{MANAGE.emergencyBody}</p>
          <a href={`tel:${SUPPORT.emergencyTel}`} className="mt-3 inline-block font-display text-[1.5rem] underline underline-offset-4">
            {SUPPORT.emergencyPhone}
          </a>
          <p className="mt-3 font-sans text-[0.8125rem] text-ivory/75">
            Not urgent?{" "}
            <a href={`mailto:${SUPPORT.email}`} className="underline underline-offset-4">{SUPPORT.email}</a>
          </p>
        </section>
      </aside>
    </div>
  );
}

function PaymentPanel({ booking }: { booking: CustomerBookingView }) {
  const p = booking.payment;
  const status = PAYMENT_STATUS[p.status];
  return (
    <section aria-labelledby="payment-title" className="border border-graphite/20 bg-white/60 p-5">
      <h2 id="payment-title" className="font-display text-[1.375rem]">{MANAGE.payment}</h2>
      <dl className="mt-3 divide-y divide-graphite/15 font-sans text-small">
        <div className="flex justify-between gap-3 py-2">
          <dt className="text-graphite">{MANAGE.paymentMethod}</dt>
          <dd className="text-right">{p.method ? PAYMENT_METHOD[p.method] : "Not selected"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <dt className="text-graphite">{MANAGE.paymentStatus}</dt>
          <dd><StatusBadge label={status.label} tone={status.tone} /></dd>
        </div>
        <div className="flex justify-between gap-3 py-2">
          <dt className="text-graphite">Amount</dt>
          <dd className="text-right text-graphite">Not shown in this demo</dd>
        </div>
        <div className="py-2">
          <dt className="sr-only">Coverage</dt>
          <dd>{MANAGE.paymentCovers(p.coversLegs.length)}</dd>
        </div>
      </dl>
      {p.method === "airport_desk" && p.status === "unpaid" && (
        <div className="mt-3 space-y-2 border-t border-graphite/15 pt-3 font-sans text-small">
          <p className="text-ink">{MANAGE.deskDue}</p>
          {p.paymentPoint && (
            <p className="flex gap-2">
              <IconPin size={16} className="mt-0.5 shrink-0 text-brand-navy" />
              <span>
                <strong className="font-medium">{p.paymentPoint.desk}</strong>, {p.paymentPoint.label}
                {p.paymentPoint.note && <span className="block text-graphite">{p.paymentPoint.note}</span>}
              </span>
            </p>
          )}
          {p.coversLegs.length > 1 && <p className="text-graphite">{AIRPORT_DESK_PAYMENT.roundTrip}</p>}
        </div>
      )}
      {p.status === "paid" && (
        <p className="mt-3 flex gap-2 border-t border-graphite/15 pt-3 font-sans text-small text-ink">
          <IconCheck size={16} className="mt-0.5 shrink-0 text-brand-navy" />
          Payment recorded{p.paidAt ? ` on ${formatDate(p.paidAt, "short")}` : ""}
          {p.paymentPoint ? ` at ${p.paymentPoint.desk}` : ""}.
        </p>
      )}
    </section>
  );
}

function LegCard({
  view,
  title,
  reconfirmation,
  onConfirm,
  paidHere,
  paidOnArrival,
  booking,
}: {
  view: BookingLegView;
  title: string;
  reconfirmation: ReconfirmationStatus;
  onConfirm: (s: ReconfirmationStatus) => void;
  paidHere: boolean;
  paidOnArrival: boolean;
  booking: CustomerBookingView;
}) {
  const id = useId();
  const { leg, flight, pickup, journey } = view;
  const rc = RECONFIRMATION[reconfirmation];
  const op = LEG_STATUS[view.operationalStatus];
  const done = view.operationalStatus === "completed";
  const reminder = view.reconfirmation.status === "requested" ? reminderFor(booking, leg.id) : null;

  return (
    <section aria-labelledby={`${id}-title`} className={`border bg-white/60 ${done ? "border-graphite/15 opacity-90" : "border-graphite/25"}`}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-graphite/15 p-5 sm:p-6">
        <div>
          <h2 id={`${id}-title`} className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-graphite">
            {title}
          </h2>
          <p className="mt-1 font-display text-[1.5rem] leading-tight">
            {leg.from.name} <IconArrow size={18} className="inline-block align-middle text-brand-amber" /> {leg.to.name}
          </p>
          <p className="mt-1 font-sans text-small text-ink">{formatDate(leg.date, "long")}</p>
        </div>
        <StatusBadge label={op.label} tone={op.tone} />
      </header>

      <dl className="grid gap-x-6 gap-y-4 p-5 font-sans text-small sm:grid-cols-2 sm:p-6">
        <Fact term={MANAGE.pickup}>
          {pickup.status === "meets_flight" && MANAGE.pickupMeets}
          {pickup.status === "confirmed" && `${pickup.time}, ${pickup.location}`}
          {pickup.status === "pending" && (
            <>
              <StatusBadge label={MANAGE.pickupPending} tone="pending" />
              <span className="mt-1 block text-graphite">
                {pickup.expectedChannel === "hotel_reception" ? MANAGE.pickupPendingHotel : MANAGE.pickupPendingOther}
              </span>
            </>
          )}
        </Fact>
        <Fact term={MANAGE.duration}>
          {journey.status === "estimated" ? `About ${journey.minutes} minutes` : <span className="text-graphite">{MANAGE.durationUnavailable}</span>}
        </Fact>
        {flight && (
          <Fact term={`${flight.kind === "arrival" ? "Arrival" : "Departure"} ${MANAGE.flight.toLowerCase()}`}>
            <span className="inline-flex items-center gap-1.5">
              <IconPlane size={15} /> {flight.flightNumber} · {flight.kind === "arrival" ? "lands" : "departs"} {flight.scheduledTime}
            </span>
            <span className="block text-graphite">
              {locationLabel(flight.kind === "arrival" ? leg.from : leg.to)}
              {flight.terminal ? ` · ${MEETING_TERMINAL[flight.terminal]}` : ""}
            </span>
          </Fact>
        )}
        {view.accommodation && (
          <Fact term={MANAGE.accommodation}>
            {view.accommodation.name}
            {view.accommodation.addressOrDirections && <span className="block text-graphite">{view.accommodation.addressOrDirections}</span>}
          </Fact>
        )}
        <Fact term={MANAGE.vehicle}>{view.vehicleCategory ?? <span className="text-graphite">{MANAGE.vehiclePending}</span>}</Fact>
        <Fact term={MANAGE.payment}>
          {legPaymentLine(booking, leg.id, leg.direction, paidHere, paidOnArrival)}
        </Fact>
      </dl>

      {leg.direction === "arrival" && !done && (
        <div className="border-t border-graphite/15 p-5 sm:p-6">
          <h3 className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-graphite">{MANAGE.meeting}</h3>
          <div className="mt-3">
            <AirportMeeting airportId={leg.from.id} initialTerminal={flight?.terminal ? MEETING_TERMINAL[flight.terminal] : null} />
          </div>
        </div>
      )}
      {leg.direction === "departure" && !done && (
        <p className="border-t border-graphite/15 p-5 font-sans text-small text-graphite sm:p-6">{DEPARTURE_PICKUP}</p>
      )}

      {/* ---- Reconfirmation, separate from payment ---- */}
      {!done && (
        <div className="border-t border-graphite/15 bg-bone/40 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-graphite">{MANAGE.reconfirmation}</h3>
            <StatusBadge label={rc.label} tone={rc.tone} />
          </div>
          {rc.detail && <p className="mt-2 font-sans text-small text-graphite">{rc.detail}</p>}
          {(reconfirmation === "requested" || reconfirmation === "no_response") && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className="btn-action py-3" onClick={() => onConfirm("confirmed")}>
                <IconCheck size={16} />
                {MANAGE.confirmAction}
              </button>
              <a className="btn-outline py-3" href={`mailto:${SUPPORT.email}?subject=${encodeURIComponent("Change to my transfer")}`}>
                {MANAGE.reportChange}
              </a>
            </div>
          )}
          {reconfirmation === "confirmed" && view.reconfirmation.status !== "confirmed" && (
            <p role="status" className="mt-3 font-sans text-small text-ink">{MANAGE.confirmDone}</p>
          )}
        </div>
      )}

      {reminder && (
        <details className="border-t border-graphite/15 p-5 sm:p-6">
          <summary className="cursor-pointer font-sans text-small font-medium text-brand-navy underline-offset-4 hover:underline">
            {MANAGE.reminder}
          </summary>
          <p className="mt-2 font-sans text-[0.8125rem] text-graphite">{MANAGE.reminderNote}</p>
          <div className="mt-3 border border-graphite/20 bg-ivory p-4 font-sans text-small">
            <p className="font-medium text-ink">{reminder.subject}</p>
            {reminder.lines.map((l) => (
              <p key={l} className="mt-2 text-ink">{l}</p>
            ))}
            <p className="mt-3 inline-flex items-center gap-2 border border-ink/30 px-3 py-1.5 text-graphite">
              {reminder.cta} <span className="text-[0.75rem]">(secure link — not active in demo)</span>
            </p>
          </div>
        </details>
      )}
    </section>
  );
}

function legPaymentLine(
  booking: CustomerBookingView,
  legId: LegId,
  direction: BookingLegView["leg"]["direction"],
  paidHere: boolean,
  paidOnArrival: boolean
) {
  const p = booking.payment;
  if (!p.coversLegs.includes(legId)) return "—";
  if (paidOnArrival) return MANAGE.paidReturn;
  if (paidHere) return "Paid";
  if (p.method === "airport_desk" && p.status === "unpaid") {
    return direction === "arrival" ? MANAGE.deskDueShort : MANAGE.deskIncluded;
  }
  return PAYMENT_STATUS[p.status].label;
}

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-graphite">{term}</dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}

