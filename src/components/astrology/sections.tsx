"use client";

import { useState } from "react";
import { Glyph } from "@/components/glyph";
import { CHAPTERS, LIFE_AREAS, NAKSHATRA_MOOD, SATURN_PLAIN } from "@/lib/content/plain";
import { GRAHAS, SIGNS, type NatalChart, type PlanetPosition, type SaturnCycle } from "@/lib/engine";
import { ageAt, dms, fmtDate, fmtMonth, SANSKRIT } from "./format";

export function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1 h2">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function BorderlineNote({ chart }: { chart: NatalChart }) {
  const b = chart.lagna?.borderline;
  if (!chart.lagna || !b) return null;
  const mins = Math.abs(b.minutesToChange);
  return (
    <div className="rounded-3xl border border-accent/60 bg-accent-soft p-4 text-[15px]">
      <p className="font-semibold">Your lagna sits right on a sign boundary</p>
      <p className="mt-1 text-muted">
        It is {dms(chart.lagna.degree)} {SIGNS[chart.lagna.sign].en}. Had you been born about {mins} minute{mins === 1 ? "" : "s"}{" "}
        {b.minutesToChange < 0 ? "earlier" : "later"}, it would be {b.alternateSignName}. If you aren&apos;t sure of the exact
        minute, read both. The houses each planet falls in under {b.alternateSignName} rising are shown in the table below.
      </p>
    </div>
  );
}

const BADGES: [test: (p: PlanetPosition) => boolean, term: string, plain: string][] = [
  [(p) => p.dignity === "exalted", "Exalted", "at its strongest"],
  [(p) => p.dignity === "own", "Own sign", "at home"],
  [(p) => p.dignity === "debilitated", "Debilitated", "working harder here"],
  [(p) => p.retrograde && p.graha !== "Rahu" && p.graha !== "Ketu", "Retrograde", "looking back, reworking"],
  [(p) => p.combust, "Combust", "close to the Sun, quieter"],
];

