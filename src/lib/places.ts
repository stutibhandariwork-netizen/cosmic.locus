import { asset } from "./base-path";

/** GeoNames (CC BY 4.0) subset: India 3,000+ people, elsewhere 15,000+. */
export interface Place {
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  label: string;
}

type Raw = [name: string, alts: string, state: string, country: string, lat: number, lon: number, tz: string];

interface Row extends Place {
  keys: string[];
  region: string;
}

let loading: Promise<Row[]> | null = null;
let loadingTop: Promise<Row[]> | null = null;
let full: Row[] | null = null;

export function normalise(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.,'’()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const parse = (raw: Raw[]): Row[] =>
  raw.map(([name, alts, state, country, latitude, longitude, timeZone]) => ({
    name,
    state,
    country,
    latitude,
    longitude,
    timeZone,
    label: [name, state, country].filter(Boolean).join(", "),
    keys: [...new Set([name, ...(alts ? alts.split("|") : [])].map(normalise))],
    region: normalise(`${state} ${country}`),
  }));

/** The full list (37,000 places, about 1.2 MB over the wire), downloaded once. */
function load(): Promise<Row[]> {
  loading ??= fetch(asset("/places.json"))
    .then((r) => r.json() as Promise<Raw[]>)
    .then((raw) => (full = parse(raw)))
    .catch((e) => {
      loading = null;
      throw e;
    });
  return loading;
}

/** The 3,000 biggest places (about 80 KB), which answer most searches while the full list loads. */
function loadTop(): Promise<Row[]> {
  loadingTop ??= fetch(asset("/places-top.json"))
    .then((r) => r.json() as Promise<Raw[]>)
    .then(parse)
    .catch((e) => {
      loadingTop = null;
      throw e;
    });
  return loadingTop;
}

/** Starts both downloads in the background (call as soon as onboarding opens). */
export function preloadPlaces() {
  loadTop().catch(() => {});
  load().catch(() => {});
}

export const fullPlacesReady = () => full !== null;

/** Prefix search over the full list; extra words narrow by state or country ("cuttack odisha"). Largest places first. */
export async function searchPlaces(query: string, limit = 8): Promise<Place[]> {
  return search(await load(), query, limit);
}

/** The same search over the small list of big places, for instant first results. */
export async function quickSearchPlaces(query: string, limit = 8): Promise<Place[]> {
  return search(full ?? (await loadTop()), query, limit);
}

export function search(all: Row[], query: string, limit = 8): Place[] {
  const q = normalise(query);
  if (q.length < 2) return [];
  const words = q.split(" ");
  const splits = words.map((_, i) => [words.slice(0, words.length - i).join(" "), words.slice(words.length - i)] as const);
  const exact: Row[] = [];
  const prefix: Row[] = [];
  for (const r of all) {
    for (const [name, region] of splits) {
      if (!region.every((w) => r.region.includes(w))) continue;
      if (r.keys.includes(name)) {
        exact.push(r);
        break;
      }
      if (r.keys.some((k) => k.startsWith(name))) {
        prefix.push(r);
        break;
      }
    }
    if (exact.length >= limit) break;
  }
  return [...exact, ...prefix].slice(0, limit).map(({ name, state, country, latitude, longitude, timeZone, label }) => ({ name, state, country, latitude, longitude, timeZone, label }));
}
