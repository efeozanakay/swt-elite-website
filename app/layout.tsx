import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://swtelite.com"),
  title: "SWT Elite | Ground Operations & Transportation, Türkiye",
  description:
    "Ground operations, transportation and destination services for travel partners across Türkiye.",

  openGraph: {
    title: "SWT Elite | Ground Operations & Transportation, Türkiye",
    description:
      "Ground operations, transportation and destination services for travel partners across Türkiye.",
    type: "website",
    locale: "en_US",
    siteName: "SWT Elite",
  },

  twitter: {
    card: "summary_large_image",
    title: "SWT Elite | Ground Operations & Transportation, Türkiye",
    description:
      "Ground operations, transportation and destination services for travel partners across Türkiye.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        {children}
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
