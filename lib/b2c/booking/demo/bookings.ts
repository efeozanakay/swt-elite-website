/**
 * DEMO DATA — fictional bookings for designing My Transfer.
 *
 * No entry is a real reservation, passenger or payment. Names, contact
 * details, flight numbers and references are placeholders, and the
 * reference format is not the real one. Pickup times, journey durations
 * and vehicles are left in their pending states on purpose: those values
 * come from operations and are never invented, even for a demo.
 *
 * Dates are relative to the day the page is viewed so the scenarios
 * (a reminder for tomorrow, a return after a paid arrival) stay current.
 */
import { locationById, type TransferLocation } from "@/lib/b2c/demo/locations";
import { toISODate } from "@/lib/b2c/locale";
import { directionOf } from "@/lib/b2c/booking/itinerary";
import { deskPaymentPoint } from "@/lib/b2c/booking/payment-eligibility";
import type { BookingLegView, CustomerBookingView, Leg, LegId } from "@/lib/b2c/booking/types";

const loc = (id: string) => locationById(id) as TransferLocation;

const day = (today: Date, offset: number) =>
  toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset));

const leg = (id: LegId, from: string, to: string, date: string, time: string): Leg => ({
  id,
  from: loc(from),
  to: loc(to),
  date,
  time,
  direction: directionOf(loc(from), loc(to)),
});

const DEMO_LEAD = {
  firstName: "Demo",
  lastName: "Passenger",
  email: "demo.passenger@example.com",
  phone: "+00 000 000 0000",
};

const pendingLeg = (l: Leg, extra: Partial<BookingLegView> = {}): BookingLegView => ({
  leg: l,
  flight: null,
  accommodation: null,
  pickup: l.direction === "arrival" ? { status: "meets_flight" } : { status: "pending", expectedChannel: "hotel_reception" },
  journey: { status: "unavailable" },
  operationalStatus: "awaiting_assignment",
  reconfirmation: { status: "not_requested", requestedAt: null, respondedAt: null, channel: null },
  vehicleCategory: null,
  ...extra,
});

