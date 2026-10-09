/**
 * Customer-facing copy for the consumer travel pages, English.
 *
 * Kept out of the components so it can move into per-locale dictionaries
 * (de, tr, ru) without restructuring anything: a future
 * `copy.de.ts` exports the same shape. Strings that need values use small
 * functions rather than concatenation inside JSX, because word order
 * differs between languages.
 *
 * House rules: no ratings, awards, fleet numbers, customer counts,
 * guarantees or prices. Operational and policy facts come from
 * lib/b2c/business.ts, which holds only what SWT Elite has approved.
 */
import {
  CANCELLATION,
  DEPARTURE_PICKUP,
  FLIGHT_MONITORING,
  MAX_GROUP,
  PRIVATE_RULES,
  SHARED_RULES,
  SUPPORT,
  TEAM_EXPERIENCE,
} from "@/lib/b2c/business";

export { NAV } from "@/lib/b2c/copy-nav";
import { NAV } from "@/lib/b2c/copy-nav";

export const PROTOTYPE = {
  banner: "Preview",
  pricing: "Prices are not shown in this preview.",
  booking: "Online booking isn’t open yet. This preview ends at your selection — nothing is reserved, sent or charged.",
  tours: "The experiences below are illustrative examples used to design this page. They are not yet available to book.",
  imagery: "Images are illustrative and do not show a specific SWT ELITE departure or location.",
};

export const PRICE_PLACEHOLDER = "—";

export const SEARCH = {
  heading: "Find your transfer",
  oneWay: "One-way",
  roundTrip: "Round trip",
  tripLegend: "Journey type",
  from: "From",
  fromPlaceholder: "Airport, resort or area",
  to: "To",
  toPlaceholder: "Airport, resort or area",
  swap: "Swap pickup and drop-off",
  date: "Date",
  returnDate: "Return date",
  returnTime: "Return pickup",
  timeOptional: "Optional",
  passengers: "Passengers",
  adults: "Adults",
  adultsHint: "Age 12+",
  children: "Children",
  childrenHint: "Age 0–11",
  childAge: (n: number) => `Age of child ${n}`,
  childAgePlaceholder: "Age",
  childAgeOption: (age: number) => (age === 0 ? "Under 1" : `${age} ${age === 1 ? "year" : "years"}`),
  childAgesHint: "Children’s ages are needed for shuttle fares and child seats.",
  done: "Done",
  submit: "Search Transfers",
  update: "Update Search",
  noMatches: "No matching places in this preview.",
  airportGroup: "Airports",
  areaGroup: "Resorts & areas",
  hotelHint: "Choose the resort or area. Your exact hotel or address is added when you book.",
  errorSummary: (n: number) =>
    n === 1 ? "One detail needs attention." : `${n} details need attention.`,
  increase: (what: string) => `Add one ${what}`,
  decrease: (what: string) => `Remove one ${what}`,
  groupLimit: `For groups over ${MAX_GROUP}, contact us at ${SUPPORT.email}.`,
};

export const SERVICES = {
  shared: {
    id: "shared" as const,
    name: "Shared Shuttle",
    tagline: "Share the ride, pay per seat.",
    description: "A cost-effective way to reach your hotel, travelling with other guests heading the same way.",
    priceBasis: "Price per passenger",
    features: [
      "Priced per passenger, with child fares",
      "Shared with other travellers; hotel stops on the way",
      "Waits up to 60 minutes after you check in at our desk",
      "One suitcase per passenger",
    ],
    bestFor: "Solo travellers and couples on a budget",
    details: [
      { term: "Waiting", detail: SHARED_RULES.waiting },
      { term: "Stops", detail: "The shuttle may stop at other hotels on the route, so the journey can take longer than a direct transfer." },
      { term: "Luggage", detail: SHARED_RULES.luggage },
      { term: "Children", detail: "Under 3 travel free. Ages 3 to 11 pay 50% of the adult fare. From 12, the adult fare applies." },
      { term: "Child seats", detail: SHARED_RULES.childSeats },
      { term: "Special items", detail: SHARED_RULES.declarations },
      { term: "Flight monitoring", detail: FLIGHT_MONITORING },
    ],
  },
  private: {
    id: "private" as const,
    name: "Private Transfer",
    tagline: "Your own vehicle, straight there.",
    description: "A vehicle reserved for your party only, taking you directly to your address.",
    priceBasis: "Price per vehicle",
    features: [
      "One price per vehicle, not per person",
      "Only your party on board",
      "Direct to your address, no other stops",
      "Vehicle matched to your group and luggage",
    ],
    bestFor: "Families, groups and anyone short on time",
    details: [
      { term: "Vehicle", detail: "A Mercedes Vito-type van is the standard vehicle for up to five passengers. Larger groups travel by minibus, midibus or coach." },
      { term: "Route", detail: "Direct between your pickup and drop-off, without other stops." },
      { term: "Children", detail: `${PRIVATE_RULES.pricing} Every passenger, including infants, counts towards the vehicle’s capacity.` },
      { term: "Child seats", detail: PRIVATE_RULES.childSeats },
      { term: "Luggage", detail: PRIVATE_RULES.luggage },
      { term: "Flight monitoring", detail: FLIGHT_MONITORING },
    ],
  },
};

