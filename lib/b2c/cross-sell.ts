import type { TourDestination } from "@/lib/b2c/demo/tours";

/**
 * Which tour destination to suggest for a transfer's resort end.
 * A plain lookup on purpose: contextual links, not a recommendation
 * engine. Areas with no demo experiences nearby get no suggestion.
 */
const NEAREST: Record<string, TourDestination> = {
  "antalya-centre": "Antalya",
  lara: "Antalya",
  kundu: "Antalya",
  konyaalti: "Antalya",
  belek: "Antalya",
  side: "Side",
  manavgat: "Side",
  alanya: "Alanya",
  mahmutlar: "Alanya",
  kemer: "Kemer",
  tekirova: "Kemer",
  fethiye: "Fethiye",
  oludeniz: "Fethiye",
  gocek: "Fethiye",
  goreme: "Cappadocia",
  urgup: "Cappadocia",
  uchisar: "Cappadocia",
};

export const tourDestinationFor = (locationId: string) => NEAREST[locationId] ?? null;
