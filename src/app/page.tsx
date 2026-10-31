"use client";

import { Glyph } from "@/components/glyph";
import Link from "next/link";
import { useMemo } from "react";
import { MoonPhaseIcon, Sparkle, Star8, SunFace } from "@/components/art";
import { Loading } from "@/components/gate";
import { Onboarding } from "@/components/onboarding";
import { AreaTile, ReadingCard } from "@/components/ui";
import { chartFor, deviceTimeZone, localDay, useChart } from "@/lib/chart";
import { fmtTime } from "@/lib/format";
import { moonNow, moonSignChange } from "@/lib/sky";
import { useData, type Prefs, type Profile } from "@/lib/store";
import { greetingFor, todayReading } from "@/lib/today";

export default function Home() {
  const data = useData();
  const chart = useChart(data?.profile);
  if (!data) return <Loading />;
  if (!data.profile || !chart) return <Onboarding />;
  return <Today profile={data.profile} chart={chart.chart} prefs={data.prefs} />;
}

function Today({ profile, chart, prefs }: { profile: Profile; chart: ReturnType<typeof chartFor>["chart"]; prefs: Prefs }) {
  const tz = deviceTimeZone();
  const now = useMemo(() => new Date(), []);
  const day = useMemo(() => localDay(now, tz), [now, tz]);
  const reading = useMemo(() => todayReading(profile, chart, prefs.system, day), [profile, chart, prefs.system, day]);
  const moon = useMemo(() => moonNow(now, prefs.system), [now, prefs.system]);
  const change = useMemo(() => moonSignChange(now, new Date(day.start.getTime() + 86_400_000), prefs.system), [now, day, prefs.system]);
  const calm = prefs.comfort;
  const heroH = calm ? 220 : 262;
  const dateLabel = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: tz }).format(now).replace(" ", " · ");
  const firstName = profile.name.split(" ")[0];

  return (
    <div className="-mx-4 -mt-6 flex flex-col">
      <div className="relative flex shrink-0 flex-col bg-peach px-5 pt-4" style={{ height: heroH }}>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-[13px] font-bold tracking-[0.14em] uppercase">{dateLabel}</p>
            <h1 className="font-display text-[22px] leading-tight font-semibold">
              {greetingFor(day.hour)}, {firstName}
            </h1>
          </div>
          <Link href="/settings/" aria-label="Settings" className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-cocoa bg-cream hover:bg-butter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
              <circle cx="16" cy="7" r="2" />
              <circle cx="8" cy="17" r="2" />
            </svg>
          </Link>
        </div>
        <div className="relative flex flex-1 items-end justify-center">
          {!calm && (
            <>
              <Star8 size={26} fill="var(--cream)" className="twinkle absolute" style={{ left: 34, bottom: 70 }} />
              <Star8 size={20} className="twinkle twinkle-2 absolute" style={{ right: 40, bottom: 110 }} />
              <Sparkle size={14} className="twinkle twinkle-3 absolute" style={{ right: 70, bottom: 34 }} />
              <Sparkle size={12} className="twinkle twinkle-2 absolute" style={{ left: 80, bottom: 140 }} />
            </>
          )}
          <div
            className="flex w-[170px] items-center justify-center overflow-hidden rounded-t-[85px] border-2 border-b-0 border-cocoa bg-butter"
            style={{ height: heroH - 92 }}
          >
            <SunFace size={150} face="var(--cream)" className="sun-wake" label={`Today's sun is smiling`} />
          </div>
        </div>
      </div>
      <div className="pattern-scallop-edge shrink-0" aria-hidden />

      <div className="flex flex-col gap-3.5 px-4 pt-1.5">
        <ReadingCard
          eyebrow={
            <>
              Read from your {reading.base.body} in {reading.base.signName} <Glyph sign={reading.base.sign} />
            </>
          }
          headline={reading.headline}
          action={
            <Link href="/day/" className="btn">
              Read deeper
            </Link>
          }
        >
          <p>{reading.body}</p>
        </ReadingCard>

        <div className="grid grid-cols-3 gap-2.5">
          <AreaTile href="/day/#love" area="love" title="Love" line={reading.love.line} />
          <AreaTile href="/day/#work" area="work" title="Work" line={reading.work.line} />
          <AreaTile href="/day/#self-care" area="selfcare" title="Self-care" line={reading.selfcare.line} />
        </div>

        <div className="flex items-center gap-3 rounded-[18px] border-2 border-outline bg-surface px-3.5 py-2.5">
          <MoonPhaseIcon elongation={moon.elongation} />
          <div className="flex flex-col text-[15px] leading-snug">
            <p>
              <b>{moon.phase}</b> · Moon in {moon.signName}
              {prefs.system === "vedic" && ` · ${moon.nakshatra}`}
            </p>
            {change && (
              <p className="text-muted">
                Moves into {change.signName} at {fmtTime(change.at.toISOString(), tz)}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
