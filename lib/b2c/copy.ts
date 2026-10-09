/**
 * Customer-facing copy for the consumer travel pages, English.
 *
 * Kept out of the components so it can move into per-locale dictionaries
 * (de, tr, ru) without restructuring anything: a future
 * `copy.de.ts` exports the same shape. Strings that need values use small
 * functions rather than concatenation inside JSX, because word order
 * differs between languages.
 *
 * House rules for this file: no ratings, awards, fleet numbers,
 * guarantees, prices or policies. Anything that depends on approved
 * business information says so instead of inventing it.
 */

export const NAV = {
  transfers: "Airport Transfers",
  transfersShort: "Transfers",
  tours: "Tours & Experiences",
  toursShort: "Tours",
  destinations: "Destinations",
  partners: "For Partners",
  contact: "Contact",
  cta: "Search Transfers",
  travelGroup: "Travel with us",
  companyGroup: "Company",
  language: "Language",
  languagePlanned: "In preparation",
};

export const PROTOTYPE = {
  banner: "Preview",
  pricing: "Prices are not shown in this preview.",
  booking: "Online booking isn’t open yet. This preview ends at your selection — nothing is reserved or charged.",
  tours: "The experiences below are illustrative examples used to design this page. They are not yet available to book.",
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
};

export const SERVICES = {
  shared: {
    id: "shared" as const,
    name: "Shared Shuttle",
    tagline: "Share the ride, pay per seat.",
    description: "A comfortable, cost-effective way to reach your hotel, travelling with other guests heading the same way.",
    priceBasis: "Price per passenger",
    features: [
      "Priced per passenger",
      "Shared with other travellers",
      "May stop at other hotels on the route",
      "Some waiting time is possible",
    ],
    bestFor: "Solo travellers and couples on a budget",
    details: [
      { term: "Vehicle", detail: "Shared with other guests travelling in the same direction." },
      { term: "Waiting", detail: "The shuttle may wait at the airport for other passengers before leaving." },
      { term: "Stops", detail: "Additional hotel stops along the route are possible, so the journey can take longer than a direct transfer." },
      { term: "Luggage", detail: "Standard luggage allowance per passenger — details to be confirmed with booking terms." },
    ],
  },
  private: {
    id: "private" as const,
    name: "Private Transfer",
    tagline: "Your own vehicle, straight there.",
    description: "A vehicle reserved for you and your group only, taking you directly to your address.",
    priceBasis: "Price per vehicle",
    features: [
      "Priced per vehicle, not per person",
      "Only your party on board",
      "Direct, no other stops",
      "Vehicle matched to passengers and luggage",
    ],
    bestFor: "Families, groups and anyone short on time",
    details: [
      { term: "Vehicle", detail: "Reserved for your party only." },
      { term: "Route", detail: "Direct between your pickup and drop-off, without other stops." },
      { term: "Capacity", detail: "Vehicle size is matched to your passenger count and luggage. Exact vehicle types are confirmed with booking." },
      { term: "Luggage", detail: "Luggage capacity depends on the vehicle — to be confirmed with booking terms." },
    ],
  },
};

