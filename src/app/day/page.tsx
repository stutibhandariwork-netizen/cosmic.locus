"use client";

import { SIGN_GLYPH } from "@/lib/content/glyphs";
import Link from "next/link";
import { useMemo } from "react";
import { WithChart } from "@/components/gate";
import { AREA_FILL, ReadingCard } from "@/components/ui";
import { templateAffirmation } from "@/lib/affirmations";
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
  const affirmation = templateAffirmation(facts);
  const [, m, d] = profile.birthDate.split("-").map(Number);
  const personal = personalCycles(m, d, day.parts);
  const vedic = prefs.system === "vedic";
  const dateLabel = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: tz }).format(new Date());

  const areas = [
    { id: "love", title: "Love", fill: AREA_FILL.love, ...r.love },
    { id: "work", title: "Work", fill: AREA_FILL.work, ...r.work },
    { id: "self-care", title: "Self-care", fill: AREA_FILL.selfcare, ...r.selfcare },
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

      <ReadingCard eyebrow={`Read from your ${r.base.body} in ${r.base.signName} ${SIGN_GLYPH[r.base.sign]}`} headline={r.headline}>
        <p>{r.body}</p>
        <p className="text-[15px] text-muted">
          Why: today the Moon is in {r.moonSign}, the {ordinal(r.house)} sign counted from your {r.base.signName} {r.base.body}. That part of your chart is
          about {r.zone}.
        </p>
      </ReadingCard>

      {areas.map((a) => (
        <section key={a.id} id={a.id} className="card scroll-mt-6">
          <p className="flex items-center gap-2 text-[13px] font-bold tracking-[0.14em] uppercase">
            <span className={`size-4 rounded-full border-2 border-cocoa ${a.fill}`} aria-hidden />
            {a.title}
          </p>
          <h2 className="font-display text-[22px] leading-tight font-semibold">{a.line}</h2>
          <p>{a.detail}</p>
        </section>
      ))}

      <ReadingCard eyebrow="Today's affirmation" headline={`“${affirmation.text}”`}>
        {vedic && <p className="text-[15px] text-muted">{affirmation.why}</p>}
      </ReadingCard>

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
    </div>
  );
}
