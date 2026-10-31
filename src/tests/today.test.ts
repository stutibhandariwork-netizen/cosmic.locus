import { describe, expect, it } from "vitest";
import { computeNatalChart, localToUtc } from "@/lib/engine";
import { bigThree, moonNow, moonSignChange, phaseName, seedOf } from "@/lib/sky";
import type { Profile } from "@/lib/store";
import { PERSONAL_DAY } from "@/lib/numerology/meanings";
import { personalCycles } from "@/lib/numerology/calc";
import { greetingFor, todayReading } from "@/lib/today";

const profile: Profile = {
  name: "Asha",
  birthDate: "2000-01-21",
  birthTime: "12:46",
  place: { label: "Cuttack", latitude: 20.46, longitude: 85.88, timeZone: "Asia/Kolkata" },
};
const chart = computeNatalChart({ utc: localToUtc("2000-01-21", "12:46", "Asia/Kolkata"), latitude: 20.46, longitude: 85.88, timeKnown: true, saturnYears: 1 });
const day = (date: string) => ({ date, start: localToUtc(date, "00:00", "Asia/Kolkata") });

describe("big three", () => {
  it("gives sidereal signs in Vedic mode and tropical signs in Western mode", () => {
    const v = bigThree(chart, "vedic");
    expect([v.sun.signName, v.moon.signName, v.rising?.signName]).toEqual(["Capricorn", "Cancer", "Taurus"]);
    const w = bigThree(chart, "western");
    expect([w.sun.signName, w.moon.signName, w.rising?.signName]).toEqual(["Aquarius", "Leo", "Taurus"]);
    expect(w.sun.degree).toBeCloseTo(0.5, 0);
  });

  it("has no rising sign without a birth time", () => {
    const noTime = computeNatalChart({ utc: localToUtc("2000-01-21", "12:00", "Asia/Kolkata"), latitude: 20.46, longitude: 85.88, timeKnown: false, saturnYears: 1 });
    expect(bigThree(noTime, "vedic").rising).toBeNull();
  });
});

describe("today's reading", () => {
  it("counts the noon Moon from the natal Moon (Vedic) or Sun (Western)", () => {
    // 1 Nov 2026 at noon IST the Moon is in sidereal Cancer and tropical Leo.
    const v = todayReading(profile, chart, "vedic", day("2026-11-01"));
    expect(v.base).toMatchObject({ body: "Moon", signName: "Cancer" });
    expect([v.moonSign, v.house]).toEqual(["Cancer", 1]);
    const w = todayReading(profile, chart, "western", day("2026-11-01"));
    expect(w.base).toMatchObject({ body: "Sun", signName: "Aquarius" });
    expect([w.moonSign, w.house]).toEqual(["Leo", 7]);
  });

  it("is the same all day and usually changes with the date", () => {
    const a = todayReading(profile, chart, "vedic", day("2026-11-01"));
    expect(todayReading(profile, chart, "vedic", day("2026-11-01"))).toEqual(a);
    const week = ["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"].map((d) => todayReading(profile, chart, "vedic", day(d)).headline);
    expect(new Set([a.headline, ...week]).size).toBeGreaterThan(2);
  });
});

describe("daily variety", () => {
  const dates = (from: string, n: number) =>
    Array.from({ length: n }, (_, i) => new Date(Date.parse(`${from}T00:00:00Z`) + i * 86_400_000).toISOString().slice(0, 10));

  for (const system of ["vedic", "western"] as const) {
    it(`never repeats a headline or tile line on consecutive days (${system}, 30 days)`, () => {
      const days = dates("2026-11-01", 30).map((d) => todayReading(profile, chart, system, day(d)));
      for (let i = 1; i < days.length; i++) {
        const [a, b] = [days[i - 1], days[i]];
        expect(b.headline, `day ${i}`).not.toBe(a.headline);
        expect(b.love.line, `love ${i}`).not.toBe(a.love.line);
        expect(b.work.line, `career ${i}`).not.toBe(a.work.line);
        expect(b.selfcare.line, `mind ${i}`).not.toBe(a.selfcare.line);
        expect(b.also?.text, `also ${i}`).not.toBe(a.also?.text);
      }
    });
  }

  it("names a second planet: Venus, Mars or the current chapter, in turn", () => {
    const planets = dates("2026-11-01", 3).map((d) => todayReading(profile, chart, "vedic", day(d)).also?.planet);
    expect(new Set(planets).size).toBe(3);
    expect(planets).toContain("Venus");
    expect(planets).toContain("Mars");
  });

  it("has six readings and four lines per area for every Moon position", async () => {
    const { DAILY } = await import("@/lib/content/daily");
    for (let h = 1; h <= 12; h++) {
      expect(DAILY[h].readings).toHaveLength(6);
      for (const a of ["love", "work", "selfcare"] as const) expect(DAILY[h][a].lines).toHaveLength(4);
    }
  });
});

describe("sky helpers", () => {
  it("names moon phases", () => {
    expect([0, 45, 90, 135, 180, 225, 270, 315, 350].map(phaseName)).toEqual([
      "New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent", "New moon",
    ]);
  });

  it("finds the full moon of 5 Nov 2025 (Aries sidereal, Taurus tropical)", () => {
    const m = moonNow(new Date("2025-11-05T13:19:00Z"), "vedic");
    expect(m.phase).toBe("Full moon");
    expect(m.signName).toBe("Aries");
    expect(moonNow(new Date("2025-11-05T13:19:00Z"), "western").signName).toBe("Taurus");
  });

  it("finds when the Moon changes sign during a day, in each zodiac", () => {
    // 1 Nov 2026 IST: the sidereal Moon enters Cancer a minute after midnight; the tropical Moon enters Leo later in the day.
    const from = localToUtc("2026-11-01", "00:00", "Asia/Kolkata");
    const to = localToUtc("2026-11-02", "00:00", "Asia/Kolkata");
    const w = moonSignChange(from, to, "western")!;
    expect(w.signName).toBe("Leo");
    expect(w.at > from && w.at < to).toBe(true);
    expect(moonNow(new Date(w.at.getTime() - 120_000), "western").signName).toBe("Cancer");
    expect(moonNow(new Date(w.at.getTime() + 120_000), "western").signName).toBe("Leo");
    const v = moonSignChange(from, to, "vedic")!;
    expect(v.signName).toBe("Cancer");
    expect(v.at.getTime() - from.getTime()).toBeLessThan(5 * 60_000);
    expect(w.at > v.at).toBe(true);
    expect(moonNow(new Date("2026-11-01T06:30:00Z"), "vedic").nakshatra).toBe("Pushya");
    expect(moonSignChange(new Date("2026-11-01T06:30:00Z"), new Date("2026-11-01T07:30:00Z"), "vedic")).toBeNull();
  });

  it("seeds are stable", () => {
    expect(seedOf("a", 1)).toBe(seedOf("a", 1));
    expect(seedOf("a", 1)).not.toBe(seedOf("a", 2));
  });
});

describe("small things", () => {
  it("greets by the hour, including late at night", () => {
    expect([0, 4, 5, 11, 12, 16, 17, 23].map(greetingFor)).toEqual([
      "Up late", "Up late", "Good morning", "Good morning", "Good afternoon", "Good afternoon", "Good evening", "Good evening",
    ]);
  });

  it("has a personal-day meaning for every value personalCycles can return", () => {
    for (let d = 1; d <= 31; d++) {
      const { day } = personalCycles(1, 21, { year: 2026, month: 11, day: d });
      expect(PERSONAL_DAY[day], `day ${d}`).toBeTruthy();
    }
  });
});
