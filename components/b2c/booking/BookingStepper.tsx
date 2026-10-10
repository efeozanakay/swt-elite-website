"use client";

import { IconCheck } from "@/components/b2c/Icons";
import { STEPS, type StepId } from "@/lib/b2c/booking/draft";
import { FLOW } from "@/lib/b2c/copy-booking";

/**
 * Progress for the booking flow.
 *
 * Desktop: a horizontal list of all five steps. Completed steps are
 * buttons that go back to them (data is kept); later steps are plain
 * text, because the only way forward is Continue, which validates.
 * Mobile: "Step 2 of 5", the step name, the next step and a segmented
 * bar, which fits one line and still says where you are.
 */
export function BookingStepper({
  current,
  reached,
  onGo,
}: {
  current: StepId;
  /** Index of the furthest step reached, so going back keeps forward
   *  steps reachable without re-validating them in order. */
  reached: number;
  onGo: (step: StepId) => void;
}) {
  const index = STEPS.indexOf(current);
  const next = STEPS[index + 1];
  return (
    <nav aria-label={FLOW.stepNavLabel}>
      {/* ---- Mobile ---- */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between gap-3 font-sans">
          <p className="text-small text-ink">
            <span className="text-graphite">{FLOW.stepOf(index + 1, STEPS.length)} · </span>
            <span className="font-medium">{FLOW.steps[current].label}</span>
          </p>
          {next && <p className="truncate text-[0.8125rem] text-graphite">{FLOW.next(FLOW.steps[next].short)}</p>}
        </div>
        <ol className="mt-3 grid grid-cols-5 gap-1" aria-hidden="true">
          {STEPS.map((s, i) => (
            <li key={s} className={`h-1 ${i <= index ? "bg-brand-amber" : i <= reached ? "bg-graphite/40" : "bg-graphite/15"}`} />
          ))}
        </ol>
      </div>

      {/* ---- Desktop ---- */}
      <ol className="hidden md:flex md:items-stretch">
        {STEPS.map((s, i) => {
          const done = i < index || (i <= reached && i !== index);
          const isCurrent = i === index;
          const reachable = i <= reached && !isCurrent;
          const label = FLOW.steps[s].label;
          const marker = (
            <span
              aria-hidden="true"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-sans text-small tabular-nums ${
                isCurrent
                  ? "border-ink bg-ink text-ivory"
                  : done
                    ? "border-brand-navy bg-brand-navy text-ivory"
                    : "border-graphite/35 text-graphite"
              }`}
            >
              {done && !isCurrent ? <IconCheck size={16} /> : i + 1}
            </span>
          );
          const text = (
            <span className={`font-sans text-small ${isCurrent ? "font-medium text-ink" : done ? "text-ink" : "text-graphite"}`}>
              {label}
              <span className="sr-only">{isCurrent ? ` (${FLOW.current})` : done ? ` (${FLOW.completed})` : ""}</span>
            </span>
          );
          return (
            <li
              key={s}
              aria-current={isCurrent ? "step" : undefined}
              className={`relative flex flex-1 items-center gap-3 border-b-2 pb-3 pr-3 ${isCurrent ? "border-brand-amber" : done ? "border-brand-navy/40" : "border-graphite/15"}`}
            >
              {reachable ? (
                <button
                  type="button"
                  onClick={() => onGo(s)}
                  className="flex min-h-[44px] items-center gap-3 text-left underline-offset-4 hover:underline"
                >
                  {marker}
                  {text}
                </button>
              ) : (
                <span className="flex min-h-[44px] items-center gap-3">
                  {marker}
                  {text}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
