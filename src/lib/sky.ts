import { MoonPhase } from "astronomy-engine";
import { lahiriAyanamsa, signOf, SIGNS, siderealLongitude, type NatalChart } from "./engine";
import { angleDiff, bisect, nakshatraOf, norm360 } from "./engine/math";
import type { Prefs } from "./store";

export type ZodiacSystem = Prefs["system"];

/** Natal longitudes for the chosen zodiac. The engine is sidereal (Lahiri); tropical adds the ayanamsa back. */
export function bigThree(chart: NatalChart, system: ZodiacSystem) {
  const shift = system === "western" ? chart.ayanamsa.degrees : 0;
  const at = (lon: number) => {
    const l = norm360(lon + shift);
    return { longitude: l, sign: signOf(l), signName: SIGNS[signOf(l)].en, degree: l % 30 };
  };
  return {
    sun: at(chart.planets.Sun.longitude),
    moon: at(chart.planets.Moon.longitude),
    rising: chart.lagna ? at(chart.lagna.longitude) : null,
  };
}

const moonLongitude = (at: Date, system: ZodiacSystem) => {
  const sid = siderealLongitude("Moon", at);
  return system === "western" ? norm360(sid + lahiriAyanamsa(at)) : sid;
};

/** Sun and Moon longitudes right now, in the chosen zodiac (for drawing today's sky). */
export function skyNow(at: Date, system: ZodiacSystem) {
  const shift = system === "western" ? lahiriAyanamsa(at) : 0;
  return { sun: norm360(siderealLongitude("Sun", at) + shift), moon: norm360(siderealLongitude("Moon", at) + shift), elongation: MoonPhase(at) };
}

/** Where the Moon is right now, in the chosen zodiac. The nakshatra is always sidereal. */
export function moonNow(at: Date, system: ZodiacSystem) {
  const lon = moonLongitude(at, system);
  const elongation = MoonPhase(at);
  const nak = nakshatraOf(siderealLongitude("Moon", at));
  return { sign: signOf(lon), signName: SIGNS[signOf(lon)].en, nakshatra: nak.name, nakshatraIndex: nak.index, elongation, phase: phaseName(elongation) };
}

/** When the Moon next changes sign between `from` and `to` (it moves about 13° a day, so at most once). */
export function moonSignChange(from: Date, to: Date, system: ZodiacSystem): { at: Date; signName: string } | null {
  const start = signOf(moonLongitude(from, system));
  if (signOf(moonLongitude(to, system)) === start) return null;
  const boundary = ((start + 1) % 12) * 30;
  const at = bisect((d) => angleDiff(moonLongitude(d, system), boundary), from, to);
  return { at, signName: SIGNS[(start + 1) % 12].en };
}

export function phaseName(elongation: number): string {
  const names = ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"];
  return names[Math.floor(norm360(elongation + 22.5) / 45) % 8];
}

/** Stable 32-bit hash (FNV-1a), so a person gets the same reading or card all day. */
export function seedOf(...parts: (string | number)[]): number {
  let h = 0x811c9dc5;
  for (const ch of parts.join("|")) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export const SIGN_ABBR = ["ARI", "TAU", "GEM", "CAN", "LEO", "VIR", "LIB", "SCO", "SAG", "CAP", "AQU", "PIS"];
