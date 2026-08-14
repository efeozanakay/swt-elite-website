const CORNERS = [
  "top-3 left-3 border-t border-l",
  "top-3 right-3 border-t border-r",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
] as const;

type Tone = "ivory" | "charcoal";

/**
 * Neutral, architectural stand-in for future SWT documentary photography.
 * Flat tone + registration-mark corners signal "intentional crop", not a
 * finished image — swap the fill for a real <Image> once photography exists.
 */
export function ImagePlaceholder({
  label,
  aspect = "4 / 5",
  tone = "ivory",
  className = "",
}: {
  label: string;
  aspect?: string;
  tone?: Tone;
  className?: string;
}) {
  const fill = tone === "ivory" ? "bg-stone/35" : "bg-ivory/[0.06]";
  const border = tone === "ivory" ? "border-graphite/25" : "border-ivory/20";
  const text = tone === "ivory" ? "text-graphite/70" : "text-ivory/50";

  return (
    <div
      className={`group relative w-full overflow-hidden border ${border} ${fill} ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={label}
    >
      {CORNERS.map((pos) => (
        <span
          key={pos}
          className={`pointer-events-none absolute h-4 w-4 ${border} ${pos}`}
        />
      ))}
      <span
        className={`absolute bottom-4 left-4 right-4 font-sans text-[0.65rem] uppercase tracking-[0.14em] ${text}`}
      >
        Placeholder — {label}
      </span>
    </div>
  );
}
