import { tourDestinationFor } from "@/lib/b2c/cross-sell";
import { locationById } from "@/lib/b2c/demo/locations";
import { TOURS, type Tour, type TourDestination } from "@/lib/b2c/demo/tours";

/**
 * Post-booking "Explore your destination" content, by resort area.
 *
 * Modular on purpose: each kind of recommendation is a module with its
 * own resolver. Tours are the only module in this phase. Dining, local
 * attractions and other services are roadmap items and deliberately not
 * implemented; adding one means adding a member to the union and a
 * resolver, without touching the booking flow.
 *
 * Coverage follows the tours programme: Antalya province only. Areas
 * outside it return nothing rather than an invented inventory.
 */
export type DiscoveryModule = { kind: "tours"; destination: TourDestination; items: Tour[] };

export type Discovery = {
  /** The customer's own resort area, e.g. "Belek". */
  place: string;
  modules: DiscoveryModule[];
};

export function discoveryFor(areaId: string | null | undefined, limit = 3): Discovery | null {
  const area = locationById(areaId);
  if (!area || area.kind !== "area") return null;
  const destination = tourDestinationFor(area.id);
  if (!destination) return null;
  const items = TOURS.filter((t) => t.destination === destination).slice(0, limit);
  if (!items.length) return null;
  return { place: area.name, modules: [{ kind: "tours", destination, items }] };
}
