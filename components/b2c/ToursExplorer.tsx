"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconArrow, IconClock, IconClose, IconPin, IconSearch } from "@/components/b2c/Icons";
import { B2CImage } from "@/components/b2c/B2CImage";
import { SectionIntro } from "@/components/b2c/SectionIntro";
import { TourCard } from "@/components/b2c/TourCard";
import { TourDetailBody } from "@/components/b2c/TourDetailBody";
import { PROTOTYPE, TOURS } from "@/lib/b2c/copy";
import {
  DURATION_LABELS,
  TOUR_CATEGORIES,
  TOUR_DESTINATIONS,
  TOURS as TOUR_LIST,
  tourById,
  type Tour,
  type TourCategory,
  type TourDestination,
  type TourDuration,
} from "@/lib/b2c/demo/tours";
import { normalise } from "@/lib/b2c/demo/locations";

type Filters = {
  q: string;
  category: TourCategory | "";
  destination: TourDestination | "";
  duration: TourDuration | "";
};

const EMPTY: Filters = { q: "", category: "", destination: "", duration: "" };


/** Editorial layout for the four featured experiences: a wide and a
 *  narrow tile per row, alternating sides, so the row reads as a
 *  magazine spread rather than a uniform grid of thumbnails. */
const FEATURED_SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

/**
 * Featured row, category entry points, the filterable listing and the
 * destination index share one piece of state, so a click anywhere on the
 * page narrows the same list. Filters are mirrored into the query string
 * (replaceState, no history spam) so a filtered view can be shared, and
 * so the transfer results page can deep-link into a destination.
 */
