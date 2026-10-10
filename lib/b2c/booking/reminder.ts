import type { CustomerBookingView, LegId } from "@/lib/b2c/booking/types";

/**
 * Content for the planned day-before reminder, per leg.
 *
 * Nothing here schedules or sends anything: there is no scheduler, email
 * or WhatsApp integration, and no credentials. This only decides what a
 * reminder for one leg should say, so the rules are fixed before the
 * automation is built:
 *
 * - Reconfirmation is separate from payment, and each leg of a round
 *   trip is reconfirmed on its own.
 * - Payment is mentioned only when it is genuinely outstanding for this
 *   leg. A return already covered by a payment taken at the airport desk
 *   is never asked to pay again.
 * - The link is a placeholder for a secure, expiring access link that a
 *   backend would issue. A booking reference alone never grants access.
 *
 * Consent, templates, retries, delivery tracking and what to do about an
 * unanswered reminder are open decisions (see the integration document).
 */
export type ReminderContent = {
  legId: LegId;
  subject: string;
  lines: string[];
  /** What the payment line says, for display and for tests. */
  payment: "none" | "pay_at_desk" | "already_paid" | "online_unavailable";
  cta: string;
};

export function reminderFor(b: CustomerBookingView, legId: LegId): ReminderContent | null {
  const view = b.legs.find((l) => l.leg.id === legId);
  if (!view) return null;
  const { leg } = view;
  const covered = b.payment.coversLegs.includes(legId);

  let payment: ReminderContent["payment"] = "none";
  if (covered && b.payment.status === "paid") payment = "already_paid";
  else if (covered && b.payment.method === "airport_desk" && b.payment.status === "unpaid") {
    // Desk payments are collected on arrival, so only the arrival leg
    // carries the instruction; a return covered by the same payment does
    // not ask again.
    payment = leg.direction === "arrival" ? "pay_at_desk" : "none";
  } else if (covered && b.payment.method === "online_card" && b.payment.status === "unpaid") {
    payment = "online_unavailable";
  }

  const pickup =
    view.pickup.status === "confirmed"
      ? `Pickup: ${view.pickup.time} at ${view.pickup.location}.`
      : view.pickup.status === "meets_flight"
        ? "We monitor your flight and meet you on arrival."
        : "Your pickup time has not been set yet. It will be shared with you once confirmed.";

  const lines = [
    "Your transfer is scheduled for tomorrow. Please review your details and confirm your transfer using the link below.",
    `${leg.from.name} → ${leg.to.name}`,
    pickup,
  ];
  if (payment === "pay_at_desk") {
    const where = b.payment.paymentPoint ? `${b.payment.paymentPoint.desk}, ${b.payment.paymentPoint.label}` : "the SWT ELITE desk";
    lines.push(`Payment is due at ${where} on arrival, by cash or card.`);
  }
  if (payment === "already_paid") lines.push("This journey is already paid. No payment is needed.");

  return { legId, subject: "Your transfer tomorrow — please confirm", lines, payment, cta: "Review and confirm my transfer" };
}
