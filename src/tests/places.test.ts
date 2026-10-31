import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

const file = (name: string) => readFileSync(path.join(process.cwd(), "public", name), "utf8");

describe("birth place search", () => {
  it("answers from the small list of big places before the full list arrives", async () => {
    const requested: string[] = [];
    vi.stubGlobal("fetch", async (url: string) => {
      requested.push(url);
      // The full list never arrives in this test; only the small one does.
      return url.endsWith("places-top.json") ? new Response(file("places-top.json")) : new Promise<Response>(() => {});
    });
    const { quickSearchPlaces, fullPlacesReady } = await import("@/lib/places");
    const found = await quickSearchPlaces("cuttack");
    expect(found[0].label).toBe("Cuttack, Odisha, India");
    expect(found[0].timeZone).toBe("Asia/Kolkata");
    expect((await quickSearchPlaces("कटक"))[0]?.name).toBe("Cuttack");
    expect(fullPlacesReady()).toBe(false);
    expect(requested.some((u) => u.endsWith("places.json"))).toBe(false);
    vi.unstubAllGlobals();
  });

  it("keeps the small list small and in step with the full one", () => {
    const top = JSON.parse(file("places-top.json")) as unknown[][];
    const full = JSON.parse(file("places.json")) as unknown[][];
    expect(top.length).toBe(3000);
    expect(file("places-top.json").length).toBeLessThan(300_000);
    const names = new Set(full.map((r) => `${r[0]}|${r[2]}|${r[3]}`));
    for (const r of top) expect(names.has(`${r[0]}|${r[2]}|${r[3]}`)).toBe(true);
  });
});
