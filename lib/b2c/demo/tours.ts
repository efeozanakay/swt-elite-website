/**
 * DEMO DATA — prototype only.
 *
 * Illustrative experiences used to design the Tours & Experiences
 * discovery page. None of these is a confirmed product: there is no
 * supplier, schedule, inclusion list, price or availability behind any
 * entry. Itinerary steps are a structural sample that shows how a real
 * itinerary will be laid out, not a description of a real day.
 *
 * Replace this module with the real catalogue. Components only depend on
 * the `Tour` shape, so the swap does not touch the UI.
 */
import type { SceneKind, SceneTone } from "@/lib/b2c/scenes";

export type TourCategory = "boat" | "culture" | "nature" | "family" | "sightseeing";
export type TourDuration = "half-day" | "full-day";

export const TOUR_CATEGORIES: { id: TourCategory; label: string; blurb: string }[] = [
  { id: "boat", label: "Boat Trips & Sea", blurb: "Bays, coves and a day on the water." },
  { id: "culture", label: "City & Culture", blurb: "Old towns, ancient cities and local life." },
  { id: "nature", label: "Nature & Adventure", blurb: "Canyons, rivers and mountain roads." },
  { id: "family", label: "Family Activities", blurb: "Easy-going days that work for all ages." },
  { id: "sightseeing", label: "Sightseeing", blurb: "The views and landmarks worth the trip." },
];

export const TOUR_DESTINATIONS = [
  "Antalya",
  "Kemer",
  "Side",
  "Alanya",
  "Fethiye",
  "Cappadocia",
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
  scene: { kind: SceneKind; tone: SceneTone; seed: number };
  featured?: boolean;
};

