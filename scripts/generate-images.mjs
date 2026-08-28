/**
 * Derives the responsive image set the site actually ships.
 *
 * The originals in public/images stay exactly as they are and are never
 * written to. They are the source of truth and the rollback point; this
 * script only reads them and writes derivatives into public/images/opt,
 * alongside a manifest the Photo component consumes.
 *
 * Run with: npm run images
 *
 * Why this exists at all: next.config sets output:'export' with
 * images.unoptimized, so next/image emits a plain <img> with no srcset
 * and no format negotiation. Every device was downloading the same
 * full-resolution PNG, and the `sizes` props written throughout the
 * components had no effect whatsoever.
 *
 * Width ladders are capped at the source's own width. Several sources are
 * smaller than the slot they fill at 1920, so upscaling them here would
 * add bytes without adding detail. Where that happens it is recorded in
 * the manifest as `sourceShortfall` so the limitation stays visible.
 */
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "opt");

const LADDER = [400, 640, 828, 1080, 1280, 1600, 1920, 2560];

/**
 * `maxCss` is the widest this image is ever laid out, measured from the
 * rendered page at 1920. Ladder entries above 2x that are pointless.
 */
const SOURCES = [
  {
    src: "public/images/swt-elite-hero-airport-vito.png",
    slug: "hero-airport-vito",
    key: "/images/swt-elite-hero-airport-vito.png",
    maxCss: 1905,
  },
  {
    src: "public/images/operations/ground-handling-meet-greet.png",
    slug: "ground-handling-meet-greet",
    key: "/images/operations/ground-handling-meet-greet.png",
    maxCss: 1410,
  },
  {
    src: "public/images/operations/transportation-airport-vito.png",
    slug: "transportation-airport-vito",
    key: "/images/operations/transportation-airport-vito.png",
    maxCss: 1181,
  },
  {
    src: "public/images/operations/destination-services-hotel-representative.png",
    slug: "destination-services-hotel-representative",
    key: "/images/operations/destination-services-hotel-representative.png",
    maxCss: 1905,
  },
  {
    src: "public/images/operations/groups-mice-coach-briefing.png",
    slug: "groups-mice-coach-briefing",
    key: "/images/operations/groups-mice-coach-briefing.png",
    maxCss: 620,
  },
  {
    src: "public/images/operations/fleet-mixed-vehicle-lineup.png",
    slug: "fleet-mixed-vehicle-lineup",
    key: "/images/operations/fleet-mixed-vehicle-lineup.png",
    maxCss: 1905,
  },
  {
    src: "public/images/operations/operations-centre-24-7.png",
    slug: "operations-centre-24-7",
    key: "/images/operations/operations-centre-24-7.png",
    maxCss: 1905,
  },
  {
    src: "public/images/operations/operational-scale-real-fleet-lineup.png",
    slug: "operational-scale-real-fleet-lineup",
    key: "/images/operations/operational-scale-real-fleet-lineup.png",
    maxCss: 650,
  },
  {
    src: "public/images/operations/field-team-hotel-operation.png",
    slug: "field-team-hotel-operation",
    key: "/images/operations/field-team-hotel-operation.png",
    maxCss: 1105,
  },
];

/**
 * The brand lockup is a different problem from the photography. It has an
 * alpha channel and hard type edges, and it is the only image besides the
 * hero still that loads at first paint, so its weight is felt on every
 * load. It was shipping at 650px and 77.5KB while being displayed at
 * 154px in the header and 180px in the footer.
 *
 * Encoded lossless only. The source holds 3,884 distinct opaque colours,
 * so it carries gradients rather than being flat artwork, and palette
 * quantisation to 256 colours would be visibly lossy on a client's brand
 * mark. Lossy AVIF at q80 would save a further 14KB and would very likely
 * look fine, but that is a judgement that needs eyes on the result rather
 * than a byte count, so it is deliberately not taken here.
 */
const LOGO = {
  src: "source-assets/images/swt-elite-logo.png",
  slug: "swt-elite-logo",
  key: "/brand/swt-elite-logo.png",
  // 400px covers the 180px footer lockup on a 2x display.
  widths: [200, 320, 400],
};

