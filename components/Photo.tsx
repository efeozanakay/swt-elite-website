import Image from "next/image";

/**
 * Aspect-boxed, object-cover photography slot — the production counterpart
 * to ImagePlaceholder. `position` sets object-position deliberately per
 * image so the approved crop keeps its intended subject in frame; never
 * leave it at a blind default center. `quality` defaults to 90 — higher
 * than Next's default 75 — since every source photo here is large-format
 * documentary photography where compression softening is visible.
 */
export function Photo({
  src,
  alt,
  aspect,
  position = "50% 50%",
  className = "",
  sizes = "100vw",
  priority = false,
  quality = 90,
}: {
  src: string;
  alt: string;
  aspect: string;
  position?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