export function ToursExplorer() {
  const [f, setF] = useState<Filters>(EMPTY);
  const [openTour, setOpenTour] = useState<Tour | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // State, not a ref: the URL must only be written after a render that
  // already holds the values restored from it, or the first write wipes
  // the deep link it was about to read.
  const [ready, setReady] = useState(false);

  // Restore from the URL once.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const dest = p.get("destination");
    const cat = p.get("category");
    const dur = p.get("duration");
    setF({
      q: p.get("q") ?? "",
      destination: (TOUR_DESTINATIONS as readonly string[]).includes(dest ?? "") ? (dest as TourDestination) : "",
      category: TOUR_CATEGORIES.some((c) => c.id === cat) ? (cat as TourCategory) : "",
      duration: dur === "half-day" || dur === "full-day" ? dur : "",
    });
    const t = tourById(p.get("tour"));
    if (t) setOpenTour(t);
    setReady(true);
  }, []);

  // Mirror to the URL.
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (f.q) p.set("q", f.q);
    if (f.destination) p.set("destination", f.destination);
    if (f.category) p.set("category", f.category);
    if (f.duration) p.set("duration", f.duration);
    if (openTour) p.set("tour", openTour.id);
    const qs = p.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
  }, [f, openTour, ready]);

  // Drive the native dialog from state.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (openTour && !d.open) {
      d.showModal();
      document.body.style.overflow = "hidden";
    } else if (!openTour && d.open) {
      d.close();
    }
  }, [openTour]);

  const onDialogClose = () => {
    document.body.style.overflow = "";
    setOpenTour(null);
    triggerRef.current?.focus();
  };

  const open = useCallback((tour: Tour, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpenTour(tour);
  }, []);

  const results = useMemo(() => {
    const q = normalise(f.q.trim());
    return TOUR_LIST.filter(
      (t) =>
        (!f.category || t.category === f.category) &&
        (!f.destination || t.destination === f.destination) &&
        (!f.duration || t.duration === f.duration) &&
        (!q ||
          [t.title, t.destination, t.summary, ...t.highlights, TOUR_CATEGORIES.find((c) => c.id === t.category)!.label].some((s) =>
            normalise(s).includes(q)
          ))
    );
  }, [f]);

  const active = f.q || f.category || f.destination || f.duration;
  const set = (patch: Partial<Filters>) => setF((prev) => ({ ...prev, ...patch }));
  const jumpToList = () =>
    document.getElementById("discover")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* ---------------- Featured ---------------- */}
      <section aria-labelledby="featured-title" className="bg-ivory py-20 text-ink lg:py-28">
        <div className="edge wrap">
          <SectionIntro id="featured-title" eyebrow={TOURS.featured.eyebrow} title={TOURS.featured.title} body={TOURS.featured.body} />
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
            {TOUR_LIST.filter((t) => t.featured).map((t, i) => {
              const category = TOUR_CATEGORIES.find((c) => c.id === t.category)!;
              return (
                <li key={t.id} className={FEATURED_SPANS[i % FEATURED_SPANS.length]}>
                  <button
                    type="button"
                    onClick={(e) => open(t, e.currentTarget)}
                    className="group relative block aspect-[4/5] w-full overflow-hidden bg-charcoal text-left text-ivory sm:aspect-[4/5] lg:aspect-auto lg:h-[30rem]"
                  >
                    <span className="absolute inset-0 transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03] motion-reduce:transform-none">
                      <B2CImage name={t.image} focus={t.focus} alt="" sizes="(min-width: 1024px) 58vw, (min-width: 640px) 50vw, 100vw" />
                    </span>
                    {/* Two scrims: a short one at the top for the tag, a
                        long one at the bottom so the title holds 4.5:1 on
                        the brightest sunset frames. */}
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-charcoal/45 to-transparent" />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-transparent" />
                    <span className="demo-tag absolute left-4 top-4 bg-ivory/90 text-ink">Demo</span>
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8">
                      <span className="max-w-md">
                        <span className="flex items-center gap-3 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-ivory/90"><span aria-hidden="true" className="h-px w-6 bg-brand-amber" />{category.label}</span>
                        <span className="mt-3 block font-display text-[1.75rem] leading-[1.1] sm:text-[2.125rem]">{t.title}</span>
                        <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-sans text-small text-ivory/80">
                          <span className="flex items-center gap-1.5"><IconPin size={15} />{t.destination}</span>
                          <span className="flex items-center gap-1.5"><IconClock size={15} />{DURATION_LABELS[t.duration]}</span>
                        </span>
                      </span>
                      <span aria-hidden="true" className="hidden h-11 w-11 shrink-0 items-center justify-center border border-ivory/40 transition-colors duration-300 group-hover:border-brand-amber group-hover:bg-brand-amber group-hover:text-ink sm:flex">
                        <IconArrow size={18} />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section aria-labelledby="categories-title" className="bg-bone py-20 text-ink lg:py-24">
        <div className="edge wrap">
          <SectionIntro id="categories-title" eyebrow={TOURS.categories.eyebrow} title={TOURS.categories.title} />
          <ul className="mt-10 grid grid-cols-2 border-t border-graphite/20 lg:mt-12 lg:grid-cols-5">
            {TOUR_CATEGORIES.map((c, i) => {
              const count = TOUR_LIST.filter((t) => t.category === c.id).length;
              return (
                <li key={c.id} className={`border-b border-graphite/20 lg:border-b-0 ${i > 0 ? "lg:border-l" : ""} ${i % 2 === 1 ? "border-l" : ""}`}>
                  <button
                    type="button"
                    onClick={() => {
                      set({ category: c.id });
                      jumpToList();
                    }}
                    className={`group flex h-full w-full flex-col items-start gap-3 py-6 text-left sm:px-6 sm:py-7 ${i % 2 === 0 ? "pr-4" : "px-4"} ${i === 0 ? "lg:pl-0" : ""}`}
                  >
                    <span aria-hidden="true" className="block h-px w-8 bg-brand-amber transition-all duration-500 ease-editorial group-hover:w-16" />
                    <span className="font-display text-[1.1875rem] leading-snug sm:text-[1.375rem]">{c.label}</span>
                    <span className="hidden font-sans text-small text-graphite sm:block">{c.blurb}</span>
                    <span className="mt-auto pt-3 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite transition-colors group-hover:text-ink">
                      {TOURS.discover.results(count)} →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- Discover ---------------- */}
      <section id="discover" aria-labelledby="discover-title" className="bg-ivory py-20 text-ink lg:py-28">
        <div className="edge wrap">
          <SectionIntro id="discover-title" eyebrow={TOURS.discover.eyebrow} title={TOURS.discover.title} body={PROTOTYPE.tours} />

          <div className="mt-10 border border-graphite/15 bg-bone/60 p-4 sm:p-6" role="search" aria-label={TOURS.discover.title}>
            <div className="grid gap-2 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div className="sf-cell">
                <label htmlFor="tour-q" className="sf-label">{TOURS.discover.search}</label>
                <div className="flex items-center gap-2">
                  <IconSearch size={16} className="mt-1 shrink-0 text-graphite" />
                  <input
                    id="tour-q"
                    type="search"
                    value={f.q}
                    onChange={(e) => set({ q: e.target.value })}
                    placeholder={TOURS.discover.searchPlaceholder}
                    className="sf-input"
                  />
                </div>
              </div>
              <SelectCell
                id="tour-destination"
                label={TOURS.discover.destination}
                value={f.destination}
                onChange={(v) => set({ destination: v as TourDestination | "" })}
                options={[{ value: "", label: TOURS.discover.anyDestination }, ...TOUR_DESTINATIONS.map((d) => ({ value: d, label: d }))]}
              />
              <SelectCell
                id="tour-duration"
                label={TOURS.discover.duration}
                value={f.duration}
                onChange={(v) => set({ duration: v as TourDuration | "" })}
                options={[
                  { value: "", label: TOURS.discover.anyDuration },
                  ...(Object.keys(DURATION_LABELS) as TourDuration[]).map((d) => ({ value: d, label: DURATION_LABELS[d] })),
                ]}
              />
            </div>

            <div role="group" aria-label={TOURS.discover.category} className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <button type="button" aria-pressed={!f.category} onClick={() => set({ category: "" })} className="chip">
                {TOURS.discover.allCategories}
              </button>
              {TOUR_CATEGORIES.map((c) => (
                <button key={c.id} type="button" aria-pressed={f.category === c.id} onClick={() => set({ category: f.category === c.id ? "" : c.id })} className="chip">
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p aria-live="polite" className="font-sans text-small text-graphite">
              {TOURS.discover.results(results.length)}
              {f.destination ? ` in ${f.destination}` : ""}
            </p>
            {active && (
              <button type="button" onClick={() => setF(EMPTY)} className="link-quiet text-small">
                {TOURS.discover.clear}
              </button>
            )}
          </div>

          <div ref={listRef} className="mt-6">
            {results.length ? (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((t) => (
                  <li key={t.id}>
                    <TourCard tour={t} onOpen={open} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-6 border border-dashed border-graphite/35 px-6 py-16 sm:items-center sm:text-center">
                <span className="flex h-14 w-14 items-center justify-center border border-graphite/30 text-graphite" aria-hidden="true">
                  <IconSearch size={22} />
                </span>
                <div>
                  <p className="font-display text-display-sm">{TOURS.discover.emptyTitle}</p>
                  <p className="mt-2 max-w-md font-sans text-body text-graphite">{TOURS.discover.emptyBody}</p>
                </div>
                <button type="button" onClick={() => setF(EMPTY)} className="btn-outline">
                  {TOURS.discover.clear}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Destinations ---------------- */}
      <section id="destinations" aria-labelledby="destinations-title" className="on-dark bg-charcoal py-20 text-ivory lg:py-28">
        <div className="edge wrap">
          <SectionIntro id="destinations-title" eyebrow={TOURS.destinations.eyebrow} title={TOURS.destinations.title} body={TOURS.destinations.body} />
          {/* Typographic, not photographic. With nine supplied images,
              a photo per area meant every picture on the page appeared
              three or four times; the areas read just as well as an
              index, and the photographs stay with the experiences. */}
          <ul className="mt-12 grid border-t border-ivory/15 md:grid-cols-2 md:gap-x-12">
            {TOUR_DESTINATIONS.map((d) => {
              const count = TOUR_LIST.filter((t) => t.destination === d).length;
              return (
                <li key={d} className="border-b border-ivory/15">
                  <button
                    type="button"
                    onClick={() => {
                      set({ destination: d, category: "", q: "" });
                      jumpToList();
                    }}
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span>
                      <span className="block font-display text-[1.5rem] leading-tight sm:text-[1.75rem]">{d}</span>
                      <span className="mt-1 block font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-ivory/70">
                        {TOURS.destinations.count(count)}
                      </span>
                    </span>
                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center border border-ivory/30 transition-colors duration-300 group-hover:border-brand-amber group-hover:bg-brand-amber group-hover:text-ink">
                      <IconArrow size={16} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- Preview dialog ---------------- */}
      <dialog
        ref={dialogRef}
        aria-labelledby="tour-preview-title"
        onClose={onDialogClose}
        onClick={(e) => {
          // A click on the ::backdrop lands on the dialog element itself.
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-charcoal/70 backdrop:backdrop-blur-[2px] sm:m-auto sm:h-auto sm:max-h-[92vh] sm:w-[min(64rem,calc(100%-3rem))]"
      >
        {openTour && (
          <div className="relative h-full overflow-y-auto bg-ivory sm:max-h-[92vh]">
            <form method="dialog" className="sticky top-0 z-10 flex justify-end">
              <button
                type="submit"
                aria-label={TOURS.preview.close}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center bg-ivory/95 text-ink shadow-sm transition-colors hover:bg-ivory"
              >
                <IconClose size={20} />
              </button>
            </form>
            <TourDetailBody tour={openTour} titleId="tour-preview-title" />
          </div>
        )}
      </dialog>
    </>
  );
}

function SelectCell({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="sf-cell">
      <label htmlFor={id} className="sf-label">{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="sf-input cursor-pointer pr-6">
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-graphite">
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </div>
    </div>
  );
}
