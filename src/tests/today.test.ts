import { describe, expect, it } from "vitest";
import { computeNatalChart, localToUtc } from "@/lib/engine";
import { bigThree, moonNow, moonSignChange, phaseName, seedOf } from "@/lib/sky";
import type { Profile } from "@/lib/store";
import { todayReading } from "@/lib/today";

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
