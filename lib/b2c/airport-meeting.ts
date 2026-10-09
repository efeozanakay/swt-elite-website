/**
 * Verified airport meeting procedures, as supplied by SWT Elite
 * operations. Both Shared Shuttle and Private Transfer use the local
 * procedure for the airport.
 *
 * Only airports listed here have published instructions. Do not add desk
 * numbers or procedures for any other airport without operational
 * confirmation: for those, the component says the meeting point is
 * confirmed with the booking.
 */
export type MeetingPoint = {
  /** Terminal label, or null when the airport has a single procedure. */
  terminal: string | null;
  summary: string;
  steps?: string[];
};

export const AIRPORT_MEETING: Record<string, { airport: string; points: MeetingPoint[] }> = {
  ayt: {
    airport: "Antalya Airport (AYT)",
    points: [
      { terminal: "International Terminal 1", summary: "SWT ELITE Desk 44." },
      { terminal: "International Terminal 2", summary: "SWT ELITE Desk 74." },
      {
        terminal: "Domestic Terminal",
        summary: "A representative will be waiting with an SWT ELITE sign.",
        steps: [
          "If you can’t find the representative, go to SWT ELITE Desk 44 in International Arrivals at Terminal 1 for assistance.",
        ],
      },
    ],
  },
  gzp: {
    airport: "Gazipaşa–Alanya Airport (GZP)",
    points: [{ terminal: null, summary: "A representative will meet you at the arrivals exit." }],
  },
  adb: {
    airport: "Izmir Adnan Menderes Airport (ADB)",
    points: [
      {
        terminal: null,
        summary: "SWT ELITE Desk 14, in the open parking area.",
        steps: ["Exit International Arrivals.", "Cross the bridge.", "Turn right to Desk 14."],
      },
    ],
  },
  bjv: {
    airport: "Milas–Bodrum Airport (BJV)",
    points: [{ terminal: null, summary: "SWT ELITE Desk 15." }],
  },
  dlm: {
    airport: "Dalaman Airport (DLM)",
    points: [{ terminal: null, summary: "A representative will meet you at the arrivals exit." }],
  },
};

export const meetingFor = (airportId: string | null | undefined) =>
  (airportId && AIRPORT_MEETING[airportId]) || null;