const FORMATS = [
  { ext: "avif", opts: { quality: 52, effort: 5, chromaSubsampling: "4:2:0" } },
  { ext: "webp", opts: { quality: 80, effort: 5 } },
  { ext: "jpg", opts: { quality: 80, mozjpeg: true, progressive: true } },
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const manifest = {};
  let sourceBytes = 0;
  let derivedBytes = 0;

  for (const entry of SOURCES) {
    const abs = path.join(ROOT, entry.src);
    const input = sharp(abs);
    const meta = await input.metadata();
    sourceBytes += (await fs.stat(abs)).size;

    // Never upscale: the ladder stops at the source's own width, and at
    // twice the widest layout the image is ever given.
    const ceiling = Math.min(meta.width, entry.maxCss * 2);
    const widths = LADDER.filter((w) => w < ceiling);
    if (!widths.includes(ceiling)) widths.push(ceiling);
    widths.sort((a, b) => a - b);

    const files = {};
    for (const { ext, opts } of FORMATS) {
      files[ext] = [];
      for (const w of widths) {
        const name = `${entry.slug}-${w}.${ext}`;
        const dest = path.join(OUT_DIR, name);
        const pipeline = sharp(abs).resize({ width: w, withoutEnlargement: true });
        if (ext === "avif") await pipeline.avif(opts).toFile(dest);
        else if (ext === "webp") await pipeline.webp(opts).toFile(dest);
        else await pipeline.flatten({ background: "#15130F" }).jpeg(opts).toFile(dest);
        const size = (await fs.stat(dest)).size;
        derivedBytes += size;
        files[ext].push({ w, bytes: size });
      }
    }

    manifest[entry.key] = {
      slug: entry.slug,
      sourceWidth: meta.width,
      sourceHeight: meta.height,
      maxCss: entry.maxCss,
      widths,
      // True when the source cannot cover the widest layout at 1x. Not
      // something this script can fix: it needs a larger export from the
      // original photography.
      sourceShortfall: meta.width < entry.maxCss ? entry.maxCss - meta.width : 0,
      dpr2Shortfall: meta.width < entry.maxCss * 2,
      files,
    };

    const largest = files.avif[files.avif.length - 1];
    console.log(
      `${entry.slug.padEnd(42)} ${String(meta.width).padStart(4)}px source  ` +
        `${widths.length} widths  largest avif ${(largest.bytes / 1024).toFixed(0)}KB`
    );
  }

  // Brand lockup: alpha preserved, no JPEG path.
  {
    const abs = path.join(ROOT, LOGO.src);
    const meta = await sharp(abs).metadata();
    const files = { webp: [], png: [] };
    for (const w of LOGO.widths) {
      for (const ext of ["webp", "png"]) {
        const dest = path.join(OUT_DIR, `${LOGO.slug}-${w}.${ext}`);
        const pipe = sharp(abs).resize({ width: w, withoutEnlargement: true });
        if (ext === "webp") await pipe.webp({ lossless: true, effort: 6 }).toFile(dest);
        else await pipe.png({ compressionLevel: 9 }).toFile(dest);
        files[ext].push({ w, bytes: (await fs.stat(dest)).size });
      }
    }
    manifest[LOGO.key] = {
      slug: LOGO.slug,
      sourceWidth: meta.width,
      sourceHeight: meta.height,
      widths: LOGO.widths,
      files,
    };
    const at400 = files.webp.find((f) => f.w === 400);
    console.log(
      `${LOGO.slug.padEnd(42)} ${String(meta.width).padStart(4)}px source  ` +
        `${LOGO.widths.length} widths  400 webp ${(at400.bytes / 1024).toFixed(1)}KB (lossless)`
    );
  }

  await fs.writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  console.log(
    `\nsources ${(sourceBytes / 1048576).toFixed(2)}MB ` +
      `-> derivatives ${(derivedBytes / 1048576).toFixed(2)}MB across all formats and widths`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
