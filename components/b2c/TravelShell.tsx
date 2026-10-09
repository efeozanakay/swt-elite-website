import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

/** Page frame shared by the consumer travel pages. */
export function TravelShell({
  current,
  solidHeader = false,
  children,
}: {
  current?: string;
  solidHeader?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navigation variant="travel" current={current} solid={solidHeader} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
