/**
 * Frontend data model for transfer booking.
 *
 * These types describe what the consumer pages need to show and collect.
 * They are NOT a description of SWT Port, the separately maintained
 * operations platform: its architecture, database and API are unknown to
 * this repository and nothing here assumes them. When an integration is
 * designed, a server-side adapter maps between these shapes and whatever
 * SWT Port exposes; the browser never talks to SWT Port directly.
 *
 * Conventions
 * - Statuses are closed unions, never free strings, and each concern has
 *   its own field. Booking, payment, passenger reconfirmation and the
 *   operational state of each leg change independently: a booking can be
 *   reserved, unpaid and already reconfirmed; a paid return leg can still
 *   have its pickup time pending.
 * - Anything the operations team decides (pickup time, vehicle, journey
 *   duration) is modelled as "pending" until a backend supplies it. The
 *   frontend never computes or guesses those values.
 * - Money is integer minor units with an explicit currency, so a total is
 *   never the product of floating-point arithmetic in the browser.
 *
 * See docs/b2c-integration-requirements.md for which fields are
 * customer-supplied, which must come from a backend, and which are still
 * undecided.
 */

import type { TransferLocation } from "@/lib/b2c/demo/locations";

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

/** The two consumer services. There are no other tiers. */
export type ServiceId = "shared" | "private";

/** Operational vehicle bands, from lib/b2c/business.ts. Informational
 *  for the customer; the actual vehicle is assigned by operations. */
export type VehicleBandId = "van" | "minibus" | "midibus" | "bus";

/* ------------------------------------------------------------------ */
/* Route and legs                                                      */
/* ------------------------------------------------------------------ */

/** "out" is the first journey; "ret" exists only on a round trip. */
export type LegId = "out" | "ret";

/** Whether a leg collects passengers off a flight, takes them to one, or
 *  neither (airport-to-airport is technically both; see `Leg`). */
export type LegDirection = "arrival" | "departure" | "airport_to_airport";

export type Leg = {
  id: LegId;
  from: TransferLocation;
  to: TransferLocation;
  /** ISO date (YYYY-MM-DD) of the transfer. */
  date: string;
  /** Flight arrival time (from an airport) or requested pickup time (from
   *  an accommodation), HH:MM on a 5-minute grid, or "" when not given. */
  time: string;
  direction: LegDirection;
};

/* ------------------------------------------------------------------ */
/* Passengers                                                          */
/* ------------------------------------------------------------------ */

export type PassengerCounts = {
  adults: number;
  children: number;
  /** One age (0-11) per child, in the order entered. */
  childAges: number[];
};

/** Shared Shuttle fare categories. Private Transfer has no per-person
 *  fare, so these are only used for the shuttle. */
export type FareCategory = "adult" | "child_half" | "infant_free";

export type LeadPassenger = {
  firstName: string;
  lastName: string;
  email: string;
  /** E.164-like, with country code, as typed by the customer. */
  phone: string;
};

export type ManifestEntry = {
  kind: "adult" | "child";
  /** Children only. */
  age: number | null;
  firstName: string;
  lastName: string;
};

export type PassengerManifest = {
  lead: LeadPassenger;
  /** Everyone other than the lead passenger. Names are optional at
   *  booking time and may be completed later. */
  others: ManifestEntry[];
};

/* ------------------------------------------------------------------ */
/* Flights and accommodation                                           */
/* ------------------------------------------------------------------ */

/** Antalya Airport terminals with distinct meeting and payment points. */
export type AytTerminal = "int_t1" | "int_t2" | "domestic";

export type FlightDetails = {
  legId: LegId;
  kind: "arrival" | "departure";
  /** Airport id from the location list (e.g. "ayt"). */
  airportId: string;
  flightNumber: string;
  airline: string;
  /** Arrivals: the city flown in from. Departures: unused. */
  origin: string;
  /** ISO date of the scheduled flight. For a departure this can be the
   *  day after the transfer (an early-morning flight). */
  scheduledDate: string;
  /** Scheduled local time, HH:MM. */
  scheduledTime: string;
  /** AYT arrivals only; null when the customer is not sure yet. */
  terminal: AytTerminal | null;
};

