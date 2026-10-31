"use client";

import Link from "next/link";
import { useState } from "react";
import { ChartTabs } from "@/components/astrology/chart-tabs";
import { dms } from "@/components/astrology/format";
import { BorderlineNote, DashaTimeline, Placements, SaturnCycles, Section } from "@/components/astrology/sections";
import { ZodiacWheel } from "@/components/astrology/wheel";
import { WithChart } from "@/components/gate";
import { PageHeader, Segmented } from "@/components/ui";
import { MOON_LINES, RISING_LINES, SUN_LINES } from "@/lib/content/signs";
import { GRAHAS, northIndianChartSvg, SIGNS, type NatalChart } from "@/lib/engine";
import { fmtLocal } from "@/lib/format";
import { bigThree, type ZodiacSystem } from "@/lib/sky";
import { setPrefs, type Profile } from "@/lib/store";

export default function LocusPage() {
  return (
    <WithChart>
      {({ profile, chart, timeNote, data }) => <Locus profile={profile} chart={chart} timeNote={timeNote} system={data.prefs.system} />}
    </WithChart>
  );
}

function Locus({ profile, chart, timeNote, system }: { profile: Profile; chart: NatalChart; timeNote: string | null; system: ZodiacSystem }) {
  const three = bigThree(chart, system);
  const vedic = system === "vedic";
  const zodiac = vedic ? "measured against the stars (sidereal zodiac, Lahiri)" : "in the tropical zodiac";
  const born = fmtLocal(`${profile.birthDate}T12:00:00Z`, "UTC");

  return (
    <div className="flex flex-col gap-3.5">
      <PageHeader
        title="Your Locus"
        sub="Your exact place in the sky"
        right={
          <Segmented
            label="Chart system"
            compact
            className="shrink-0"
            value={system}
            onChange={(s) => setPrefs({ system: s })}
            options={[
              { id: "vedic", label: "Vedic" },
              { id: "western", label: "Western" },
            ]}
          />
        }
      />

      <div className="py-1">
        <ZodiacWheel three={three} />
      </div>

      <h2 className="h2 mt-1">Your big three</h2>
      <ul className="flex flex-col gap-2.5">
        <BigThreeRow dot="bg-ochre" title={`Sun · ${three.sun.signName}`} line={SUN_LINES[three.sun.sign]}>
          On {born} the Sun was at {dms(three.sun.degree)} {three.sun.signName}, {zodiac}. Your Sun sign is the heart of you: what you&apos;re building and what
          makes you feel most alive.
        </BigThreeRow>
        <BigThreeRow dot="bg-blush" title={`Moon · ${three.moon.signName}`} line={MOON_LINES[three.moon.sign]}>
          The Moon was at {dms(three.moon.degree)} {three.moon.signName}, {zodiac}. Your Moon sign is your inner weather: how you feel and what soothes you.
          {vedic &&
            ` In Vedic astrology it matters most, so your daily reading is counted from it. Its nakshatra is ${chart.planets.Moon.nakshatra.name}, pada ${chart.planets.Moon.nakshatra.pada}.`}
        </BigThreeRow>
        {three.rising ? (
          <BigThreeRow dot="bg-periwinkle" title={`Rising · ${three.rising.signName}`} line={RISING_LINES[three.rising.sign]}>
            {three.rising.signName} was coming up over the eastern horizon at {profile.birthTime} in {profile.place.label}, at {dms(three.rising.degree)}. Your
            rising sign colours first impressions and sets the order of your houses.
            {timeNote && ` ${timeNote}`}
          </BigThreeRow>
        ) : (
          <li className="flex items-center gap-3 rounded-[18px] bg-surface px-3.5 py-3">
            <span className="size-3.5 shrink-0 rounded-full border-2 border-periwinkle" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-bold">Rising · needs your birth time</p>
              <p className="text-[15px] leading-snug text-muted">Your rising sign changes every two hours or so. Even a rough time helps.</p>
            </div>
            <Link href="/settings/" className="flex min-h-11 items-center text-[15px] font-bold text-label">
              Add time
            </Link>
          </li>
        )}
      </ul>
      {vedic && <BorderlineNote chart={chart} />}

      <div className="mt-8 flex flex-col gap-12">
        {vedic ? (
          <>
            <Section eyebrow="Indian style" title="Your birth chart">
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
              {!chart.lagna && <p className="text-[15px] text-muted">Without a birth time, houses are counted from your Moon sign.</p>}
            </Section>
            <Section eyebrow="Nine planets" title="Where everything sits">
              <Placements chart={chart} />
            </Section>
            <Section eyebrow="Combinations" title="Your special patterns">
              <YogaDetails chart={chart} />
            </Section>
            <div id="dasha" className="scroll-mt-6">
              <Section eyebrow="Vimshottari dasha" title="The chapters of your life">
                <DashaTimeline chart={chart} />
              </Section>
            </div>
            <Section eyebrow="Saturn's rhythm" title="Big life cycles">
              <SaturnCycles chart={chart} />
            </Section>
          </>
        ) : (
          <Section eyebrow="Tropical zodiac" title="Where everything sits">
            <WesternPlacements chart={chart} />
          </Section>
        )}
      </div>
    </div>
  );
}

function BigThreeRow({ dot, title, line, children }: { dot: string; title: string; line: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = `why-${title.split(" ")[0].toLowerCase()}`;
  return (
    <li className="rounded-[18px] bg-surface px-3.5 py-3">
      <div className="flex items-center gap-3">
        <span className={`size-3.5 shrink-0 rounded-full ${dot}`} aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="font-bold">{title}</p>
          <p className="text-[15px] leading-snug text-muted">{line}</p>
        </div>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} className="min-h-11 shrink-0 text-[15px] font-bold text-label">
          {open ? "Close" : "Why?"}
        </button>
      </div>
      {open && (
        <p id={id} className="mt-2 border-t border-line pt-2 text-[15px] leading-relaxed">
          {children}
        </p>
      )}
    </li>
  );
}

function YogaDetails({ chart }: { chart: NatalChart }) {
  const present = chart.yogas.filter((y) => y.present);
  if (!present.length) return <p className="text-[15px] text-muted">None of the classic yogas we look for are in your chart. That&apos;s common, and not a bad thing.</p>;
  return (
    <ul className="grid gap-2.5">
      {present.map((y) => (
        <li key={y.key} className="card gap-1 p-4">
          <p className="font-bold">
            {y.name}
            {y.cancelled ? <span className="chip ml-2">cancelled</span> : null}
          </p>
          <p className="text-[15px] text-muted">{y.details}</p>
        </li>
      ))}
    </ul>
  );
}

/** Tropical sign and degree for each planet. Houses and dashas are Vedic-only here. */
function WesternPlacements({ chart }: { chart: NatalChart }) {
  const shift = chart.ayanamsa.degrees;
  const rows = GRAHAS.filter((g) => g !== "Ketu").map((g) => {
    const lon = (chart.planets[g].longitude + shift) % 360;
    return { name: g === "Rahu" ? "North Node" : g, sign: SIGNS[Math.floor(lon / 30)].en, deg: dms(lon % 30), retro: chart.planets[g].retrograde && g !== "Rahu" };
  });
  return (
    <ul className="card gap-0 divide-y divide-line p-0">
      {rows.map((r) => (
        <li key={r.name} className="flex items-baseline justify-between gap-3 px-4 py-3">
          <span className="font-bold">{r.name}</span>
          <span className="text-[15px] tabular-nums">
            {r.deg} {r.sign}
            {r.retro && <span className="text-muted"> · retrograde</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
