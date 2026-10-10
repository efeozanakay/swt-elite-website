# B2C transfer booking — frontend data requirements

Status: frontend prototype. No live booking, pricing, payment, reminder or
SWT Port connection exists. This document lists what the consumer pages
need, to support an independent architecture compatibility audit against
SWT Port. It deliberately makes **no** assumptions about SWT Port's
architecture, database or API.

Typed model: `lib/b2c/booking/types.ts`. Rules: `payment-eligibility.ts`,
`draft.ts`, `reminder.ts`. Demo data source: `source.ts`,
`demo/bookings.ts`. Rule checks: `npm run test:rules`.

## Integration boundary

- The browser talks only to this site's own server-side endpoints
  (Cloudflare Pages Functions, as `functions/api/enquiry.ts` does today).
  Those hold any credentials and translate to/from SWT Port.
- The UI depends on the `BookingDataSource` interface; the demo source
  is swapped for a live one without touching components.
- Static export (`output: 'export'`) and the Pages deployment are unchanged.

## 1. Customer-supplied data (`BookingRequest`)

| Area | Fields |
| --- | --- |
| Journey | trip type; pickup and drop-off location ids; outbound date; flight-arrival or pickup time (5-minute grid); return date and time |
| Passengers | adults; children; each child's age (0–11) |
| Service | `shared` or `private` |
| Lead passenger | first name, last name, email, phone with country code |
| Other passengers | first and last name per passenger (optional at booking) |
| Flights, per leg | arrival flight for legs starting at an airport, departure flight for legs ending at one: number, airline (optional), origin (arrivals, optional), scheduled date and local time, AYT arrival terminal (optional: T1 / T2 / domestic) |
| Accommodation | resort area id, accommodation name, address or directions (optional) |
| Extras | child seats (≤ number of children), stroller / wheelchair / golf bag, notes and special requests (≤ 300 characters) |
| Payment method | `airport_desk` (only when eligible) or `online_card` (prototype) |

Personal details are never placed in URLs. In the prototype the draft
lives in React state and `sessionStorage` for the current tab only.

## 2. Data required from the operations backend

- **Routes and locations**: the bookable pickup/drop-off list (the current
  list is demo data).
- **Quotes**: per service and itinerary, with per-leg lines, fare units
  (shuttle: adult / 50% child / free under 3; private: per vehicle),
  currency, total in minor units, a quote reference and expiry. Until
  then every quote is `unavailable` and the UI shows a placeholder.
- **Booking**: reference, `BookingStatus`, created time.
- **Per leg**: `LegOperationalStatus`, pickup (`meets_flight` / `pending`
  / `confirmed` with time, date, location), journey estimate, assigned
  vehicle category, extras confirmation.
- **Payment**: method, `PaymentStatus`, legs covered, amount, desk payment
  point, paid-at time and payment-record reference. `paid` is shown only
  when backed by an authorised payment record.
- **Reconfirmation per leg**: status, requested-at, responded-at, channel.

Statuses are independent fields (booking / payment / reconfirmation /
leg operations), never one combined status.

## 3. Actions the frontend expects a backend to support

1. Get locations and routes.
2. Quote an itinerary for a service.
3. Submit a booking request; receive reference and initial statuses.
4. Issue a secure customer access credential (signed, expiring link token
   and/or authenticated session). A booking reference alone never grants
   access.
5. Get the customer booking view (`CustomerBookingView`) for that credential.
6. Record a passenger reconfirmation for one leg; report a change.
7. Request a change or cancellation (policy in `CANCELLATION`).
8. (Future) Start an online card payment and receive its result via a
   server-side callback; record desk payments from the POS / cash process.
9. (Future) Day-before reminders per leg over email and WhatsApp, using
   the content rules in `reminder.ts`.

## 4. Unresolved fields and decisions

- **Desk eligibility interpretation**: the prototype requires the AYT
  arrival to be the *first* leg. Hotel → AYT → hotel round trips are
  treated as ineligible. Needs confirmation.
- Whether the desk payment point must be known at booking (terminal is
  optional now; all three desks are listed when unknown).
- **Booking status** set: does SWT Port distinguish "requested" from
  "reserved" (instant vs. reviewed confirmation)?
- Currency or currencies, and whether quotes can expire mid-checkout.
- Shuttle fares for return legs: same units each way, or one combined fare?
- Five-passenger private bookings: van or minibus — how and when it is
  confirmed to the customer.
- Pickup time delivery for departures: currently hotel reception; whether
  it is also sent to the customer directly.
- Journey duration: source and whether it is ever shown before travel.
- Passenger names: required at booking or later? Reconfirmation per
  booking vs. per leg on the backend side.
- Unanswered reconfirmation (`no_response`): operational policy is
  undefined. Nothing is cancelled automatically.
- Whether flight departure date can differ from transfer date by more
  than one day.
- Equipment details (wheelchair type, golf bag count) — structured fields
  or free text.

## 5. Security and operational dependencies

- No SWT Port URL, credential or internal API is referenced in the
  repository; all integration goes through server-side functions with
  secrets in Cloudflare environment variables.
- Customer access requires an unguessable, expiring token or an
  authenticated session; rate-limit and log access; never expose personal
  data from a reference number.
- Payment: a gateway and PCI scope review are needed before any online
  card payment. No card data is collected today. Desk payments must be
  recorded by operations before a booking shows as paid.
- Reminders: notification consent, WhatsApp Business / email provider
  approval, templates, retry and delivery tracking need separate review.
- Wheelchair-accessible vehicles, child seats and equipment must be
  confirmed by operations; the UI never promises them.
- Final booking terms and legal text must be published before booking and
  payment open (`CANCELLATION.legalNote`).
- Airport meeting points and desk numbers come from operations
  (`lib/b2c/airport-meeting.ts`, `AIRPORT_DESK_PAYMENT`).
