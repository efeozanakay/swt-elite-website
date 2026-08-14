import { Reveal } from "@/components/Reveal";

const STAGES = [
  {
    index: "01",
    name: "Arrival",
    detail:
      "Flight monitored and arrival window confirmed before the vehicle is dispatched.",
  },
  {
    index: "02",
    name: "Transfer",
    detail:
      "Meet & greet, luggage handling and a direct transfer to the first stop.",
  },
  {
    index: "03",
    name: "During Stay",
    detail:
      "Guides and local teams on call for every movement across the destination.",
  },
  {
    index: "04",
    name: "Departure",
    detail:
      "Return transfer scheduled and reconfirmed well ahead of check-out.",
  },
];

export function OperationalJourney() {
  return (
    <section className="bg-bone py-28 sm:py-36">
      <div className="edge wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-6">The Operating Cycle</p>
          <h2 className="font-display text-display-sm text-ink">
            From <span className="italic">Touchdown</span> to{" "}
            <span className="italic">Takeoff</span>.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-16 grid grid-cols-1 border-graphite/20 sm:grid-cols-2 sm:border-t lg:grid-cols-4">
            {STAGES.map((stage, i) => (
              <div
                key={stage.index}
                className={`border-graphite/20 py-8 pr-8 sm:py-10 lg:border-t-0 ${
                  i === 0 ? "border-t sm:border-t-0" : "border-t"
                } ${i % 2 === 1 ? "sm:pl-8" : ""} lg:border-l lg:pl-8 ${
                  i === 0 ? "lg:border-l-0 lg:pl-0" : ""
                }`}
              >
                <span className="font-sans text-small text-graphite">
                  {stage.index}
                </span>
                <h3 className="mt-4 font-display text-display-sm text-ink">
                  {stage.name}
                </h3>
                <p className="mt-4 max-w-[22rem] font-sans text-body text-graphite">
                  {stage.detail}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
