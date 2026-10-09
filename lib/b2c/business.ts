/**
 * Approved operational and commercial facts for the consumer pages.
 *
 * Everything in this file was supplied and approved by SWT Elite. It is
 * the single place those facts live, so copy and components quote it
 * rather than restating it. Do not add anything here that has not been
 * approved: an unsupported promise in this file becomes a promise on
 * every page that reads it.
 */

export const SUPPORT = {
  email: "info@swtelite.com",
  /** Emergency / on-trip assistance only. Not a sales or general line. */
  emergencyPhone: "+90 549 180 72 17",
  emergencyTel: "+905491807217",
};

/**
 * As shown on the TÜRSAB agency identification plaque and the matching
 * published TÜRSAB record. The licence status must be re-checked against
 * the live registry before launch; this file cannot do that.
 *
 * `verifyUrl` is the TÜRSAB home page, not a deep link: the agency
 * verification page's exact address could not be confirmed from the
 * build environment, and a guessed URL would be worse than a general one.
 */
export const LICENCE = {
  agencyName: "SWT ELITE TOURISM",
  legalName: "SAFE WINGS TURİZM TİCARET LİMİTED ŞİRKETİ",
  tursabNo: "17600",
  line: "TÜRSAB Licensed Travel Agency · Licence No. 17600",
  verifyUrl: "https://www.tursab.org.tr/",
  verifyLabel: "Verify with TÜRSAB",
};

export const TEAM_EXPERIENCE =
  "Our team includes travel and transportation professionals with over 20 years of industry experience.";

export const FLIGHT_MONITORING =
  "We monitor your flight’s arrival status and adjust transfer arrangements in case of delays.";

export const CANCELLATION = {
  headline: "Free cancellation up to 24 hours before pickup.",
  points: [
    "Cancel at least 24 hours before your scheduled pickup for a full refund.",
    "Within 24 hours of pickup there is no standard refund; exceptional circumstances are reviewed individually.",
    "Changes requested at least 24 hours before pickup carry no change fee, subject to availability and operational approval. A different route or vehicle may involve a price difference.",
    "If your flight is delayed and we are monitoring it, that delay is not treated as a no-show.",
    "On a round trip, each journey is assessed against its own pickup time.",
  ],
  /** The policy is approved commercially; its legal text is not final. */
  legalNote: "Full booking terms will be published before online booking and payment open.",
};

/** Shared Shuttle child fares. Private Transfer is priced per vehicle. */
export const CHILD_FARES = [
  { band: "Under 3", rule: "Free" },
  { band: "Age 3 to 11", rule: "50% of the adult fare" },
  { band: "Age 12 and over", rule: "Adult fare" },
];

export const CHILD_AGE_MAX = 11;

export const SHARED_RULES = {
  waiting:
    "The shuttle waits up to 60 minutes after passengers check in at the SWT ELITE airport transfer desk.",
  luggage: "One suitcase per passenger.",
  childSeats: "Child seats can be requested free of charge, subject to confirmation.",
  declarations: "Please declare a baby stroller, wheelchair or golf bag when booking so it can be planned for.",
};

export const PRIVATE_RULES = {
  pricing: "One price per vehicle. Children are included and do not have a separate fare.",
  luggage: "Luggage capacity depends on the vehicle assigned to your group.",
  childSeats: "Child seats can be requested free of charge, subject to confirmation.",
};

/**
 * Operational vehicle bands. Internal categories: the consumer choice is
 * always Shared Shuttle vs Private Transfer, and this only informs the
 * line that says which kind of vehicle a private group usually gets.
 * Every passenger, infants included, counts towards capacity.
 */
export const VEHICLE_BANDS = [
  { id: "van", label: "Mercedes Vito-type van", min: 1, max: 5 },
  { id: "minibus", label: "Minibus", min: 5, max: 10 },
  { id: "midibus", label: "Midibus", min: 11, max: 18 },
  { id: "bus", label: "Coach", min: 19, max: 45 },
] as const;

export const MAX_GROUP = 45;

export function privateVehicleFor(passengers: number): { label: string; note: string } {
  if (passengers === 5) {
    return {
      label: "Mercedes Vito-type van or minibus",
      note: "For five passengers the vehicle depends on your luggage and is confirmed with booking.",
    };
  }
  const band = VEHICLE_BANDS.find((b) => passengers >= b.min && passengers <= b.max);
  if (!band) {
    return { label: "Group transport", note: `For groups over ${MAX_GROUP}, contact us and we will plan it with you.` };
  }
  return { label: band.label, note: "Final vehicle assignment is confirmed with booking." };
}

export const DEPARTURE_PICKUP =
  "For journeys to the airport, your pickup time is emailed to your hotel’s reception desk, and reception can give it to you.";

export const EQUIPMENT_OPTIONS = [
  { id: "stroller", label: "Baby stroller" },
  { id: "wheelchair", label: "Wheelchair" },
  { id: "golf", label: "Golf bag" },
] as const;

export const EQUIPMENT_NOTE =
  "Requests are reviewed by our operations team and confirmed with your booking. A wheelchair-accessible vehicle can’t be promised until it has been confirmed.";
