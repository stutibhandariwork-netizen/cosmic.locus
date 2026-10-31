"use client";

import { useSyncExternalStore } from "react";
import type { SpreadKey } from "./tarot/spreads";

/**
 * Everything is kept in this browser's localStorage. Nothing is sent anywhere.
 */

export interface Profile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string | null; // HH:mm, null when unknown
  place: { label: string; latitude: number; longitude: number; timeZone: string };
}

export interface TarotSession {
  id: string;
  spread: SpreadKey;
  question: string | null;
  createdAt: string;
  /** Shuffled when the reading starts, before any card is chosen. */
  deckOrder: number[];
  reversals: boolean[];
  picks: number[];
  clarifiers: { forPick: number; position: number }[];
}

export interface JournalEntry {
  id: string;
  text: string;
  prompt: string | null;
  /** What the note is about, captured when written. */
  link: { title: string; summary: string; href: string } | null;
  date: string; // local YYYY-MM-DD
  createdAt: string;
}

export interface Prefs {
  /** Sidereal (Lahiri) or tropical zodiac for signs shown across the app. */
  system: "vedic" | "western";
  /** "Comfort reading": a calmer Today screen with less decoration. */
  comfort: boolean;
}

/** The Google Doc the journal is copied to, if the visitor connected Google Docs. */
export interface GoogleDocLink {
  docId: string;
  url: string;
  syncedAt: string;
}

export type RitualStep = "read" | "card" | "affirmation" | "write";

export interface Data {
  profile: Profile | null;
  prefs: Prefs;
  google: GoogleDocLink | null;
  /** The "Your sky is ready" guide has been seen (shown once after onboarding). */
  seenWelcome: boolean;
  /** Today's ritual steps that are done, for one local date. */
  ritual: { date: string; done: RitualStep[] };
  tarot: TarotSession[];
  journal: JournalEntry[];
}

const KEY = "grahify-demo-v1";
export const DEFAULT_PREFS: Prefs = { system: "vedic", comfort: false };
const EMPTY: Data = { profile: null, prefs: DEFAULT_PREFS, google: null, seenWelcome: false, ritual: { date: "", done: [] }, tarot: [], journal: [] };

let cache: Data | null = null;
const listeners = new Set<() => void>();

function read(): Data {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<Data>) : {};
    cache = { ...EMPTY, ...saved, prefs: { ...DEFAULT_PREFS, ...saved.prefs } };
  } catch {
    cache = EMPTY;
  }
  return cache;
}

export function update(fn: (d: Data) => Data) {
  cache = fn(read());
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // storage full or blocked (private mode): keep working for this visit
  }
  listeners.forEach((l) => l());
}

export function clearAll() {
  cache = EMPTY;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/** The stored data, or null during the static pre-render (before the browser takes over). */
export function useData(): Data | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** The current data, outside React (e.g. right after an update). */
export const snapshot = () => read();

/** Marks a ritual step done for a local date (starting fresh on a new day). */
export const markRitual = (date: string, step: RitualStep) =>
  update((d) => {
    const done = d.ritual.date === date ? d.ritual.done : [];
    return done.includes(step) ? d : { ...d, ritual: { date, done: [...done, step] } };
  });

export const setPrefs = (p: Partial<Prefs>) => update((d) => ({ ...d, prefs: { ...d.prefs, ...p } }));

export const newId = () => crypto.randomUUID();
