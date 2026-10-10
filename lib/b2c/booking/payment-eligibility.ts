import { AIRPORT_DESK_PAYMENT } from "@/lib/b2c/business";
import type {
  AytTerminal,
  DeskIneligibleReason,
  DeskPaymentEligibility,
  DeskPaymentPoint,
  Leg,
} from "@/lib/b2c/booking/types";

/**
 * Pay-at-airport-desk eligibility, derived from the itinerary.
 *
 * Approved rules:
 * - Eligible: Antalya Airport (AYT) → hotel/accommodation, one way or
 *   followed by a return journey. International Terminal 1, International
 *   Terminal 2 and domestic arrivals all qualify.
 * - Not eligible: standalone hotel → airport, any other airport
 *   (Gazipaşa included), and itineraries without an eligible AYT arrival.
 *
 * Interpretation (open for confirmation, see the integration document):
 * the AYT arrival must be the FIRST leg. A hotel → AYT → hotel round trip
 * does contain an AYT arrival, but it comes after the outbound journey
 * has already been driven, so it is treated as ineligible here.
 */
export function deskPaymentEligibility(
  legs: Leg[],
  arrivalTerminal: AytTerminal | null = null
): DeskPaymentEligibility {
  const first = legs[0];
  const ineligible = (reason: DeskIneligibleReason): DeskPaymentEligibility => ({ eligible: false, reason });

  if (!first) return ineligible("no_arrival_leg");
  const anyArrival = legs.some((l) => l.from.kind === "airport");
  if (!anyArrival) return ineligible("no_arrival_leg");
  if (first.from.kind !== "airport") {
    return legs.some((l) => l.from.id === AIRPORT_DESK_PAYMENT.airportId)
      ? ineligible("first_leg_not_arrival")
      : ineligible("arrival_not_ayt");
  }
  if (first.from.id !== AIRPORT_DESK_PAYMENT.airportId) return ineligible("arrival_not_ayt");
  if (first.to.kind !== "area") return ineligible("arrival_not_to_accommodation");

  return {
    eligible: true,
    collectAtLeg: first.id,
    // One payment on arrival covers the whole booking, return included.
    coversLegs: legs.map((l) => l.id),
    paymentPoint: deskPaymentPoint(arrivalTerminal),
  };
}

export function deskPaymentPoint(terminal: AytTerminal | null): DeskPaymentPoint | null {
  if (!terminal) return null;
  const p = AIRPORT_DESK_PAYMENT.points.find((x) => x.terminal === terminal);
  if (!p) return null;
  return { terminal: p.terminal, label: p.label, desk: p.desk, note: "note" in p ? p.note : undefined };
}

export const DESK_INELIGIBLE_COPY: Record<DeskIneligibleReason, string> = {
  no_arrival_leg:
    "Paying at the airport desk is available for journeys that start with an arrival at Antalya Airport. Journeys to the airport only can’t use it.",
  arrival_not_ayt:
    "Paying at the airport desk is currently available for Antalya Airport (AYT) arrivals only.",
  first_leg_not_arrival:
    "Paying at the airport desk is available when your booking starts with an arrival at Antalya Airport. This itinerary starts with a journey to the airport.",
  arrival_not_to_accommodation:
    "Paying at the airport desk is available for transfers from Antalya Airport to a hotel or accommodation.",
};
