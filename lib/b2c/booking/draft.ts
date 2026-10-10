import { CHILD_AGE_MAX } from "@/lib/b2c/business";
import { accommodationArea, flightRequirements, passengerCounts } from "@/lib/b2c/booking/itinerary";
import type {
  AytTerminal,
  BookingRequest,
  EquipmentId,
  FlightDetails,
  Leg,
  ManifestEntry,
  PaymentMethod,
  ServiceId,
} from "@/lib/b2c/booking/types";
import type { TransferSearch } from "@/lib/b2c/transfer-search";

/**
 * Checkout state between steps. Held in React state and mirrored to
 * sessionStorage (this tab only, cleared when it closes) so a reload does
 * not lose the details. Personal details never go into the URL.
 */
export type BookingDraft = {
  service: ServiceId | null;
  childSeats: number;
  equipment: EquipmentId[];
  notes: string;
  /** Passenger, flight and accommodation fields, keyed by field id. */
  fields: Record<string, string>;
  paymentMethod: PaymentMethod | null;
};

export const EMPTY_DRAFT: BookingDraft = {
  service: null,
  childSeats: 0,
  equipment: [],
  notes: "",
  fields: {},
  paymentMethod: null,
};

export const STEPS = ["transfer", "extras", "details", "review", "payment"] as const;
export type StepId = (typeof STEPS)[number];

export type FieldErrors = Record<string, string>;

export const NOTES_MAX = 300;
const FLIGHT_RE = /^[A-Z0-9]{2}\s?\d{1,4}[A-Z]?$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** A leading + or 00 so the number carries its country code. */
const PHONE_RE = /^(\+|00)[\d\s()-]+$/;

/** Field ids, so the form, validation and request mapping agree. */
export const F = {
  leadFirst: "lead-first",
  leadLast: "lead-last",
  email: "email",
  phone: "phone",
  hotel: "hotel",
  hotelAddress: "hotel-address",
  flight: (key: string, part: "number" | "airline" | "origin" | "date" | "time" | "terminal") => `${key}-${part}`,
  other: (key: string, part: "first" | "last") => `${key}-${part}`,
};

export type OtherPassengerSlot = { key: string; kind: "adult" | "child"; label: string; age: number | null };

export function otherPassengerSlots(s: TransferSearch): OtherPassengerSlot[] {
  return [
    ...Array.from({ length: Math.max(0, s.adults - 1) }, (_, i) => ({
      key: `a${i + 2}`,
      kind: "adult" as const,
      label: `Adult ${i + 2}`,
      age: null,
    })),
    ...s.ages.map((age, i) => ({ key: `c${i + 1}`, kind: "child" as const, label: `Child ${i + 1}`, age })),
  ];
}

/* ------------------------------------------------------------------ */
/* Per-step validation                                                 */
/* ------------------------------------------------------------------ */

export function validateTransfer(d: BookingDraft): FieldErrors {
  return d.service ? {} : { service: "Choose Shared Shuttle or Private Transfer to continue." };
}

export function validateExtras(d: BookingDraft, s: TransferSearch): FieldErrors {
  const e: FieldErrors = {};
  if (d.childSeats > s.children) e.childSeats = "You can request at most one child seat per child.";
  if (d.notes.length > NOTES_MAX) e.notes = `Please keep notes under ${NOTES_MAX} characters.`;
  return e;
}

