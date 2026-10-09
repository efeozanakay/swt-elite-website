import { locationById, type TransferLocation } from "@/lib/b2c/demo/locations";
import { parseISODate, toISODate } from "@/lib/b2c/locale";

/**
 * The transfer search, as it travels between the landing page and the
 * results page. It lives in the URL rather than in memory so a results
 * page can be reloaded, bookmarked or shared and still show the journey.
 */
export type TripType = "oneway" | "return";

export type TransferSearch = {
  trip: TripType;
  from: string;
  to: string;
  date: string;
  time: string;
  returnDate: string;
  returnTime: string;
  adults: number;
  children: number;
};

export const PASSENGER_LIMITS = {
  adults: { min: 1, max: 16 },
  children: { min: 0, max: 10 },
} as const;

export const EMPTY_SEARCH: TransferSearch = {
  trip: "oneway",
  from: "",
  to: "",
  date: "",
  time: "",
  returnDate: "",
  returnTime: "",
  adults: 2,
  children: 0,
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const intParam = (v: string | null, fallback: number) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
};

const timeParam = (v: string | null) =>
  v && /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? v : "";

const dateParam = (v: string | null) => (v && parseISODate(v) ? v : "");

export function searchFromParams(params: URLSearchParams): TransferSearch {
  return {
    trip: params.get("trip") === "return" ? "return" : "oneway",
    from: locationById(params.get("from"))?.id ?? "",
    to: locationById(params.get("to"))?.id ?? "",
    date: dateParam(params.get("date")),
    time: timeParam(params.get("time")),
    returnDate: dateParam(params.get("rdate")),
    returnTime: timeParam(params.get("rtime")),
    adults: clamp(
      intParam(params.get("adults"), EMPTY_SEARCH.adults),
      PASSENGER_LIMITS.adults.min,
      PASSENGER_LIMITS.adults.max
    ),
    children: clamp(
      intParam(params.get("children"), 0),
      PASSENGER_LIMITS.children.min,
      PASSENGER_LIMITS.children.max
    ),
  };
}

export function searchToQuery(s: TransferSearch): string {
  const p = new URLSearchParams();
  p.set("trip", s.trip);
  if (s.from) p.set("from", s.from);
  if (s.to) p.set("to", s.to);
  if (s.date) p.set("date", s.date);
  if (s.time) p.set("time", s.time);
  if (s.trip === "return") {
    if (s.returnDate) p.set("rdate", s.returnDate);
    if (s.returnTime) p.set("rtime", s.returnTime);
  }
  p.set("adults", String(s.adults));
  if (s.children) p.set("children", String(s.children));
  return p.toString();
}

export type SearchErrors = Partial<
  Record<"from" | "to" | "date" | "returnDate", string>
>;

/** Returns an empty object when the search is complete and coherent. */
export function validateSearch(s: TransferSearch, today = new Date()) {
  const errors: SearchErrors = {};
  const from = locationById(s.from);
  const to = locationById(s.to);
  const todayISO = toISODate(today);

  if (!from) errors.from = "Choose a pickup location from the list.";
  if (!to) errors.to = "Choose a drop-off location from the list.";
  if (from && to && from.id === to.id) {
    errors.to = "Pickup and drop-off must be different places.";
  } else if (from && to && from.kind !== "airport" && to.kind !== "airport") {
    // Every product on this page is an airport transfer, in either
    // direction. Say so rather than quietly accepting a route we have
    // nothing to show for.
    errors.to = "Airport transfers start or end at an airport. Choose an airport for one side of the journey.";
  }

  if (!s.date) errors.date = "Choose a travel date.";
  else if (s.date < todayISO) errors.date = "The travel date can’t be in the past.";

  if (s.trip === "return") {
    if (!s.returnDate) errors.returnDate = "Choose a return date.";
    else if (s.date && s.returnDate < s.date)
      errors.returnDate = "The return can’t be before the outbound journey.";
  }

  return errors;
}

/** The label a time field should carry depends on where the journey
 *  starts: from an airport the useful fact is when the flight lands,
 *  from a hotel it is when to be collected. */
export function timeLabel(pickup: TransferLocation | null) {
  return pickup?.kind === "airport" ? "Flight arrival" : "Pickup time";
}