export function demoBookings(today: Date) {
  const nowISO = today.toISOString();

  /* 1. Reminder for tomorrow: reserved, pay at desk, not yet paid. */
  const b1Out = leg("out", "ayt", "belek", day(today, 1), "14:35");
  const b1Ret = leg("ret", "belek", "ayt", day(today, 8), "");
  const reminderTomorrow: CustomerBookingView = {
    reference: "DEMO-A1",
    status: "reserved",
    service: "private",
    createdAt: day(today, -20),
    passengers: { adults: 2, children: 1, childAges: [5] },
    lead: DEMO_LEAD,
    legs: [
      pendingLeg(b1Out, {
        flight: {
          legId: "out", kind: "arrival", airportId: "ayt", flightNumber: "XX 1234", airline: "Demo Air", origin: "Demo City",
          scheduledDate: b1Out.date, scheduledTime: "14:35", terminal: "int_t1",
        },
        accommodation: { areaId: "belek", name: "Demo Resort Hotel", addressOrDirections: "" },
        reconfirmation: { status: "requested", requestedAt: nowISO, respondedAt: null, channel: "email" },
      }),
      pendingLeg(b1Ret, {
        flight: {
          legId: "ret", kind: "departure", airportId: "ayt", flightNumber: "XX 1235", airline: "Demo Air", origin: "",
          scheduledDate: b1Ret.date, scheduledTime: "18:10", terminal: null,
        },
        accommodation: { areaId: "belek", name: "Demo Resort Hotel", addressOrDirections: "" },
      }),
    ],
    extras: { childSeats: 1, equipment: ["stroller"], operationalNotes: "", confirmation: "requested" },
    payment: {
      method: "airport_desk", status: "unpaid", coversLegs: ["out", "ret"], amount: null,
      paymentPoint: deskPaymentPoint("int_t1"), paidAt: null, paymentRecordRef: null,
    },
    specialRequests: "",
  };

  /* 2. Arrival paid at the desk; return reminder must not ask for money. */
  const b2Out = leg("out", "ayt", "side", day(today, -6), "10:20");
  const b2Ret = leg("ret", "side", "ayt", day(today, 1), "");
  const paidReturn: CustomerBookingView = {
    reference: "DEMO-B2",
    status: "reserved",
    service: "shared",
    createdAt: day(today, -30),
    passengers: { adults: 2, children: 0, childAges: [] },
    lead: DEMO_LEAD,
    legs: [
      pendingLeg(b2Out, {
        flight: {
          legId: "out", kind: "arrival", airportId: "ayt", flightNumber: "XX 2201", airline: "Demo Air", origin: "Demo City",
          scheduledDate: b2Out.date, scheduledTime: "10:20", terminal: "int_t2",
        },
        accommodation: { areaId: "side", name: "Demo Seaside Hotel", addressOrDirections: "" },
        operationalStatus: "completed",
        reconfirmation: { status: "confirmed", requestedAt: day(today, -7), respondedAt: day(today, -7), channel: "email" },
      }),
      pendingLeg(b2Ret, {
        flight: {
          legId: "ret", kind: "departure", airportId: "ayt", flightNumber: "XX 2202", airline: "Demo Air", origin: "",
          scheduledDate: b2Ret.date, scheduledTime: "16:45", terminal: null,
        },
        accommodation: { areaId: "side", name: "Demo Seaside Hotel", addressOrDirections: "" },
        reconfirmation: { status: "requested", requestedAt: nowISO, respondedAt: null, channel: "whatsapp" },
      }),
    ],
    extras: { childSeats: 0, equipment: ["golf"], operationalNotes: "", confirmation: "requested" },
    payment: {
      method: "airport_desk", status: "paid", coversLegs: ["out", "ret"], amount: null,
      paymentPoint: deskPaymentPoint("int_t2"), paidAt: day(today, -6), paymentRecordRef: "DEMO-PAYMENT-RECORD",
    },
    specialRequests: "",
  };

  /* 3. Reserved, unpaid and already reconfirmed: independent statuses. */
  const b3Out = leg("out", "ayt", "alanya", day(today, 3), "21:50");
  const reconfirmedUnpaid: CustomerBookingView = {
    reference: "DEMO-C3",
    status: "reserved",
    service: "shared",
    createdAt: day(today, -10),
    passengers: { adults: 1, children: 2, childAges: [2, 9] },
    lead: DEMO_LEAD,
    legs: [
      pendingLeg(b3Out, {
        flight: {
          legId: "out", kind: "arrival", airportId: "ayt", flightNumber: "XX 3307", airline: "Demo Air", origin: "Demo City",
          scheduledDate: b3Out.date, scheduledTime: "21:50", terminal: "domestic",
        },
        accommodation: { areaId: "alanya", name: "Demo Apartments", addressOrDirections: "Demo street address" },
        reconfirmation: { status: "confirmed", requestedAt: day(today, -1), respondedAt: day(today, -1), channel: "email" },
      }),
    ],
    extras: { childSeats: 1, equipment: [], operationalNotes: "", confirmation: "requested" },
    payment: {
      method: "airport_desk", status: "unpaid", coversLegs: ["out"], amount: null,
      paymentPoint: deskPaymentPoint("domestic"), paidAt: null, paymentRecordRef: null,
    },
    specialRequests: "",
  };

  return [
    {
      id: "reminder",
      label: "Reminder for tomorrow",
      description: "Round trip, pay at the AYT desk, arrival reconfirmation requested.",
      booking: reminderTomorrow,
    },
    {
      id: "paid-return",
      label: "Paid on arrival, return tomorrow",
      description: "Both journeys paid at the desk; the return reminder asks for no payment.",
      booking: paidReturn,
    },
    {
      id: "reconfirmed-unpaid",
      label: "Reconfirmed, not yet paid",
      description: "Reserved, unpaid and already reconfirmed — independent statuses.",
      booking: reconfirmedUnpaid,
    },
  ];
}
