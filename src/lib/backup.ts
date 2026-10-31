import { DEFAULT_PREFS, type Data, type JournalEntry, type Prefs, type Profile, type TarotSession } from "./store";
import { isEmail } from "./signup";
import { SPREADS } from "./tarot/spreads";

/**
 * Checks a file made by "Download my data" before it replaces what's on this device.
 * Only known fields are kept; anything that doesn't look right is rejected with a plain reason.
 */

export type BackupCheck =
  | { ok: true; data: Data; summary: { name: string | null; birthDate: string | null; tarot: number; journal: number; exportedAt: string | null } }
  | { ok: false; error: string };

type Obj = Record<string, unknown>;
const isObj = (x: unknown): x is Obj => typeof x === "object" && x !== null && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === "string";
const isNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;
const SPREAD_KEYS = new Set(SPREADS.map((s) => s.key));

function profileOf(x: unknown): Profile | null | undefined {
  if (x === null || x === undefined) return null;
  if (!isObj(x) || !isStr(x.name) || !isStr(x.birthDate) || !DATE.test(x.birthDate)) return undefined;
  if (!(x.birthTime === null || (isStr(x.birthTime) && TIME.test(x.birthTime)))) return undefined;
  const p = x.place;
  if (!isObj(p) || !isStr(p.label) || !isNum(p.latitude) || !isNum(p.longitude) || !isStr(p.timeZone)) return undefined;
  if (Math.abs(p.latitude) > 90 || Math.abs(p.longitude) > 180) return undefined;
  return {
    name: x.name.slice(0, 100),
    birthDate: x.birthDate,
    birthTime: x.birthTime as string | null,
    place: { label: p.label, latitude: p.latitude, longitude: p.longitude, timeZone: p.timeZone },
  };
}

function tarotOf(x: unknown): TarotSession | undefined {
  if (!isObj(x) || !isStr(x.id) || !isStr(x.spread) || !SPREAD_KEYS.has(x.spread as TarotSession["spread"]) || !isStr(x.createdAt)) return undefined;
  const order = x.deckOrder;
  if (!Array.isArray(order) || order.length !== 78 || new Set(order).size !== 78 || !order.every((n) => Number.isInteger(n) && n >= 0 && n < 78)) return undefined;
  if (!Array.isArray(x.reversals) || x.reversals.length !== 78 || !x.reversals.every((b) => typeof b === "boolean")) return undefined;
  if (!Array.isArray(x.picks) || !x.picks.every((n) => Number.isInteger(n) && n >= 1 && n <= 78)) return undefined;
  const clarifiers = Array.isArray(x.clarifiers) ? x.clarifiers.filter((c): c is { forPick: number; position: number } => isObj(c) && isNum(c.forPick) && isNum(c.position)) : [];
  return {
    id: x.id,
    spread: x.spread as TarotSession["spread"],
    question: isStr(x.question) ? x.question : null,
    createdAt: x.createdAt,
    deckOrder: order as number[],
    reversals: x.reversals as boolean[],
    picks: x.picks as number[],
    clarifiers,
  };
}

function journalOf(x: unknown): JournalEntry | undefined {
  if (!isObj(x) || !isStr(x.id) || !isStr(x.text) || !isStr(x.date) || !DATE.test(x.date) || !isStr(x.createdAt)) return undefined;
  const l = x.link;
  const link = isObj(l) && isStr(l.title) && isStr(l.summary) && isStr(l.href) && l.href.startsWith("/") ? { title: l.title, summary: l.summary, href: l.href } : null;
  return { id: x.id, text: x.text, prompt: isStr(x.prompt) ? x.prompt : null, link, date: x.date, createdAt: x.createdAt };
}

function contactOf(x: unknown): Data["contact"] {
  if (!isObj(x) || !isStr(x.email) || !isEmail(x.email) || !isStr(x.consentAt)) return null;
  return { email: x.email, phone: isStr(x.phone) ? x.phone : null, consentAt: x.consentAt };
}

function prefsOf(x: unknown): Prefs {
  if (!isObj(x)) return DEFAULT_PREFS;
  return {
    system: x.system === "western" ? "western" : "vedic",
    comfort: x.comfort === true,
    astrologer: x.astrologer === true,
  };
}

export function checkBackup(text: string): BackupCheck {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file isn't a Cosmic Locus backup. Choose the .json file you downloaded from Settings." };
  }
  if (!isObj(raw) || !Array.isArray(raw.journal) || !Array.isArray(raw.tarot) || !("profile" in raw)) {
    return { ok: false, error: "This file isn't a Cosmic Locus backup. Choose the .json file you downloaded from Settings." };
  }
  const profile = profileOf(raw.profile);
  if (profile === undefined) return { ok: false, error: "The birth details in this backup look damaged, so nothing was restored." };
  const tarot = raw.tarot.map(tarotOf);
  const journal = raw.journal.map(journalOf);
  if (tarot.some((t) => !t) || journal.some((j) => !j)) {
    return { ok: false, error: "Some tarot spreads or journal notes in this backup look damaged, so nothing was restored." };
  }
  const data: Data = {
    profile,
    prefs: prefsOf(raw.prefs),
    google: isObj(raw.google) && isStr(raw.google.docId) && isStr(raw.google.url) && isStr(raw.google.syncedAt) ? { docId: raw.google.docId, url: raw.google.url, syncedAt: raw.google.syncedAt } : null,
    seenWelcome: true,
    ritual: { date: "", done: [] },
    visits: 0,
    installHintDismissed: raw.installHintDismissed === true,
    contact: contactOf(raw.contact),
    contactDismissed: raw.contactDismissed === true,
    tarot: tarot as TarotSession[],
    journal: journal as JournalEntry[],
  };
  return {
    ok: true,
    data,
    summary: {
      name: profile?.name ?? null,
      birthDate: profile?.birthDate ?? null,
      tarot: data.tarot.length,
      journal: data.journal.length,
      exportedAt: isStr(raw.exportedAt) ? raw.exportedAt : null,
    },
  };
}
