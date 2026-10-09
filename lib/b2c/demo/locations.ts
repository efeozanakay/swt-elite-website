/**
 * DEMO DATA — prototype only.
 *
 * Pickup and drop-off points for the transfer search. These are real
 * airports and real resort areas, grouped by the six regions the
 * corporate Coverage section already names, but this list is NOT a
 * statement of which routes SWT Elite sells to consumers. The production
 * route list, with its prices, replaces this file.
 */
export type LocationKind = "airport" | "area";

export type TransferLocation = {
  id: string;
  name: string;
  kind: LocationKind;
  /** IATA code, airports only. */
  code?: string;
  region: string;
};

export const REGIONS = [
  "Antalya",
  "Dalaman",
  "Bodrum",
  "Izmir",
  "Istanbul",
  "Cappadocia",
] as const;

const airport = (id: string, name: string, code: string, region: string) =>
  ({ id, name, kind: "airport", code, region }) as const;
const area = (id: string, name: string, region: string) =>
  ({ id, name, kind: "area", region }) as const;

export const LOCATIONS: TransferLocation[] = [
  airport("ayt", "Antalya Airport", "AYT", "Antalya"),
  airport("gzp", "Gazipaşa–Alanya Airport", "GZP", "Antalya"),
  airport("dlm", "Dalaman Airport", "DLM", "Dalaman"),
  airport("bjv", "Milas–Bodrum Airport", "BJV", "Bodrum"),
  airport("adb", "Izmir Adnan Menderes Airport", "ADB", "Izmir"),
  airport("ist", "Istanbul Airport", "IST", "Istanbul"),
  airport("saw", "Istanbul Sabiha Gökçen Airport", "SAW", "Istanbul"),
  airport("nav", "Nevşehir Kapadokya Airport", "NAV", "Cappadocia"),
  airport("asr", "Kayseri Airport", "ASR", "Cappadocia"),

  area("antalya-centre", "Antalya City Centre", "Antalya"),
  area("lara", "Lara", "Antalya"),
  area("kundu", "Kundu", "Antalya"),
  area("konyaalti", "Konyaaltı", "Antalya"),
  area("belek", "Belek", "Antalya"),
  area("side", "Side", "Antalya"),
  area("manavgat", "Manavgat", "Antalya"),
  area("alanya", "Alanya", "Antalya"),
  area("mahmutlar", "Mahmutlar", "Antalya"),
  area("kemer", "Kemer", "Antalya"),
  area("tekirova", "Tekirova", "Antalya"),
  area("kas", "Kaş", "Antalya"),

  area("fethiye", "Fethiye", "Dalaman"),
  area("oludeniz", "Ölüdeniz", "Dalaman"),
  area("gocek", "Göcek", "Dalaman"),
  area("dalyan", "Dalyan", "Dalaman"),
  area("marmaris", "Marmaris", "Dalaman"),

  area("bodrum-centre", "Bodrum Centre", "Bodrum"),
  area("gumbet", "Gümbet", "Bodrum"),
  area("turgutreis", "Turgutreis", "Bodrum"),
  area("yalikavak", "Yalıkavak", "Bodrum"),

  area("izmir-centre", "Izmir City Centre", "Izmir"),
  area("cesme", "Çeşme", "Izmir"),
  area("kusadasi", "Kuşadası", "Izmir"),

  area("sultanahmet", "Sultanahmet", "Istanbul"),
  area("taksim", "Taksim", "Istanbul"),
  area("besiktas", "Beşiktaş", "Istanbul"),

  area("goreme", "Göreme", "Cappadocia"),
  area("urgup", "Ürgüp", "Cappadocia"),
  area("uchisar", "Uçhisar", "Cappadocia"),
];

export const locationById = (id: string | null | undefined) =>
  LOCATIONS.find((l) => l.id === id) ?? null;

export const locationLabel = (l: TransferLocation) =>
  l.code ? `${l.name} (${l.code})` : l.name;

/** Accent- and case-insensitive, so "oludeniz" finds Ölüdeniz and
 *  "gocek" finds Göcek on a keyboard without Turkish characters. */
export const normalise = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i");
