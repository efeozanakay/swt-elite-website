import Image from "next/image";

// Official SWT Elite lockup — symbol + "SWT Elite" + "Safe Wings Travel".
// Source asset: public/brand/swt-elite-logo.png (650×497). Preserve this
// aspect ratio; do not crop or recompose the mark itself.
const LOGO_ASPECT = 650 / 497;

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
    <Image
      src="/brand/swt-elite-logo.png"
      alt="SWT Elite — Safe Wings Travel"
      width={width}
      height={height}
      priority={priority}
      quality={100}
      className={className}
    />
  );
}
