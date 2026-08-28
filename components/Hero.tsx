import { HeroMedia } from "@/components/HeroMedia";
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

        The film, its scrims and its playback control live in HeroMedia,
        which is a client component because reduced-motion has to be read
        at runtime. The still used as the poster is unchanged.
      */}
      <HeroMedia />

      {/*
        Content sits bottom-left on mobile/tablet and moves to an
        upper-left position on desktop (lg+), a gap below the nav.

        The block keeps `.edge`/`.wrap` at every breakpoint so its left
        edge is the shared canvas edge that every section below it uses.
        An earlier pass overrode those with `lg:mx-0 lg:max-w-none
        lg:px-0 lg:left-[8%]` to pin the block to the viewport instead,
        on the reading that `.wrap`'s auto margins were wrongly centring
        it. They were not: the canvas is centred, so aligning to it is
        the point. Pinning to a viewport percentage detached the hero
        from the grid and the two drifted further apart the wider the
        screen got — measured 18px out at 1440, 177px at 1920 and 445px
        at 2560. `lg:inset-x-0` with the canvas classes intact puts the
        headline on the same left edge as every heading beneath it at
        all widths.

        Below lg the block is a flex item of the section, and .wrap's
        mx-auto sets auto inline margins. Auto inline margins override
        align-items: stretch, so the item shrank to fit-content and
        centred itself: measured 48.5px of left margin at 768, putting the
        hero 49px right of the canvas edge that every section below uses.
        That is baseline behaviour, present before this pass. w-full
        restores the stretch so the block spans the canvas at every
        breakpoint.

        The top offset derives from --header-h so it tracks the nav.
      */}
      <div className="edge wrap relative z-10 w-full pb-20 pt-40 md:pb-28 lg:absolute lg:inset-x-0 lg:top-[calc(var(--header-h)+8px)] lg:pb-0 lg:pt-0">
        <Reveal immediate className="lg:max-w-lg xl:max-w-2xl">
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-swt-orange" aria-hidden="true" />
            Ground Operations — Türkiye
          </p>
          {/*
            The hard line break is the intended composition at every
            width. Below sm the `hero` step made each half too wide for
            the measure, so both halves wrapped again and the headline
            broke into four lines with two orphans (228/131/260/122px at
            375). `hero-sm` sizes the type so each half holds one line
            from 320px up; text-wrap:balance and dropping the <br> were
            both tried first and measured strictly worse, including a
            regression from two lines to three at 768.

            The measure widens at xl so the halves still hold one line
            each once the type reaches 72px.
          */}
          <h1 className="max-w-4xl font-display text-hero-sm text-ivory sm:text-hero lg:max-w-lg lg:text-display-lg xl:max-w-2xl">
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
