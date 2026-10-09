"use client";

import { useId, useState } from "react";
import { AirportMeeting, MEETING_AIRPORTS } from "@/components/b2c/AirportMeeting";
import { MEETING } from "@/lib/b2c/copy";

/** Airport picker around AirportMeeting, for the /transfers landing page.
 *  Lists only airports with published meeting procedures. */
export function AirportMeetingPicker() {
  const id = useId();
  const [airport, setAirport] = useState(MEETING_AIRPORTS[0].id);
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-12">
      <div className="sf-cell self-start">
        <label htmlFor={id} className="sf-label">{MEETING.airport}</label>
        <select id={id} value={airport} onChange={(e) => setAirport(e.target.value)} className="sf-input cursor-pointer">
          {MEETING_AIRPORTS.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>
      <div className="min-h-[9rem]">
        {/* Remount per airport so the terminal choice resets. */}
        <AirportMeeting key={airport} airportId={airport} />
      </div>
    </div>
  );
}
