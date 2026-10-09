import manifest from "@/public/images/b2c/manifest.json";

/**
 * Supplied imagery for the consumer travel pages.
 *
 * Each entry pairs a responsive asset (see scripts/generate-b2c-images.mjs)
 * with its alt text and a default focal point. The focal point is what
 * object-position keeps in frame when a container crops the image to a
 * different aspect, so it is set per image rather than left at centre.
 *
 * Alt text describes what is in the picture. It does not claim a
 * picture shows an SWT Elite vehicle, tour or departure.
 */
export type ImageKey = keyof typeof manifest;

export const IMAGES: Record<ImageKey, { alt: string; focus: string }> = {
  "airport-transfer-sunset": {
    alt: "A minibus and a private van at an airport terminal kerb at sunset, with an aircraft climbing overhead",
    focus: "62% 70%",
  },
  "lycian-coast-ruins-sunset": {
    alt: "Ancient columns above a turquoise bay on the Lycian coast at sunset, with a gulet sailing below",
    focus: "60% 55%",
  },
  "antalya-kaleici-harbour": {
    alt: "Antalya’s old harbour below the stone walls of Kaleiçi, with the Taurus Mountains behind",
    focus: "55% 50%",
  },
  "mediterranean-resort-golden-hour": {
    alt: "A long beach and pine-backed resort with a golf course at golden hour",
    focus: "55% 55%",
  },
  "ancient-coastal-ruins-sunset": {
    alt: "Ancient temple columns on a rocky Mediterranean shore at sunset",
    focus: "72% 55%",
  },
  "alanya-castle-marina": {
    alt: "Alanya’s castle peninsula and marina at golden hour",
    focus: "45% 50%",
  },
  "turquoise-cove-resort-town": {
    alt: "A turquoise cove and resort town beneath steep mountains at sunset",
    focus: "50% 60%",
  },
  "cappadocia-sunrise-balloons": {
    alt: "Hot-air balloons rising over Cappadocia’s fairy chimneys at sunrise",
    focus: "60% 45%",
  },
  "gulet-turquoise-cove": {
    alt: "A wooden gulet anchored in a clear turquoise cove with swimmers nearby",
    focus: "55% 60%",
  },
  "canyon-rafting": {
    alt: "A raft on a turquoise river between limestone canyon walls",
    focus: "45% 70%",
  },
};

export const imageMeta = (key: ImageKey) =>
  (manifest as Record<string, { width: number; height: number; widths: number[] }>)[key];
