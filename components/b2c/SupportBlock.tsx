import { SUPPORT } from "@/lib/b2c/business";
import { SUPPORT_COPY } from "@/lib/b2c/copy";
import { SectionIntro } from "@/components/b2c/SectionIntro";

/**
 * Customer contact, with routine questions and on-the-day emergencies
 * kept visibly apart. The phone number is an emergency transfer line,
 * not a sales or general enquiries line, and the copy says so.
 */
export function SupportBlock() {
  return (
    <section aria-labelledby="support-title" className="bg-ivory py-20 text-ink md:py-24">
      <div className="edge wrap">
        <SectionIntro id="support-title" eyebrow={SUPPORT_COPY.eyebrow} title={SUPPORT_COPY.title} />
        <div className="mt-10 grid border-t border-graphite/20 md:grid-cols-2">
          <div className="border-b border-graphite/20 py-8 md:border-b-0 md:pr-10">
            <h3 className="font-display text-[1.375rem]">{SUPPORT_COPY.general}</h3>
            <p className="mt-2 max-w-md font-sans text-body text-graphite">{SUPPORT_COPY.generalBody}</p>
            <a href={`mailto:${SUPPORT.email}`} className="link-quiet mt-5">
              {SUPPORT.email}
            </a>
          </div>
          <div className="py-8 md:border-l md:border-graphite/20 md:pl-10">
            <h3 className="font-display text-[1.375rem]">{SUPPORT_COPY.emergency}</h3>
            <p className="mt-2 max-w-md font-sans text-body text-graphite">{SUPPORT_COPY.emergencyBody}</p>
            <a href={`tel:${SUPPORT.emergencyTel}`} className="link-quiet mt-5">
              {SUPPORT.emergencyPhone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
