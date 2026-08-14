import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type Partner = {
  name: string;
  file: string;
  tightCrop: boolean;
  maxWidth: number;
  /** Extra filter classes appended after the shared grayscale treatment.
   * Used only where a logo's source colors convert to a visibly lighter
   * gray than the others at the same nominal size — darkens post-grayscale
   * luminance without reintroducing color, so the monochrome look holds. */
  extraFilter?: string;
};

// "top" pair is unchanged from before. "trio" and "pair" replace the old
// uniform 2-column flow for the remaining five logos, which left Trend
// Sport Travel alone in a trailing row — now a balanced 3-across row with
// a centred 2-up row beneath it.
const TOP: Partner[] = [
  { name: "ForYou Travel", file: "foryou-travel.png", tightCrop: true, maxWidth: 235 },
  { name: "Onextur", file: "onextur.png", tightCrop: true, maxWidth: 235 },
];

const TRIO: Partner[] = [
  { name: "Rocket DMC", file: "rocket-dmc.png", tightCrop: false, maxWidth: 300 },
  { name: "Lucca Tour", file: "lucca-tour.png", tightCrop: false, maxWidth: 300 },
  { name: "Diana Travel", file: "diana-travel.png", tightCrop: false, maxWidth: 300 },
];

const PAIR: Partner[] = [
  { name: "Sonar Tour", file: "sonar-tour.png", tightCrop: false, maxWidth: 300 },
  // ~20% smaller again on top of the earlier reduction, per review.
  // extraFilter: measured post-grayscale luminance directly from the
  // source PNGs (median 164/255 for TST vs 121 for Rocket DMC and 139 for
  // Lucca Tour — TST's greens simply convert to a lighter gray than their
  // wordmarks' original colors do). brightness-[85%] on top of the
  // existing grayscale scales TST's luminance down to ~140, matching
  // Lucca Tour almost exactly, without reintroducing any color.
  {
    name: "Trend Sport Travel",
    file: "trend-sport-travel.png",
    tightCrop: true,
    maxWidth: 136,
    extraFilter: "brightness-[85%]",
  },
];

function PartnerLogo({
  partner,
  fixedWidth = false,
}: {
  partner: Partner;
  /** Grid tracks below (grid-cols-N / fr units) resolve `w-full` +
   * `max-w` correctly, letting items shrink on mobile. `grid-cols-[auto
   * auto]` (used for the centred pair) sizes its tracks from content, and
   * a percentage-width child inside an auto track collapses to 0×0 in
   * this case — so that row passes `fixedWidth` to use an explicit pixel
   * width instead, which content-sized grid tracks can measure. */
  fixedWidth?: boolean;
}) {
  return (
    <li
      className={`relative mx-auto ${fixedWidth ? "" : "w-full"} ${
        partner.tightCrop ? "aspect-[8/5]" : "aspect-[32/11]"
      }`}
      style={
        fixedWidth
          ? { width: partner.maxWidth }
          : { maxWidth: partner.maxWidth }
      }
    >
      <Image
        src={`/partners/${partner.file}`}
        alt={`${partner.name} logo`}
        fill
        quality={100}
        sizes={`(min-width: 1024px) ${partner.maxWidth}px, 42vw`}
        className={`grayscale transition duration-300 ease-editorial hover:grayscale-0 ${
          partner.tightCrop ? "object-cover" : "object-contain"
        } ${partner.extraFilter ?? ""}`}
      />
    </li>
  );
}

export function Partners() {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.24em] text-graphite">
            Partners
          </p>

          <h2 className="mt-5 max-w-[610px] font-serif text-[36px] leading-[1.16] tracking-[-0.025em] text-graphite sm:text-[42px] lg:text-[48px]">
            Working with tour operators and DMC partners across Europe and
            Türkiye.
          </h2>
        </Reveal>

        <Reveal delay={100} className="mt-16">
          <div className="border-t border-graphite/20 pt-12">
            <ul className="grid grid-cols-2 items-center gap-x-16 gap-y-16 sm:gap-x-24 sm:gap-y-20">
              {TOP.map((partner) => (
                <PartnerLogo key={partner.file} partner={partner} />
              ))}
            </ul>

            <ul className="mt-16 grid grid-cols-1 items-center justify-items-center gap-y-16 sm:mt-20 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-0">
              {TRIO.map((partner) => (
                <PartnerLogo key={partner.file} partner={partner} />
              ))}
            </ul>

            <ul className="mx-auto mt-16 grid w-fit grid-cols-1 items-center justify-items-center gap-y-16 sm:mt-20 lg:grid-cols-[auto_auto] lg:gap-x-16">
              {PAIR.map((partner) => (
                <PartnerLogo key={partner.file} partner={partner} fixedWidth />
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