/** Each planet: its sign and life area in plain words, with the house, nakshatra and degrees alongside. */
export function Placements({ chart, astrologer }: { chart: NatalChart; astrologer: boolean }) {
  const alt = chart.lagna?.borderline;
  return (
    <div className="card overflow-hidden p-0">
      <ul className="divide-y divide-line">
        {GRAHAS.map((g) => {
          const p = chart.planets[g];
          const badges = BADGES.filter(([t]) => t(p));
          return (
            <li key={g} className="flex gap-3 px-4 py-3">
              <span className="w-6 pt-0.5 text-center text-xl text-label">
                <Glyph planet={g} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="font-bold">
                    {g} {SANSKRIT[g] !== g && <span className="font-normal text-muted">· {SANSKRIT[g]}</span>}
                  </p>
                  <p className="text-[15px] tabular-nums">
                    {SIGNS[p.sign].en} <Glyph sign={p.sign} />
                    {astrologer && ` ${dms(p.degree)}`}
                  </p>
                </div>
                <p className="text-[15px]">
                  In your {LIFE_AREAS[p.house].zone} <span className="text-muted">· House {p.house}</span>
                  {alt && <span className="text-muted"> ({alt.alternateHouses[g]} if {alt.alternateSignName} rising)</span>}
                </p>
                <p className="text-[13px] text-muted">
                  {p.nakshatra.name}
                  {astrologer && ` pada ${p.nakshatra.pada}`}: {NAKSHATRA_MOOD[p.nakshatra.index]}
                </p>
                {badges.length > 0 && (
                  <p className="mt-1 flex flex-wrap gap-1.5">
                    {badges.map(([, term, plain]) => (
                      <span key={term} className="chip">
                        {term} <span className="ml-1 font-normal text-muted">· {plain}</span>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="border-t border-line px-4 py-2.5 text-[13px] text-muted">
        Sidereal zodiac (Lahiri ayanamsa {dms(chart.ayanamsa.degrees)}), whole-sign houses
        {chart.houseBasis === "moon" ? " counted from the Moon" : ""}, mean nodes. Calculated for your exact birth time and place.
      </p>
    </div>
  );
}

/**
 * Vimshottari dasha as "the chapters of your life": the previous chapter, the current one and the
 * next two, with the rest (up to about age 90) behind a button.
 */
export function LifeChapters({ chart, astrologer }: { chart: NatalChart; astrologer: boolean }) {
  const [all, setAll] = useState(false);
  const birth = chart.input.utc;
  const now = new Date().toISOString();
  const mds = chart.dasha.mahadashas.filter((m) => m.end > birth && ageAt(birth, m.start) < 90);
  const ci = mds.findIndex((m) => m.start <= now && now < m.end);
  const from = Math.max(0, (ci < 0 ? 0 : ci) - 1);
  const shown = all ? mds : mds.slice(from, from + 4);

  return (
    <div className="flex flex-col gap-3">
      <ol className="flex flex-col gap-3">
        {shown.map((m) => {
          const isNow = m.start <= now && now < m.end;
          const isPast = m.end <= now;
          const start = m.start < birth ? birth : m.start;
          const ch = CHAPTERS[m.lord];
          const ad = isNow ? m.antardashas.find((a) => a.start <= now && now < a.end) : undefined;
          const pd = ad?.pratyantars.find((x) => x.start <= now && now < x.end);
          const progress = isNow ? (Date.parse(now) - Date.parse(m.start)) / (Date.parse(m.end) - Date.parse(m.start)) : 0;
          return (
            <li key={m.start} className={`card gap-1.5 ${isNow ? "border-gold bg-gradient-to-b from-gold-soft to-[#fbf3dc] text-cocoa" : ""} ${isPast ? "opacity-75" : ""}`}>
              <p className={`text-[13px] font-bold tracking-[0.14em] uppercase ${isNow ? "text-rust" : "text-label"}`}>
                {isNow ? "You are here" : isPast ? "Before" : "Coming up"} · {new Date(start).getUTCFullYear()}–{new Date(m.end).getUTCFullYear()}
              </p>
              <h3 className="font-display text-[22px] leading-tight font-semibold">Your {ch.name}</h3>
              <p>{ch.theme[0].toUpperCase() + ch.theme.slice(1)}.</p>
              <p className={`text-[13px] ${isNow ? "" : "text-muted"}`}>
                <Glyph planet={m.lord} /> {m.lord} Mahadasha · {fmtMonth(start)} – {fmtMonth(m.end)} · age {ageAt(birth, start)}–{ageAt(birth, m.end)}
                {m.start < birth ? " (balance at birth)" : ""}
              </p>
              {isNow && ad && (
                <>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream" role="img" aria-label={`${Math.round(progress * 100)}% of this chapter done`}>
                    <div className="h-full rounded-full bg-rust" style={{ width: `${progress * 100}%` }} />
                  </div>
                  <p className="mt-1">
                    <b>Right now, until {fmtDate(ad.end)}:</b> the focus is {CHAPTERS[ad.lord].focus}, so {CHAPTERS[ad.lord].nudge}.
                  </p>
                  <p className="text-[13px]">
                    <Glyph planet={ad.lord} /> {ad.lord} Antardasha
                    {pd && (
                      <>
                        {" "}
                        · <Glyph planet={pd.lord} /> {pd.lord} Pratyantar until {fmtDate(pd.end)}
                      </>
                    )}
                  </p>
                  <details className="mt-1 text-[15px]">
                    <summary className="min-h-11 cursor-pointer content-center font-bold">The sub-chapters of this chapter</summary>
                    <ul className="mt-1 flex flex-col gap-1">
                      {m.antardashas.map((a) => (
                        <li key={a.start} className={`flex justify-between gap-3 rounded-lg px-2 py-1 ${a.start === ad.start ? "bg-cream font-bold" : ""}`}>
                          <span>
                            {CHAPTERS[a.lord].focus[0].toUpperCase() + CHAPTERS[a.lord].focus.slice(1)}
                            <span className="block text-[13px] font-normal">
                              {m.lord}–{a.lord}
                            </span>
                          </span>
                          <span className="shrink-0 text-[13px] tabular-nums">
                            {fmtMonth(a.start)} – {fmtMonth(a.end)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </>
              )}
              {astrologer && !isNow && <p className="text-[13px] text-muted">{m.years} years</p>}
            </li>
          );
        })}
      </ol>
      {mds.length > shown.length || all ? (
        <button type="button" className="btn-ghost self-start" onClick={() => setAll(!all)} aria-expanded={all}>
          {all ? "Show fewer chapters" : "Show your whole timeline"}
        </button>
      ) : null}
    </div>
  );
}

/** Joins pieces of one cycle that Saturn's retrograde split by less than a year, keeping the pauses. */
function groupCycles(cycles: SaturnCycle[]) {
  const YEAR = 365.25 * 86_400_000;
  const groups: { kind: SaturnCycle["kind"]; start: string; end: string; segments: SaturnCycle["segments"]; pauses: [string, string][] }[] = [];
  for (const c of cycles) {
    const last = groups.at(-1);
    if (last && last.kind === c.kind && new Date(c.start).getTime() - new Date(last.end).getTime() < YEAR) {
      last.pauses.push([last.end, c.start]);
      last.end = c.end;
      last.segments = [...last.segments, ...c.segments];
    } else {
      groups.push({ ...c, pauses: [] });
    }
  }
  return groups;
}

/**
 * Sade Sati and Ashtama Shani in plain words, framed as growth. By default: the most recent past
 * cycle, any current one, and the next one ahead.
 */
export function SaturnCycles({ chart }: { chart: NatalChart }) {
  const [all, setAll] = useState(false);
  const birth = chart.input.utc;
  const now = new Date().toISOString();
  const cycles = groupCycles(chart.saturnCycles).filter((c) => ageAt(birth, c.start) < 90);
  const lastPast = cycles.filter((c) => c.end <= now).at(-1);
  const current = cycles.filter((c) => c.start <= now && now < c.end);
  const next = cycles.find((c) => c.start > now);
  const focus = [lastPast, ...current, next].filter((c): c is (typeof cycles)[number] => !!c);
  const shown = all ? cycles : focus;
  const ages = (a: number, b: number) => (a === b ? `age ${a}` : `age ${a}–${b}`);

  if (!cycles.length) return <p className="text-[15px] text-muted">No Saturn cycles over your Moon in this lifetime window.</p>;
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-3">
        {shown.map((c) => {
          const isNow = c.start <= now && now < c.end;
          const isPast = c.end <= now;
          const t = SATURN_PLAIN[c.kind];
          return (
            <li key={c.start} className={`card gap-1.5 ${isNow ? "border-gold bg-gradient-to-b from-gold-soft to-[#fbf3dc] text-cocoa" : ""} ${isPast ? "opacity-75" : ""}`}>
              <p className={`text-[13px] font-bold tracking-[0.14em] uppercase ${isNow ? "text-rust" : "text-label"}`}>
                {isNow ? "Now" : isPast ? "Behind you" : "Ahead"} · {new Date(c.start).getUTCFullYear()}–{new Date(c.end).getUTCFullYear()}
              </p>
              <h3 className="font-display text-[22px] leading-tight font-semibold">{t.title}</h3>
              <p>{isNow ? t.now : isPast ? t.past : t.next}</p>
              <p className={`text-[13px] ${isNow ? "" : "text-muted"}`}>
                <Glyph planet="Saturn" /> {t.term}: {t.what} · {fmtMonth(c.start)} – {fmtMonth(c.end)} · {ages(ageAt(birth, c.start), ageAt(birth, c.end))}
              </p>
              {c.pauses.map(([from, to]) => (
                <p key={from} className="text-[13px] text-muted">
                  A breather from {fmtMonth(from)} to {fmtMonth(to)} while Saturn stepped back.
                </p>
              ))}
            </li>
          );
        })}
      </ul>
      {cycles.length > focus.length && (
        <button type="button" className="btn-ghost self-start" onClick={() => setAll(!all)} aria-expanded={all}>
          {all ? "Show fewer" : "Show every Saturn cycle"}
        </button>
      )}
    </div>
  );
}
