import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import { ORG, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const TITLE = "SWT Elite | Ground Operations & Transportation, Türkiye";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: ORG.description,

  // The page had no canonical, so any parameterised or trailing-slash
  // variant a partner or a campaign link produced was a separate URL as
  // far as a crawler was concerned.
  alternates: { canonical: "/" },

  openGraph: {
    title: TITLE,
    description: ORG.description,
    type: "website",
    // The content is English for an international audience, and the
    // company operates in Türkiye. en_US was neither.
    locale: "en_GB",
    siteName: ORG.name,
    url: SITE_URL,
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: ORG.description,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/**
 * Organization data, restricted to facts the site already states or that
 * were supplied directly. Deliberately absent: telephone, licence and
 * registration numbers, founding date, opening hours, geo coordinates,
 * ratings, awards and social profiles. None of those are known here, and
 * asserting them in machine-readable form would be worse than omitting
 * them — search engines treat this as a claim about the business.
 */
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["Organization", "TravelAgency"],
  "@id": `${SITE_URL}/#organization`,
  name: ORG.name,
  alternateName: ORG.alternateName,
  url: SITE_URL,
  email: ORG.email,
  description: ORG.description,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/opt/swt-elite-logo-400.png`,
    width: 400,
    height: 306,
  },
  image: `${SITE_URL}/opengraph-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: ORG.address.streetAddress,
    addressLocality: ORG.address.addressLocality,
    addressRegion: ORG.address.addressRegion,
    addressCountry: ORG.address.addressCountry,
  },
  areaServed: ORG.areaServed.map((name) => ({ "@type": "Place", name })),
  knowsAbout: ORG.services,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Serialised object, not user input; there is no interpolation
          // point an outside value could reach.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD),
          }}
        />
        <EnquiryProvider>{children}</EnquiryProvider>
        <Script
          id="cloudflare-web-analytics"
          strategy="afterInteractive"
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token":"fd43c44f8f5842ea9e12642f63fd7e2a"}'
        />
      </body>
    </html>
  );
}
