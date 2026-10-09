import manifest from "@/public/images/opt/manifest.json";

type Entry = {
  slug: string;
  sourceWidth: number;
  sourceHeight: number;
  files: { webp?: { w: number }[] };
};

/**
 * Aspect-boxed, object-cover photography slot. `position` sets
 * object-position deliberately per image so the approved crop keeps its
 * intended subject in frame; never leave it at a blind default center.
 *
 * Serves the q95 WebP width ladder from public/images/opt (see
 * scripts/generate-images.mjs) through srcset, so `sizes` finally does
 * what it says: a phone gets an 828px file, not the 2MB original. The
 * original PNG stays as `src`, so a photograph with no derivatives yet
 * still renders exactly as before.
 *
 * A plain <img> rather than next/image: under output:'export' with
 * images.unoptimized, next/image emits a single src and ignores sizes.
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
  const entry = (manifest as unknown as Record<string, Entry>)[src];
  const ladder = entry?.files.webp ?? [];
  const srcSet = ladder.length
    ? ladder.map((f) => `/images/opt/${entry!.slug}-${f.w}.webp ${f.w}w`).join(", ")
    : undefined;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={entry?.sourceWidth}
        height={entry?.sourceHeight}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
