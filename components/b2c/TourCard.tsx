import { B2CImage } from "@/components/b2c/B2CImage";
import { IconArrow, IconClock, IconPin } from "@/components/b2c/Icons";
import { PRICE_PLACEHOLDER, TOURS } from "@/lib/b2c/copy";
import { DURATION_LABELS, TOUR_CATEGORIES, type Tour } from "@/lib/b2c/demo/tours";

/**
 * Reusable experience card. The whole card is one hit target: the title
 * button's ::after covers the card, so there is a single tab stop and a
 * single accessible name instead of a nest of links.
 */
export function TourCard({
  tour,
  onOpen,
  size = "default",
}: {
  tour: Tour;
  onOpen: (tour: Tour, trigger: HTMLElement) => void;
  size?: "default" | "feature";
}) {
  const category = TOUR_CATEGORIES.find((c) => c.id === tour.category)!;
  const feature = size === "feature";
  return (
    <article className="group relative flex h-full flex-col bg-ivory">
      <div className={`relative overflow-hidden bg-charcoal ${feature ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
        <div className="absolute inset-0 transition-transform duration-700 ease-editorial group-hover:scale-[1.04] motion-reduce:transform-none">
          <B2CImage name={tour.image} alt="" sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
        </div>
        <span className="demo-tag absolute left-3 top-3 bg-ivory/90 text-ink">Demo</span>
      </div>
      <div className={`flex flex-1 flex-col border border-t-0 border-graphite/20 transition-colors duration-300 group-hover:border-graphite/45 ${feature ? "p-6" : "p-5"}`}>
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{category.label}</p>
        <h3 className={`mt-2 font-display leading-snug text-ink ${feature ? "text-display-sm" : "text-[1.3125rem]"}`}>
          <button
            type="button"
            onClick={(e) => onOpen(tour, e.currentTarget)}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ink"
          >
            {tour.title}
          </button>
        </h3>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-sans text-small text-graphite">
          <li className="flex items-center gap-1.5"><IconPin size={15} />{tour.destination}</li>
          <li className="flex items-center gap-1.5"><IconClock size={15} />{DURATION_LABELS[tour.duration]}</li>
        </ul>
        <p className="mt-3 line-clamp-2 font-sans text-small text-graphite">{tour.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <p className="font-sans text-small text-graphite">
            {TOURS.discover.priceLabel}{" "}
            <span className="font-display text-[1.25rem] text-ink" aria-label="price not shown in this preview">{PRICE_PLACEHOLDER}</span>
          </p>
          <span aria-hidden="true" className="inline-flex items-center gap-2 font-sans text-small font-medium text-ink">
            {TOURS.discover.view}
            <IconArrow size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
