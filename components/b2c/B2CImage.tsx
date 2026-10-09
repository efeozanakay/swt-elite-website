import { IMAGES, imageMeta, type ImageKey } from "@/lib/b2c/images";

/**
 * Responsive image for the travel pages. Fills its positioned parent and
 * crops with object-cover, so the parent decides the aspect ratio.
 *
 * A plain <img> with srcset rather than next/image: the site is a static
 * export with images.unoptimized, where next/image emits a single src
 * and the `sizes` prop does nothing.
 */
export function B2CImage({
  name,
  sizes,
  alt,
  focus,
  priority = false,
  className = "",
}: {
  name: ImageKey;
  /** CSS width the image is laid out at, per breakpoint. */
  sizes: string;
  /** Overrides the registry alt. Pass "" for decorative use. */
  alt?: string;
  /** Overrides the registry focal point (object-position). */
  focus?: string;
  priority?: boolean;
  className?: string;
}) {
  const meta = imageMeta(name);
  const srcSet = meta.widths.map((w) => `/images/b2c/${name}-${w}.webp ${w}w`).join(", ");
  const fallback = meta.widths.find((w) => w >= 1200) ?? meta.width;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/b2c/${name}-${fallback}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={meta.width}
      height={meta.height}
      alt={alt ?? IMAGES[name].alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      style={{ objectPosition: focus ?? IMAGES[name].focus }}
    />
  );
}
