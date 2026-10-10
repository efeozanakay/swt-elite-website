"use client";

import { useId } from "react";
import { Group, SelectField, TextField } from "@/components/b2c/booking/Fields";
import { TimeField } from "@/components/b2c/TransferSearchForm";
import { AIRPORT_DESK_PAYMENT, EQUIPMENT_OPTIONS } from "@/lib/b2c/business";
import { BOOKING } from "@/lib/b2c/copy";
import { FLOW } from "@/lib/b2c/copy-booking";
import { locationLabel } from "@/lib/b2c/demo/locations";
import { formatDate } from "@/lib/b2c/locale";
import { F, otherPassengerSlots, type BookingDraft, type FieldErrors } from "@/lib/b2c/booking/draft";
import { accommodationArea, flightRequirements } from "@/lib/b2c/booking/itinerary";
import type { Leg, ServiceId } from "@/lib/b2c/booking/types";
import type { TransferSearch } from "@/lib/b2c/transfer-search";

/**
 * Step 3. The traveller details a real booking needs, shaped by the
 * journey: lead passenger, other passengers, an arrival flight for every
 * leg that starts at an airport, a departure flight for every leg that
 * ends at one, and the accommodation. Same fields and validation as the
 * former single-page form; extras are shown as a summary from step 2
 * rather than asked for twice.
 */
