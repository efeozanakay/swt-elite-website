import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

const CATEGORIES = [
  {
    name: "VIP",
    detail: "Executive sedans and SUVs for principal and VIP movement.",
    tier: "Executive capacity",
  },
  {
    name: "Minivan",
    detail: "Door-to-door transfers for small parties and families.",
    tier: "Small group",
  },
  {
    name: "Minibus",
    detail: "Coordinated transfers for small tour and MICE groups.",
    tier: "Mid-size group",
  },
  {
    name: "Coach",
    detail: "Full-scale group and event transportation.",
    tier: "Full coach",
  },
];

export function Fleet() {
  return (
    <section id="fleet" className="on-dark bg-charcoal py-28 md:py-32 lg:py-36">
      <div className="edge wrap mb-12 lg:mb-16">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-6">Fleet</p>
          <h2 className="font-display text-display text-ivory">
            A fleet sized to the operation, not the other way round.
          </h2>
        </Reveal>
      </div>

      {/* dominant, full-bleed — the fleet visual carries this section,
          not the category list beneath it */}
      <Reveal delay={80}>
        <Photo
          src="/images/operations/fleet-mixed-vehicle-lineup.png"
          alt="Mixed SWT fleet lineup — executive vans, minibuses and coaches"
          aspect="16 / 9"
          position="50% 62%"
          // full-bleed band: measured 375 / 753 / 1009 / 1425 / 1905
          sizes="100vw"
        />
      </Reveal>

      <div className="edge wrap mt-16 lg:mt-20">
        <Reveal delay={160}>
          <div className="border-t border-ivory/15">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="grid grid-cols-1 gap-2 border-b border-ivory/15 py-6 sm:grid-cols-12 sm:items-center sm:gap-6"
              >
                <h3 className="font-display text-display-sm text-ivory sm:col-span-3">
                  {cat.name}
                </h3>
                <p className="font-sans text-body text-ivory/70 sm:col-span-6">
                  {cat.detail}
                </p>
                <p className="font-sans text-small uppercase tracking-[0.1em] text-ivory/50 sm:col-span-3 sm:text-right">
                  {cat.tier}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