export function validateDetails(d: BookingDraft, legs: Leg[]): FieldErrors {
  const v = d.fields;
  const e: FieldErrors = {};
  const req = (k: string, msg: string) => {
    if (!v[k]?.trim()) e[k] = msg;
  };
  req(F.leadFirst, "Enter the lead passenger’s first name.");
  req(F.leadLast, "Enter the lead passenger’s last name.");
  if (!v[F.email]?.trim()) e[F.email] = "Enter an email address for the booking.";
  else if (!EMAIL_RE.test(v[F.email].trim())) e[F.email] = "Enter a valid email address.";
  const phone = v[F.phone]?.trim() ?? "";
  if (!phone) e[F.phone] = "Enter a mobile number we can reach on the day.";
  else if (!PHONE_RE.test(phone) || phone.replace(/\D/g, "").length < 8)
    e[F.phone] = "Start with your country code, e.g. +44 7700 900123.";

  for (const f of flightRequirements(legs)) {
    const num = F.flight(f.key, "number");
    if (!v[num]?.trim()) e[num] = "Enter the flight number.";
    else if (!FLIGHT_RE.test(v[num].trim())) e[num] = "Use the airline code and number, e.g. TK 2412.";
    const time = F.flight(f.key, "time");
    if (!v[time]) e[time] = f.kind === "arrival" ? "Enter the scheduled landing time." : "Enter the scheduled departure time.";
    if (f.kind === "departure") {
      const date = F.flight(f.key, "date");
      const flightDate = v[date] || f.legDate;
      // A departure flight is on the transfer day or, for an early
      // morning flight, the day after. Anything else is a typo.
      if (flightDate < f.legDate) e[date] = "The flight can’t be before the transfer date.";
      else if (flightDate > nextDay(f.legDate)) e[date] = "The flight should be on the transfer date or the day after.";
    }
  }
  if (accommodationArea(legs)) req(F.hotel, "Enter the name of your hotel or accommodation.");
  return e;
}

export function validatePayment(d: BookingDraft, deskEligible: boolean): FieldErrors {
  if (!d.paymentMethod) return { payment: "Choose how you would like to pay." };
  if (d.paymentMethod === "airport_desk" && !deskEligible)
    return { payment: "Paying at the airport desk isn’t available for this itinerary." };
  return {};
}

function nextDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + 1);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

/* ------------------------------------------------------------------ */
/* Draft → typed request                                               */
/* ------------------------------------------------------------------ */

const AYT_TERMINALS: AytTerminal[] = ["int_t1", "int_t2", "domestic"];

export function arrivalTerminal(d: BookingDraft, legs: Leg[]): AytTerminal | null {
  const first = flightRequirements(legs).find((f) => f.kind === "arrival" && f.airport.id === "ayt");
  if (!first) return null;
  const t = d.fields[F.flight(first.key, "terminal")] as AytTerminal | undefined;
  return t && AYT_TERMINALS.includes(t) ? t : null;
}

/** Assembles the customer-supplied booking request from the draft. */
export function toBookingRequest(s: TransferSearch, legs: Leg[], d: BookingDraft): BookingRequest | null {
  if (!d.service || !legs.length) return null;
  const v = d.fields;
  const t = (k: string) => (v[k] ?? "").trim();
  const others: ManifestEntry[] = otherPassengerSlots(s).map((o) => ({
    kind: o.kind,
    age: o.age !== null && o.age >= 0 && o.age <= CHILD_AGE_MAX ? o.age : null,
    firstName: t(F.other(o.key, "first")),
    lastName: t(F.other(o.key, "last")),
  }));
  const flights: FlightDetails[] = flightRequirements(legs).map((f) => {
    const terminal = t(F.flight(f.key, "terminal")) as AytTerminal;
    return {
      legId: f.legId,
      kind: f.kind,
      airportId: f.airport.id,
      flightNumber: t(F.flight(f.key, "number")).toUpperCase(),
      airline: t(F.flight(f.key, "airline")),
      origin: f.kind === "arrival" ? t(F.flight(f.key, "origin")) : "",
      scheduledDate: f.kind === "departure" ? t(F.flight(f.key, "date")) || f.legDate : f.legDate,
      scheduledTime: t(F.flight(f.key, "time")),
      terminal: f.airport.id === "ayt" && f.kind === "arrival" && AYT_TERMINALS.includes(terminal) ? terminal : null,
    };
  });
  const area = accommodationArea(legs);
  return {
    service: d.service,
    legs,
    passengers: passengerCounts(s),
    manifest: {
      lead: { firstName: t(F.leadFirst), lastName: t(F.leadLast), email: t(F.email), phone: t(F.phone) },
      others,
    },
    flights,
    accommodation: area ? { areaId: area.id, name: t(F.hotel), addressOrDirections: t(F.hotelAddress) } : null,
    extras: {
      childSeats: d.childSeats,
      equipment: d.equipment,
      operationalNotes: d.notes.trim(),
    },
    paymentMethod: d.paymentMethod,
    quoteRef: null,
  };
}
