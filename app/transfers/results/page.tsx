import type { Metadata } from "next";
import { Suspense } from "react";
import { TransferResults } from "@/components/b2c/TransferResults";
import { TravelShell } from "@/components/b2c/TravelShell";
import { RESULTS } from "@/lib/b2c/copy";

export const metadata: Metadata = {
  title: RESULTS.meta.title,
  description: RESULTS.meta.description,
  alternates: { canonical: "/transfers/results" },
  // A results page is a view of someone's query string, not content.
  robots: { index: false, follow: true },
};

export default function TransferResultsPage() {
  return (
    <TravelShell current="transfers" solidHeader>
      {/* The page is statically exported, so the search is read from the
          query string in the browser and this fallback is what the HTML
          ships with. It is a full screen tall so the footer starts below
          the fold and does not jump when the results replace it. */}
      <Suspense fallback={<div className="min-h-[100svh] bg-charcoal" aria-busy="true" />}>
        <TransferResults />
      </Suspense>
    </TravelShell>
  );
}
