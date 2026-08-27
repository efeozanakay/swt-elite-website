import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

export function People() {
  return (
    <section id="people" className="bg-bone py-24 sm:py-32">
      <div className="edge wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
        <Reveal className="lg:col-span-7">
          <Photo
            src="/images/operations/field-team-hotel-operation.png"
            alt="SWT field team coordinating a live hotel-side operation"
            aspect="3 / 2"
            position="50% 42%"
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
        </Reveal>

        <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
          <p className="eyebrow mb-6">Field Team</p>
          <h2 className="font-display text-display text-ink">
            Operations are built by people.
          </h2>
          <p className="mt-6 max-w-md font-sans text-body text-graphite">
            Transportation, guest assistance, guiding and field operations
            are coordinated by experienced local teams — on the ground in
            Türkiye, not managed remotely.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
