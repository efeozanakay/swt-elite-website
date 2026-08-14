import { Reveal } from "@/components/Reveal";

export function FinalCTA() {
  return (
    <section
      id="handover"
      className="on-dark bg-charcoal py-32 sm:py-40"
    >
      <div className="edge wrap flex flex-col items-start">
        <Reveal>
          <p className="eyebrow mb-8">Partnership</p>
          <h2 className="max-w-3xl font-display text-display-lg text-ivory">
            Let&rsquo;s Build Your
            <br />
            Operation in Türkiye.
          </h2>
          <p className="mt-8 max-w-md font-sans text-body-lg text-ivory/75">
            Tell us what you need on the ground.
          </p>
          <a
            href="mailto:info@swtelite.com"
            className="btn-primary mt-10"
          >
            Start a Conversation
          </a>
        </Reveal>
      </div>
    </section>
  );
}
