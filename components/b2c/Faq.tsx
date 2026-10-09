import { SectionIntro } from "@/components/b2c/SectionIntro";

/**
 * Native <details> disclosures: keyboard and screen-reader support for
 * free, works before hydration, and in-page search can open them.
 */
export function Faq({
  eyebrow,
  title,
  items,
  className = "bg-bone",
}: {
  eyebrow: string;
  title: string;
  items: { q: string; a: string }[];
  className?: string;
}) {
  return (
    <section aria-labelledby="faq-title" className={`py-24 md:py-28 lg:py-32 ${className}`}>
      <div className="edge wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionIntro eyebrow={eyebrow} title={title} id="faq-title" />
        </div>
        <div className="border-t border-graphite/25 lg:col-span-8">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-graphite/25">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-display text-[1.3125rem] leading-snug text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="relative mt-2 h-3 w-3 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-3 bg-ink" />
                  <span className="absolute left-1/2 top-0 h-3 w-px bg-ink transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 font-sans text-body text-graphite">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
