"use client";

import { useState } from "react";
import { IconBag, IconCheck, IconClock, IconUsers } from "@/components/b2c/Icons";
import { ServiceImage } from "@/components/b2c/ServiceImage";
import { privateVehicleFor } from "@/lib/b2c/business";
import { PRICE_PLACEHOLDER, RESULTS, SERVICES } from "@/lib/b2c/copy";
import { FLOW } from "@/lib/b2c/copy-booking";
import type { Quote, ServiceId } from "@/lib/b2c/booking/types";
import type { TransferSearch } from "@/lib/b2c/transfer-search";

/**
 * One service option on the Select Transfer step: Shared Shuttle or
 * Private Transfer. Moved here from the former results page unchanged in
 * substance; the price now comes from a Quote, which in this preview is
 * always "unavailable" and renders as a placeholder.
 */
export function TransferOptionCard({
  id,
  search,
  quote,
  selected,
  onSelect,
}: {
  id: ServiceId;
  search: TransferSearch;
  quote: Quote;
  selected: boolean;
  onSelect: () => void;
}) {
  const svc = SERVICES[id];
  const [open, setOpen] = useState(false);
  const pax = search.adults + search.children;
  const isReturn = search.trip === "return";
  const free = search.ages.filter((a) => a >= 0 && a < 3).length;
  const half = search.ages.filter((a) => a >= 3).length;
  const vehicle = privateVehicleFor(pax);

  const facts =
    id === "shared"
      ? [
          { icon: IconUsers, term: RESULTS.seats, value: RESULTS.seatsFor(pax), note: search.children ? RESULTS.childFareNote(free, half) : "" },
          { icon: IconClock, term: "Waiting", value: RESULTS.waiting, note: "Not counted from landing. Other hotel stops possible." },
          { icon: IconBag, term: RESULTS.luggage, value: RESULTS.luggageShared(pax), note: "" },
        ]
      : [
          { icon: IconUsers, term: RESULTS.vehicle, value: vehicle.label, note: vehicle.note },
          { icon: IconClock, term: RESULTS.journey, value: RESULTS.direct, note: search.children ? "Children included in the vehicle price; infants count towards capacity" : "" },
          { icon: IconBag, term: RESULTS.luggage, value: RESULTS.luggagePrivate, note: "" },
        ];

  return (
    <article
      aria-labelledby={`svc-${id}`}
      className={`relative flex flex-col border bg-white/60 transition-[border-color,box-shadow] duration-300 ${
        selected ? "border-ink shadow-[0_0_0_1px_theme(colors.ink)]" : "border-graphite/20 hover:border-graphite/45"
      }`}
    >
      {selected && <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1 bg-brand-amber" />}
      <ServiceImage id={id} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id={`svc-${id}`} className="font-display text-[1.625rem] leading-tight">{svc.name}</h3>
            <p className="mt-1 font-sans text-body text-graphite">{svc.tagline}</p>
          </div>
          {selected && (
            <span className="demo-tag shrink-0 border-ink bg-ink py-1 text-ivory">
              <IconCheck size={12} /> {RESULTS.selected}
            </span>
          )}
        </div>

        <ul className="mt-5 space-y-2.5">
          {svc.features.map((f) => (
            <li key={f} className="flex gap-2.5 font-sans text-small text-ink">
              <IconCheck size={16} className="mt-0.5 shrink-0 text-brand-navy" />
              {f}
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 border-t border-graphite/15 pt-5 font-sans text-small">
          {facts.map(({ icon: Icon, term, value, note }) => (
            <div key={term}>
              <dt className="flex items-center gap-2 text-graphite">
                <Icon size={16} className="shrink-0" />
                {term}
              </dt>
              <dd className="pl-6 text-ink">{value}</dd>
              {note && <dd className="pl-6 text-graphite">{note}</dd>}
            </div>
          ))}
        </dl>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={`svc-${id}-details`}
          onClick={() => setOpen((v) => !v)}
          className="mt-4 inline-flex min-h-[44px] items-center gap-2 self-start font-sans text-small font-medium text-brand-navy underline-offset-4 hover:underline"
        >
          {open ? RESULTS.hideDetails : RESULTS.details}
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.25" />
          </svg>
        </button>
        <dl id={`svc-${id}-details`} hidden={!open} className="mt-2 space-y-3 bg-bone/70 p-4 font-sans text-small">
          {svc.details.map((d) => (
            <div key={d.term}>
              <dt className="font-medium text-ink">{d.term}</dt>
              <dd className="mt-0.5 text-graphite">{d.detail}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          <div>
            <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{svc.priceBasis}</p>
            {quote.status === "quoted" ? (
              <p className="mt-1 font-display text-[1.75rem] leading-none">
                {new Intl.NumberFormat("en-GB", { style: "currency", currency: quote.total.currency }).format(quote.total.amountMinor / 100)}
              </p>
            ) : (
              <>
                <p className="mt-1 font-display text-[1.75rem] leading-none" aria-hidden="true">{PRICE_PLACEHOLDER}</p>
                <p className="mt-1 font-sans text-[0.75rem] text-graphite">{FLOW.priceUnavailable}</p>
              </>
            )}
            {isReturn && <p className="mt-0.5 font-sans text-[0.75rem] text-graphite">{RESULTS.bothLegs}</p>}
          </div>
          <button
            type="button"
            aria-pressed={selected}
            onClick={onSelect}
            className={selected ? "btn-outline border-ink bg-ink px-5 py-3 text-ivory hover:bg-ink" : "btn-action px-5 py-3"}
          >
            {selected ? RESULTS.selected : RESULTS.select}
            <span className="sr-only"> {svc.name}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
