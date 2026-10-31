"use client";

import { useMemo } from "react";
import { computeNatalChart, resolveLocalTime, utcOffsetMinutes, type NatalChart } from "./engine";
import type { Profile } from "./store";

/** The natal chart for a stored profile, calculated in the browser. */
export function chartFor(p: Profile): { chart: NatalChart; timeNote: string | null } {
  const resolved = resolveLocalTime(p.birthDate, p.birthTime ?? "12:00", p.place.timeZone);
  const timeNote =
    p.birthTime && resolved.kind === "ambiguous"
      ? "Clocks went back that night; the first occurrence of this time is used."
      : p.birthTime && resolved.kind === "nonexistent"
        ? "Clocks jumped forward that night; this time was read with the earlier offset."
        : null;
  const chart = computeNatalChart({
    utc: resolved.utc,
    latitude: p.place.latitude,
    longitude: p.place.longitude,
    timeKnown: p.birthTime !== null,
  });
  return { chart, timeNote };
}

export function useChart(p: Profile | null | undefined) {
  return useMemo(() => (p ? chartFor(p) : null), [p]);
}

/** The visitor's own time zone (from their device). */
export const deviceTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** Local calendar day in a time zone: date string, start instant, hour, parts. */
export function localDay(at: Date, timeZone: string) {
  const local = new Date(at.getTime() + utcOffsetMinutes(timeZone, at) * 60_000);
  const midnight = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  return {
    date: local.toISOString().slice(0, 10),
    start: new Date(midnight - utcOffsetMinutes(timeZone, new Date(midnight)) * 60_000),
    hour: local.getUTCHours(),
    parts: { year: local.getUTCFullYear(), month: local.getUTCMonth() + 1, day: local.getUTCDate() },
  };
}
