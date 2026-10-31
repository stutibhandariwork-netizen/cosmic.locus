import { describe, expect, it } from "vitest";
import { computeNatalChart, localToUtc } from "@/lib/engine";
import { lifeStory } from "@/lib/story";

const chart = computeNatalChart({ utc: localToUtc("2000-01-21", "12:46", "Asia/Kolkata"), latitude: 20.46, longitude: 85.88, timeKnown: true, saturnYears: 1 });

describe("your story in three lines", () => {
  it("sums up the big three in one sentence", () => {
    expect(lifeStory(chart, "vedic").who).toBe("Ambitious on the outside, tender on the inside, and easygoing to meet.");
  });

  it("names the chapter and sub-chapter you're in, with the real dasha alongside", () => {
    const s = lifeStory(chart, "vedic", new Date("2026-11-01T00:00:00Z"));
    expect(s.now?.mahadasha.lord).toBe("Mercury");
    expect(s.now?.antardasha.lord).toBe("Saturn");
    expect(s.now?.line).toBe(
      "You're in your learning-and-talking chapter (2012–2029). Until February 2029, the focus is steady work and long-term plans, so keep showing up; slow progress here really lasts.",
    );
  });

  it("looks ahead to the next chapter when the current sub-chapter is the last", () => {
    const s = lifeStory(chart, "vedic", new Date("2026-11-01T00:00:00Z"));
    expect(s.next).toMatchObject({ lord: "Ketu", isChapter: true });
    expect(s.next?.line).toBe("From 2029, your letting-go chapter begins: looking inward and clearing what's done.");
    const earlier = lifeStory(chart, "vedic", new Date("2015-01-01T00:00:00Z"));
    expect(earlier.next?.isChapter).toBe(false);
    expect(earlier.next?.line).toMatch(/^From \w+ \d{4}, the focus turns to /);
  });
});
