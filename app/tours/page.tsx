import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/b2c/Faq";
import { IconArrow, IconPlane } from "@/components/b2c/Icons";
import { SceneArt } from "@/components/b2c/SceneArt";
import { SectionIntro } from "@/components/b2c/SectionIntro";
import { ToursExplorer } from "@/components/b2c/ToursExplorer";
import { TravelShell } from "@/components/b2c/TravelShell";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { PROTOTYPE, TOURS } from "@/lib/b2c/copy";

export const metadata: Metadata = {
  title: TOURS.meta.title,
  description: TOURS.meta.description,
  alternates: { canonical: "/tours" },
  openGraph: {
    title: TOURS.meta.title,
    description: TOURS.meta.description,
    url: "/tours",
    type: "website",
    locale: "en_GB",
    siteName: "SWT Elite",
  },
};

export default function ToursPage() {
  return (
    <TravelShell current="tours">
      {/* ---------------- Hero ----------------
          Transfers opens on a single full-bleed photograph; Tours opens on
          a staggered triptych, so the page reads as discovery — several
          places at once — while keeping the same type, grid and colour. */}
      <section aria-labelledby="tours-hero-title" className="on-dark relative overflow-hidden bg-charcoal text-ivory">
        <div className="edge wrap grid items-end gap-12 pb-16 pt-[calc(var(--header-h)+3rem)] lg:min-h-[86svh] lg:grid-cols-12 lg:pb-20">
          <Reveal immediate className="lg:col-span-5 lg:pb-8">
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-brand-amber" aria-hidden="true" />
              {TOURS.hero.eyebrow}
            </p>
            <h1 id="tours-hero-title" className="font-display text-hero-sm sm:text-hero lg:text-display-lg xl:text-[4.75rem] xl:leading-[1.04]">
              {TOURS.hero.title[0]}
              <br />
              <span className="italic">{TOURS.hero.title[1]}</span>
            </h1>
            <p className="mt-6 max-w-md font-sans text-body-lg text-ivory/80">{TOURS.hero.body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a href="#discover" className="btn-action">
                {TOURS.hero.cta}
                <IconArrow size={16} />
              </a>
              <Link href="/transfers" className="link-quiet group text-small">
                {TOURS.transfer.title}
              </Link>
            </div>
          </Reveal>

          <div className="relative lg:col-span-7" aria-hidden="true">
            <div className="grid grid-cols-3 items-end gap-3">
              <div className="aspect-[3/5] overflow-hidden lg:translate-y-6">
                <SceneArt kind="boat" tone="day" seed={11} />
              </div>
              <div className="aspect-[3/5] -translate-y-6 overflow-hidden lg:-translate-y-16">
                <SceneArt kind="ruins" tone="dusk" seed={4} />
              </div>
              <div className="aspect-[3/5] overflow-hidden">
                <SceneArt kind="valley" tone="dawn" seed={7} />
              </div>
            </div>
          </div>
        </div>
        <p className="edge wrap pb-6 font-sans text-[0.75rem] italic text-ivory/60">{PROTOTYPE.artwork}.</p>
      </section>

      <ToursExplorer />

      {/* ---------------- Why ---------------- */}
      <section aria-labelledby="tours-why-title" className="bg-ivory py-24 text-ink md:py-28 lg:py-32">
        <div className="edge wrap grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionIntro id="tours-why-title" eyebrow={TOURS.why.eyebrow} title={TOURS.why.title} body={TOURS.why.body} />
            <ul className="mt-10 border-t border-graphite/20">
              {TOURS.why.items.map((item) => (
                <li key={item.name} className="grid gap-2 border-b border-graphite/20 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <h3 className="font-display text-[1.25rem] leading-snug">{item.name}</h3>
                  <p className="font-sans text-body text-graphite">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <Reveal delay={100} className="lg:col-span-6">
            <Photo
              src="/images/operations/groups-mice-coach-briefing.png"
              alt={TOURS.why.imageAlt}
              aspect="4 / 3"
              position="50% 40%"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Transfer cross-promotion ---------------- */}
      <section aria-labelledby="tours-transfer-title" className="on-dark bg-charcoal text-ivory">
        <div className="edge wrap flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between lg:py-20">
          <div className="flex items-start gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-ivory/25 text-brand-amber">
              <IconPlane size={22} />
            </span>
            <div>
              <p className="eyebrow mb-3">{TOURS.transfer.eyebrow}</p>
              <h2 id="tours-transfer-title" className="font-display text-display-sm">{TOURS.transfer.title}</h2>
              <p className="mt-2 max-w-lg font-sans text-body text-ivory/70">{TOURS.transfer.body}</p>
            </div>
          </div>
          <Link href="/transfers#search" className="btn-outline shrink-0">
            {TOURS.transfer.cta}
            <IconArrow size={16} />
          </Link>
        </div>
      </section>

      <Faq eyebrow={TOURS.faq.eyebrow} title={TOURS.faq.title} items={TOURS.faq.items} />
    </TravelShell>
  );
}
