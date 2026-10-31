import { describe, expect, it } from "vitest";
import { checkBackup } from "@/lib/backup";
import { shuffleDeck } from "@/lib/tarot/shuffle";

const deck = shuffleDeck(() => 0);
const backup = {
  exportedAt: "2026-11-01T06:00:00.000Z",
  profile: { name: "Asha", birthDate: "2000-01-21", birthTime: "12:46", place: { label: "Cuttack, Odisha, India", latitude: 20.46, longitude: 85.88, timeZone: "Asia/Kolkata" } },
  prefs: { system: "western", comfort: true, astrologer: false },
  google: null,
  seenWelcome: false,
  ritual: { date: "2026-11-01", done: ["read"] },
  tarot: [{ id: "t1", spread: "CARD_OF_DAY", question: null, createdAt: "2026-11-01T05:00:00.000Z", deckOrder: deck.order, reversals: deck.reversals, picks: [5], clarifiers: [] }],
  journal: [{ id: "j1", text: "Feeling hopeful.", prompt: null, link: { title: "Card of the day: The Star", summary: "Hope", href: "/tarot/" }, date: "2026-11-01", createdAt: "2026-11-01T05:10:00.000Z" }],
};

describe("restore from a backup", () => {
  it("accepts a file made by Download my data and summarises it", () => {
    const r = checkBackup(JSON.stringify(backup));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.summary).toEqual({ name: "Asha", birthDate: "2000-01-21", tarot: 1, journal: 1, exportedAt: "2026-11-01T06:00:00.000Z" });
    expect(r.data.prefs).toEqual({ system: "western", comfort: true, astrologer: false });
    expect(r.data.journal[0].link?.href).toBe("/tarot/");
    expect(r.data.tarot[0].picks).toEqual([5]);
  });

  it("rejects files that aren't backups", () => {
    for (const text of ["not json", "[]", JSON.stringify({ hello: 1 })]) {
      const r = checkBackup(text);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toMatch(/isn't a Cosmic Locus backup/);
    }
  });

  it("rejects damaged birth details, tarot or journal entries instead of half-restoring", () => {
    const bad = (patch: object) => checkBackup(JSON.stringify({ ...backup, ...patch }));
    expect(bad({ profile: { ...backup.profile, birthDate: "21/01/2000" } }).ok).toBe(false);
    expect(bad({ profile: { ...backup.profile, place: { ...backup.profile.place, latitude: 200 } } }).ok).toBe(false);
    expect(bad({ tarot: [{ ...backup.tarot[0], deckOrder: [1, 2, 3] }] }).ok).toBe(false);
    expect(bad({ tarot: [{ ...backup.tarot[0], spread: "HACK" }] }).ok).toBe(false);
    expect(bad({ journal: [{ ...backup.journal[0], text: 5 }] }).ok).toBe(false);
  });

  it("drops links that point off the site and keeps a missing profile as none", () => {
    const r = checkBackup(JSON.stringify({ ...backup, profile: null, journal: [{ ...backup.journal[0], link: { title: "x", summary: "y", href: "https://evil.example" } }] }));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.profile).toBeNull();
      expect(r.data.journal[0].link).toBeNull();
    }
  });
});
