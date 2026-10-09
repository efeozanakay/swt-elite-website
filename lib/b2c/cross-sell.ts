import type { TourDestination } from "@/lib/b2c/demo/tours";
import type { ImageKey } from "@/lib/b2c/images";

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
