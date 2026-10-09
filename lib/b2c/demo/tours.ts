/**
 * DEMO DATA — prototype only.
 *
 * Illustrative experiences used to design the Tours & Experiences
 * discovery page. None of these is a confirmed product: there is no
 * supplier, schedule, inclusion list, price or availability behind any
 * entry. Itinerary steps are a structural sample that shows how a real
 * itinerary will be laid out, not a description of a real day.
 *
 * Scope, as approved: the first programme is Antalya-only, for guests
 * staying in Antalya and its resorts. Nothing here departs from another
 * city, and trips from Antalya to destinations outside the province are
 * deliberately absent until the real catalogue confirms them.
 *
 * Replace this module with the real catalogue. Components only depend on
 * the `Tour` shape, so the swap does not touch the UI.
 */
import type { ImageKey } from "@/lib/b2c/images";

export type TourCategory = "boat" | "rafting" | "safari" | "culture" | "nature";
export type TourDuration = "half-day" | "full-day";

/** No category has priority; this is display order only. */
export const TOUR_CATEGORIES: { id: TourCategory; label: string; blurb: string }[] = [
  { id: "boat", label: "Boat Excursions", blurb: "Bays, coves and a day on the water." },
  { id: "rafting", label: "Rafting", blurb: "White water in the canyons inland." },
  { id: "safari", label: "Jeep & ATV Safari", blurb: "Off-road tracks into the Taurus foothills." },
  { id: "culture", label: "Culture & Sightseeing", blurb: "Old towns and ancient cities by the sea." },
  { id: "nature", label: "Nature & Outdoors", blurb: "Forests, rivers and coastal paths." },
];

/** Areas within Antalya province where the demo experiences take place. */
export const TOUR_DESTINATIONS = [
  "Antalya City",
  "Kemer",
  "Belek",
  "Side & Manavgat",
  "Alanya",
  "Kaş & Demre",
] as const;
export type TourDestination = (typeof TOUR_DESTINATIONS)[number];

export const DURATION_LABELS: Record<TourDuration, string> = {
  "half-day": "Half day",
  "full-day": "Full day",
};

export type Tour = {
  id: string;
  title: string;
  destination: TourDestination;
  category: TourCategory;
  duration: TourDuration;
  summary: string;
  highlights: string[];
  /** Sample structure only — see the module note. */
  itinerary: { label: string; detail: string }[];
  /** null until real commercial data exists. Rendered as "—". */
  price: null;
  /** Inclusions and exclusions are unknown for every demo entry. */
  inclusions: string[] | null;
  exclusions: string[] | null;
  image: ImageKey;
  /** Overrides the image's default focal point for this card. */
  focus?: string;
  featured?: boolean;
};

const SAMPLE_ITINERARY = (middle: { label: string; detail: string }[]) => [
  { label: "Start", detail: "Hotel pickup or meeting point to be confirmed." },
  ...middle,
  { label: "Return", detail: "Return to your hotel area — arrangements to be confirmed." },
];

const tour = (t: Omit<Tour, "price" | "inclusions" | "exclusions">): Tour => ({
  ...t,
  price: null,
  inclusions: null,
  exclusions: null,
});