const SAMPLE_ITINERARY = (middle: { label: string; detail: string }[]) => [
  { label: "Start", detail: "Meeting or pickup point to be confirmed." },
  ...middle,
  { label: "Return", detail: "Return arrangements to be confirmed." },
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
    scene: { kind: "boat", tone: "day", seed: 11 },
    featured: true,
  }),
  tour({
    id: "side-ancient-city-sunset",
    title: "Side Ancient City at Golden Hour",
    destination: "Side",
    category: "culture",
    duration: "half-day",
    summary: "Walk through the ancient city to the temple columns by the sea as the light drops.",
    highlights: ["Temple of Apollo by the water", "Ancient theatre and colonnaded street", "Harbour at sunset"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Afternoon", detail: "Walk through the ancient city." },
      { label: "Sunset", detail: "Time at the temple ruins by the sea." },
    ]),
    scene: { kind: "ruins", tone: "dusk", seed: 4 },
    featured: true,
  }),
  tour({
    id: "cappadocia-valleys",
    title: "Cappadocia Valleys & Viewpoints",
    destination: "Cappadocia",
    category: "sightseeing",
    duration: "full-day",
    summary: "Fairy chimneys, rock-cut churches and the viewpoints over Göreme’s valleys.",
    highlights: ["Fairy chimney landscapes", "Valley walks and viewpoints", "Rock-cut architecture"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Viewpoints above the valleys." },
      { label: "Midday", detail: "Short valley walk." },
      { label: "Afternoon", detail: "Rock-cut sites and village stop." },
    ]),
    scene: { kind: "valley", tone: "dawn", seed: 7 },
    featured: true,
  }),
  tour({
    id: "kaleici-old-town-walk",
    title: "Kaleiçi Old Town Walk",
    destination: "Antalya",
    category: "culture",
    duration: "half-day",
    summary: "Narrow lanes, Ottoman houses and the old harbour at the heart of Antalya.",
    highlights: ["Hadrian’s Gate", "Ottoman-era lanes", "The old Roman harbour"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Walk", detail: "Through the old town lanes to the harbour." },
      { label: "Free time", detail: "Time to explore on your own." },
    ]),
    scene: { kind: "oldtown", tone: "dusk", seed: 21 },
  }),
  tour({
    id: "koprulu-canyon-river",
    title: "Köprülü Canyon River Day",
    destination: "Antalya",
    category: "nature",
    duration: "full-day",
    summary: "A day in the national park canyon, following the river between steep limestone walls.",
    highlights: ["National park canyon", "River activities", "Mountain scenery"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Drive into the national park." },
      { label: "Midday", detail: "Time on and beside the river." },
      { label: "Afternoon", detail: "Canyon viewpoints." },
    ]),
    scene: { kind: "canyon", tone: "day", seed: 15 },
  }),
  tour({
    id: "taurus-mountain-roads",
    title: "Taurus Mountain Roads",
    destination: "Kemer",
    category: "nature",
    duration: "full-day",
    summary: "Leave the coast behind for mountain villages, forest roads and wide views over the sea.",
    highlights: ["Mountain villages", "Forest tracks", "Panoramas over the coast"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Climb into the mountains." },
      { label: "Midday", detail: "Village stop." },
    ]),
    scene: { kind: "mountains", tone: "day", seed: 33 },
  }),
  tour({
    id: "alanya-harbour-castle",
    title: "Alanya Harbour & Castle Cruise",
    destination: "Alanya",
    category: "boat",
    duration: "half-day",
    summary: "See the castle peninsula, sea caves and the Red Tower from the water.",
    highlights: ["Castle peninsula from the sea", "Sea caves", "The Red Tower"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Cruise", detail: "Around the castle peninsula." },
      { label: "Swim stop", detail: "Time in the water if conditions allow." },
    ]),
    scene: { kind: "coast", tone: "day", seed: 9 },
  }),
  tour({
    id: "duden-waterfalls",
    title: "Düden Waterfalls & City Panorama",
    destination: "Antalya",
    category: "sightseeing",
    duration: "half-day",
    summary: "The waterfalls that drop straight into the Mediterranean, and the cliffs above the city.",
    highlights: ["Waterfalls over the sea cliffs", "Park walk", "City viewpoints"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Waterfalls", detail: "Upper and lower falls." },
      { label: "Viewpoint", detail: "Cliffs above the city." },
    ]),
    scene: { kind: "waterfall", tone: "day", seed: 5 },
  }),
  tour({
    id: "side-family-beach-boat",
    title: "Family Day on the Water",
    destination: "Side",
    category: "family",
    duration: "half-day",
    summary: "An easy-paced boat outing designed around younger travellers and shorter attention spans.",
    highlights: ["Short sailing legs", "Shallow-water swim stop", "Relaxed pace"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Sail", detail: "Short leg along the coast." },
      { label: "Swim", detail: "Shallow bay stop." },
    ]),
    scene: { kind: "boat", tone: "dawn", seed: 27 },
  }),
  tour({
    id: "oludeniz-butterfly-valley",
    title: "Ölüdeniz & Butterfly Valley",
    destination: "Fethiye",
    category: "boat",
    duration: "full-day",
    summary: "The famous lagoon, then along the cliffs to the valley that opens onto its own beach.",
    highlights: ["Blue Lagoon views", "Butterfly Valley beach", "Swim stops"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Depart from Ölüdeniz." },
      { label: "Midday", detail: "Butterfly Valley." },
      { label: "Afternoon", detail: "Coves on the way back." },
    ]),
    scene: { kind: "coast", tone: "dawn", seed: 41 },
  }),
  tour({
    id: "fethiye-family-day",
    title: "Fethiye Old Town & Market Day",
    destination: "Fethiye",
    category: "family",
    duration: "half-day",
    summary: "Harbour-front walk, the old town and time at the local market — gentle and flexible.",
    highlights: ["Harbour promenade", "Old town lanes", "Local market"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Walk", detail: "Harbour and old town." },
      { label: "Market", detail: "Free time." },
    ]),
    scene: { kind: "oldtown", tone: "day", seed: 12 },
  }),
  tour({
    id: "perge-aspendos",
    title: "Perge & Aspendos Ancient Sites",
    destination: "Antalya",
    category: "culture",
    duration: "full-day",
    summary: "Two of the region’s great ancient sites in one day, including the theatre at Aspendos.",
    highlights: ["Aspendos theatre", "Perge colonnaded street", "Roman aqueduct"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Perge." },
      { label: "Afternoon", detail: "Aspendos." },
    ]),
    scene: { kind: "ruins", tone: "day", seed: 18 },
  }),
];

export const tourById = (id: string | null | undefined) =>
  TOURS.find((t) => t.id === id) ?? null;
