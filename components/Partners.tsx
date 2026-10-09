import Image from "next/image";
import { Reveal } from "@/components/Reveal";

/**
 * Partner marks are sized by their own artwork, not by their file.
 *
 * Six of the original seven files are the same 640x220 canvas, but the mark inside
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

// Preserve the original order: two rows of four.
const PARTNERS: Partner[] = [
  {
    name: "ForYou Travel",
    file: "foryou-travel.png",
    fw: 640,
    fh: 220,
    ink: { x: 270, y: 63, w: 97, h: 95 },
    width: 79,
    filter: "brightness-[74%]",
  },
  {
    name: "Onextur",
    file: "onextur.png",
    fw: 640,
    fh: 220,
    ink: { x: 260, y: 63, w: 120, h: 93 },
    width: 90,
  },
  {
    name: "Rocket DMC",
    file: "rocket-dmc.png",
    fw: 640,
    fh: 220,
    ink: { x: 98, y: 81, w: 444, h: 56 },
    width: 206,
  },
  {
    name: "Lucca Tour",
    file: "lucca-tour.png",
    fw: 640,
    fh: 220,
    ink: { x: 184, y: 69, w: 272, h: 83 },
    width: 138,
  },
  {
    name: "Diana Travel",
    file: "diana-travel.png",
    fw: 640,
    fh: 220,
    ink: { x: 189, y: 74, w: 264, h: 75 },
    width: 152,
    filter: "brightness-[73%]",
  },
  {
    name: "Sonar Tour",
    file: "sonar-tour.png",
    fw: 640,
    fh: 220,
    ink: { x: 204, y: 66, w: 231, h: 88 },
    width: 98,
  },
  {
    name: "Trend Sport Travel",
    file: "trend-sport-travel.png",
    fw: 651,
    fh: 415,
    ink: { x: 0, y: 15, w: 633, h: 386 },
    width: 103,
    filter: "brightness-[78%]",
  },
  {
    name: "Ela Excellence",
    // Official transparent PNG from elahotels.com's Logos and Brand Guides kit.
    file: "ela-excellence.png",
    fw: 2363,
    fh: 1654,
    ink: { x: 145, y: 183, w: 2072, h: 1288 },
    // 18% ink coverage: 116px matches the surrounding marks' optical weight.
    // Mean grayscale luminance is 127, so no brightness correction is needed.
    width: 116,
  },
];

function PartnerLogo({ partner }: { partner: Partner }) {
  // One scale factor takes the mark from file space to rendered space, so
  // the crop box and the artwork inside it can never drift apart.
  const k = partner.width / partner.ink.w;
  const px = (n: number) => `calc(${n.toFixed(1)}px * var(--ls))`;

  return (
    <li className="group flex h-[calc(150px*var(--ls))] items-center justify-center border-b border-r border-graphite/15 transition-colors duration-500 ease-editorial hover:bg-white/50">
      <span
        className="relative block overflow-hidden"
        style={{
          width: px(partner.width),
          height: px(partner.ink.h * k),
        }}
      >
        {/*
          At rest: grayscale with the per-mark luminance correction, so
          the set reads as one even, quiet row. On hover the whole cell
          (not just the image) drops both the grayscale and the
          correction, so the mark shows its own brand colours exactly as
          supplied. The previous hover removed only the grayscale and
          kept the brightness correction, which dulled every colour
          (Trend Sport Travel's lime turned olive).
        */}
        <Image
          src={`/partners/${partner.file}`}
          alt={`${partner.name} logo`}
          width={Math.round(partner.fw * k)}
          height={Math.round(partner.fh * k)}
          quality={100}
          className={`absolute max-w-none opacity-80 grayscale transition-[filter,opacity] duration-500 ease-editorial group-hover:opacity-100 group-hover:brightness-100 group-hover:grayscale-0 motion-reduce:transition-none ${
            partner.filter ?? ""
          }`}
          style={{
            width: px(partner.fw * k),
            height: px(partner.fh * k),
            left: px(-partner.ink.x * k),
            top: px(-partner.ink.y * k),
          }}
        />
      </span>
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

        <Reveal delay={100} className="mt-14 lg:mt-16">
          {/*
            Two rows of four, side by side, in a hairline grid: every mark
            sits centred in an equal cell on a shared centreline, so the
            set reads as one composed row-based wall rather than marks
            scattered over three staggered rows. Two columns below md.

            --ls scales the marks and the cell height from one place; the
            marks keep their exact aspect ratios at every breakpoint
            because every dimension derives from the same factor.
          */}
          <ul className="grid grid-cols-2 border-l border-t border-graphite/15 [--ls:0.62] md:grid-cols-4 md:[--ls:0.72] lg:[--ls:0.92] xl:[--ls:1]">
            {PARTNERS.map((partner) => (
              <PartnerLogo key={partner.file} partner={partner} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
