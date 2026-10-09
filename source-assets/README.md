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

Not here. The nine photographs are in `public/images/` as the original
lossless PNGs, which remain the source of truth and the `<img>` fallback.

The first responsive AVIF/WebP pipeline (AVIF q52 / WebP q80) was rolled
back for visibly degrading the photography at 32-38 dB PSNR. The current
`scripts/generate-images.mjs` produces WebP at q95 only: 39-43 dB against
the source resized with the same filter (lowest at the 400px widths),
reviewed by eye at 100% crops before shipping. `Photo` serves them by
srcset, which took a full mobile scroll of the homepage from 21.4MB of
images to 2.2MB.

## Hero film

`public/videos/swt-hero-mobile.{webm,mp4}` are the portrait-phone
encodes of `swt-hero-final`: the 960px slice a phone actually shows,
cropped at the same 78% framing and scaled to 720px (0.7MB / 1.3MB,
against 3.8MB / 3.5MB). See `components/HeroMedia.tsx` for the ffmpeg
filter.

## `b2c/`

Supplied imagery for the consumer travel pages (/transfers, /tours),
renamed to descriptive English slugs. `npm run images:b2c` derives the
WebP widths in `public/images/b2c/` and their manifest. Quality is q86,
chosen by eye against q92 at 100% crops; the script prints PSNR per
variant (31-38 dB, low because these sources are dense with fine
texture) so any change to the settings is measurable.
