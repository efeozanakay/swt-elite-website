import { IconArrow, IconCheck } from "@/components/b2c/Icons";
import { CANCELLATION, EQUIPMENT_OPTIONS, SUPPORT } from "@/lib/b2c/business";
import { PRICE_PLACEHOLDER, RESULTS, SERVICES } from "@/lib/b2c/copy";
import { FLOW } from "@/lib/b2c/copy-booking";
import { formatDate } from "@/lib/b2c/locale";
import { timeLabel, type TransferSearch } from "@/lib/b2c/transfer-search";
import type { BookingDraft } from "@/lib/b2c/booking/draft";
import type { Leg } from "@/lib/b2c/booking/types";

/** The journey and choices so far. Rendered in the sticky sidebar on
 *  desktop and inside a disclosure on mobile, from the same markup. */
export function JourneySummary({ search, legs, draft }: { search: TransferSearch; legs: Leg[]; draft: BookingDraft }) {
  const isReturn = legs.length > 1;
  const extras = [
    draft.childSeats ? `${draft.childSeats} child ${draft.childSeats === 1 ? "seat" : "seats"}` : "",
    ...draft.equipment.map((e) => EQUIPMENT_OPTIONS.find((o) => o.id === e)?.label ?? e),
  ].filter(Boolean);

  return (
    <div className="font-sans text-small">
      <ol className="space-y-4">
        {legs.map((l) => (
          <li key={l.id}>
            <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">
              {isReturn ? (l.id === "out" ? RESULTS.outbound : RESULTS.return) : "Journey"}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-ink">
              <span>{l.from.name}</span>
              <IconArrow size={14} className="shrink-0 text-graphite" />
              <span>{l.to.name}</span>
            </p>
            <p className="text-graphite">
              {formatDate(l.date, "short")} · {timeLabel(l.from)}: {l.time || RESULTS.timeTbc}
            </p>
          </li>
        ))}
      </ol>
      <dl className="mt-4 divide-y divide-graphite/15 border-t border-graphite/15">
        <SummaryRow term="Passengers" value={passengerLine(search)} />
        <SummaryRow term={FLOW.service} value={draft.service ? SERVICES[draft.service].name : "Not selected yet"} />
        {extras.length > 0 && <SummaryRow term="Extras" value={extras.join(", ")} />}
        <SummaryRow term={draft.service ? SERVICES[draft.service].priceBasis : FLOW.price}>
          <span aria-hidden="true">{PRICE_PLACEHOLDER} </span>
          <span className="text-graphite">{FLOW.priceUnavailable}</span>
        </SummaryRow>
      </dl>
      <p className="mt-4 flex gap-2 text-ink">
        <IconCheck size={16} className="mt-0.5 shrink-0 text-brand-navy" />
        {CANCELLATION.headline}
      </p>
      <p className="mt-4 border-t border-graphite/15 pt-4 text-graphite">
        Questions:{" "}
        <a className="text-ink underline underline-offset-4" href={`mailto:${SUPPORT.email}`}>
          {SUPPORT.email}
        </a>
      </p>
    </div>
  );
}

function SummaryRow({ term, value, children }: { term: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-graphite">{term}</dt>
      <dd className="text-right text-ink">{children ?? value}</dd>
    </div>
  );
}

export function passengerLine(s: TransferSearch) {
  const base = RESULTS.passengers(s.adults, s.children);
  const known = s.ages.filter((a) => a >= 0);
  if (!s.children || known.length !== s.children) return base;
  return `${base} (${s.children === 1 ? "age" : "ages"} ${known.map((a) => (a === 0 ? "under 1" : a)).join(", ")})`;
}