export const MEETING = {
  eyebrow: "At the airport",
  title: "Where we meet you.",
  body: "Both Shared Shuttle and Private Transfer use the same meeting point at each airport.",
  airport: "Airport",
  terminal: "Arriving at",
  unknown: "Meeting point details for this airport are confirmed with your booking.",
  resultsTitle: (airport: string) => `Meeting point at ${airport}`,
};

export const SUPPORT_COPY = {
  eyebrow: "Help",
  title: "Two ways to reach us.",
  general: "General questions",
  generalBody: "Questions before you travel, changes and anything else that isn’t urgent.",
  emergency: "24/7 emergency transfer assistance",
  emergencyBody: "For urgent help on the day of your transfer — for example if you can’t find your driver. Not for bookings or general questions.",
};

export const TRANSFERS = {
  meta: {
    title: "Airport Transfers in Türkiye — Shared Shuttle & Private Transfer | SWT Elite",
    description: "Shared shuttle and private airport transfers between Türkiye’s airports and your hotel, from SWT ELITE, a TÜRSAB-licensed travel agency based in Antalya.",
  },
  hero: {
    eyebrow: "Airport transfers — Türkiye",
    title: ["Travel your way.", "We take care of the rest."],
    body: "Shared shuttles and private transfers between Türkiye’s airports and your hotel — in either direction, arranged by a local operator.",
    imageAlt: "Illustrative image: a minibus and a private van at an airport terminal kerb at sunset",
  },
  assurances: [
    "Free cancellation up to 24 hours before pickup",
    "Real-time flight monitoring",
    "24/7 emergency transfer assistance",
  ],
  compare: {
    eyebrow: "Two ways to travel",
    title: "Shared or private. Choose what suits the trip.",
    body: "Every journey is one of two services. No tiers to decode — just a clear difference in how you travel and how it’s priced.",
    bestFor: "Best for",
  },
  how: {
    eyebrow: "How it works",
    title: "From arrivals to your door.",
    steps: [
      { name: "Search your route", detail: "Airport to hotel, hotel to airport, or both. Tell us when and who’s travelling." },
      { name: "Choose your service", detail: "Compare Shared Shuttle and Private Transfer side by side." },
      { name: "Add your details", detail: "Flight number, hotel and any child seats or special items, so the transfer is planned around you." },
      { name: "Meet us at the airport", detail: "Check in at the SWT ELITE desk or meet our representative, depending on the airport. We monitor your flight." },
    ],
  },
  destinations: {
    eyebrow: "Popular routes",
    title: "From Antalya Airport.",
    body: "Pick a destination to start your search with the route already filled in.",
    cta: (place: string) => `Search transfers to ${place}`,
    note: "Journey times vary with traffic and season, and are shown when booking opens.",
  },
  why: {
    eyebrow: "Why SWT Elite",
    title: "A licensed local operator.",
    body: TEAM_EXPERIENCE,
    items: [
      { name: "Real-time flight monitoring", detail: FLIGHT_MONITORING },
      { name: "24/7 emergency assistance", detail: "An emergency transfer line for urgent help on the day you travel." },
      { name: "Established airport reception", detail: "An SWT ELITE desk or a representative at the airports we serve, with set meeting procedures." },
      { name: "Free cancellation", detail: "Cancel at least 24 hours before pickup for a full refund." },
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Before you travel.",
    items: [
      {
        q: "What’s the difference between Shared Shuttle and Private Transfer?",
        a: "A Shared Shuttle carries guests from different bookings heading the same way. It’s priced per passenger and may stop at other hotels. A Private Transfer is reserved for your party only, goes directly to your address and is priced per vehicle.",
      },
      {
        q: "How long does the shuttle wait at the airport?",
        a: `${SHARED_RULES.waiting} The wait is counted from check-in at the desk, not from when your flight lands.`,
      },
      {
        q: "What if my flight is delayed?",
        a: `${FLIGHT_MONITORING} A delay to a flight we are monitoring is not treated as a no-show.`,
      },
      {
        q: "How much luggage can I bring?",
        a: `On the Shared Shuttle, ${SHARED_RULES.luggage.toLowerCase()} On a Private Transfer, luggage capacity depends on the vehicle assigned to your group. Please declare a baby stroller, wheelchair or golf bag when booking.`,
      },
      {
        q: "Do children pay?",
        a: "On the Shared Shuttle, children under 3 travel free, ages 3 to 11 pay 50% of the adult fare, and from 12 the adult fare applies. A Private Transfer has one price per vehicle, so children don’t have a separate fare. Child seats can be requested free of charge on both, subject to confirmation.",
      },
      {
        q: "How do I find my pickup time for the journey back to the airport?",
        a: DEPARTURE_PICKUP,
      },
      {
        q: "Can I cancel or change my transfer?",
        a: `${CANCELLATION.headline} Within 24 hours of pickup there is no standard refund, though exceptional circumstances are reviewed individually. Changes made at least 24 hours ahead carry no change fee, subject to availability; a different route or vehicle may change the price. On a round trip, each journey is assessed against its own pickup time.`,
      },
      {
        q: "Who do I contact if something goes wrong on the day?",
        a: `Call our 24/7 emergency transfer line on ${SUPPORT.emergencyPhone}. For anything that isn’t urgent, email ${SUPPORT.email}.`,
      },
    ],
  },
  tours: {
    eyebrow: "During your stay",
    title: "Make the most of your stay.",
    body: "Boat days, rafting, ancient sites and mountain roads around Antalya.",
    cta: "Explore Tours & Experiences",
  },
};

export const RESULTS = {
  meta: {
    title: "Transfer Options | SWT Elite",
    description: "Compare Shared Shuttle and Private Transfer options for your journey.",
  },
  eyebrow: "Your transfer",
  title: "Choose your transfer",
  outbound: "Outbound",
  return: "Return",
  edit: "Edit search",
  closeEdit: "Close",
  passengers: (a: number, c: number) =>
    [`${a} ${a === 1 ? "adult" : "adults"}`, c ? `${c} ${c === 1 ? "child" : "children"}` : ""]
      .filter(Boolean)
      .join(", "),
  timeTbc: "Time to be added",
  select: "Select",
  selected: "Selected",
  details: "Service details",
  hideDetails: "Hide details",
  seatsFor: (n: number) => `${n} ${n === 1 ? "seat" : "seats"} in a shared vehicle`,
  childFareNote: (free: number, half: number) =>
    [free ? `${free} under 3 free` : "", half ? `${half} at 50% child fare` : ""].filter(Boolean).join(", "),
  luggageShared: (n: number) => `${n} ${n === 1 ? "suitcase" : "suitcases"} (one per passenger)`,
  luggagePrivate: "Depends on the vehicle",
  waiting: "Up to 60 min after desk check-in",
  direct: "Direct, no other stops",
  vehicle: "Usual vehicle",
  seats: "Seats",
  luggage: "Luggage",
  journey: "Journey",
  summary: "Your selection",
  change: "Change",
  noSelection: "Select a service to see your summary.",
  continueLater: "Booking opens soon",
  bothLegs: "Applies to both journeys",
  cancellation: CANCELLATION.headline,
  legalNote: CANCELLATION.legalNote,
  departureNote: DEPARTURE_PICKUP,
  missing: {
    title: "Start with your journey.",
    body: "Tell us where you’re going and we’ll show both transfer options.",
  },
  invalid: {
    title: "This journey needs a few changes.",
    body: "Fix the details below to compare transfer options.",
    blocked: "Fix your journey details above to compare and select a service.",
  },
  crossSellEyebrow: "During your stay",
  crossSell: (place: string) => `Staying in ${place}?`,
  crossSellBody: "See experiences you could add to your stay — boat days, rafting and ancient sites around Antalya.",
  crossSellCta: "Explore experiences",
};

/** The booking-details step on the results page. A prototype: it
 *  validates and shows a review, and says plainly that nothing is sent. */
export const BOOKING = {
  step: "Next step",
  title: "Booking details",
  start: "Add booking details",
  prototype:
    "Prototype: you can fill in and check these details, but nothing is sent, stored or reserved. Online booking is not open yet.",
  lead: "Lead passenger",
  leadHint: "The person we contact about this booking and on the day of travel.",
  emailHint: "Booking confirmation will be sent here once online booking opens.",
  phoneHint: "With country code. Our team uses it if your flight or pickup changes.",
  others: "Other passengers",
  othersHint: "Names help the driver and desk team check everyone in. You can add them later.",
  under3: "Travels free on Shared Shuttle",
  child: "Child fare on Shared Shuttle",
  agesNote: "Children’s ages come from your search. To change an age, edit the search above.",
  flights: "Flight details",
  flightsHint:
    "We monitor arrival flights in real time and adjust the pickup if your flight is early or late. For departures, the flight time is used to plan your hotel pickup.",
  arrival: "Arrival flight",
  departure: "Departure flight",
  departureTimeHint: "Scheduled time shown on your ticket.",
  hotel: "Hotel details",
  hotelHint: (area: string) => `Where you are staying in ${area}. The exact name helps the driver find the right entrance.`,
  requests: "Requests for our operations team",
  seatsHint: "Free of charge, subject to confirmation.",
  notesHint: "Optional. For example, the size of a wheelchair or golf bag, or anything the driver should know.",
  review: "Review details",
  reviewTitle: "Your details — not sent",
  notSent:
    `Nothing has been sent or booked. When online booking opens, this is the point where you would confirm and pay. Until then, contact ${SUPPORT.email} to arrange a transfer.`,
};

export const TOURS = {
  meta: {
    title: "Tours & Experiences in Antalya | SWT Elite",
    description: "Boat trips, rafting, jeep safaris, cultural sightseeing and nature days around Antalya — a preview of SWT ELITE Tours & Experiences.",
  },
  hero: {
    eyebrow: "Tours & Experiences — Antalya",
    title: ["Discover more", "of Antalya."],
    body: "Boat days on the coast, rafting in the canyons, ancient cities by the sea — the days worth leaving the sun lounger for.",
    cta: "Find an experience",
  },
  featured: {
    eyebrow: "Featured experiences",
    title: "Four ways to spend a day.",
    body: "On the water, down the river, in the old town and among the ruins.",
  },
  categories: {
    eyebrow: "Explore by interest",
    title: "What kind of day?",
  },
  discover: {
    eyebrow: "Discover",
    title: "Find an experience",
    search: "Search experiences",
    searchPlaceholder: "Try “boat”, “rafting” or “Kemer”",
    destination: "Area",
    anyDestination: "All of Antalya",
    duration: "Duration",
    anyDuration: "Any length",
    category: "Category",
    allCategories: "All",
    results: (n: number) => (n === 1 ? "1 experience" : `${n} experiences`),
    clear: "Clear filters",
    emptyTitle: "Nothing matches those filters.",
    emptyBody: "Try another area or category, or clear the filters to see everything.",
    view: "View details",
    priceLabel: "From",
  },
  preview: {
    overview: "Overview",
    highlights: "Highlights",
    itinerary: "Sample itinerary structure",
    itineraryNote: "Shows how a day will be laid out. Not a confirmed schedule.",
    included: "Included",
    excluded: "Not included",
    tbc: "To be confirmed with the final itinerary.",
    duration: "Duration",
    durationNote: "Exact times to be confirmed",
    price: "Price",
    close: "Close",
    status: "Prototype preview — this experience is an illustrative example and can’t be booked yet.",
    transfer: "Need a transfer to your hotel first?",
    imageNote: "Illustrative image",
  },
  destinations: {
    eyebrow: "Areas",
    title: "Where will you be staying?",
    body: "The first programme is based around Antalya. Choose your area to see experiences nearby.",
    count: (n: number) => (n === 1 ? "1 experience" : `${n} experiences`),
  },
  why: {
    eyebrow: "Why explore with SWT Elite",
    title: "Experiences from the people who move you.",
    body: "We already run ground operations from our Antalya base. Tours & Experiences brings that local knowledge to your holiday.",
    items: [
      { name: "Licensed local operator", detail: "SWT ELITE TOURISM is a TÜRSAB-licensed travel agency based in Antalya." },
      { name: "Clear before you choose", detail: "Every experience will list what’s included, what isn’t and how the day runs." },
      { name: "Transfers in the same place", detail: "Arrive, get to your hotel and plan your days with one operator." },
    ],
    imageAlt: "An SWT Elite team member briefing a group of travellers beside a coach",
  },
  faq: {
    eyebrow: "Questions",
    title: "Good to know.",
    items: [
      {
        q: "Can I book these experiences now?",
        a: "Not yet. This page previews how Tours & Experiences will work. The experiences shown are illustrative examples; the real programme, prices and availability will be published with booking.",
      },
      {
        q: "Where do experiences start?",
        a: "The first programme is focused on Antalya and the resorts around it. Trips further afield are not part of it until they are confirmed.",
      },
      {
        q: "What will be included in each experience?",
        a: "Each experience will state its inclusions, exclusions, duration and meeting arrangements before you book.",
      },
    ],
  },
  transfer: {
    eyebrow: "Getting there",
    title: "Need an airport transfer?",
    body: "Shared shuttle or private transfer between the airport and your hotel.",
    cta: "Search Transfers",
  },
};

export const FOOTER_TRAVEL = {
  title: "Travel",
  links: [
    { label: NAV.transfers, href: "/transfers" },
    { label: NAV.tours, href: "/tours" },
  ],
};

export const HOME_TRAVEL_BAND = {
  eyebrow: "Travelling yourself?",
  body: "Airport transfers and experiences for holidaymakers, from the same team.",
};
