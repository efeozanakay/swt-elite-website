import Image from "next/image";
import { Reveal } from "@/components/Reveal";

/**
 * Partner marks are sized by their own artwork, not by their file.
 *
 * Six of the seven files are the same 640x220 canvas, but the mark inside
 * each occupies a wildly different share of it: ForYou's is 97px wide,
 * Rocket DMC's is 444px. Sizing by file width, as this section used to,
 * therefore had almost no relation to how large each logo actually looked.
 * Measured from the pixels, the rendered marks spanned 26px to 81px of
 * optical height, a 3.1x spread, which is what made the group read as
 * scattered rather than composed.
 *
 * `ink` is each mark's true bounding box within its file, measured by
 * scanning for pixels that are both opaque and darker than near-white.
 * `width` is the target rendered width of that box. Everything else is
 * derived, so the file's own padding no longer leaks into the layout: the
 * artwork is cropped to its mark and the spacing between logos is real
 * spacing rather than accumulated transparent margin.
 *
 * Widths come from equalising optical weight, w * h * sqrt(coverage),
 * where coverage is the share of the bounding box that is actually ink.
 * Plain area normalisation over-punishes solid marks like Sonar Tour;
 * the square-root damping keeps them in proportion. Rocket DMC lands
 * almost exactly where it already was, so this is a correction of the
 * outliers rather than a re-scaling of the set.
 */
type Partner = {
  name: string;
  file: string;
  /** Intrinsic file dimensions. */
  fw: number;
  fh: number;
  /** Measured bounding box of the mark within the file, in file pixels. */
  ink: { x: number; y: number; w: number; h: number };
  /** Target rendered width of the mark at lg, in CSS pixels. */
  width: number;
  /** Grid placement. Kept explicit so Tailwind sees static class names. */
  place: string;
  /**
   * Post-grayscale luminance correction. Measured mean ink luminance runs
   * from 84 (Sonar Tour) to 186 (Diana Travel) across the set, so the
   * lightest marks need bringing down to sit at the same tonal weight as
   * the rest. Targets roughly 135, the middle of the uncorrected cluster.
   * Sonar Tour is left alone: it is a dense filled mark and brightening it
   * would wash it out rather than balance it.
   */
  filter?: string;
};

// Order and grouping are unchanged: two, then three, then two. Only the
// sizing, cropping and grid beneath them are new.
const PARTNERS: Partner[] = [
  {
    name: "ForYou Travel",
    file: "foryou-travel.png",
    fw: 640,
    fh: 220,
    ink: { x: 270, y: 63, w: 97, h: 95 },
    width: 79,
    place: "md:col-start-3 md:col-span-4",
    filter: "brightness-[74%]",
  },
  {
    name: "Onextur",
    file: "onextur.png",
    fw: 640,
    fh: 220,
    ink: { x: 260, y: 63, w: 120, h: 93 },
    width: 90,
    place: "md:col-span-4",
  },
  {
    name: "Rocket DMC",
    file: "rocket-dmc.png",
    fw: 640,
    fh: 220,
    ink: { x: 98, y: 81, w: 444, h: 56 },
    width: 206,
    place: "md:col-span-4",
  },
  {
    name: "Lucca Tour",
    file: "lucca-tour.png",
    fw: 640,
    fh: 220,
    ink: { x: 184, y: 69, w: 272, h: 83 },
    width: 138,
    place: "md:col-span-4",
  },
  {
    name: "Diana Travel",
    file: "diana-travel.png",
    fw: 640,
    fh: 220,
    ink: { x: 189, y: 74, w: 264, h: 75 },
    width: 152,
    place: "md:col-span-4",
    filter: "brightness-[73%]",
  },
  {
    name: "Sonar Tour",
    file: "sonar-tour.png",
    fw: 640,
    fh: 220,
    ink: { x: 204, y: 66, w: 231, h: 88 },
    width: 98,
    place: "md:col-start-3 md:col-span-4",
  },
  {
    name: "Trend Sport Travel",
    file: "trend-sport-travel.png",
    fw: 651,
    fh: 415,
    ink: { x: 0, y: 15, w: 633, h: 386 },
    width: 103,
    place: "col-span-2 md:col-span-4",
    filter: "brightness-[78%]",
  },
];

function PartnerLogo({ partner }: { partner: Partner }) {
  // One scale factor takes the mark from file space to rendered space, so
  // the crop box and the artwork inside it can never drift apart.
  const k = partner.width / partner.ink.w;
  const px = (n: number) => `calc(${n.toFixed(1)}px * var(--ls))`;

  return (
    <li
      className={`relative overflow-hidden ${partner.place}`}
      style={{
        width: px(partner.width),
        height: px(partner.ink.h * k),
      }}
    >
      <Image
        src={`/partners/${partner.file}`}
        alt={`${partner.name} logo`}
        width={Math.round(partner.fw * k)}
        height={Math.round(partner.fh * k)}
        quality={100}
        className={`absolute max-w-none grayscale transition duration-300 ease-editorial hover:grayscale-0 ${
          partner.filter ?? ""
        }`}
        style={{
          width: px(partner.fw * k),
          height: px(partner.fh * k),
          left: px(-partner.ink.x * k),
          top: px(-partner.ink.y * k),
        }}
      />
    </li>
  );
}

export function Partners() {
  return (
    <section className="bg-ivory py-20 md:py-24 lg:py-28">
      <div className="edge wrap">
        <Reveal>
          <p className="eyebrow">Partners</p>

          <h2 className="mt-5 max-w-2xl font-display text-display text-ink">
            Working with tour operators and DMC partners across Europe and
            Türkiye.
          </h2>
        </Reveal>

        <Reveal delay={100} className="mt-16">
          <div className="border-t border-graphite/20 pt-14 lg:pt-16">
            {/*
              One grid rather than three, so every mark aligns to the same
              columns and there is a single gap value to read. The two,
              three, two grouping is unchanged; each row is centred on the
              twelve-column field by its first item's col-start, which is
              what turns the narrow-wide-narrow shape into a deliberate
              symmetric block instead of three unrelated rows.

              Fixed auto-rows give the composition a constant vertical
              pitch. Without it, row height followed whichever mark
              happened to be tallest and the spacing between rows drifted.

              --ls scales the whole set from one place; the marks keep
              their exact aspect ratios at every breakpoint because every
              dimension derives from the same factor.
            */}
            <ul
              className="mx-auto grid max-w-[960px] grid-cols-2 items-center justify-items-center gap-x-6 gap-y-12 [--ls:0.58] [grid-auto-rows:calc(92px*var(--ls))] md:grid-cols-12 md:gap-y-14 md:[--ls:0.68] lg:gap-x-6 lg:gap-y-16 lg:[--ls:1]"
            >
              {PARTNERS.map((partner) => (
                <PartnerLogo key={partner.file} partner={partner} />
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
