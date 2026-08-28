import { BrandMark } from "@/components/BrandMark";

/**
 * Google's documented Maps URL form, pointing at the same destination as
 * the link originally supplied. That link carried browser-session
 * parameters and the window dimensions it was copied from; those expire
 * and describe a machine rather than a place, so they are not published.
 */
const MAPS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Alko+Plaza%2C+Alt%C4%B1nova+Sinan%2C+No%3A3%2C+07030+Kepez%2FAntalya";

const LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Fleet", href: "#fleet" },
  { label: "Türkiye", href: "#coverage" },
  { label: "About", href: "#people" },
];

const LEGAL = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark border-t border-ivory/10 bg-charcoal pt-20">
      <div className="edge wrap">
        <BrandMark height={138} />

        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-ivory/10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Footer" className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-small uppercase tracking-[0.08em] text-ivory/70 transition-colors duration-300 hover:text-ivory"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div>
            <p className="eyebrow mb-4">Partnership Enquiries</p>
            <a
              href="mailto:info@swtelite.com"
              className="font-sans text-body text-ivory/80"
            >
              info@swtelite.com
            </a>
          </div>

          {/*
            The Antalya base is stated here rather than as a section of
            its own. The approved page order is Final CTA straight into
            the Footer, so the address belongs in the Location block that
            already existed rather than in a block between them.
          */}
          <div>
            <p className="eyebrow mb-4">Location</p>
            <address className="not-italic">
              <p className="font-sans text-body text-ivory/80">
                Alko Plaza
                <br />
                Altınova Sinan Mh. Sevil Sk. No:3/3
                <br />
                Kepez / Antalya / Türkiye
              </p>
            </address>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-sans text-small uppercase tracking-[0.08em] text-ivory/70 transition-colors duration-300 hover:text-ivory"
            >
              View on Google Maps
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <div>
            <p className="eyebrow mb-4">Operations</p>
            <p className="font-sans text-body text-ivory/80">
              Coordination available 24/7
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ivory/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-small text-ivory/50">
            © {year} SWT Elite. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-sans text-small text-ivory/50 transition-colors duration-300 hover:text-ivory/80"
              >
                {item.label}
              </a>
            ))}
            {/* Was ivory/30, which measures 2.51:1 on charcoal. ivory/50
                is the lowest step that clears 4.5:1 and is already the
                weight used by the copyright and legal links beside it. */}
            <span className="font-sans text-small text-ivory/50">
              Designed by Ozzy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
