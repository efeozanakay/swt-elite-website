import { Reveal } from "@/components/Reveal";

const METADATA = ["Ground Operations", "Türkiye", "B2B"];

export function Recognition() {
  return (
    <section className="edge wrap py-28 sm:py-36">
      <Reveal>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-8">What We Do</p>
            <h2 className="max-w-3xl font-display text-display text-ink">
              We coordinate every movement on the ground — from airport
              arrival and transportation to in-destination guest support.
            </h2>
          </div>

          <div className="lg:col-span-4 lg:pt-16">
            <ul className="flex flex-col gap-4 border-t border-graphite/20 pt-6">
              {METADATA.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between border-b border-graphite/15 pb-4 font-sans text-small uppercase tracking-[0.12em] text-graphite"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