export type Accommodation = {
  /** The resort area chosen in the search. */
  areaId: string;
  name: string;
  addressOrDirections: string;
};

/* ------------------------------------------------------------------ */
/* Extras                                                              */
/* ------------------------------------------------------------------ */

export type EquipmentId = "stroller" | "wheelchair" | "golf";

/** Every extra is a request. None is guaranteed until operations
 *  confirm it, and a wheelchair-accessible vehicle is never promised. */
export type ExtrasRequest = {
  childSeats: number;
  equipment: EquipmentId[];
  /** Free text for the operations team. */
  operationalNotes: string;
};

export type ExtraConfirmation = "requested" | "confirmed" | "unavailable";

/* ------------------------------------------------------------------ */
/* Quotes                                                              */
/* ------------------------------------------------------------------ */

export type CurrencyCode = "EUR" | "GBP" | "USD" | "TRY";

/** Integer minor units (cents, pence, kuruş). */
export type Money = { amountMinor: number; currency: CurrencyCode };

export type QuoteLine = {
  legId: LegId;
  basis: "per_passenger" | "per_vehicle";
  /** Shuttle: one entry per fare category in use. Private: one vehicle. */
  units: { label: string; quantity: number; unitPrice: Money | null }[];
  subtotal: Money | null;
};

/**
 * A price for one service on one itinerary. Only a backend can produce a
 * "quoted" value; until one exists every quote is "unavailable" and the
 * UI shows a placeholder, never an invented amount.
 */
export type Quote =
  | { status: "unavailable"; service: ServiceId; reason: "no_pricing_source" | "route_not_priced" }
  | {
      status: "quoted";
      service: ServiceId;
      /** Opaque reference the backend uses to honour the price. */
      quoteRef: string;
      lines: QuoteLine[];
      total: Money;
      /** ISO timestamp after which the quote must be refreshed. */
      validUntil: string;
    };

/* ------------------------------------------------------------------ */
/* Payment                                                             */
/* ------------------------------------------------------------------ */

/** "online_card" has no gateway yet and exists as a prototype option. */
export type PaymentMethod = "airport_desk" | "online_card";

/** Where an airport-desk payment is taken. */
export type DeskPaymentPoint = {
  terminal: AytTerminal;
  label: string;
  /** e.g. "Desk 44". */
  desk: string;
  /** Extra instruction (domestic arrivals are escorted to Desk 44). */
  note?: string;
};

export type DeskIneligibleReason =
  | "no_arrival_leg"
  | "arrival_not_ayt"
  | "first_leg_not_arrival"
  | "arrival_not_to_accommodation";

export type DeskPaymentEligibility =
  | {
      eligible: true;
      /** The AYT arrival leg at which payment is collected. */
      collectAtLeg: LegId;
      /** Every leg the single desk payment covers. */
      coversLegs: LegId[];
      /** Known only when the customer has given their arrival terminal. */
      paymentPoint: DeskPaymentPoint | null;
    }
  | { eligible: false; reason: DeskIneligibleReason };

/**
 * Payment status, independent of booking status. "paid" is set ONLY
 * when the backend has recorded an authorised payment (a desk POS or
 * cash receipt, or a gateway capture). The frontend never sets it.
 */
export type PaymentStatus =
  | "not_selected"
  | "unpaid"
  | "paid"
  | "refund_pending"
  | "refunded";

