import { locationById } from "@/lib/b2c/demo/locations";
import type { TransferSearch } from "@/lib/b2c/transfer-search";
import type { FareCategory, Leg, LegDirection, LegId, PassengerCounts } from "@/lib/b2c/booking/types";
import type { TransferLocation } from "@/lib/b2c/demo/locations";

/**
 * Turns a validated search into the legs of a booking. Returns [] for an
 * incomplete search, so callers can treat "no legs" as "not bookable".
 */
export function legsFromSearch(s: TransferSearch): Leg[] {
  const from = locationById(s.from);
  const to = locationById(s.to);
  if (!from || !to || !s.date) return [];
  const legs: Leg[] = [{ id: "out", from, to, date: s.date, time: s.time, direction: directionOf(from, to) }];
  if (s.trip === "return" && s.returnDate) {
    legs.push({ id: "ret", from: to, to: from, date: s.returnDate, time: s.returnTime, direction: directionOf(to, from) });
  }
  return legs;
}

export function directionOf(from: TransferLocation, to: TransferLocation): LegDirection {
  if (from.kind === "airport" && to.kind === "airport") return "airport_to_airport";
  return from.kind === "airport" ? "arrival" : "departure";
}

export const passengerCounts = (s: TransferSearch): PassengerCounts => ({
  adults: s.adults,
  children: s.children,
  childAges: s.ages.filter((a) => a >= 0),
});

export const totalPassengers = (p: PassengerCounts) => p.adults + p.children;

/** Shared Shuttle fare category for a child of a given age. Adults
 *  (12+) are entered as adults in the search. */
export const fareCategoryForAge = (age: number): FareCategory =>
  age < 3 ? "infant_free" : age <= 11 ? "child_half" : "adult";

/** How many of each Shared Shuttle fare a party needs, per leg. Counts
 *  only: amounts come from a pricing source, never from here. */
export function shuttleFareUnits(p: PassengerCounts): Record<FareCategory, number> {
  const units: Record<FareCategory, number> = { adult: p.adults, child_half: 0, infant_free: 0 };
  for (const age of p.childAges) units[fareCategoryForAge(age)] += 1;
  return units;
}

/** One block per flight the booking needs: an arrival flight for each
 *  leg starting at an airport, a departure flight for each leg ending at
 *  one. */
export type FlightRequirement = {
  key: string;
  legId: LegId;
  kind: "arrival" | "departure";
  airport: TransferLocation;
  legDate: string;
};

export function flightRequirements(legs: Leg[]): FlightRequirement[] {
  return legs.flatMap((leg) => [
    ...(leg.from.kind === "airport"
      ? [{ key: `${leg.id}-arr`, legId: leg.id, kind: "arrival" as const, airport: leg.from, legDate: leg.date }]
      : []),
    ...(leg.to.kind === "airport"
      ? [{ key: `${leg.id}-dep`, legId: leg.id, kind: "departure" as const, airport: leg.to, legDate: leg.date }]
      : []),
  ]);
}

/** The non-airport end of the journey, where the accommodation is. */
export const accommodationArea = (legs: Leg[]): TransferLocation | null => {
  const first = legs[0];
  if (!first) return null;
  if (first.from.kind !== "airport") return first.from;
  if (first.to.kind !== "airport") return first.to;
  return null;
};
