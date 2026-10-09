import manifest from "@/public/images/b2c/manifest.json";

/**
 * Supplied imagery for the consumer travel pages.
 *
 * Each entry pairs a responsive asset (see scripts/generate-b2c-images.mjs)
 * with its alt text and a default focal point. The focal point is what
 * object-position keeps in frame when a container crops the image to a
 * different aspect, so it is set per image rather than left at centre.
 *
 * These are AI-generated, provisional design images supplied for the
 * prototype, not documentary photographs. Alt text therefore opens with
 * "Illustrative image" and never claims a picture shows a real SWT
 * Elite vehicle, tour, departure or a specific real view. Replace with
 * licensed or own photography before commercial launch.
 */
export type ImageKey = keyof typeof manifest;

export const IMAGES: Record<ImageKey, { alt: string; focus: string }> = {
  "airport-transfer-sunset": {
    alt: "Illustrative image: a minibus and a private van at an airport terminal kerb at sunset, with an aircraft climbing overhead",
    focus: "62% 70%",
  },
  "lycian-coast-ruins-sunset": {
    alt: "Illustrative image: ancient columns above a turquoise bay on the Lycian coast at sunset, with a gulet sailing below",
    focus: "60% 55%",
  },
  "antalya-kaleici-harbour": {
    alt: "Illustrative image: antalya’s old harbour below the stone walls of Kaleiçi, with the Taurus Mountains behind",
    focus: "55% 50%",
  },
  "mediterranean-resort-golden-hour": {
    alt: "Illustrative image: a long beach and pine-backed resort with a golf course at golden hour",
    focus: "55% 55%",
  },
  "ancient-coastal-ruins-sunset": {
    alt: "Illustrative image: ancient temple columns on a rocky Mediterranean shore at sunset",
    focus: "72% 55%",
  },
  "alanya-castle-marina": {
    alt: "Illustrative image: alanya’s castle peninsula and marina at golden hour",
    focus: "45% 50%",
  },
  "turquoise-cove-resort-town": {
    alt: "Illustrative image: a turquoise cove and resort town beneath steep mountains at sunset",
    focus: "50% 60%",
  },
  "cappadocia-sunrise-balloons": {
    alt: "Illustrative image: hot-air balloons rising over Cappadocia’s fairy chimneys at sunrise",
    focus: "60% 45%",
  },
  "gulet-turquoise-cove": {
    alt: "Illustrative image: a wooden gulet anchored in a clear turquoise cove with swimmers nearby",
    focus: "55% 60%",
  },
  /** A crop of airport-transfer-sunset on the minibus alone, for the
   *  Shared Shuttle card. Replaced the fleet car-park photo, whose dense
   *  rows of small vehicles aliased into a pixelated look at card size
   *  and did not read as a shuttle. */
  "shuttle-minibus-airport": {
    alt: "Illustrative image: a white minibus at an airport terminal at sunset",
    focus: "42% 55%",
  },
  "canyon-rafting": {
    alt: "Illustrative image: a raft on a turquoise river between limestone canyon walls",
    focus: "45% 70%",
  },
};

export const imageMeta = (key: ImageKey) =>
  (manifest as Record<string, { width: number; height: number; widths: number[] }>)[key];
