import { Reveal } from "@/components/Reveal";

export function Hero() {
  return (
    <section
      id="top"
      className="on-dark relative flex h-[100svh] min-h-[640px] w-full flex-col justify-end overflow-hidden bg-charcoal"
    >
      {/*
        Final hero background — SWT vehicle at airport arrivals, blue hour.
        Composed with the vehicle on the right and negative space on the
        left for the typography below; object-position keeps that framing
        intact under object-cover rather than defaulting to center.

        Muted, looping video is the Hero background. The same still
        photograph is used as the video's `poster` — shown instantly
        (preventing layout shift while the video loads) and as the
        fallback if playback genuinely fails — via the poster attribute
        only, not a separate visible layer. (prefers-reduced-motion
        handling intentionally removed for now — video is always the
        visible media; revisit in a later pass if reduced-motion support
        is required.)
      */}
      <div className="absolute inset-0" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/swt-elite-hero-airport-vito.png"
          className="absolute inset-0 h-full w-full object-cover object-[78%_38%]"
        >
          <source src="/videos/swt-hero-final.webm" type="video/webm" />
          <source src="/videos/swt-hero-final.mp4" type="video/mp4" />
        </video>
        {/* restrained readability treatment — left side only, so the
            photograph itself is never globally darkened or flattened.
            Slightly stronger than a bare minimum since the content block
            now sits in the upper-left, over sky rather than the darker
            road area the original bottom scrim was tuned for. */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent lg:hidden" />
      </div>

      {/*
        Content sits bottom-left on mobile/tablet (unchanged, already
        approved there) and moves to a true upper-left position on
        desktop (lg+): left-[8%] horizontally, top-[132px] vertically
        (nav's 124px + an 8px gap — deliberately tight so the block reads
        as clearly upper, not mid-left).

        Previous pass used `lg:inset-x-0` + `.wrap`'s `mx-auto
        max-w-canvas`: at viewports wider than the 1440px canvas, auto
        margins centred that box instead of pinning it left, which is why
        the content kept reading as "left-center" rather than upper-left
        regardless of the top offset. Fixed here via `lg:mx-0
        lg:max-w-none lg:px-0` (utility classes win over the
        component-layer `.edge`/`.wrap` rules) plus an explicit
        `lg:left-[8%]`, so the block is genuinely left-anchored at every
        desktop width, not just at exactly 1440px.
      */}
      <div className="edge wrap relative z-10 pb-20 pt-40 sm:pb-28 lg:absolute lg:left-[8%] lg:top-[132px] lg:mx-0 lg:max-w-none lg:px-0 lg:pb-0 lg:pt-0">
        <Reveal className="lg:max-w-lg">
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-swt-orange" aria-hidden="true" />
            Ground Operations — Türkiye
          </p>
          <h1 className="max-w-4xl font-display text-hero text-ivory lg:max-w-lg lg:text-display-lg">
            Before They Arrive,
            <br />
            We&rsquo;re Already There.
          </h1>
          <p className="mt-8 max-w-xl font-sans text-body-lg text-ivory/80 lg:max-w-sm">
            Ground operations, transportation and destination services for
            travel partners across Türkiye.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
            <a href="#handover" className="btn-primary">
              Partner With Us
            </a>
            <a href="#capabilities" className="link-quiet group">
              Explore Our Capabilities
              <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
