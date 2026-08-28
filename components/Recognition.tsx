import { Reveal } from "@/components/Reveal";

const METADATA = ["Ground Operations", "Türkiye", "B2B"];

export function Recognition() {
  return (
    <section className="edge wrap py-28 md:py-32 lg:py-36">
      <Reveal>
        {/*
          Two columns from md. This section is type only, so splitting it
          at tablet costs nothing: there is no photograph to shrink, and
          the 8-col statement still gets ~450px of measure at 768 while
          the metadata rail takes the ~225px it needs.
        */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <p className="eyebrow mb-8">What We Do</p>
            <h2 className="max-w-3xl font-display text-display text-ink">
              We coordinate every movement on the ground — from airport
              arrival and transportation to in-destination guest support.
            </h2>
          </div>

          <div className="md:col-span-4 md:pt-16">
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
