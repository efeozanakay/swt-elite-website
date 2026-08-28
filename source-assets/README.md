# Source assets

The original, full-resolution images. Nothing here is served to the
browser and nothing here is written to by any script — these are the
inputs and the rollback point.

`scripts/generate-images.mjs` (run via `npm run images`) reads this
directory and writes derivatives into `public/images/opt/`, which is what
the site actually ships. To change an image, replace the original here
and re-run the script.

## Why these are not in `public/`

They were, and Next copied all 21MB of them into `out/` on every build
even though no markup referenced them any more. Keeping them outside
`public/` preserves them in full while keeping them out of the deployed
output.

## `opengraph-image.png`

The original 1200x630 export. Next resolves `app/opengraph-image.*` by
convention, so the PNG and the JPEG that is actually served cannot both
live in `app/`. The JPEG is generated from this file at quality 84 and is
91% smaller.
