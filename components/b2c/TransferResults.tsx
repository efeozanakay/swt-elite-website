"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AirportMeeting } from "@/components/b2c/AirportMeeting";
import { B2CImage } from "@/components/b2c/B2CImage";
import { IconArrow, IconBag, IconCheck, IconClock, IconInfo, IconUsers } from "@/components/b2c/Icons";
import { TransferSearchForm } from "@/components/b2c/TransferSearchForm";
import { Photo } from "@/components/Photo";
import {
  EQUIPMENT_NOTE,
  EQUIPMENT_OPTIONS,
  FLIGHT_MONITORING,
  SUPPORT,
  privateVehicleFor,
} from "@/lib/b2c/business";
import { MEETING, PRICE_PLACEHOLDER, PROTOTYPE, RESULTS, SEARCH, SERVICES } from "@/lib/b2c/copy";
import { areaImageFor, tourDestinationFor } from "@/lib/b2c/cross-sell";
import { locationById, locationLabel, type TransferLocation } from "@/lib/b2c/demo/locations";
import { formatDate } from "@/lib/b2c/locale";
import {
  searchFromParams,
  searchToQuery,
  timeLabel,
  validateSearch,
  type TransferSearch,
} from "@/lib/b2c/transfer-search";

type ServiceId = "shared" | "private";

const PHOTOS: Record<ServiceId, { src: string; alt: string; position: string }> = {
  shared: {
    src: "/images/operations/fleet-mixed-vehicle-lineup.png",
    alt: "SWT Elite minibuses and coaches parked by the coast",
    position: "30% 60%",
  },
  private: {
    src: "/images/operations/transportation-airport-vito.png",
    alt: "A private SWT Elite van outside an airport terminal",
    position: "50% 60%",
  },
};

/**
 * Every state of this page renders inside a block at least one screen
 * tall. The page is statically exported and reads its search from the
 * URL in the browser, so the first paint is a placeholder that is then
 * replaced. When the placeholder was shorter than the content, the
 * footer jumped down the screen on every load (CLS 0.27-0.30 measured).
 * With the placeholder a full screen tall, the footer starts below the
 * fold and never moves within view.
 */
const FRAME = "min-h-[100svh]";