export const TOURS: Tour[] = [
  tour({
    id: "kemer-coast-boat-day",
    title: "Kemer Coastline Boat Day",
    destination: "Kemer",
    category: "boat",
    duration: "full-day",
    summary: "A slow day along the pine-backed coves south of Antalya, with time to swim between stops.",
    highlights: ["Bays below the Taurus Mountains", "Swim stops in clear water", "Views back to the coast"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Board and head out along the coastline." },
      { label: "Midday", detail: "Anchor in a bay for swimming." },
      { label: "Afternoon", detail: "Further coves before heading back to harbour." },
    ]),
    image: "gulet-turquoise-cove",
    featured: true,
  }),
  tour({
    id: "koprulu-canyon-rafting",
    title: "Köprülü Canyon Rafting",
    destination: "Side & Manavgat",
    category: "rafting",
    duration: "full-day",
    summary: "A day in the national park canyon, rafting the river between steep limestone walls.",
    highlights: ["National park canyon", "Rafting on the river", "Mountain scenery"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Drive into the national park." },
      { label: "Midday", detail: "Safety briefing and time on the river." },
      { label: "Afternoon", detail: "Canyon viewpoints." },
    ]),
    image: "canyon-rafting",
    featured: true,
  }),
  tour({
    id: "kaleici-old-town-walk",
    title: "Kaleiçi Old Town & Harbour",
    destination: "Antalya City",
    category: "culture",
    duration: "half-day",
    summary: "Narrow lanes, Ottoman houses and the old harbour at the heart of Antalya.",
    highlights: ["Hadrian’s Gate", "Ottoman-era lanes", "The old Roman harbour"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Walk", detail: "Through the old town lanes to the harbour." },
      { label: "Free time", detail: "Time to explore on your own." },
    ]),
    image: "antalya-kaleici-harbour",
    featured: true,
  }),
  tour({
    id: "side-ancient-city-sunset",
    title: "Side Ancient City at Golden Hour",
    destination: "Side & Manavgat",
    category: "culture",
    duration: "half-day",
    summary: "Walk through the ancient city to the temple columns by the sea as the light drops.",
    highlights: ["Temple ruins by the water", "Ancient theatre and colonnaded street", "Harbour at sunset"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Afternoon", detail: "Walk through the ancient city." },
      { label: "Sunset", detail: "Time at the temple ruins by the sea." },
    ]),
    image: "ancient-coastal-ruins-sunset",
    featured: true,
  }),
  tour({
    id: "taurus-jeep-safari",
    title: "Taurus Foothills Jeep Safari",
    destination: "Kemer",
    category: "safari",
    duration: "full-day",
    summary: "Off-road tracks up from the coast into forest villages, with wide views back over the sea.",
    highlights: ["Off-road forest tracks", "Mountain village stop", "Panoramas over the coast"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Convoy up into the foothills." },
      { label: "Midday", detail: "Village stop." },
      { label: "Afternoon", detail: "Viewpoints on the way down." },
    ]),
    image: "turquoise-cove-resort-town",
    focus: "70% 25%",
  }),
  tour({
    id: "alanya-castle-boat",
    title: "Alanya Castle & Coast by Boat",
    destination: "Alanya",
    category: "boat",
    duration: "half-day",
    summary: "See the castle peninsula, sea caves and the Red Tower from the water.",
    highlights: ["Castle peninsula from the sea", "Sea caves", "The Red Tower"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Cruise", detail: "Around the castle peninsula." },
      { label: "Swim stop", detail: "Time in the water if conditions allow." },
    ]),
    image: "alanya-castle-marina",
  }),
  tour({
    id: "demre-kekova",
    title: "Demre, Myra & Kekova",
    destination: "Kaş & Demre",
    category: "culture",
    duration: "full-day",
    summary: "Rock-cut tombs at Myra, then out over the sunken city of Kekova on the Lycian coast.",
    highlights: ["Lycian rock tombs at Myra", "Kekova by boat", "The Lycian coastline"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Coastal road west to Demre." },
      { label: "Midday", detail: "Myra and its theatre." },
      { label: "Afternoon", detail: "Boat over Kekova." },
    ]),
    image: "lycian-coast-ruins-sunset",
  }),
  tour({
    id: "belek-coast-nature",
    title: "Belek Coast & Pine Forest Walk",
    destination: "Belek",
    category: "nature",
    duration: "half-day",
    summary: "An easy walk through the coastal pine forest to the long sandy shore.",
    highlights: ["Coastal pine forest", "Long sandy beach", "Relaxed pace"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Walk", detail: "Through the pine forest to the shore." },
      { label: "Free time", detail: "Time on the beach." },
    ]),
    image: "mediterranean-resort-golden-hour",
  }),
];

export const tourById = (id: string | null | undefined) =>
  TOURS.find((t) => t.id === id) ?? null;
