"use client";

import { B2CImage } from "@/components/b2c/B2CImage";
import { IconArrow } from "@/components/b2c/Icons";
import { prefillTransfer } from "@/components/b2c/TransferSearchForm";
import { TRANSFERS } from "@/lib/b2c/copy";
import { locationById } from "@/lib/b2c/demo/locations";
import type { ImageKey } from "@/lib/b2c/images";

const ROUTES: { to: string; image: ImageKey; focus?: string }[] = [
  { to: "belek", image: "mediterranean-resort-golden-hour", focus: "50% 60%" },
  { to: "side", image: "ancient-coastal-ruins-sunset", focus: "74% 50%" },
  { to: "alanya", image: "alanya-castle-marina", focus: "38% 50%" },
  { to: "kemer", image: "turquoise-cove-resort-town", focus: "62% 55%" },
  { to: "antalya-centre", image: "antalya-kaleici-harbour", focus: "70% 55%" },
];

/**
 * Route shortcuts. Each fills the search form with Antalya Airport and
 * the destination, scrolls back to it and hands focus to the date —
 * the one thing still missing — instead of navigating anywhere.
 */
export function RouteShortcuts() {
  return (
    <ul className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
      {ROUTES.map((r) => {
        const place = locationById(r.to)!;
        return (
          <li key={r.to} className="w-[70%] shrink-0 snap-start sm:w-auto">
            <button
              type="button"
              onClick={() => {
                prefillTransfer({ from: "ayt", to: r.to });
                document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              aria-label={TRANSFERS.destinations.cta(place.name)}
              className="group relative block aspect-[3/4] w-full overflow-hidden bg-charcoal text-left text-ivory"
            >
              <span className="absolute inset-0 transition-transform duration-700 ease-editorial group-hover:scale-[1.04]">
                <B2CImage name={r.image} focus={r.focus} alt="" sizes="(min-width: 1024px) 250px, (min-width: 640px) 33vw, 70vw" />
              </span>
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <span>
                  <span className="block font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-ivory/75">AYT →</span>
                  <span className="mt-1 block font-display text-[1.625rem] leading-tight">{place.name.replace(" City Centre", "")}</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-ivory/40 transition-colors duration-300 group-hover:border-brand-amber group-hover:bg-brand-amber group-hover:text-ink">
                  <IconArrow size={16} />
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
