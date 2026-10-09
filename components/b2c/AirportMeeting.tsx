"use client";

import { useId, useState } from "react";
import { IconPin } from "@/components/b2c/Icons";
import { AIRPORT_MEETING, meetingFor } from "@/lib/b2c/airport-meeting";
import { MEETING } from "@/lib/b2c/copy";

/**
 * Airport meeting instructions for one airport. Where an airport has
 * several terminals with different procedures (Antalya), the visitor
 * picks the terminal and only that terminal's instructions are shown.
 *
 * Built to be dropped into a future booking confirmation with the booked
 * airport and terminal passed in; today it renders on the results page
 * for the arrival airport and on /transfers with an airport picker.
 */
export function AirportMeeting({
  airportId,
  tone = "light",
}: {
  airportId: string;
  tone?: "light" | "dark";
}) {
  const id = useId();
  const info = meetingFor(airportId);
  const [terminal, setTerminal] = useState(0);
  const dark = tone === "dark";
  const muted = dark ? "text-ivory/75" : "text-graphite";

  if (!info) {
    return <p className={`font-sans text-body ${muted}`}>{MEETING.unknown}</p>;
  }

  const point = info.points[Math.min(terminal, info.points.length - 1)];

  return (
    <div>
      {info.points.length > 1 && (
        <fieldset className="mb-5">
          <legend className={`mb-3 font-sans text-[0.6875rem] uppercase tracking-[0.14em] ${muted}`}>{MEETING.terminal}</legend>
          <div className="flex flex-wrap gap-2">
            {info.points.map((p, i) => (
              <label
                key={p.terminal}
                className={`cursor-pointer border px-4 py-2.5 font-sans text-small transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                  i === terminal
                    ? dark
                      ? "border-ivory bg-ivory text-ink"
                      : "border-ink bg-ink text-ivory"
                    : dark
                      ? "border-ivory/30 text-ivory hover:border-ivory"
                      : "border-graphite/30 text-ink hover:border-ink"
                }`}
              >
                <input
                  type="radio"
                  name={`${id}-terminal`}
                  className="sr-only"
                  checked={i === terminal}
                  onChange={() => setTerminal(i)}
                />
                {p.terminal}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div aria-live="polite" className="flex gap-3">
        <IconPin size={20} className={`mt-1 shrink-0 ${dark ? "text-brand-amber" : "text-brand-navy"}`} />
        <div>
          <p className="font-display text-[1.25rem] leading-snug">{point.summary}</p>
          {point.steps && point.steps.length > 1 && (
            <ol className={`mt-2 list-decimal space-y-1 pl-5 font-sans text-small ${muted}`}>
              {point.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          )}
          {point.steps && point.steps.length === 1 && (
            <p className={`mt-2 font-sans text-small ${muted}`}>{point.steps[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Airports with published meeting procedures, for pickers. */
export const MEETING_AIRPORTS = Object.entries(AIRPORT_MEETING).map(([id, v]) => ({ id, label: v.airport }));
