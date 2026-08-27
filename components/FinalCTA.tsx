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
          {/*
            The closing statement is the largest type on the page after
            the hero, and shares `display-lg` with it from lg up so the
            two read as bookends. Below sm it must not outrank the hero:
            at 375 `display-lg` resolves to 36.7px against the hero's
            34.9px, inverting the page's own hierarchy. There is no room
            for a meaningful step between a 30px section title and a
            34.9px page title on a 375px screen, so this sits level with
            the other section titles there and takes its extra weight from
            sm up, where the ladder has room to open out.
          */}
          <h2 className="max-w-3xl font-display text-display text-ivory sm:text-display-lg">
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
