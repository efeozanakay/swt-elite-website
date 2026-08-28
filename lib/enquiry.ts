/**
 * Shared shape and validation for the partnership enquiry form.
 *
 * Imported by both the drawer and the Cloudflare Pages Function, so the
 * two can never disagree about what is valid. The client copy exists to
 * give fast feedback; the server copy is the one that actually decides,
 * because anything the browser checks can be bypassed by posting to the
 * endpoint directly.
 */

export const SERVICES = [
  "Airport Transfers",
  "Ground Handling",
  "Groups & Events",
  "Destination Services",
  "Other",
] as const;

export type Service = (typeof SERVICES)[number];

export type EnquiryFields = {
  name: string;
  company: string;
  email: string;
  country: string;
  service: string;
  message: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryFields, string>>;

/** Deliberately permissive. The job here is to catch typos, not to
 *  adjudicate which addresses are real; anything stricter rejects valid
 *  addresses and loses enquiries. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: [2, 100],
  company: [2, 120],
  email: [5, 160],
  country: [2, 60],
  message: [10, 2000],
} as const;

export function validateEnquiry(input: EnquiryFields): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const v = {
    name: (input.name ?? "").trim(),
    company: (input.company ?? "").trim(),
    email: (input.email ?? "").trim(),
    country: (input.country ?? "").trim(),
    service: (input.service ?? "").trim(),
    message: (input.message ?? "").trim(),
  };

  if (!v.name) errors.name = "Please enter your name.";
  else if (v.name.length < LIMITS.name[0]) errors.name = "That looks too short.";
  else if (v.name.length > LIMITS.name[1]) errors.name = "Please shorten this.";

  if (!v.company) errors.company = "Please enter your company.";
  else if (v.company.length < LIMITS.company[0]) errors.company = "That looks too short.";
  else if (v.company.length > LIMITS.company[1]) errors.company = "Please shorten this.";

  if (!v.email) errors.email = "Please enter your business email.";
  else if (!EMAIL.test(v.email) || v.email.length > LIMITS.email[1])
    errors.email = "Please check this email address.";

  if (!v.country) errors.country = "Please enter your country.";
  else if (v.country.length > LIMITS.country[1]) errors.country = "Please shorten this.";

  if (!v.service) errors.service = "Please choose what you need.";
  else if (!(SERVICES as readonly string[]).includes(v.service))
    errors.service = "Please choose one of the listed options.";

  if (!v.message) errors.message = "Please tell us what you need.";
  else if (v.message.length < LIMITS.message[0])
    errors.message = "Please add a little more detail.";
  else if (v.message.length > LIMITS.message[1])
    errors.message = "Please keep this under 2000 characters.";

  return errors;
}
