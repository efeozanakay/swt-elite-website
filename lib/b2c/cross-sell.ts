import type { TourDestination } from "@/lib/b2c/demo/tours";
import type { ImageKey } from "@/lib/b2c/images";

/**
 * Which tour destination to suggest for a transfer's resort end.
 * A plain lookup on purpose: contextual links, not a recommendation
 * engine. The tours programme is Antalya-only, so resorts outside the
 * province (Fethiye, Bodrum, Cappadocia…) get no suggestion.
 */
const NEAREST: Record<string, TourDestination> = {
  "antalya-centre": "Antalya City",
  lara: "Antalya City",
  kundu: "Antalya City",
  konyaalti: "Antalya City",
  belek: "Belek",
  side: "Side & Manavgat",
  manavgat: "Side & Manavgat",
  alanya: "Alanya",
  mahmutlar: "Alanya",
  kemer: "Kemer",
  tekirova: "Kemer",
  kas: "Kaş & Demre",
};

export const tourDestinationFor = (locationId: string) => NEAREST[locationId] ?? null;

/**
 * Contextual image for the resort end of a journey, used as a quiet
 * backdrop on the results page. Regions without a supplied image fall
 * back to none rather than to a picture of somewhere else.
 */
const AREA_IMAGE: Record<string, ImageKey> = {
  belek: "mediterranean-resort-golden-hour",
  lara: "mediterranean-resort-golden-hour",
  kundu: "mediterranean-resort-golden-hour",
  "antalya-centre": "antalya-kaleici-harbour",
  konyaalti: "antalya-kaleici-harbour",
  side: "ancient-coastal-ruins-sunset",
  manavgat: "ancient-coastal-ruins-sunset",
  alanya: "alanya-castle-marina",
  mahmutlar: "alanya-castle-marina",
  kemer: "turquoise-cove-resort-town",
  tekirova: "turquoise-cove-resort-town",
  kas: "lycian-coast-ruins-sunset",
  fethiye: "lycian-coast-ruins-sunset",
  oludeniz: "lycian-coast-ruins-sunset",
  gocek: "gulet-turquoise-cove",
  dalyan: "lycian-coast-ruins-sunset",
  goreme: "cappadocia-sunrise-balloons",
  urgup: "cappadocia-sunrise-balloons",
  uchisar: "cappadocia-sunrise-balloons",
};

export const areaImageFor = (locationId: string) => AREA_IMAGE[locationId] ?? null;
