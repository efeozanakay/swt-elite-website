import type {
  BookingStatus,
  ExtraConfirmation,
  LegOperationalStatus,
  PaymentMethod,
  PaymentStatus,
  ReconfirmationStatus,
} from "@/lib/b2c/booking/types";

/** Tone drives the badge colour only; the label always says the state. */
export type Tone = "neutral" | "pending" | "positive" | "attention";

type Label = { label: string; tone: Tone; detail?: string };

export const BOOKING_STATUS: Record<BookingStatus, Label> = {
  requested: { label: "Requested", tone: "pending", detail: "Our operations team is reviewing your booking." },
  reserved: { label: "Reserved", tone: "positive", detail: "Your transfer is reserved." },
  cancelled: { label: "Cancelled", tone: "attention" },
  completed: { label: "Completed", tone: "neutral" },
};

export const PAYMENT_METHOD: Record<PaymentMethod, string> = {
  airport_desk: "Pay at the airport desk",
  online_card: "Online card payment",
};

export const PAYMENT_STATUS: Record<PaymentStatus, Label> = {
  not_selected: { label: "Not selected", tone: "neutral" },
  unpaid: { label: "Not yet paid", tone: "pending" },
  paid: { label: "Paid", tone: "positive" },
  refund_pending: { label: "Refund in progress", tone: "pending" },
  refunded: { label: "Refunded", tone: "neutral" },
};

export const RECONFIRMATION: Record<ReconfirmationStatus, Label> = {
  not_requested: { label: "Not requested yet", tone: "neutral", detail: "We’ll ask you to confirm the day before this journey." },
  requested: { label: "Please confirm", tone: "attention", detail: "Let us know you’re still travelling." },
  confirmed: { label: "Confirmed by you", tone: "positive" },
  no_response: { label: "Awaiting your reply", tone: "attention", detail: "We haven’t heard back yet. Please confirm or contact us." },
  change_requested: { label: "Change requested", tone: "pending", detail: "Our team will contact you about the change." },
};

export const LEG_STATUS: Record<LegOperationalStatus, Label> = {
  awaiting_assignment: { label: "Vehicle not yet assigned", tone: "pending" },
  assigned: { label: "Vehicle assigned", tone: "positive" },
  in_progress: { label: "On the way", tone: "positive" },
  completed: { label: "Completed", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "attention" },
  no_show: { label: "Marked as no-show", tone: "attention" },
};

export const EXTRAS_STATUS: Record<ExtraConfirmation, Label> = {
  requested: { label: "Requested — awaiting confirmation", tone: "pending" },
  confirmed: { label: "Confirmed", tone: "positive" },
  unavailable: { label: "Could not be arranged", tone: "attention" },
};
