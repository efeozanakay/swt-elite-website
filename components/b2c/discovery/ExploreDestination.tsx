"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrow, IconInfo } from "@/components/b2c/Icons";
import { TourCard } from "@/components/b2c/TourCard";
import { DISCOVER } from "@/lib/b2c/copy-booking";
import { discoveryFor } from "@/lib/b2c/discovery";

/**
 * "Explore <area>" after the booking journey, never during checkout.
 * Reuses the /tours card; opening a card goes to the tours page with
 * that experience's preview open, so there is one detail view.
 */
export function ExploreDestination({ areaId, headingLevel = 2 }: { areaId: string; headingLevel?: 2 | 3 }) {
  const router = useRouter();
  const discovery = discoveryFor(areaId);
  if (!discovery) return null;
  const H = headingLevel === 2 ? "h2" : "h3";

  return (
    <section aria-labelledby="explore-title" className="bg-bone py-14 text-ink lg:py-20">
      <div className="edge wrap">
        {discovery.modules.map((m) =>
          m.kind === "tours" ? (
            <div key={m.kind}>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="eyebrow mb-3">{DISCOVER.eyebrow}</p>
                  <H id="explore-title" className="font-display text-display">{DISCOVER.title(discovery.place)}</H>
                  <p className="mt-3 font-sans text-body text-graphite">{DISCOVER.body}</p>
                </div>
                <Link href={`/tours?destination=${encodeURIComponent(m.destination)}#discover`} className="btn-outline">
                  {DISCOVER.all(m.destination)}
                  <IconArrow size={16} />
                </Link>
              </div>
              <p className="mt-5 flex gap-2 font-sans text-small text-graphite">
                <IconInfo size={18} className="mt-0.5 shrink-0" />
                {DISCOVER.demoNote}
              </p>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {m.items.map((t) => (
                  <li key={t.id}>
                    <TourCard
                      tour={t}
                      onOpen={() => router.push(`/tours?destination=${encodeURIComponent(m.destination)}&tour=${t.id}`)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
