"use client";

import Link from "next/link";
import { useState } from "react";
import { ChartTabs } from "@/components/astrology/chart-tabs";
import { dms } from "@/components/astrology/format";
import { BorderlineNote, LifeChapters, Placements, SaturnCycles, Section } from "@/components/astrology/sections";
import { ZodiacWheel } from "@/components/astrology/wheel";
import { WithChart } from "@/components/gate";
import { Glyph } from "@/components/glyph";
import { LinkRow, NextStep, PageHeader, Segmented } from "@/components/ui";
import { STORY, yogaPlain } from "@/lib/content/plain";
import { lifeStory } from "@/lib/story";
import { MOON_LINES, RISING_LINES, SUN_LINES } from "@/lib/content/signs";
import { GRAHAS, houseFrom, northIndianChartSvg, SIGNS, type NatalChart } from "@/lib/engine";
import { fmtLocal } from "@/lib/format";
import { bigThree, type ZodiacSystem } from "@/lib/sky";
import { setPrefs, type Profile } from "@/lib/store";

export default function LocusPage() {
  return (
    <WithChart>
      {({ profile, chart, timeNote, data }) => <Locus profile={profile} chart={chart} timeNote={timeNote} system={data.prefs.system} astrologer={data.prefs.astrologer} />}
    </WithChart>
  );
}

function Locus({ profile, chart, timeNote, system, astrologer }: { profile: Profile; chart: NatalChart; timeNote: string | null; system: ZodiacSystem; astrologer: boolean }) {
  const three = bigThree(chart, system);
  const vedic = system === "vedic";
  const zodiac = vedic ? "measured against the stars (sidereal zodiac, Lahiri)" : "in the tropical zodiac";
  // Sanskrit sign names belong to the sidereal (Vedic) signs only.
  const sa = (sign: number) => (vedic ? SIGNS[sign].sa : undefined);
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

      <StoryCard chart={chart} system={system} />

      <figure className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo to-indigo-deep px-3 pt-4 pb-3 shadow-glow">
        <StarDust />
        <ZodiacWheel three={three} />
        <figcaption className="relative mt-2 text-center text-[13px] text-gold-soft">
          The sky the day you were born · {born}
          {profile.birthTime ? `, ${profile.birthTime}` : ""} · {profile.place.label.split(",")[0]}
        </figcaption>
      </figure>

      <h2 id="big-three" className="h2 mt-1 scroll-mt-6">
        Your big three
      </h2>
      <ul className="flex flex-col gap-2.5">
        <BigThreeRow dot="bg-gold" planet="Sun" sign={three.sun.sign} title={`Sun · ${three.sun.signName}`} sa={sa(three.sun.sign)} line={SUN_LINES[three.sun.sign]}>
          On {born} the Sun was at {dms(three.sun.degree)} {three.sun.signName}, {zodiac}. Your Sun sign is the heart of you: what you&apos;re building and what
          makes you feel most alive.
          {vedic && ` Its nakshatra is ${chart.planets.Sun.nakshatra.name}, pada ${chart.planets.Sun.nakshatra.pada}.`}
        </BigThreeRow>
        <BigThreeRow dot="bg-blush" planet="Moon" sign={three.moon.sign} title={`Moon · ${three.moon.signName}`} sa={sa(three.moon.sign)} line={MOON_LINES[three.moon.sign]}>
          The Moon was at {dms(three.moon.degree)} {three.moon.signName}, {zodiac}. Your Moon sign is your inner weather: how you feel and what soothes you.
          {vedic &&
            ` In Vedic astrology it matters most, so your daily reading is counted from it. Its nakshatra is ${chart.planets.Moon.nakshatra.name}, pada ${chart.planets.Moon.nakshatra.pada}.`}
        </BigThreeRow>
        {three.rising ? (
          <BigThreeRow dot="bg-periwinkle" sign={three.rising.sign} title={`Rising · ${three.rising.signName}`} sa={sa(three.rising.sign)} line={RISING_LINES[three.rising.sign]}>
            {three.rising.signName} was coming up over the eastern horizon at {profile.birthTime} in {profile.place.label}, at {dms(three.rising.degree)}. Your
            rising sign colours first impressions and sets the order of your houses.
            {vedic && chart.lagna && ` In Vedic astrology it is your lagna, in ${chart.lagna.nakshatra.name} nakshatra, pada ${chart.lagna.nakshatra.pada}.`}
            {timeNote && ` ${timeNote}`}
          </BigThreeRow>
        ) : (
          <li className="flex items-center gap-3 rounded-[18px] border border-dashed border-field bg-surface px-3.5 py-3">
            <span className="size-3.5 shrink-0 rounded-full border-2 border-periwinkle" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-bold">Add your birth time to unlock your rising sign</p>
              <p className="text-[15px] leading-snug text-muted">It changes every two hours or so and sets which life areas each planet touches. Even a rough time helps.</p>
            </div>
            <Link href="/settings/" className="flex min-h-11 items-center text-[15px] font-bold text-label">
              Add time
            </Link>
          </li>
        )}
      </ul>
      {vedic && <BorderlineNote chart={chart} />}
      <NextStep href="#chapters" label="See the chapter you're in now" />

      <div className="mt-8 flex flex-col gap-12">
        <div id="chapters" className="scroll-mt-6">
          <span id="dasha" />
          <Section eyebrow="Vimshottari dasha · Vedic" title="The chapters of your life">
            <LifeChapters chart={chart} astrologer={astrologer} />
            <NextStep href="/day/#love" label="What this means for love and career today" />
          </Section>
        </div>
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
              <Placements chart={chart} astrologer={astrologer} />
            </Section>
            <Section eyebrow="Yogas and doshas" title="Your special patterns">
              <YogaList chart={chart} astrologer={astrologer} />
            </Section>
            <Section eyebrow="Saturn cycles · Sade Sati" title="Your big growing-up seasons">
              <SaturnCycles chart={chart} />
            </Section>
          </>
        ) : (
          <Section eyebrow="Tropical zodiac" title="Where everything sits">
            <WesternPlacements chart={chart} />
          </Section>
        )}
        <Section eyebrow="Numerology" title="Your numbers">
          <LinkRow href="/numerology/" title="Your numbers" sub="Life path, birth number and today's personal day" />
        </Section>
      </div>
    </div>
  );
}

