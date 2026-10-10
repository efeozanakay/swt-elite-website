import type { CustomerBookingView, Leg, PassengerCounts, Quote, ServiceId } from "@/lib/b2c/booking/types";
import { demoBookings } from "@/lib/b2c/booking/demo/bookings";

/**
 * Where the booking pages get data the customer does not supply.
 *
 * The UI depends on this interface only. Today the single implementation
 * is the demo source below: it has no prices and no real bookings. A
 * future implementation calls this site's own server-side endpoint (a
 * Cloudflare Pages Function), which holds the credentials and talks to
 * the operations platform. The browser never calls SWT Port directly, and
 * no SWT Port URL appears in this repository.
 */
export interface BookingDataSource {
  readonly kind: "demo" | "live";
  quote(service: ServiceId, legs: Leg[], passengers: PassengerCounts): Quote;
  /** Demo only. A live source resolves bookings from an authenticated
   *  session or a protected access token, never from a reference alone. */
  demoBookings(today: Date): { id: string; label: string; description: string; booking: CustomerBookingView }[];
}

export const demoSource: BookingDataSource = {
  kind: "demo",
  // No pricing source exists yet, so every quote is unavailable and the
  // UI shows a placeholder instead of an invented amount.
  quote: (service) => ({ status: "unavailable", service, reason: "no_pricing_source" }),
  demoBookings,
};

export const bookingSource: BookingDataSource = demoSource;