export type PaymentInfo = {
  method: PaymentMethod | null;
  status: PaymentStatus;
  /** Legs this payment covers. A round trip paid at the AYT desk on
   *  arrival lists both legs, so the return is never charged again. */
  coversLegs: LegId[];
  amount: Money | null;
  /** Desk payments only. */
  paymentPoint: DeskPaymentPoint | null;
  /** Set by the backend from the authorised payment record. */
  paidAt: string | null;
  /** Backend payment-record reference, opaque to the frontend. */
  paymentRecordRef: string | null;
};

/* ------------------------------------------------------------------ */
/* Booking, legs and operations                                        */
/* ------------------------------------------------------------------ */

/** Commercial state of the booking as a whole. */
export type BookingStatus =
  /** Submitted, awaiting operations review (not yet guaranteed). */
  | "requested"
  /** Accepted by operations; the transfer is held for the customer. */
  | "reserved"
  | "cancelled"
  | "completed";

/** Operational state of one leg. */
export type LegOperationalStatus =
  | "awaiting_assignment"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

/** Pickup details are supplied by operations, never derived here. */
export type PickupDetails =
  /** Arrival legs: the driver or shuttle meets the flight, which is
   *  monitored, so there is no fixed clock time to publish. */
  | { status: "meets_flight" }
  /** Time not yet set by operations. */
  | { status: "pending"; expectedChannel: "hotel_reception" | "email" | "message" | null }
  | { status: "confirmed"; time: string; date: string; location: string; confirmedAt: string };

export type JourneyEstimate =
  | { status: "unavailable" }
  | { status: "estimated"; minutes: number; source: "operations" };

/** Passenger reconfirmation for one leg. Separate from payment. */
export type ReconfirmationStatus =
  /** Not yet asked (more than a day out, or reminders not running). */
  | "not_requested"
  /** Reminder sent; awaiting the passenger. */
  | "requested"
  | "confirmed"
  /** Reminder sent, no answer. What happens next is an unresolved
   *  operational policy; nothing is cancelled automatically. */
  | "no_response"
  /** The passenger reported a change; operations follow up. */
  | "change_requested";

export type Reconfirmation = {
  status: ReconfirmationStatus;
  requestedAt: string | null;
  respondedAt: string | null;
  /** Channel the reminder went out on, once there is one. */
  channel: "email" | "whatsapp" | "sms" | null;
};

/** Customer-facing view of one leg, as My Transfer renders it. */
export type BookingLegView = {
  leg: Leg;
  flight: FlightDetails | null;
  accommodation: Accommodation | null;
  pickup: PickupDetails;
  journey: JourneyEstimate;
  operationalStatus: LegOperationalStatus;
  reconfirmation: Reconfirmation;
  /** Vehicle category once operations assign it; never guessed. */
  vehicleCategory: string | null;
};

/**
 * Everything My Transfer shows. A backend produces this for an
 * authenticated customer (signed-in session or protected access token);
 * it is never fetched by a guessable booking number alone.
 */
export type CustomerBookingView = {
  reference: string;
  status: BookingStatus;
  service: ServiceId;
  createdAt: string;
  passengers: PassengerCounts;
  lead: LeadPassenger;
  legs: BookingLegView[];
  extras: ExtrasRequest & { confirmation: ExtraConfirmation };
  payment: PaymentInfo;
  specialRequests: string;
};

/* ------------------------------------------------------------------ */
/* Booking request (what the customer submits)                         */
/* ------------------------------------------------------------------ */

/**
 * The customer-supplied part of a booking, assembled by the checkout.
 * Nothing in it is decided by operations. This is what a future submit
 * action would send to a server-side endpoint (never to SWT Port
 * directly from the browser).
 */
export type BookingRequest = {
  service: ServiceId;
  legs: Leg[];
  passengers: PassengerCounts;
  manifest: PassengerManifest;
  flights: FlightDetails[];
  accommodation: Accommodation | null;
  extras: ExtrasRequest;
  paymentMethod: PaymentMethod | null;
  /** Quote the customer saw, so the backend can honour or re-price it. */
  quoteRef: string | null;
};
