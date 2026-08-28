import manifest from "@/public/images/opt/manifest.json";

type Variant = { w: number; bytes: number };
type Entry = {
  slug: string;
  sourceWidth: number;
  sourceHeight: number;
  maxCss: number;
  widths: number[];
  sourceShortfall: number;
  dpr2Shortfall: boolean;
  files: { avif: Variant[]; webp: Variant[]; jpg: Variant[] };
};

const IMAGES = manifest as unknown as Record<string, Entry>;

const srcSet = (slug: string, variants: Variant[], ext: string) =>
  variants.map((v) => `/images/opt/${slug}-${v.w}.${ext} ${v.w}w`).join(", ");

/**
 * Aspect-boxed, object-cover photography slot.
 *
 * next/image cannot help here: next.config sets output:'export' with
 * images.unoptimized, so it emits a bare <img> with no srcset and no
 * format negotiation, and every device downloaded the same
 * multi-megabyte PNG. This renders the <picture> by hand instead, from
 * the derivatives and manifest produced by scripts/generate-images.mjs.
 *
 * `position` sets object-position deliberately per image so the approved
 * crop keeps its subject in frame; never leave it at a blind centre.
 *
 * `sizes` is now load-bearing rather than decorative, so it must describe
 * the real layout at every breakpoint. The values in each call site were
 * measured from the rendered page, not estimated.
 */
export function Photo({
  src,
  alt,
  aspect,
  position = "50% 50%",
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  aspect: string;
  position?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const entry = IMAGES[src];

  if (!entry) {
    throw new Error(
      `Photo: no derivatives for "${src}". Run "npm run images" after adding a source file.`
    );
  }

  const { slug, files } = entry;
  const widest = files.jpg[files.jpg.length - 1];

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet(slug, files.avif, "avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(slug, files.webp, "webp")} sizes={sizes} />
        <img
          src={`/images/opt/${slug}-${widest.w}.jpg`}
          srcSet={srcSet(slug, files.jpg, "jpg")}
          sizes={sizes}
          alt={alt}
          width={entry.sourceWidth}
          height={entry.sourceHeight}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: position }}
        />
      </picture>
    </div>
  );
}
