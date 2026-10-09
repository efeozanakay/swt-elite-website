import Link from "next/link";
import { IconArrow } from "@/components/b2c/Icons";
import { HOME_TRAVEL_BAND, NAV } from "@/lib/b2c/copy";

/**
 * The homepage's one pathway for holidaymakers. Deliberately quiet: a
 * single line on the ivory ground between the About section and the
 * partnership close, so the B2B page keeps its own call to action and
 * a traveller who arrived here still finds the consumer services.
 */
export function TravelBand() {
  return (
    <section aria-label={HOME_TRAVEL_BAND.eyebrow} className="border-t border-graphite/15 bg-ivory">
      <div className="edge wrap flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-body text-graphite">
          <span className="eyebrow mr-3 text-ink">{HOME_TRAVEL_BAND.eyebrow}</span>
          <span className="block md:inline">{HOME_TRAVEL_BAND.body}</span>
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/transfers" className="link-quiet group">
            {NAV.transfers}
            <IconArrow size={16} className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" />
          </Link>
          <Link href="/tours" className="link-quiet group">
            {NAV.tours}
            <IconArrow size={16} className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
