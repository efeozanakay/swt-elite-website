/**
 * Responsive WebP set for the consumer travel pages.
 *
 * Reads the supplied originals in source-assets/b2c (never written to,
 * never deployed) and writes width variants into public/images/b2c, plus
 * a manifest that the B2CImage component reads for srcset and intrinsic
 * size.
 *
 * Run with: npm run images:b2c
 *
 * Quality is set high on purpose. An earlier attempt at a lossy pipeline
 * for the corporate photography was rolled back because it visibly
 * softened large-format images (32-38 dB PSNR; see
 * source-assets/README.md). This script reports PSNR for every variant
 * against the source resized to the same width with the same filter, so
 * any regression is a number in the console, not a surprise on screen.
 * The widest variant is the source's own width: nothing is upscaled.
 *
 * Expect 31-38 dB here. These sources are dense with foliage, stone and
 * water texture, and lossy WebP always subsamples chroma, so whole-image
 * PSNR runs lower than on smoother photography. q86 was chosen by eye
 * against q92 at 100% crops: the difference is a faint softening in
 * foliage that is not visible at display size, and q92 costs about 30%
 * more bytes. Re-check by eye if QUALITY or the sources change.
 */
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "source-assets", "b2c");
const OUT_DIR = path.join(ROOT, "public", "images", "b2c");
const LADDER = [480, 800, 1200, 1672];
const QUALITY = 86;

async function psnr(reference, candidate) {
  const [a, b] = await Promise.all([
    sharp(reference).raw().toBuffer(),
    sharp(candidate).raw().toBuffer(),
  ]);
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  const mse = sum / a.length;
  return mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = (await fs.readdir(SRC_DIR)).filter((f) => f.endsWith(".png")).sort();
  const manifest = {};

  for (const file of files) {
    const slug = path.basename(file, ".png");
    const src = path.join(SRC_DIR, file);
    const meta = await sharp(src).metadata();
    const widths = LADDER.filter((w) => w < meta.width);
    widths.push(meta.width);
    const entry = { width: meta.width, height: meta.height, widths: [] };

    for (const w of widths) {
      const resized = await sharp(src).resize({ width: w, kernel: "lanczos3" }).removeAlpha().toBuffer();
      const webp = await sharp(resized).webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toBuffer();
      const out = path.join(OUT_DIR, `${slug}-${w}.webp`);
      await fs.writeFile(out, webp);
      const db = await psnr(await sharp(resized).png().toBuffer(), webp);
      entry.widths.push(w);
      console.log(`${slug}-${w}.webp  ${(webp.length / 1024).toFixed(0)} KB  ${db.toFixed(1)} dB`);
    }
    manifest[slug] = entry;
  }

  await fs.writeFile(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