export function TransferResults() {
  const params = useSearchParams();
  const router = useRouter();
  const search = useMemo(() => searchFromParams(new URLSearchParams(params.toString())), [params]);
  const from = locationById(search.from);
  const to = locationById(search.to);
  const complete = Boolean(from && to && search.date);
  const errors = useMemo(() => (complete ? validateSearch(search) : {}), [complete, search]);
  const errorList = Object.values(errors);
  const invalid = errorList.length > 0;

  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<ServiceId | null>(null);
  const [mounted, setMounted] = useState(false);
  const [summaryInView, setSummaryInView] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // A link can arrive with a journey that cannot be booked (same place
  // twice, two hotels, a past date, a round trip without a return date,
  // missing child ages). Open the editor with its errors showing, and
  // keep selection off until the journey is fixed.
  useEffect(() => {
    if (invalid) {
      setEditing(true);
      setSelected(null);
    }
  }, [invalid]);

  // The mobile selection bar is only useful while the full summary is
  // off-screen; when the summary is visible the bar would cover it.
  useEffect(() => {
    const node = summaryRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setSummaryInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(node);
    return () => io.disconnect();
  }, [mounted, complete]);

  const applySearch = (next: TransferSearch) => {
    router.replace(`/transfers/results?${searchToQuery(next)}`, { scroll: false });
    setEditing(false);
    setSelected(null);
    requestAnimationFrame(() => editButtonRef.current?.focus());
  };

  // Dates are formatted with the visitor's Intl data, which need not
  // match the build machine's, so nothing locale-formatted is rendered
  // before mount.
  if (!mounted) return <div className={`${FRAME} bg-charcoal`} aria-busy="true" />;

  if (!complete) {
    return (
      <section className={`${FRAME} bg-ivory pb-24 pt-[calc(var(--header-h)+3rem)]`}>
        <div className="edge wrap">
          <p className="eyebrow mb-6">{RESULTS.eyebrow}</p>
          <h1 className="font-display text-display text-ink">{RESULTS.missing.title}</h1>
          <p className="mt-4 max-w-xl font-sans text-body-lg text-graphite">{RESULTS.missing.body}</p>
          <div className="mt-10 border border-graphite/15 bg-ivory p-5 shadow-[0_40px_80px_-40px_rgba(21,19,15,0.35)] sm:p-7">
            <TransferSearchForm initial={search} onSearch={applySearch} />
          </div>
        </div>
      </section>
    );
  }

  const isReturn = search.trip === "return";
  const hotelSide = from!.kind === "airport" ? to! : from!;
  const tourDestination = tourDestinationFor(hotelSide.id);
  const areaImage = areaImageFor(hotelSide.id);
  const pax = search.adults + search.children;
  const arrivalAirport = from!.kind === "airport" ? from! : isReturn && to!.kind === "airport" ? to! : null;
  const goesToAirport = to!.kind === "airport" || (isReturn && from!.kind === "airport");
  const paxLine = passengerLine(search);

  return (
    <div className={FRAME}>
      {/* ---------------- Journey summary ---------------- */}
      <section
        aria-labelledby="results-title"
        className="on-dark relative overflow-hidden bg-charcoal pb-6 pt-[calc(var(--header-h)+1.25rem)] text-ivory sm:pb-10 sm:pt-[calc(var(--header-h)+2.5rem)]"
      >
        {/* The destination, quietly: on the right half behind the heading,
            fading into the charcoal so it sets the scene without
            competing with the summary or the options below. */}
        {areaImage && (
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-full opacity-30 lg:w-[58%] lg:opacity-70">
            <B2CImage name={areaImage} alt="" sizes="(min-width: 1024px) 58vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/60 to-charcoal/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/40" />
          </div>
        )}
        <div className="edge wrap relative">
          <div className="flex items-start justify-between gap-4 lg:items-end">
            <div className="min-w-0">
              <p className="eyebrow mb-3 sm:mb-4">{RESULTS.eyebrow}</p>
              <h1 id="results-title" className="font-display text-[1.625rem] leading-tight sm:text-display">
                <span className="sr-only">{RESULTS.title}: </span>
                <span className="block">{from!.name}</span>
                <span className="flex items-center gap-2 text-ivory/90 sm:gap-3">
                  <IconArrow size={22} className="shrink-0 text-brand-amber" />
                  <span className="italic">{to!.name}</span>
                </span>
              </h1>
            </div>
            <button
              ref={editButtonRef}
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-expanded={editing}
              aria-controls="edit-search"
              className="btn-outline shrink-0 px-4 py-2.5 sm:px-6 sm:py-3.5"
            >
              {editing ? RESULTS.closeEdit : RESULTS.edit}
            </button>
          </div>

          <dl className={`mt-5 grid grid-cols-2 gap-px border border-ivory/15 bg-ivory/15 sm:mt-8 ${isReturn ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            <Leg label={isReturn ? RESULTS.outbound : SEARCH.oneWay} from={from!} date={search.date} time={search.time} />
            {isReturn && search.returnDate && (
              <Leg label={RESULTS.return} from={to!} date={search.returnDate} time={search.returnTime} />
            )}
            <SummaryCell term={SEARCH.passengers} value={paxLine} />
            <SummaryCell term="Journey type" value={isReturn ? SEARCH.roundTrip : SEARCH.oneWay} />
          </dl>
        </div>
      </section>

      {/* ---------------- Edit panel ---------------- */}
      <div id="edit-search" hidden={!editing} className="border-b border-graphite/15 bg-bone">
        <div className="edge wrap py-8">
          {invalid && (
            <div role="alert" className="mb-6 border-l-2 border-[#9A3A12] bg-ivory p-4">
              <p className="font-display text-[1.25rem] text-ink">{RESULTS.invalid.title}</p>
              <p className="mt-1 font-sans text-small text-graphite">{RESULTS.invalid.body}</p>
            </div>
          )}
          {/* Remount when the URL changes so the form starts from the
              search actually being shown. */}
          <TransferSearchForm
            key={params.toString()}
            initial={search}
            onSearch={applySearch}
            submitLabel={SEARCH.update}
            showErrors={invalid}
          />
        </div>
      </div>

      {/* ---------------- Options ---------------- */}
      <section aria-labelledby="options-title" className="bg-ivory py-8 text-ink sm:py-14 lg:py-20">
        <div className="edge wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 id="options-title" className="font-display text-display-sm">{RESULTS.title}</h2>
              <p className="font-sans text-small text-graphite">{PROTOTYPE.pricing}</p>
            </div>

            {invalid ? (
              <p className="mt-4 flex gap-2 border-l-2 border-[#9A3A12] bg-bone/70 p-3 font-sans text-small text-ink">
                <IconInfo size={18} className="mt-0.5 shrink-0" />
                {RESULTS.invalid.blocked}
              </p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-sans text-small text-graphite">
                {[RESULTS.cancellation, "Real-time flight monitoring", "Free child seats on request"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <IconCheck size={16} className="text-brand-navy" />
                    {t}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {(["shared", "private"] as const).map((id) => (
                <ServiceOption
                  key={id}
                  id={id}
                  search={search}
                  disabled={invalid}
                  selected={selected === id}
                  onSelect={() => {
                    setSelected(id);
                    // On small screens the summary sits below the cards;
                    // bring it into view so the selection has a visible result.
                    if (window.matchMedia("(max-width: 1023px)").matches) {
                      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                />
              ))}
            </div>

            {/* ---------------- At the airport ---------------- */}
            {(arrivalAirport || goesToAirport) && (
              <div className="mt-10 grid gap-6 border-t border-graphite/20 pt-8 md:grid-cols-2">
                {arrivalAirport && (
                  <section aria-labelledby="meeting-title">
                    <h2 id="meeting-title" className="eyebrow text-ink">
                      {MEETING.resultsTitle(locationLabel(arrivalAirport))}
                    </h2>
                    <div className="mt-4">
                      <AirportMeeting airportId={arrivalAirport.id} />
                    </div>
                    <p className="mt-4 font-sans text-small text-graphite">{FLIGHT_MONITORING}</p>
                  </section>
                )}
                {goesToAirport && (
                  <section aria-labelledby="departure-title">
                    <h2 id="departure-title" className="eyebrow text-ink">Pickup for your flight home</h2>
                    <p className="mt-4 font-sans text-body text-ink">{RESULTS.departureNote}</p>
                  </section>
                )}
              </div>
            )}
          </div>

          <aside aria-labelledby="summary-title" className="lg:col-span-4">
            <div
              ref={summaryRef}
              tabIndex={-1}
              className="scroll-mt-[calc(var(--header-h)+16px)] border border-graphite/20 bg-white/60 p-6 focus:outline-none lg:sticky lg:top-[calc(var(--header-h)+24px)]"
            >
              <h2 id="summary-title" className="eyebrow text-ink">{RESULTS.summary}</h2>
              <div aria-live="polite">
                {selected ? (
                  <>
                    <div className="mt-5 flex items-start justify-between gap-4 border-b border-graphite/15 pb-5">
                      <div>
                        <p className="font-display text-[1.5rem] leading-tight">{SERVICES[selected].name}</p>
                        {isReturn && <p className="mt-1 font-sans text-small text-graphite">{RESULTS.bothLegs}</p>}
                      </div>
                      <button type="button" onClick={() => setSelected(null)} className="link-quiet shrink-0 text-small">
                        {RESULTS.change}
                      </button>
                    </div>
                    <dl className="divide-y divide-graphite/15 font-sans text-small">
                      <Row term={isReturn ? RESULTS.outbound : "Journey"} value={`${locationLabel(from!)} → ${locationLabel(to!)}`} />
                      <Row term="Date" value={`${formatDate(search.date, "long")}${search.time ? `, ${search.time}` : ""}`} />
                      {isReturn && search.returnDate && (
                        <>
                          <Row term={RESULTS.return} value={`${locationLabel(to!)} → ${locationLabel(from!)}`} />
                          <Row term="Date" value={`${formatDate(search.returnDate, "long")}${search.returnTime ? `, ${search.returnTime}` : ""}`} />
                        </>
                      )}
                      <Row term={SEARCH.passengers} value={paxLine} />
                      <Row term={SERVICES[selected].priceBasis} value={PRICE_PLACEHOLDER} />
                    </dl>
                    <p className="mt-4 flex gap-2 font-sans text-small text-ink">
                      <IconCheck size={16} className="mt-0.5 shrink-0 text-brand-navy" />
                      {RESULTS.cancellation}
                    </p>
                    <TravelDetailsPreview childCount={search.children} />
                  </>
                ) : (
                  <p className="mt-5 font-sans text-body text-graphite">{RESULTS.noSelection}</p>
                )}
              </div>
              {/* Disabled and muted, not a faded action colour: it must not
                  read as a working button. */}
              <button
                type="button"
                disabled
                aria-describedby="booking-note"
                className="mt-6 w-full cursor-not-allowed border border-dashed border-graphite/40 px-6 py-3.5 font-sans text-small uppercase tracking-[0.12em] text-graphite"
              >
                {RESULTS.continueLater}
              </button>
              <p id="booking-note" className="mt-4 flex gap-2 font-sans text-small text-graphite">
                <IconInfo size={18} className="mt-0.5 shrink-0" />
                {PROTOTYPE.booking}
              </p>
              <p className="mt-2 pl-[26px] font-sans text-[0.8125rem] text-graphite">{RESULTS.legalNote}</p>
              <div className="mt-5 border-t border-graphite/15 pt-4 font-sans text-small text-graphite">
                <p>
                  Questions:{" "}
                  <a className="text-ink underline underline-offset-4" href={`mailto:${SUPPORT.email}`}>
                    {SUPPORT.email}
                  </a>
                </p>
                <p className="mt-1">
                  Urgent help on the day:{" "}
                  <a className="text-ink underline underline-offset-4" href={`tel:${SUPPORT.emergencyTel}`}>
                    {SUPPORT.emergencyPhone}
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------------- Cross-sell ---------------- */}
      {tourDestination && (
        <section aria-labelledby="xsell-title" className="bg-bone py-16 text-ink lg:py-20">
          <div className="edge wrap">
            <div className="grid overflow-hidden border border-graphite/15 bg-ivory md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              {areaImage && (
                <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[16rem]">
                  <B2CImage name={areaImage} sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
              )}
              <div className="flex flex-col items-start justify-center gap-6 border-t-2 border-brand-amber p-6 sm:p-10 md:border-l-2 md:border-t-0">
                <div className="max-w-lg">
                  <p className="eyebrow mb-3">{RESULTS.crossSellEyebrow}</p>
                  <h2 id="xsell-title" className="font-display text-display-sm">{RESULTS.crossSell(hotelSide.name)}</h2>
                  <p className="mt-3 font-sans text-body text-graphite">{RESULTS.crossSellBody}</p>
                </div>
                <Link href={`/tours?destination=${encodeURIComponent(tourDestination)}#discover`} className="btn-outline">
                  {RESULTS.crossSellCta}
                  <IconArrow size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mobile: keep the choice visible once made, but only while the
          full summary is off-screen, so the bar never covers it. */}
      {selected && <div aria-hidden="true" className="h-20 lg:hidden" />}
      {selected && !summaryInView && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-graphite/20 bg-ivory/95 backdrop-blur-sm lg:hidden">
          <div className="edge flex items-center justify-between gap-4 py-3">
            <p className="min-w-0 font-sans text-small">
              <span className="block truncate font-medium text-ink">{SERVICES[selected].name}</span>
              <span className="text-graphite">
                {SERVICES[selected].priceBasis} {PRICE_PLACEHOLDER}
              </span>
            </p>
            <button
              type="button"
              className="btn-outline shrink-0 px-4 py-2.5"
              onClick={() => {
                summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                summaryRef.current?.focus({ preventScroll: true });
              }}
            >
              {RESULTS.summary}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function passengerLine(s: TransferSearch) {
  const base = RESULTS.passengers(s.adults, s.children);
  const known = s.ages.filter((a) => a >= 0);
  if (!s.children || known.length !== s.children) return base;
  return `${base} (${s.children === 1 ? "age" : "ages"} ${known.map((a) => (a === 0 ? "under 1" : a)).join(", ")})`;
}

function Leg({ label, from, date, time }: { label: string; from: TransferLocation; date: string; time: string }) {
  return (
    <div className="col-span-2 bg-charcoal p-3 sm:col-span-1 sm:p-5">
      <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-stone">{label}</dt>
      <dd className="mt-1 font-sans text-small text-ivory sm:mt-2 sm:text-body">
        <span className="sm:hidden">{formatDate(date, "short")}</span>
        <span className="hidden sm:inline">{formatDate(date, "long")}</span>
        <span className="text-ivory/70 sm:block sm:text-small">
          <span className="sm:hidden"> · </span>
          {timeLabel(from)}: {time || RESULTS.timeTbc}
        </span>
      </dd>
    </div>
  );
}

function SummaryCell({ term, value }: { term: string; value: string }) {
  return (
    <div className="bg-charcoal p-3 sm:p-5">
      <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-stone">{term}</dt>
      <dd className="mt-1 font-sans text-small text-ivory sm:mt-2 sm:text-body">{value}</dd>
    </div>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="shrink-0 text-graphite">{term}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}

function ServiceOption({
  id,
  search,
  disabled,
  selected,
  onSelect,
}: {
  id: ServiceId;
  search: TransferSearch;
  disabled: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const svc = SERVICES[id];
  const photo = PHOTOS[id];
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
          { icon: IconClock, term: "Waiting", value: RESULTS.waiting, note: "Extra hotel stops possible" },
          { icon: IconBag, term: RESULTS.luggage, value: RESULTS.luggageShared(pax), note: "" },
        ]
      : [
          { icon: IconUsers, term: RESULTS.vehicle, value: vehicle.label, note: vehicle.note },
          { icon: IconClock, term: RESULTS.journey, value: RESULTS.direct, note: search.children ? "Children included in the vehicle price" : "" },
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
      <Photo src={photo.src} alt={photo.alt} aspect="16 / 9" position={photo.position} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
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

        {/* dl > div > (dt, dd): the only nesting a description list allows.
            The icon sits inside the dt so it stays with its term. */}
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

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{svc.priceBasis}</p>
            <p className="mt-1 font-display text-[1.75rem] leading-none" aria-label={`${svc.priceBasis}: not shown in this preview`}>
              {PRICE_PLACEHOLDER}
            </p>
            {isReturn && <p className="mt-1 font-sans text-[0.75rem] text-graphite">{RESULTS.bothLegs}</p>}
          </div>
          <button
            type="button"
            aria-pressed={selected}
            disabled={disabled}
            onClick={onSelect}
            className={
              selected
                ? "btn-outline border-ink bg-ink px-5 py-3 text-ivory hover:bg-ink"
                : "btn-action px-5 py-3 disabled:bg-stone/60 disabled:text-graphite disabled:opacity-100"
            }
          >
            {selected ? RESULTS.selected : RESULTS.select}
            <span className="sr-only"> {svc.name}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

const NOTES_MAX = 300;

/**
 * The requests a real booking will collect: child seats, items to
 * declare and a note for operations. Validated, but deliberately not
 * submitted anywhere: there is no booking system behind this preview,
 * and the panel says so.
 */
function TravelDetailsPreview({ childCount }: { childCount: number }) {
  const id = useId();
  const [seats, setSeats] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState<null | "ok" | "error">(null);
  const tooLong = notes.length > NOTES_MAX;
  const copy = RESULTS.details_preview;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setChecked(tooLong ? "error" : "ok");
      }}
      className="mt-6 border-t border-graphite/15 pt-5"
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={`${id}-title`} className="font-sans text-small font-medium uppercase tracking-[0.12em] text-ink">{copy.title}</h3>
        <span className="font-sans text-[0.75rem] text-graphite">{copy.preview}</span>
      </div>

      {childCount > 0 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-sans text-small text-ink" id={`${id}-seats`}>{copy.childSeats}</p>
            <p className="font-sans text-[0.8125rem] text-graphite">{copy.childSeatsHint}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="One fewer child seat" disabled={seats <= 0} onClick={() => setSeats(seats - 1)} className="flex h-11 w-11 items-center justify-center border border-graphite/30 disabled:opacity-35">−</button>
            <output aria-labelledby={`${id}-seats`} className="w-5 text-center font-sans text-body tabular-nums">{seats}</output>
            <button type="button" aria-label="One more child seat" disabled={seats >= childCount} onClick={() => setSeats(seats + 1)} className="flex h-11 w-11 items-center justify-center border border-graphite/30 disabled:opacity-35">+</button>
          </div>
        </div>
      )}

      <fieldset className="mt-4">
        <legend className="font-sans text-small text-ink">{copy.equipment}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((o) => {
            const on = items.includes(o.id);
            return (
              <label key={o.id} className={`chip cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${on ? "border-ink bg-ink text-ivory" : ""}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => setItems(on ? items.filter((i) => i !== o.id) : [...items, o.id])}
                />
                {o.label}
              </label>
            );
          })}
        </div>
        <p className="mt-2 font-sans text-[0.8125rem] text-graphite">{EQUIPMENT_NOTE}</p>
      </fieldset>

      <label className="mt-4 block">
        <span className="font-sans text-small text-ink">{copy.notes}</span>
        <span className="block font-sans text-[0.8125rem] text-graphite">{copy.notesHint}</span>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setChecked(null);
          }}
          rows={3}
          aria-invalid={tooLong || undefined}
          aria-describedby={tooLong ? `${id}-notes-error` : undefined}
          className="mt-2 w-full border border-graphite/25 bg-white/70 p-3 font-sans text-small text-ink focus:border-ink"
        />
        <span className={`block text-right font-sans text-[0.75rem] ${tooLong ? "text-[#9A3A12]" : "text-graphite"}`}>
          {notes.length}/{NOTES_MAX}
        </span>
        {tooLong && (
          <span id={`${id}-notes-error`} className="sf-error block">
            {copy.notesTooLong(NOTES_MAX)}
          </span>
        )}
      </label>

      <button type="submit" className="btn-outline mt-3 w-full py-3">{copy.check}</button>
      <p aria-live="polite" className="mt-2 font-sans text-small text-graphite">
        {checked === "ok" ? copy.ok : ""}
      </p>
    </form>
  );
}
