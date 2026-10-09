import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/b2c/Faq";
import { IconArrow, IconPlane } from "@/components/b2c/Icons";
import { B2CImage } from "@/components/b2c/B2CImage";
import { SectionIntro } from "@/components/b2c/SectionIntro";
import { ToursExplorer } from "@/components/b2c/ToursExplorer";
import { TravelShell } from "@/components/b2c/TravelShell";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { PROTOTYPE, TOURS } from "@/lib/b2c/copy";
import { LicenceLine } from "@/components/b2c/LicenceLine";

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
          Transfers opens on a working scene (the airport kerb) with the
          search panel docked over it; Tours opens on a full-bleed
          landscape with nothing in front of it, so the page reads as
          discovery while keeping the same type, grid and colour. */}
      <section aria-labelledby="tours-hero-title" className="on-dark relative flex min-h-[620px] items-end overflow-hidden bg-charcoal text-ivory lg:h-[92svh] lg:max-h-[960px]">
        <B2CImage name="lycian-coast-ruins-sunset" sizes="100vw" priority focus="62% 50%" />
        {/* Left-weighted scrim for the headline, plus a floor scrim for the
            CTA row. The image's brightest area is the sunset at upper
            right, away from the type. */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/45 to-charcoal/0" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-charcoal/30" />
        <div className="edge wrap relative w-full pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-24">
          <Reveal immediate className="max-w-2xl">
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-brand-amber" aria-hidden="true" />
              {TOURS.hero.eyebrow}
            </p>
            <h1 id="tours-hero-title" className="font-display text-hero-sm sm:text-hero lg:text-display-lg xl:text-[5rem] xl:leading-[1.04]">
              {TOURS.hero.title[0]}
              <br />
              <span className="italic">{TOURS.hero.title[1]}</span>
            </h1>
            <p className="mt-6 max-w-md font-sans text-body-lg text-ivory/85">{TOURS.hero.body}</p>
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
        </div>
        <p className="absolute bottom-4 right-6 max-w-[18rem] text-right font-sans text-[0.75rem] text-ivory/70 sm:right-10 lg:right-12 xl:right-16">
          {PROTOTYPE.imagery}
        </p>
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
            <LicenceLine className="mt-6" />
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

      {/* ---------------- Transfer cross-promotion ----------------
          The same airport image that opens /transfers, so the link back
          is recognisable as the other half of the same service. */}
      <section aria-labelledby="tours-transfer-title" className="on-dark relative overflow-hidden bg-charcoal text-ivory">
        <B2CImage name="airport-transfer-sunset" alt="" sizes="100vw" focus="70% 65%" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/75 to-charcoal/20" />
        <div className="edge wrap relative flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between lg:py-28">
          <div className="max-w-xl">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <IconPlane size={18} className="text-brand-amber" />
              {TOURS.transfer.eyebrow}
            </p>
            <h2 id="tours-transfer-title" className="font-display text-display">{TOURS.transfer.title}</h2>
            <p className="mt-4 max-w-md font-sans text-body-lg text-ivory/80">{TOURS.transfer.body}</p>
          </div>
          <Link href="/transfers#search" className="btn-action shrink-0">
            {TOURS.transfer.cta}
            <IconArrow size={16} />
          </Link>
        </div>
      </section>

      <Faq eyebrow={TOURS.faq.eyebrow} title={TOURS.faq.title} items={TOURS.faq.items} />
    </TravelShell>
  );
}
