import { describe, expect, it } from "vitest";
import { CHAPTERS, LIFE_AREAS, NAKSHATRA_MOOD, yogaPlain } from "@/lib/content/plain";
import { computeNatalChart, DASHA_ORDER, localToUtc, NAKSHATRAS } from "@/lib/engine";

describe("plain-language content", () => {
  it("covers every dasha lord, house and nakshatra", () => {
    for (const g of DASHA_ORDER) expect(CHAPTERS[g].name, g).toMatch(/chapter$/);
    for (let h = 1; h <= 12; h++) expect(LIFE_AREAS[h].zone, String(h)).toMatch(/zone$/);
    expect(NAKSHATRA_MOOD).toHaveLength(NAKSHATRAS.length);
  });

  it("has a plain reading for every yoga and dosha the engine can return", () => {
    const keys = new Set<string>();
    // A spread of birth dates to surface every key, including each Neecha Bhanga.
    for (let y = 1950; y < 2030; y += 5)
      for (const m of ["01", "05", "09"]) {
        const chart = computeNatalChart({ utc: localToUtc(`${y}-${m}-15`, "06:00", "Asia/Kolkata"), latitude: 20.46, longitude: 85.88, timeKnown: true, saturnYears: 1 });
        for (const yoga of chart.yogas) keys.add(yoga.key);
      }
    for (const k of keys) expect(yogaPlain(k), k).toBeTruthy();
  }, 30_000);

  it("frames the difficult ones gently", () => {
    for (const k of ["mangal_dosha", "kaal_sarp", "kemadruma", "grahan"]) {
      const p = yogaPlain(k)!;
      expect(p.gentle, k).toMatch(/Traditionally called/);
      expect(`${p.headline} ${p.meaning} ${p.gentle}`.toLowerCase()).not.toMatch(/bad luck|curse|doom|danger|misfortune will/);
    }
  });
});
