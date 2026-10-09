/**
 * Locale plumbing for the consumer pages.
 *
 * The prototype ships in English only. Everything that formats a date or
 * a number goes through here, so adding German, Turkish or Russian later
 * means swapping the active locale and the copy dictionary rather than
 * hunting for `toLocaleDateString` calls inside components.
 */
export type LocaleCode = "en" | "de" | "tr" | "ru";

export const LANGUAGES: {
  code: LocaleCode;
  /** Name in its own language, which is how a selector should list it. */
  label: string;
  /** BCP 47 tag used for Intl formatting. */
  tag: string;
  /** Only English exists today. The others are listed as planned, never
   *  as working options. */
  available: boolean;
}[] = [
  { code: "en", label: "English", tag: "en-GB", available: true },
  { code: "de", label: "Deutsch", tag: "de-DE", available: false },
  { code: "tr", label: "Türkçe", tag: "tr-TR", available: false },
  { code: "ru", label: "Русский", tag: "ru-RU", available: false },
];

export const ACTIVE_LOCALE: LocaleCode = "en";

const tag = () =>
  LANGUAGES.find((l) => l.code === ACTIVE_LOCALE)?.tag ?? "en-GB";

/** Parses YYYY-MM-DD as a local calendar date, never as UTC midnight,
 *  which would shift the day for anyone west of Greenwich. */
export function parseISODate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.getMonth() === Number(m[2]) - 1 ? d : null;
}

export function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function formatDate(
  value: string,
  style: "short" | "long" = "short"
): string {
  const d = parseISODate(value);
  if (!d) return value;
  return new Intl.DateTimeFormat(tag(), {
    weekday: style === "long" ? "long" : "short",
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  }).format(d);
}

export function formatCount(n: number, one: string, many: string) {
  return `${new Intl.NumberFormat(tag()).format(n)} ${n === 1 ? one : many}`;
}