export function DetailsStep({
  search,
  legs,
  service,
  draft,
  errors,
  setField,
  registerField,
  onEditExtras,
}: {
  search: TransferSearch;
  legs: Leg[];
  service: ServiceId;
  draft: BookingDraft;
  errors: FieldErrors;
  setField: (key: string, value: string) => void;
  registerField: (key: string) => (el: HTMLElement | null) => void;
  onEditExtras: () => void;
}) {
  const formId = useId();
  const v = draft.fields;
  const isReturn = legs.length > 1;
  const flights = flightRequirements(legs);
  const hotelArea = accommodationArea(legs);
  const others = otherPassengerSlots(search);

  const field = (
    k: string,
    label: string,
    opts: { type?: string; hint?: string; optional?: boolean; autoComplete?: string; inputMode?: "text" | "email" | "tel"; placeholder?: string; min?: string; max?: string } = {}
  ) => (
    <TextField
      key={k}
      id={`${formId}-${k}`}
      label={label}
      value={v[k] ?? ""}
      onChange={(x) => setField(k, x)}
      error={errors[k]}
      ref={registerField(k)}
      {...opts}
    />
  );

  const extras = [
    draft.childSeats ? `${draft.childSeats} child ${draft.childSeats === 1 ? "seat" : "seats"}` : "",
    ...draft.equipment.map((e) => EQUIPMENT_OPTIONS.find((o) => o.id === e)?.label ?? e),
  ].filter(Boolean);

  return (
    <div className="space-y-10">
      <Group title={BOOKING.lead} hint={BOOKING.leadHint}>
        <div className="grid gap-3 sm:grid-cols-2">
          {field(F.leadFirst, "First name", { autoComplete: "given-name" })}
          {field(F.leadLast, "Last name", { autoComplete: "family-name" })}
          {field(F.email, "Email", { type: "email", inputMode: "email", autoComplete: "email", hint: BOOKING.emailHint })}
          {field(F.phone, "Mobile phone", { type: "tel", inputMode: "tel", autoComplete: "tel", hint: BOOKING.phoneHint, placeholder: "+44 7700 900123" })}
        </div>
      </Group>

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
                {field(F.other(o.key, "first"), "First name", { optional: true, autoComplete: "off" })}
                {field(F.other(o.key, "last"), "Last name", { optional: true, autoComplete: "off" })}
              </li>
            ))}
          </ul>
          {search.children > 0 && <p className="mt-3 font-sans text-[0.8125rem] text-graphite">{BOOKING.agesNote}</p>}
        </Group>
      )}

      {flights.length > 0 && (
        <Group title={BOOKING.flights} hint={BOOKING.flightsHint}>
          <div className="space-y-6">
            {flights.map((f) => {
              const aytArrival = f.kind === "arrival" && f.airport.id === AIRPORT_DESK_PAYMENT.airportId;
              const legLabel = isReturn ? (f.legId === "out" ? "Outbound" : "Return") : "";
              return (
                <fieldset key={f.key} className="border border-graphite/15 bg-white/40 p-4 sm:p-5">
                  <legend className="px-1 font-sans text-small font-medium text-ink">
                    {f.kind === "arrival" ? BOOKING.arrival : BOOKING.departure}
                    <span className="font-normal text-graphite">
                      {" "}
                      · {locationLabel(f.airport)}
                      {legLabel ? ` · ${legLabel}` : ""}
                    </span>
                  </legend>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {field(F.flight(f.key, "number"), "Flight number", { placeholder: "TK 2412", autoComplete: "off" })}
                    {field(F.flight(f.key, "airline"), "Airline", { optional: true, autoComplete: "off" })}
                    {f.kind === "arrival"
                      ? field(F.flight(f.key, "origin"), "Flying in from", { optional: true, autoComplete: "off" })
                      : field(F.flight(f.key, "date"), "Flight date", { type: "date", hint: FLOW.details.flightDateHint, min: f.legDate })}
                    {f.kind === "arrival" && (
                      <div className="sf-cell min-h-[3.75rem] bg-bone/40">
                        <span className="sf-label">Landing date</span>
                        <span className="mt-1 font-sans text-body text-ink">{formatDate(f.legDate, "short")}</span>
                      </div>
                    )}
                    <TimeField
                      label={f.kind === "arrival" ? "Landing time" : "Departure time"}
                      required
                      value={v[F.flight(f.key, "time")] ?? ""}
                      onChange={(x) => setField(F.flight(f.key, "time"), x)}
                      error={errors[F.flight(f.key, "time")]}
                      hint={f.kind === "arrival" ? FLOW.details.arrivalTimeHint : FLOW.details.departureTimeHint}
                      hourRef={registerField(F.flight(f.key, "time"))}
                    />
                    {aytArrival && (
                      <SelectField
                        id={`${formId}-${F.flight(f.key, "terminal")}`}
                        label={FLOW.details.terminal}
                        value={v[F.flight(f.key, "terminal")] ?? ""}
                        onChange={(x) => setField(F.flight(f.key, "terminal"), x)}
                        optional
                        hint={FLOW.details.terminalHint}
                        emptyLabel={FLOW.details.terminalUnknown}
                        options={AIRPORT_DESK_PAYMENT.points.map((p) => ({ value: p.terminal, label: p.label }))}
                      />
                    )}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </Group>
      )}

      {hotelArea && (
        <Group title={BOOKING.hotel} hint={BOOKING.hotelHint(hotelArea.name)}>
          <div className="grid gap-3 sm:grid-cols-2">
            {field(F.hotel, "Hotel or accommodation name", { autoComplete: "off" })}
            {field(F.hotelAddress, "Address or directions", { optional: true, autoComplete: "street-address" })}
          </div>
        </Group>
      )}

      <section aria-labelledby={`${formId}-extras`} className="border border-graphite/15 bg-white/40 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 id={`${formId}-extras`} className="font-sans text-small font-medium text-ink">{FLOW.details.requestsSummary}</h3>
          <button type="button" onClick={onEditExtras} className="min-h-[44px] font-sans text-small font-medium text-brand-navy underline underline-offset-4">
            {FLOW.details.change}
            <span className="sr-only"> extras and requests</span>
          </button>
        </div>
        <p className="font-sans text-small text-graphite">{extras.length ? extras.join(", ") : FLOW.extras.none}</p>
        {draft.notes.trim() && <p className="mt-1 whitespace-pre-line font-sans text-small text-ink">“{draft.notes.trim()}”</p>}
      </section>
    </div>
  );
}
