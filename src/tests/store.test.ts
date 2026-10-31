import { beforeEach, describe, expect, it } from "vitest";

const mem = new Map<string, string>();
beforeEach(() => {
  mem.clear();
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => mem.set(k, v),
    removeItem: (k: string) => mem.delete(k),
  };
});

describe("stored data", () => {
  it("keeps old data and fills new fields with safe defaults", async () => {
    mem.set("grahify-demo-v1", JSON.stringify({ profile: { name: "Asha" }, tarot: [], journal: [{ id: "1" }] }));
    const { snapshot } = await import("@/lib/store");
    const d = snapshot();
    expect(d.profile?.name).toBe("Asha");
    expect(d.journal).toHaveLength(1);
    expect(d.prefs).toEqual({ system: "vedic", comfort: false, astrologer: false });
    expect(d.seenWelcome).toBe(false);
    expect(d.ritual).toEqual({ date: "", done: [] });
    expect(d.google).toBeNull();
  });

  it("tracks ritual steps per day and starts fresh on a new day", async () => {
    const { markRitual, snapshot } = await import("@/lib/store");
    markRitual("2026-11-01", "read");
    markRitual("2026-11-01", "read");
    markRitual("2026-11-01", "affirmation");
    expect(snapshot().ritual).toEqual({ date: "2026-11-01", done: ["read", "affirmation"] });
    markRitual("2026-11-02", "card");
    expect(snapshot().ritual).toEqual({ date: "2026-11-02", done: ["card"] });
  });
});
