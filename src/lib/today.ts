import { DAILY } from "./content/daily";
import { houseFrom, type NatalChart } from "./engine";
import { bigThree, moonNow, seedOf, type ZodiacSystem } from "./sky";
import type { Profile } from "./store";

/**
 * Today's reading for one person. It counts where today's Moon is from the reader's own sign:
 * their Moon sign in Vedic mode (the classic gochara method), their Sun sign in Western mode
 * (solar houses). The Moon is taken at local noon and the wording is seeded by person and date,
 * so the reading stays the same all day.
 */
export function todayReading(profile: Profile, chart: NatalChart, system: ZodiacSystem, day: { date: string; start: Date }) {
  const natal = bigThree(chart, system);
  const base = system === "vedic" ? { body: "Moon" as const, ...natal.moon } : { body: "Sun" as const, ...natal.sun };
  const noon = new Date(day.start.getTime() + 12 * 3_600_000);
  const moon = moonNow(noon, system);
  const house = houseFrom(moon.sign, base.sign);
  const read = DAILY[house];
  const seed = seedOf(profile.name, profile.birthDate, day.date);
  return {
    base, // the sign the reading is counted from
    house,
    moonSign: moon.signName,
    zone: read.zone,
    ...read.readings[seed % read.readings.length],
    love: read.love,
    work: read.work,
    selfcare: read.selfcare,
  };
}

export type TodayReading = ReturnType<typeof todayReading>;

export const greetingFor = (hour: number) => (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
