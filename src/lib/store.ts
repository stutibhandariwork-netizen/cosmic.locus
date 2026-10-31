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

export interface Data {
  profile: Profile | null;
  tarot: TarotSession[];
  journal: JournalEntry[];
}

const KEY = "grahify-demo-v1";
const EMPTY: Data = { profile: null, tarot: [], journal: [] };

let cache: Data | null = null;
const listeners = new Set<() => void>();

function read(): Data {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as Data) } : EMPTY;
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

export const newId = () => crypto.randomUUID();
