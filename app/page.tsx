import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Recognition } from "@/components/Recognition";
import { OperationalProof } from "@/components/OperationalProof";
import { CapabilitySequence } from "@/components/CapabilitySequence";
import { OperationalJourney } from "@/components/OperationalJourney";
import { Fleet } from "@/components/Fleet";
import { Coverage } from "@/components/Coverage";
import { OperationsCentre } from "@/components/OperationsCentre";
import { Partners } from "@/components/Partners";
import { People } from "@/components/People";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navigation />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Recognition />
        <OperationalProof />
        <CapabilitySequence />
        <OperationalJourney />
        <Fleet />
        <Coverage />
        <OperationsCentre />
        <Partners />
        <People />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
