import { DAILY, MARS_HINT, VENUS_HINT } from "./content/daily";
import { CHAPTERS, LIFE_AREAS } from "./content/plain";
import { currentDasha, houseFrom, lahiriAyanamsa, signOf, siderealLongitude, type Graha, type NatalChart } from "./engine";
import { norm360 } from "./engine/math";
import { bigThree, moonNow, seedOf, type ZodiacSystem } from "./sky";
import type { Profile } from "./store";

/** Days since 1970-01-01 for a local date string, so consecutive dates are consecutive numbers. */
const dayNumber = (date: string) => Math.round(Date.parse(`${date}T00:00:00Z`) / 86_400_000);

/**
 * Today's reading for one person. It counts where today's Moon is from the reader's own sign:
 * their Moon sign in Vedic mode (the classic gochara method), their Sun sign in Western mode
 * (solar houses). The Moon is taken at local noon.
 *
 * Wording rotates by one step each day from a per-person starting point, so it's the same all
 * day, and two days in a row never share a headline or tile line, even while the Moon stays
 * in the same sign. A second line comes from Venus, Mars or the current dasha in turn.
 */
export function todayReading(profile: Profile, chart: NatalChart, system: ZodiacSystem, day: { date: string; start: Date }) {
  const natal = bigThree(chart, system);
  const base = system === "vedic" ? { body: "Moon" as const, ...natal.moon } : { body: "Sun" as const, ...natal.sun };
  const noon = new Date(day.start.getTime() + 12 * 3_600_000);
  const moon = moonNow(noon, system);
  const house = houseFrom(moon.sign, base.sign);
  const read = DAILY[house];
  const n = seedOf(profile.name, profile.birthDate) + dayNumber(day.date);
  const pick = <T,>(list: T[], salt = 0) => list[(n + salt) % list.length];
  const area = (a: (typeof read)["love"], salt: number) => ({ line: pick(a.lines, salt), detail: a.detail });

  return {
    base, // the sign the reading is counted from
    house,
    moonSign: moon.signName,
    moonSignIndex: moon.sign,
    /** What the sky is doing, in plain words: the cause that makes the reading astrology. */
    sky: `The Moon is in ${moon.signName}, your ${LIFE_AREAS[house].zone} today`,
    zone: read.zone,
    ...pick(read.readings),
    love: area(read.love, 1),
    work: area(read.work, 2),
    selfcare: area(read.selfcare, 3),
    also: secondLine(chart, system, base.sign, noon, dayNumber(day.date)),
  };
}

/** One more piece of the sky, rotating daily: Venus for love, Mars for effort, or your life chapter. */
function secondLine(chart: NatalChart, system: ZodiacSystem, baseSign: number, at: Date, day: number): { planet: Graha; text: string } | null {
  const signFor = (g: Graha) => {
    const sid = siderealLongitude(g, at);
    return signOf(system === "western" ? norm360(sid + lahiriAyanamsa(at)) : sid);
  };
  const kind = day % 3;
  if (kind === 0) {
    const h = houseFrom(signFor("Venus"), baseSign);
    return { planet: "Venus", text: `Venus is in your ${LIFE_AREAS[h].zone}, so ${VENUS_HINT[h]}.` };
  }
  if (kind === 1) {
    const h = houseFrom(signFor("Mars"), baseSign);
    return { planet: "Mars", text: `Mars is in your ${LIFE_AREAS[h].zone}, so ${MARS_HINT[h]}.` };
  }
  const d = currentDasha(chart.dasha, at);
  if (!d) return null;
  return {
    planet: d.antardasha.lord,
    text: `You're in your ${CHAPTERS[d.mahadasha.lord].name}, and the focus right now is ${CHAPTERS[d.antardasha.lord].focus}.`,
  };
}

export type TodayReading = ReturnType<typeof todayReading>;

export const greetingFor = (hour: number) => (hour < 5 ? "Up late" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
