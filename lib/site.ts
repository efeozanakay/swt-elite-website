/**
 * Single source of truth for the facts the site asserts about itself.
 *
 * Everything here is either already stated somewhere in the page or was
 * supplied directly. Nothing is inferred. In particular there is no
 * telephone number, licence or registration number, founding date,
 * opening hours, rating or geo coordinate, because none of those are
 * known — and structured data that states them wrongly is worse than
 * structured data that omits them.
 */
export const SITE_URL = "https://swtelite.com";

export const ORG = {
  name: "SWT Elite",
  /** From the brand lockup, which reads "SWT Elite — Safe Wings Travel". */
  alternateName: "Safe Wings Travel",
  email: "info@swtelite.com",
  description:
    "Ground operations, transportation and destination services for travel partners across Türkiye.",
  address: {
    /** As approved. No postal code: the address block supplied does not
     *  carry one, and inventing one would be a factual claim. */
    streetAddress: "Alko Plaza, Altınova Sinan Mh. Sevil Sk. No:3/3",
    addressLocality: "Kepez",
    addressRegion: "Antalya",
    addressCountry: "TR",
  },
  /** The destinations the Coverage section already names. */
  areaServed: [
    "Antalya",
    "Istanbul",
    "Izmir",
    "Bodrum",
    "Dalaman",
    "Cappadocia",
  ],
  /** The four disciplines the Capabilities section already names. */
  services: [
    "Ground handling",
    "Transportation",
    "Destination services",
    "Groups and MICE",
  ],
} as const;