export const TRANSFERS = {
  meta: {
    title: "Airport Transfers in Türkiye — Shared Shuttle & Private Transfer | SWT Elite",
    description: "Shared shuttle and private airport transfers between Türkiye’s airports and your hotel, from SWT Elite, a ground transportation operator based in Antalya.",
  },
  hero: {
    eyebrow: "Airport transfers — Türkiye",
    title: ["Travel your way.", "We take care of the rest."],
    body: "Shared shuttles and private transfers between Türkiye’s airports and your hotel — in either direction, arranged by a local operator.",
    imageAlt: "A minibus and a private van waiting at an airport terminal kerb at sunset",
  },
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
      { name: "Search your route", detail: "Airport to hotel, hotel to airport, or both. Tell us when and how many." },
      { name: "Choose your service", detail: "Compare Shared Shuttle and Private Transfer side by side." },
      { name: "Add your details", detail: "Flight number, hotel and contact details, so the transfer is planned around you." },
      { name: "Travel", detail: "Meet your driver at the agreed point and travel on. We take care of the rest." },
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
    title: "A local operator, not a marketplace.",
    items: [
      { name: "Based in Antalya", detail: "The same team that runs ground transportation for travel partners across Türkiye." },
      { name: "Two clear services", detail: "Shared or private, explained plainly, with no hidden categories." },
      { name: "Both directions", detail: "Arrivals and departures, one-way or round trip, in one search." },
      { name: "More than the ride", detail: "Transfers and local experiences, arranged by the same operator." },
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Before you travel.",
    items: [
      {
        q: "What’s the difference between Shared Shuttle and Private Transfer?",
        a: "A Shared Shuttle carries guests from different bookings who are heading the same way. It’s priced per passenger, may wait for other arrivals and may stop at other hotels. A Private Transfer is reserved for your party only, goes directly to your address and is priced per vehicle.",
      },
      {
        q: "Can I book from my hotel to the airport?",
        a: "Yes. Search works in both directions — choose your resort or area as the pickup and the airport as the drop-off.",
      },
      {
        q: "Can I book my arrival and departure together?",
        a: "Yes. Choose Round trip and add the date of your return journey.",
      },
      {
        q: "How much luggage can I bring?",
        a: "Luggage allowance depends on the service and, for private transfers, the vehicle. It will be stated clearly before you book.",
      },
      {
        q: "How do payment and cancellation work?",
        a: "Payment and cancellation terms will be published together with online booking. Nothing in this preview takes payment.",
      },
    ],
  },
  tours: {
    eyebrow: "During your stay",
    title: "Make the most of your stay.",
    body: "Boat days, ancient cities and mountain roads — discover experiences near where you’re staying.",
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
  capacityFor: (n: number) => `Matched to ${n} ${n === 1 ? "passenger" : "passengers"}`,
  luggageTbc: "To be confirmed",
  passengerCapacity: "Passenger capacity",
  luggageCapacity: "Luggage capacity",
  summary: "Your selection",
  change: "Change",
  noSelection: "Select a service to see your summary.",
  continueLater: "Booking opens soon",
  bothLegs: "Applies to both journeys",
  missing: {
    title: "Start with your journey.",
    body: "Tell us where you’re going and we’ll show both transfer options.",
  },
  crossSellEyebrow: "During your stay",
  crossSell: (place: string) => `Staying in ${place}?`,
  crossSellBody: "See experiences you could add to your stay — boat days, old towns and ancient sites nearby.",
  crossSellCta: "Explore experiences",
};

export const TOURS = {
  meta: {
    title: "Tours & Experiences in Türkiye | SWT Elite",
    description: "Discover boat trips, ancient cities, nature days and family activities across Türkiye with SWT Elite.",
  },
  hero: {
    eyebrow: "Tours & Experiences",
    title: ["Discover more", "of Türkiye."],
    body: "Ancient cities by the sea, quiet coves and valleys of stone — the places worth leaving the sun lounger for.",
    cta: "Find an experience",
  },
  featured: {
    eyebrow: "Featured experiences",
    title: "Four days worth planning around.",
    body: "On the water, above the valleys, down the river and along the ancient coast.",
  },
  categories: {
    eyebrow: "Explore by interest",
    title: "What kind of day?",
  },
  discover: {
    eyebrow: "Discover",
    title: "Find an experience",
    search: "Search experiences",
    searchPlaceholder: "Try “boat”, “ancient” or “Kemer”",
    destination: "Destination",
    anyDestination: "All destinations",
    duration: "Duration",
    anyDuration: "Any length",
    category: "Category",
    allCategories: "All",
    results: (n: number) => (n === 1 ? "1 experience" : `${n} experiences`),
    clear: "Clear filters",
    emptyTitle: "Nothing matches those filters.",
    emptyBody: "Try another destination or category, or clear the filters to see everything.",
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
  },
  destinations: {
    eyebrow: "Destinations",
    title: "Where will you be staying?",
    body: "Choose a destination to see experiences nearby.",
    count: (n: number) => (n === 1 ? "1 experience" : `${n} experiences`),
  },
  why: {
    eyebrow: "Why explore with SWT Elite",
    title: "Experiences from the people who move you.",
    body: "We already run ground operations across Türkiye. Tours & Experiences brings that local knowledge to your holiday.",
    items: [
      { name: "Local operator", detail: "Based in Antalya, working on the ground across Türkiye." },
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
        a: "Not yet. This page previews how Tours & Experiences will work. The experiences shown are illustrative examples, and the real programme will be published with booking.",
      },
      {
        q: "What will be included in each experience?",
        a: "Each experience will state its inclusions, exclusions, duration and meeting arrangements before you book.",
      },
      {
        q: "Are experiences suitable for children?",
        a: "Look for the Family Activities category. Suitability details will be listed on every experience.",
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
