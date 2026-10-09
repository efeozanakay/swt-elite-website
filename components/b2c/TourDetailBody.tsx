import Link from "next/link";
import { B2CImage } from "@/components/b2c/B2CImage";
import { IconArrow, IconCheck, IconClock, IconInfo, IconPin } from "@/components/b2c/Icons";
import { PRICE_PLACEHOLDER, TOURS } from "@/lib/b2c/copy";
import { DURATION_LABELS, TOUR_CATEGORIES, type Tour } from "@/lib/b2c/demo/tours";

/**
 * Everything a tour detail view shows, independent of where it is shown.
 * Today it renders inside the preview dialog; a future /tours/[id] page
 * can render the same component as its body.
 */
export function TourDetailBody({ tour, titleId }: { tour: Tour; titleId: string }) {
  const category = TOUR_CATEGORIES.find((c) => c.id === tour.category)!;
  return (
    <article>
      <div className="relative aspect-[16/10] overflow-hidden bg-charcoal sm:aspect-[5/2]">
        <B2CImage name={tour.image} focus={tour.focus} sizes="(min-width: 1024px) 1024px, 100vw" />
        <span className="demo-tag absolute left-4 top-4 bg-ivory/90 text-ink">Demo</span>
        <span className="absolute bottom-3 right-3 bg-charcoal/70 px-2 py-1 font-sans text-[0.6875rem] text-ivory/90">
          {TOURS.preview.imageNote}
        </span>
      </div>

      <div className="p-6 sm:p-10">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{category.label}</p>
        <h2 id={titleId} className="mt-2 font-display text-display text-ink">{tour.title}</h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-sans text-small text-graphite">
          <li className="flex items-center gap-2"><IconPin size={16} />{tour.destination}</li>
          <li className="flex items-center gap-2"><IconClock size={16} />{DURATION_LABELS[tour.duration]}</li>
        </ul>

        <p className="mt-6 flex gap-3 border-l-2 border-brand-amber bg-bone/70 p-4 font-sans text-small text-ink">
          <IconInfo size={18} className="mt-0.5 shrink-0" />
          {TOURS.preview.status}
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_15rem]">
          <div className="space-y-10">
            <section>
              <h3 className="eyebrow text-ink">{TOURS.preview.overview}</h3>
              <p className="mt-3 font-sans text-body-lg text-ink">{tour.summary}</p>
            </section>

            <section>
              <h3 className="eyebrow text-ink">{TOURS.preview.highlights}</h3>
              <ul className="mt-4 space-y-2.5">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex gap-3 font-sans text-body text-ink">
                    <IconCheck size={18} className="mt-1 shrink-0 text-brand-navy" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="eyebrow text-ink">{TOURS.preview.itinerary}</h3>
              <p className="mt-2 font-sans text-small italic text-graphite">{TOURS.preview.itineraryNote}</p>
              <ol className="mt-5 border-l border-graphite/25">
                {tour.itinerary.map((step) => (
                  <li key={step.label} className="relative pb-5 pl-6 last:pb-0">
                    <span aria-hidden="true" className="absolute -left-[4.5px] top-2 h-2 w-2 bg-ink" />
                    <p className="font-sans text-small font-medium uppercase tracking-[0.1em] text-ink">{step.label}</p>
                    <p className="mt-1 font-sans text-body text-graphite">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="grid gap-6 sm:grid-cols-2">
              {[
                { title: TOURS.preview.included, items: tour.inclusions },
                { title: TOURS.preview.excluded, items: tour.exclusions },
              ].map((block) => (
                <div key={block.title} className="border-t border-graphite/20 pt-4">
                  <h3 className="eyebrow text-ink">{block.title}</h3>
                  {block.items ? (
                    <ul className="mt-3 space-y-1.5 font-sans text-body">
                      {block.items.map((i) => <li key={i}>{i}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-3 font-sans text-small text-graphite">{TOURS.preview.tbc}</p>
                  )}
                </div>
              ))}
            </section>
          </div>

          <aside className="h-fit space-y-5 border border-graphite/20 p-5 md:sticky md:top-6">
            <div>
              <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{TOURS.preview.duration}</p>
              <p className="mt-1 font-display text-[1.375rem]">{DURATION_LABELS[tour.duration]}</p>
              <p className="font-sans text-small text-graphite">{TOURS.preview.durationNote}</p>
            </div>
            <div className="border-t border-graphite/15 pt-5">
              <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{TOURS.preview.price}</p>
              <p className="mt-1 font-display text-[1.75rem] leading-none" aria-label="Price: not shown in this preview">{PRICE_PLACEHOLDER}</p>
            </div>
            <div className="border-t border-graphite/15 pt-5">
              <p className="font-sans text-small text-ink">{TOURS.preview.transfer}</p>
              <Link href="/transfers#search" className="mt-2 inline-flex items-center gap-2 font-sans text-small font-medium text-brand-navy underline-offset-4 hover:underline">
                Search transfers <IconArrow size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
