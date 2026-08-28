# Source assets

Originals that are not served directly.

## `swt-elite-logo.png`

The brand lockup at 650x497. `BrandMark` serves lossless WebP and PNG
derivatives of it from `public/images/opt/`, sized to how the mark is
actually drawn, so this original is not requested by the browser. Both
derivative formats are mathematically lossless, so the rendered mark is
pixel-identical to this file.

## `opengraph-image.png`

The original 1200x630 export. Next resolves `app/opengraph-image.*` by
convention, so the PNG and the JPEG that is actually served cannot both
live in `app/`.

## Photography

Not here. The nine photographs are in `public/images/`, served directly
as the original lossless PNGs, which is the approved visual state.

A responsive AVIF/WebP pipeline was built and then rolled back: at the
quality it was generated with it was visibly degrading the photography.
Measured against the originals it scored 32-38 dB PSNR, where the
full-bleed images sat at 32-36 dB, and that is plainly visible on
large-format work. `scripts/generate-images.mjs` is kept intact and still
runnable for a future attempt at substantially higher quality, but its
photographic output is not currently used or shipped. Any retry needs a
review by eye, not a byte count.
