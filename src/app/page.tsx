"use client";

import { Glyph } from "@/components/glyph";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { MoonPhaseIcon, Sparkle, Star8, SunFace } from "@/components/art";
import { Loading } from "@/components/gate";
import { Onboarding } from "@/components/onboarding";
import { CardOfTheDay, todaysCard } from "@/components/tarot/today-card";
import { AreaTile, LinkRow, NextStep, ReadingCard, RitualHeading } from "@/components/ui";
import { WelcomeGuide } from "@/components/welcome";
import { templateAffirmation } from "@/lib/affirmations";
import { dailyFacts } from "@/lib/astrology/daily";
import type { NatalChart } from "@/lib/engine";
import { journalPrompt } from "@/lib/journal/core";
import { deviceTimeZone, localDay, useChart } from "@/lib/chart";
import { fmtTime } from "@/lib/format";
import { moonNow, moonSignChange } from "@/lib/sky";
import { markRitual, useData, type Data, type Prefs, type Profile } from "@/lib/store";
import { greetingFor, todayReading } from "@/lib/today";

export default function Home() {
  const data = useData();
  const chart = useChart(data?.profile);
  if (!data) return <Loading />;
  if (!data.profile || !chart) return <Onboarding />;
  if (!data.seenWelcome) return <WelcomeGuide name={data.profile.name.split(" ")[0]} />;
  return <Today data={data} profile={data.profile} chart={chart.chart} prefs={data.prefs} />;
}

const STEPS = ["read", "card", "affirmation", "write"] as const;

function Today({ data, profile, chart, prefs }: { data: Data; profile: Profile; chart: NatalChart; prefs: Prefs }) {
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
  const facts = useMemo(() => dailyFacts(chart, day.start, day.date), [chart, day]);
  const affirmation = templateAffirmation(facts);

  // Ritual progress for today: stored steps, plus what the data already shows.
  const stored = data.ritual.date === day.date ? data.ritual.done : [];
  const done = {
    read: stored.includes("read"),
    card: stored.includes("card") || todaysCard(data) !== null,
    affirmation: stored.includes("affirmation"),
    write: stored.includes("write") || data.journal.some((e) => e.date === day.date),
  };
  const count = STEPS.filter((k) => done[k]).length;

  // "Read your day" is done once the reading has been on screen for a moment.
  const readRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = readRef.current;
    if (!el || done.read) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(t);
        if (e.isIntersecting) t = setTimeout(() => markRitual(day.date, "read"), 2500);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [done.read, day.date]);

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
        <section className="flex items-center justify-between gap-3 px-1" aria-label="Today's ritual">
          <p className="font-display text-lg font-semibold">Your ritual today</p>
          <p className="flex items-center gap-1" role="img" aria-label={`${count} of 4 done`}>
            {STEPS.map((k) => (
              <Star8 key={k} size={18} fill={done[k] ? "var(--ochre)" : "none"} strokeWidth={1} />
            ))}
            <span className="ml-1 text-[13px] font-bold">{count}/4</span>
          </p>
        </section>

        <RitualHeading n={1} title="Read your day" done={done.read} />
        <div ref={readRef}>
          <ReadingCard
            eyebrow={
              <>
                Read from your {reading.base.body} in {reading.base.signName} <Glyph sign={reading.base.sign} />
              </>
            }
            headline={reading.headline}
            action={
              <Link href="/day/" className="btn" onClick={() => markRitual(day.date, "read")}>
                Read deeper
              </Link>
            }
          >
            <p>{reading.body}</p>
          </ReadingCard>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <AreaTile href="/day/#love" area="love" title="Love" line={reading.love.line} />
          <AreaTile href="/day/#work" area="work" title="Work" line={reading.work.line} />
          <AreaTile href="/day/#self-care" area="selfcare" title="Self-care" line={reading.selfcare.line} />
        </div>

        <div className="flex items-center gap-3 rounded-[18px] border-2 border-outline bg-surface px-3.5 py-2.5">
          <MoonPhaseIcon elongation={moon.elongation} />
          <div className="flex flex-col text-[15px] leading-snug">
            <p>
              <b>{moon.phase}</b> · Moon in {moon.signName} <Glyph sign={moon.sign} />
              {prefs.system === "vedic" && ` · ${moon.nakshatra}`}
            </p>
            {change && (
              <p className="text-muted">
                Moves into {change.signName} at {fmtTime(change.at.toISOString(), tz)}
              </p>
            )}
          </div>
        </div>
        {!done.card && <NextStep href="#ritual-card" label="Pull a card for today" />}

        <div id="ritual-card" className="mt-4 flex scroll-mt-4 flex-col gap-3">
          <RitualHeading n={2} title="Pull today's card" done={done.card} />
          <CardOfTheDay data={data} compact onPulled={() => markRitual(day.date, "card")} />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <RitualHeading n={3} title="Your affirmation" done={done.affirmation} />
          <section className="card">
            <p className="eyebrow">Say it once, out loud or in your head</p>
            <p className="headline">“{affirmation.text}”</p>
            {done.affirmation ? (
              <p className="font-bold" role="status">
                You&apos;re carrying it with you today.
              </p>
            ) : (
              <button type="button" className="btn mt-1 self-start" onClick={() => markRitual(day.date, "affirmation")}>
                I&apos;ll carry this today
              </button>
            )}
          </section>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <RitualHeading n={4} title="Write one line" done={done.write} />
          <section className="card">
            <p className="eyebrow">Today&apos;s prompt</p>
            <p className="font-display text-[22px] leading-tight font-semibold">{journalPrompt(facts)}</p>
            {done.write ? (
              <p className="font-bold">Written. Lovely.</p>
            ) : (
              <Link href="/journal/" className="btn mt-1 self-start">
                Write one line
              </Link>
            )}
          </section>
        </div>

        {count === 4 && (
          <section className="card items-center bg-butter text-center text-cocoa" role="status">
            <p className="flex gap-1" aria-hidden>
              <Star8 size={20} />
              <Star8 size={26} />
              <Star8 size={20} />
            </p>
            <p className="headline">You&apos;re all set for today.</p>
            <p>See you tomorrow, {firstName}.</p>
          </section>
        )}

        <div className="mt-4">
          <LinkRow href="/week/" title="This week" sub="Where each planet is heading, and what it means for you" />
        </div>
      </div>
    </div>
  );
}
