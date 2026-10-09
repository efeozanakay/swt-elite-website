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
          query string in the browser. */}
      <Suspense fallback={<div className="min-h-[70vh] bg-charcoal" aria-busy="true" />}>
        <TransferResults />
      </Suspense>
    </TravelShell>
  );
}
