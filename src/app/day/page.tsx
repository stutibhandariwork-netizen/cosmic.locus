"use client";

import { Glyph } from "@/components/glyph";
import Link from "next/link";
import { useMemo } from "react";
import { WithChart } from "@/components/gate";
import { AREA_FILL, NextStep, ReadingCard } from "@/components/ui";
import { dailyFacts } from "@/lib/astrology/daily";
import { deviceTimeZone, localDay } from "@/lib/chart";
import type { NatalChart } from "@/lib/engine";
import { ordinal } from "@/lib/format";
import { journalPrompt } from "@/lib/journal/core";
import { personalCycles } from "@/lib/numerology/calc";
import { PERSONAL_DAY } from "@/lib/numerology/meanings";
import type { Prefs, Profile } from "@/lib/store";
import { todayReading } from "@/lib/today";

export default function DayPage() {
  return <WithChart>{({ profile, chart, data }) => <Day profile={profile} chart={chart} prefs={data.prefs} />}</WithChart>;
}

function Day({ profile, chart, prefs }: { profile: Profile; chart: NatalChart; prefs: Prefs }) {
  const tz = deviceTimeZone();
  const day = useMemo(() => localDay(new Date(), tz), [tz]);
  const r = useMemo(() => todayReading(profile, chart, prefs.system, day), [profile, chart, prefs.system, day]);
  const facts = useMemo(() => dailyFacts(chart, day.start, day.date), [chart, day]);
  const [, m, d] = profile.birthDate.split("-").map(Number);
  const personal = personalCycles(m, d, day.parts);
  const vedic = prefs.system === "vedic";
  const dateLabel = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: tz }).format(new Date());

  const areas = [
    { id: "love", title: "Love", planet: "Venus" as const, fill: AREA_FILL.love, ...r.love },
    { id: "career", title: "Career", planet: "Saturn" as const, fill: AREA_FILL.work, ...r.work },
    { id: "mind-body", title: "Mind & body", planet: "Moon" as const, fill: AREA_FILL.selfcare, ...r.selfcare },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Link href="/" className="link self-start py-2.5">
        ← Today
      </Link>
      <header className="flex flex-col gap-0.5 px-1">
        <h1 className="title">Today, in depth</h1>
        <p className="text-[15px] text-muted">{dateLabel}</p>
      </header>

      <ReadingCard eyebrow={
          <>
            Read from your {r.base.body} in {r.base.signName} <Glyph sign={r.base.sign} />
          </>
        } headline={r.headline}>
        <p>{r.body}</p>
        {r.also && (
          <p>
            <Glyph planet={r.also.planet} /> {r.also.text}
          </p>
        )}
        <p className="text-[15px] text-muted">
          Why: {r.sky}. It&apos;s the {ordinal(r.house)} sign counted from your {r.base.body} in {r.base.signName}, the part of your chart about {r.zone}.
        </p>
      </ReadingCard>

      {areas.map((a) => (
        <section key={a.id} id={a.id} className="card scroll-mt-6">
          <p className="flex items-center gap-2 text-[13px] font-bold tracking-[0.14em] uppercase">
            <span className={`size-4 rounded-full border-2 border-cocoa ${a.fill}`} aria-hidden />
            {a.title} <Glyph planet={a.planet} />
          </p>
          <h2 className="font-display text-[22px] leading-tight font-semibold">{a.line}</h2>
          <p>{a.detail}</p>
        </section>
      ))}


      {vedic && (facts.highlights.length > 0 || facts.dasha) && (
        <section className="card">
          <p className="eyebrow">In the sky today</p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            {facts.highlights.slice(0, 4).map((h) => (
              <li key={h.fact}>{h.fact}</li>
            ))}
            {facts.dasha && (
              <li>
                You are in your {facts.dasha.mahadasha.lord} period, with a {facts.dasha.antardasha.lord} sub-period.{" "}
                <Link href="/locus/#dasha" className="link">
                  See your timeline
                </Link>
              </li>
            )}
          </ul>
        </section>
      )}

      <ReadingCard
        eyebrow="Your personal day"
        headline={`Number ${personal.day}`}
        action={
          <Link href="/numerology/" className="btn-ghost">
            All your numbers
          </Link>
        }
      >
        <p>{PERSONAL_DAY[personal.day]}</p>
      </ReadingCard>

      <ReadingCard
        eyebrow="Journal prompt"
        headline={journalPrompt(facts)}
        action={
          <Link href="/journal/" className="btn">
            Write about it
          </Link>
        }
      />
      <NextStep href="/#ritual-card" label="Pull a card for today" />
    </div>
  );
}
