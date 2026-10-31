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

export function normalise(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.,'’()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Downloads the list once, the first time someone searches. */
function load(): Promise<Row[]> {
  loading ??= fetch(asset("/places.json"))
    .then((r) => r.json() as Promise<Raw[]>)
    .then((raw) =>
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
      })),
    )
    .catch((e) => {
      loading = null;
      throw e;
    });
  return loading;
}

/** Prefix search; extra words narrow by state or country ("cuttack odisha"). Largest places first. */
export async function searchPlaces(query: string, limit = 8): Promise<Place[]> {
  const q = normalise(query);
  if (q.length < 2) return [];
  const all = await load();
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
