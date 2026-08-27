import { Reveal } from "@/components/Reveal";

/**
 * Google's documented Maps URL form, pointing at the same destination
 * string as the link this section was specified from. That link carried
 * browser-session parameters (sxsrf, sca_esv, client, and biw/bih/dpr
 * describing the window it was copied from); those expire, and they
 * describe the machine the link was copied on rather than the place, so
 * they are not something to publish. This form is stable and documented.
 */
const MAPS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Alko+Plaza%2C+Alt%C4%B1nova+Sinan%2C+No%3A3%2C+07030+Kepez%2FAntalya";

/**
 * The address as a record rather than a paragraph. Labelled rows on
 * hairlines are the same device Coverage uses for its city list and Fleet
 * uses for its categories, so the base reads as another piece of
 * operational fact in a language the page has already established, rather
 * than as a contact panel bolted to the end.
 */
const RECORD = [
  { label: "Base", value: "Alko Plaza" },
  { label: "Address", value: "Altınova Sinan Mh. Sevil Sk. No:3/3" },
  { label: "District", value: "Kepez / Antalya / Türkiye" },
];

export function Headquarters() {
  return (
    /*
      Sits between the closing CTA and the footer, both of which are
      charcoal. Without it those two ran together as a single unbroken
      block over 1200px tall at desktop, so the page's most important
      call to action shared a field with the legal boilerplate beneath it.
      Bone separates them and gives the CTA its own ground.
    */
    <section id="headquarters" className="bg-bone py-24 md:py-28 lg:py-32">
      <div className="edge wrap grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-5">
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-swt-orange" aria-hidden="true" />
            Antalya — Headquarters
          </p>
          <h2 className="font-display text-display text-ink">
            The base the network runs from.
          </h2>
        </Reveal>

        <Reveal delay={100} className="md:col-span-6 md:col-start-7">
          <address className="not-italic">
            <dl className="border-t border-graphite/20">
              {RECORD.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-1 gap-1 border-b border-graphite/15 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <dt className="eyebrow sm:col-span-4">{row.label}</dt>
                  <dd className="font-sans text-body text-ink sm:col-span-8">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </address>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet group mt-10"
          >
            View on Google Maps
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
