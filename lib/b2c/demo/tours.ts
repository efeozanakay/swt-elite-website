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
import type { ImageKey } from "@/lib/b2c/images";

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
  image: ImageKey;
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
    image: "gulet-turquoise-cove",
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
    image: "ancient-coastal-ruins-sunset",
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
    image: "cappadocia-sunrise-balloons",
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
    image: "antalya-kaleici-harbour",
  }),
  tour({
    id: "koprulu-canyon-river",
    title: "Köprülü Canyon Rafting",
    destination: "Antalya",
    category: "nature",
    duration: "full-day",
    summary: "A day in the national park canyon, following the river between steep limestone walls.",
    highlights: ["National park canyon", "Rafting on the river", "Mountain scenery"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Drive into the national park." },
      { label: "Midday", detail: "Time on and beside the river." },
      { label: "Afternoon", detail: "Canyon viewpoints." },
    ]),
    image: "canyon-rafting",
    featured: true,
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
    image: "alanya-castle-marina",
  }),
  tour({
    id: "kemer-family-coves",
    title: "Family Day in the Coves",
    destination: "Kemer",
    category: "family",
    duration: "half-day",
    summary: "An easy-paced boat outing designed around younger travellers and shorter attention spans.",
    highlights: ["Short sailing legs", "Shallow-water swim stop", "Relaxed pace"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Sail", detail: "Short leg along the coast." },
      { label: "Swim", detail: "Shallow bay stop." },
    ]),
    image: "turquoise-cove-resort-town",
  }),
  tour({
    id: "lycian-coast-heritage",
    title: "Lycian Coast & Ancient Harbours",
    destination: "Fethiye",
    category: "sightseeing",
    duration: "full-day",
    summary: "Clifftop ruins, quiet bays and the old trading harbours of the Lycian coast in one long, scenic day.",
    highlights: ["Ancient Lycian sites above the sea", "Coastal viewpoints", "Time by the water"],
    itinerary: SAMPLE_ITINERARY([
      { label: "Morning", detail: "Coastal road and first viewpoints." },
      { label: "Midday", detail: "Ancient site above the bay." },
      { label: "Afternoon", detail: "Harbour stop before heading back." },
    ]),
    image: "lycian-coast-ruins-sunset",
    featured: true,
  }),
];

export const tourById = (id: string | null | undefined) =>
  TOURS.find((t) => t.id === id) ?? null;
