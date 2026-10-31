"use client";

import { ChartTabs } from "@/components/astrology/chart-tabs";
import { BorderlineNote, CoreSigns, DashaTimeline, Placements, SaturnCycles, Section } from "@/components/astrology/sections";
import { WithChart } from "@/components/gate";
import { northIndianChartSvg, type NatalChart } from "@/lib/engine";
import { fmtLocal } from "@/lib/format";

export default function ChartPage() {
  return (
    <WithChart>
      {({ profile, chart, timeNote }) => (
        <div className="flex flex-col gap-12 pt-4">
          <header>
            <p className="eyebrow">Your birth chart</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">{profile.name}</h1>
            <p className="mt-2 text-sm text-muted">
              {fmtLocal(`${profile.birthDate}T12:00:00Z`, "UTC")}
              {profile.birthTime ? ` · ${profile.birthTime}` : " · time unknown"} · {profile.place.label}
            </p>
            {timeNote && <p className="mt-1 text-xs text-muted">{timeNote}</p>}
          </header>

          <Section eyebrow="The three pillars" title="Core signs">
            <CoreSigns chart={chart} />
            <BorderlineNote chart={chart} />
            {!chart.lagna && (
              <p className="rounded-2xl border border-line bg-surface-2 p-4 text-sm text-muted">
                Without an exact birth time, houses are counted from your Moon sign (Chandra lagna).
              </p>
            )}
          </Section>

          <Section eyebrow="The map" title="Your chart">
            <div className="card">
              <ChartTabs
                d1={northIndianChartSvg(chart, { title: "Birth chart (D1)" })}
                d9={northIndianChartSvg(chart, {
                  ascendantSign: chart.navamsa.lagnaSign ?? chart.navamsa.planets.Moon,
                  planetSigns: chart.navamsa.planets,
                  title: "Navamsa chart (D9)",
                })}
              />
            </div>
          </Section>

          <Section eyebrow="Nine grahas" title="Planet placements">
            <Placements chart={chart} />
          </Section>

          <Section eyebrow="Combinations" title="Key patterns">
            <YogaDetails chart={chart} />
          </Section>

          <Section eyebrow="Vimshottari dasha" title="The chapters of your life">
            <DashaTimeline chart={chart} />
          </Section>

          <Section eyebrow="Saturn's rhythm" title="Big life cycles">
            <SaturnCycles chart={chart} />
          </Section>

          <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">
            In the full Grahify app, an astrologer-style reading of all of this is written for you in English, Hindi or Odia.
          </p>
        </div>
      )}
    </WithChart>
  );
}

/** The yogas present, with the engine's plain explanation of each. */
function YogaDetails({ chart }: { chart: NatalChart }) {
  const present = chart.yogas.filter((y) => y.present);
  if (!present.length) return <p className="text-sm text-muted">None of the classic yogas we check for are present.</p>;
  return (
    <ul className="grid gap-2">
      {present.map((y) => (
        <li key={y.key} className="card p-4">
          <p className="font-semibold">
            {y.name}
            {y.cancelled ? <span className="chip ml-2">cancelled</span> : null}
          </p>
          <p className="mt-1 text-sm text-muted">{y.details}</p>
        </li>
      ))}
    </ul>
  );
}
