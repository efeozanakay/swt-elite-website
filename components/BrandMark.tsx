import manifest from "@/public/images/opt/manifest.json";

// Official SWT Elite lockup — symbol + "SWT Elite" + "Safe Wings Travel".
// Source asset: public/brand/swt-elite-logo.png (650×497), untouched.
// Preserve this aspect ratio; do not crop or recompose the mark itself.
const LOGO_ASPECT = 650 / 497;

const MARK = (manifest as unknown as Record<string, {
  slug: string;
  files: { webp: { w: number }[]; png: { w: number }[] };
}>)["/brand/swt-elite-logo.png"];

const srcSet = (variants: { w: number }[], ext: string) =>
  variants.map((v) => `/images/opt/${MARK.slug}-${v.w}.${ext} ${v.w}w`).join(", ");

/**
 * Deliberately one shared value rather than each instance's own width.
 * The header draws the mark at 154px and the footer at 180px; describing
 * them separately made the browser resolve two different candidates and
 * fetch the lockup twice on a single page. Quoting the larger of the two
 * costs the header a few pixels of overshoot and saves a whole request.
 */
const SIZES = "180px";

/**
 * The lockup shipped as a single 650px, 77.5KB PNG while being displayed
 * at 154px in the header and 180px in the footer, which made it the
 * heaviest image on first paint once the hero still was fixed.
 *
 * Both formats here are mathematically lossless, so the mark is
 * pixel-identical to the source at the width it is drawn. See
 * scripts/generate-images.mjs for why no lossy encoding is used on it.
 */
export function BrandMark({
  height = 40,
  className = "",
  priority = false,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet(MARK.files.webp, "webp")} sizes={SIZES} />
      <img
        src={`/images/opt/${MARK.slug}-400.png`}
        srcSet={srcSet(MARK.files.png, "png")}
        sizes={SIZES}
        alt="SWT Elite — Safe Wings Travel"
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
      />
    </picture>
  );
}
