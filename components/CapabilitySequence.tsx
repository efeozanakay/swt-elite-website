import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

export function CapabilitySequence() {
  return (
    <section id="capabilities" className="bg-ivory">
      <div className="edge wrap py-28 sm:py-36">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-6">Capabilities</p>
          <h2 className="font-display text-display text-ink">
            Four disciplines, one operation on the ground.
          </h2>
        </Reveal>
      </div>

      {/* 01 — Ground Handling: text left, wide image right. Gap tightened
          (10→8) and column re-split (5/7→3/9) to give the photograph
          substantially more presence, per the desktop scale pass. */}
      <div className="edge wrap grid grid-cols-1 gap-12 pb-24 sm:pb-32 lg:grid-cols-12 lg:items-center lg:gap-8">
        <Reveal className="lg:col-span-3">
          <span className="font-sans text-small text-graphite">01</span>
          <p className="eyebrow mb-5 mt-3">Ground Handling</p>
          <h3 className="font-display text-display-sm text-ink">
            The ground work starts before the wheels stop.
          </h3>
          <p className="mt-6 font-sans text-body text-graphite">
            Airport coordination, meet &amp; greet and arrival handling —
            every guest movement tracked from touchdown through to the
            waiting vehicle.
          </p>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-9">
          <Photo
            src="/images/operations/ground-handling-meet-greet.png"
            alt="SWT representative meeting arriving guests inside the airport"
            aspect="16 / 10"
            position="62% 40%"
            sizes="(min-width: 1024px) 74vw, 100vw"
          />
        </Reveal>
      </div>

      {/* 02 — Transportation: image left, text right. Aspect adjusted
          from the original 4:5 portrait to 3:2 — the approved photo is a
          landscape establishing shot, not a tight vertical vehicle crop.
          Gap tightened (10→8) and column re-split (6/5→8/4) so the
          vehicle and branding read immediately, per the desktop scale
          pass. */}
      <div className="edge wrap grid grid-cols-1 gap-12 pb-24 sm:pb-32 lg:grid-cols-12 lg:items-center lg:gap-8">
        <Reveal className="order-2 lg:order-1 lg:col-span-8">
          <Photo
            src="/images/operations/transportation-airport-vito.png"
            alt="SWT-branded black executive minivan at the airport with a ground-operations representative"
            aspect="3 / 2"
            position="48% 52%"
            sizes="(min-width: 1024px) 62vw, 100vw"
          />
        </Reveal>
        <Reveal
          delay={100}
          className="order-1 lg:order-2 lg:col-span-4 lg:col-start-9"
        >
          <span className="font-sans text-small text-graphite">02</span>
          <p className="eyebrow mb-5 mt-3">Transportation</p>
          <h3 className="font-display text-display-sm text-ink">
            One fleet, matched to every itinerary.
          </h3>
          <p className="mt-6 max-w-md font-sans text-body text-graphite">
            Individual and group travel, VIP movements and hotel-airport
            transfers, coordinated across a fleet sized to the itinerary
            rather than the other way round.
          </p>
        </Reveal>
      </div>

      {/* 03 — Destination Services: full-bleed band, lower-left text over image.

          The 21/11 band is only 196px tall at 375px while the overlay
          block is ~257px, so the text used to spill above the photo and
          render ivory-on-ivory: the "03", the eyebrow and the headline's
          first line were all effectively invisible on every phone.
          Enforce a minimum band height below sm so the overlay always has
          image beneath it, reusing the min-h idiom OperationsCentre
          already applies to its own overlay. sm:min-h-0 hands control
          back to the 21/11 aspect once the band is naturally tall enough. */}
      <Reveal>
        <div className="relative w-full">
          <Photo
            src="/images/operations/destination-services-hotel-representative.png"
            alt="SWT hotel representative assisting guests in a resort lobby"
            aspect="21 / 11"
            position="50% 32%"
            className="min-h-[480px] sm:min-h-0"
          />
          {/* Text covers a much larger share of the band on mobile, so the
              scrim has to reach higher and hold more density there. The
              original lighter treatment resumes at sm, where the band is
              wide and the text sits in the lower third. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/55 via-60% to-charcoal/0 sm:from-charcoal/70 sm:via-charcoal/10 sm:via-50%" />
          <div className="on-dark edge wrap absolute inset-x-0 bottom-0 pb-10 sm:pb-14">
            <span className="font-sans text-small text-ivory/70">03</span>
            <p className="eyebrow mb-4 mt-2">Destination Services</p>
            <h3 className="max-w-xl font-display text-display-sm text-ivory">
              Support that stays with the group, not just the transfer.
            </h3>
            <p className="mt-4 max-w-md font-sans text-body text-ivory/80">
              Guides, in-destination coordination and local operational
              assistance for the full length of the stay.
            </p>
          </div>
        </div>
      </Reveal>

      {/* 04 — Groups & MICE: single approved photograph. Gap tightened
          (10→8) and image column widened (5→6) to give it editorial
          authority comparable to Ground Handling/Transportation. */}
      <div className="edge wrap grid grid-cols-1 gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-center lg:gap-8">
        <Reveal className="lg:col-span-6">
          <span className="font-sans text-small text-graphite">04</span>
          <p className="eyebrow mb-5 mt-3">Groups &amp; MICE</p>
          <h3 className="font-display text-display-sm text-ink">
            Complex movements, handled as routine.
          </h3>
          <p className="mt-6 max-w-md font-sans text-body text-graphite">
            Group movement, event logistics and multi-vehicle scheduling —
            coordinated as a single operation, however many moving parts
            it contains.
          </p>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-6 lg:col-start-7">
          <Photo
            src="/images/operations/groups-mice-coach-briefing.png"
            alt="SWT staff member briefing a tour group beside a coach at a hotel"
            aspect="3 / 2"
            position="46% 44%"
            className="lg:ml-auto lg:max-w-[620px]"
            sizes="(min-width: 1024px) 620px, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
