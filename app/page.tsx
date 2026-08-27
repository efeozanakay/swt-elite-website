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
import { Headquarters } from "@/components/Headquarters";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
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
        <Headquarters />
      </main>
      <Footer />
    </>
  );
}
