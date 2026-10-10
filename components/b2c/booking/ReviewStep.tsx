"use client";

import type { ReactNode } from "react";
import { IconCheck, IconClock } from "@/components/b2c/Icons";
import { Row } from "@/components/b2c/booking/Fields";
import { passengerLine } from "@/components/b2c/booking/JourneySummary";
import { AIRPORT_DESK_PAYMENT, CANCELLATION, EQUIPMENT_OPTIONS } from "@/lib/b2c/business";
import { RESULTS, SERVICES } from "@/lib/b2c/copy";
import { FLOW } from "@/lib/b2c/copy-booking";
import { locationLabel } from "@/lib/b2c/demo/locations";
import { formatDate } from "@/lib/b2c/locale";
import { timeLabel, type TransferSearch } from "@/lib/b2c/transfer-search";
import type { StepId } from "@/lib/b2c/booking/draft";
import type { BookingRequest } from "@/lib/b2c/booking/types";

/**
 * Step 4. Renders the typed BookingRequest (what would be submitted), in
 * two clearly separate parts: what the customer supplied, each with an
 * Edit link back to its step, and what SWT ELITE operations confirm
 * later.
 */
export function ReviewStep({
  search,
  request,
  onEdit,
}: {
  search: TransferSearch;
  request: BookingRequest;
  onEdit: (step: StepId | "search") => void;
}) {
  const isReturn = request.legs.length > 1;
  const { lead } = request.manifest;
  const named = request.manifest.others.filter((o) => o.firstName || o.lastName);
  const extras = [
    request.extras.childSeats ? `${request.extras.childSeats} child ${request.extras.childSeats === 1 ? "seat" : "seats"}` : "",
    ...request.extras.equipment.map((e) => EQUIPMENT_OPTIONS.find((o) => o.id === e)?.label ?? e),
  ].filter(Boolean);
  const terminalLabel = (t: string | null) => AIRPORT_DESK_PAYMENT.points.find((p) => p.terminal === t)?.label;

  return (
    <div className="space-y-8">
      <section aria-labelledby="review-supplied" className="border border-graphite/20 bg-white/60">
        <header className="border-b border-graphite/15 p-5 sm:p-6">
          <h3 id="review-supplied" className="flex items-center gap-2 font-sans text-small font-medium uppercase tracking-[0.12em] text-ink">
            <IconCheck size={16} className="text-brand-navy" />
            {FLOW.review.supplied}
          </h3>
          <p className="mt-1 font-sans text-small text-graphite">{FLOW.review.suppliedHint}</p>
        </header>

        <ReviewBlock title="Transfer" onEdit={() => onEdit("transfer")}>
          <Row term="Service" value={SERVICES[request.service].name} />
          {request.legs.map((l) => (
            <Row key={l.id} term={isReturn ? (l.id === "out" ? RESULTS.outbound : RESULTS.return) : "Journey"}>
              {locationLabel(l.from)} → {locationLabel(l.to)}
              <span className="block text-graphite">
                {formatDate(l.date, "long")} · {timeLabel(l.from)}: {l.time || RESULTS.timeTbc}
              </span>
            </Row>
          ))}
          <Row term="Passengers" value={passengerLine(search)} />
        </ReviewBlock>
        <EditSearchLink onEdit={() => onEdit("search")} />

        <ReviewBlock title="Extras and requests" onEdit={() => onEdit("extras")}>
          <Row term="Requested" value={extras.length ? extras.join(", ") : FLOW.extras.none} />
          {request.extras.operationalNotes && (
            <Row term="Notes">
              <span className="whitespace-pre-line">{request.extras.operationalNotes}</span>
            </Row>
          )}
        </ReviewBlock>

        <ReviewBlock title="Passengers and travel" onEdit={() => onEdit("details")}>
          <Row term="Lead passenger">
            {lead.firstName} {lead.lastName}
            <span className="block text-graphite">{lead.email} · {lead.phone}</span>
          </Row>
          {named.length > 0 && (
            <Row term="Other passengers" value={named.map((o) => `${o.firstName} ${o.lastName}`.trim()).join(", ")} />
          )}
          {request.flights.map((f) => (
            <Row key={`${f.legId}-${f.kind}`} term={`${f.kind === "arrival" ? "Arrival" : "Departure"} flight (${f.airportId.toUpperCase()})`}>
              {[f.flightNumber, f.airline].filter(Boolean).join(" · ")}
              <span className="block text-graphite">
                {formatDate(f.scheduledDate, "short")} · {f.kind === "arrival" ? "lands" : "departs"} {f.scheduledTime}
                {f.origin ? ` · from ${f.origin}` : ""}
                {f.terminal ? ` · ${terminalLabel(f.terminal)}` : ""}
              </span>
            </Row>
          ))}
          {request.accommodation && (
            <Row term="Accommodation">
              {request.accommodation.name}
              {request.accommodation.addressOrDirections && (
                <span className="block text-graphite">{request.accommodation.addressOrDirections}</span>
              )}
            </Row>
          )}
        </ReviewBlock>
      </section>

      <section aria-labelledby="review-ops" className="border border-dashed border-graphite/40 bg-bone/50 p-5 sm:p-6">
        <h3 id="review-ops" className="flex items-center gap-2 font-sans text-small font-medium uppercase tracking-[0.12em] text-ink">
          <IconClock size={16} />
          {FLOW.review.confirmed}
        </h3>
        <p className="mt-1 font-sans text-small text-graphite">{FLOW.review.confirmedHint}</p>
        <dl className="mt-3 divide-y divide-graphite/15 font-sans text-small">
          {FLOW.review.ops.map((o) => (
            <Row key={o.term} term={o.term} value={o.detail} />
          ))}
        </dl>
      </section>

      <section aria-labelledby="review-cancel" className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 id="review-cancel" className="font-display text-[1.375rem]">{FLOW.review.cancellation}</h3>
          <ul className="mt-3 space-y-2 font-sans text-small text-ink">
            {CANCELLATION.points.map((p) => (
              <li key={p} className="flex gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-brand-navy" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-sans text-[0.8125rem] text-graphite">{CANCELLATION.legalNote}</p>
        </div>
        <div>
          <h3 className="font-display text-[1.375rem]">{FLOW.review.paymentNext}</h3>
          <p className="mt-3 font-sans text-small text-graphite">{FLOW.review.paymentNextBody}</p>
        </div>
      </section>
    </div>
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <div className="border-b border-graphite/15 px-5 py-4 last:border-b-0 sm:px-6">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="font-display text-[1.25rem] text-ink">{title}</h4>
        <button type="button" onClick={onEdit} className="min-h-[44px] font-sans text-small font-medium text-brand-navy underline underline-offset-4">
          {FLOW.review.edit}
          <span className="sr-only"> {title.toLowerCase()}</span>
        </button>
      </div>
      <dl className="divide-y divide-graphite/10 font-sans text-small">{children}</dl>
    </div>
  );
}

function EditSearchLink({ onEdit }: { onEdit: () => void }) {
  return (
    <p className="border-b border-graphite/15 px-5 pb-3 font-sans text-[0.8125rem] text-graphite sm:px-6">
      Route, dates or passengers changed?{" "}
      <button type="button" onClick={onEdit} className="text-ink underline underline-offset-4">
        {FLOW.editSearch}
      </button>
    </p>
  );
}