function BigThreeRow({
  dot,
  title,
  sa,
  line,
  planet,
  sign,
  children,
}: {
  dot: string;
  title: string;
  sa?: string;
  line: string;
  planet?: "Sun" | "Moon";
  sign: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = `why-${title.split(" ")[0].toLowerCase()}`;
  return (
    <li className="rounded-[18px] border border-outline bg-surface px-3.5 py-3 shadow-glow">
      <div className="flex items-center gap-3">
        <span className={`size-3.5 shrink-0 rounded-full ${dot}`} aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="font-bold">
            {planet && <Glyph planet={planet} />} {title} <Glyph sign={sign} />
            {sa && <span className="font-normal text-muted"> · {sa}</span>}
          </p>
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

/** The yogas and doshas present, in plain words first, with the real name and what formed it alongside. */
function YogaList({ chart, astrologer }: { chart: NatalChart; astrologer: boolean }) {
  const present = chart.yogas.filter((y) => y.present);
  const absent = chart.yogas.filter((y) => !y.present);
  return (
    <div className="flex flex-col gap-3">
      {present.length === 0 && (
        <p className="text-[15px] text-muted">None of the classic yogas we look for are in your chart. That&apos;s common, and not a bad thing.</p>
      )}
      <ul className="flex flex-col gap-3">
        {present.map((y) => {
          const plain = yogaPlain(y.key);
          return (
            <li key={y.key} className="card gap-1.5">
              <h3 className="font-display text-[22px] leading-tight font-semibold">{plain?.headline ?? y.name}</h3>
              {plain && <p>{plain.meaning}</p>}
              {y.cancelled && <p>Other planets around your Moon soften this a lot, so it&apos;s mild for you.</p>}
              {plain && (
                <p className="text-[15px]">
                  <b>Try this:</b> {plain.nudge}
                </p>
              )}
              {plain?.gentle && <p className="text-[15px] text-muted">{plain.gentle}</p>}
              <p className="border-t border-line pt-2 text-[13px] text-muted">
                <b>{y.name}</b>
                {y.cancelled ? " (cancelled)" : ""} · {yogaFacts(y, chart)}
              </p>
            </li>
          );
        })}
      </ul>
      {astrologer && absent.length > 0 && (
        <details className="card gap-2">
          <summary className="min-h-11 cursor-pointer content-center font-bold">Checked but not in your chart ({absent.length})</summary>
          <ul className="flex flex-col gap-2 text-[15px]">
            {absent.map((y) => (
              <li key={y.key}>
                <b>{y.name}</b>: {y.details}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

const MANGAL_HOUSES = [1, 2, 4, 7, 8, 12];
const nth = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

/** What formed a yoga, in astrological terms. For Mangal Dosha, only the reference points that trigger it. */
function yogaFacts(y: NatalChart["yogas"][number], chart: NatalChart): string {
  const p = chart.planets;
  if (y.key === "mangal_dosha") {
    const refs: [string, number][] = [...(chart.lagna ? [["your lagna", chart.lagna.sign] as [string, number]] : []), ["your Moon", p.Moon.sign], ["Venus", p.Venus.sign]];
    const hits = refs.map(([label, s]) => [label, houseFrom(p.Mars.sign, s)] as const).filter(([, h]) => MANGAL_HOUSES.includes(h));
    const strong = p.Mars.dignity === "own" || p.Mars.dignity === "exalted";
    return (
      `Mars in ${SIGNS[p.Mars.sign].en}, ` +
      hits.map(([label, h]) => `the ${nth(h)} house from ${label}`).join(" and ") +
      "." +
      (strong ? " Softened: Mars is in its own or exalted sign." : "")
    );
  }
  if (y.key === "budhaditya") return `Sun and Mercury together in ${SIGNS[p.Sun.sign].en}.`;
  if (y.key === "gajakesari") return `Jupiter in the ${nth(houseFrom(p.Jupiter.sign, p.Moon.sign))} house from your Moon, an angle (kendra).`;
  return y.details;
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

/** Who you are, the chapter you're in, and what's next: plain words first, the astrology alongside. */
function StoryCard({ chart, system }: { chart: NatalChart; system: ZodiacSystem }) {
  const story = lifeStory(chart, system);
  const { sun, moon, rising } = story.three;
  return (
    <section className="card" aria-labelledby="story-title">
      <p id="story-title" className="eyebrow">
        {STORY.title}
      </p>
      <ol className="flex flex-col gap-3">
        <li className="flex flex-col gap-0.5">
          <p className="font-display text-xl leading-snug font-semibold">{story.who}</p>
          <p className="text-[13px] text-muted">
            Sun {sun.signName} <Glyph sign={sun.sign} /> · Moon {moon.signName} <Glyph sign={moon.sign} />
            {rising && (
              <>
                {" "}
                · Rising {rising.signName} <Glyph sign={rising.sign} />
              </>
            )}
          </p>
        </li>
        {story.now && (
          <li className="flex flex-col gap-0.5 border-t border-line pt-3">
            <p>{story.now.line}</p>
            <p className="text-[13px] text-muted">
              <Glyph planet={story.now.mahadasha.lord} /> {story.now.mahadasha.lord} Mahadasha · <Glyph planet={story.now.antardasha.lord} />{" "}
              {story.now.antardasha.lord} Antardasha
            </p>
          </li>
        )}
        {story.next && (
          <li className="flex flex-col gap-0.5 border-t border-line pt-3">
            <p>{story.next.line}</p>
            <p className="text-[13px] text-muted">
              <Glyph planet={story.next.lord} /> {story.next.lord} {story.next.isChapter ? "Mahadasha" : "Antardasha"}
            </p>
          </li>
        )}
      </ol>
    </section>
  );
}

/** A scatter of faint stars behind the chart wheel. */
function StarDust() {
  const stars = [
    [8, 12], [22, 6], [40, 14], [62, 8], [80, 15], [93, 6], [5, 40], [95, 38], [10, 70], [90, 72], [18, 92], [36, 96], [70, 94], [86, 88],
  ];
  return (
    <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 ? 0.35 : 0.6} fill="var(--gold-soft)" fillOpacity={0.7} />
      ))}
    </svg>
  );
}
