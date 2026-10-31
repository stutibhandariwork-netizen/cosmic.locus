"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { templateAffirmation } from "@/lib/affirmations";
import { dailyFacts } from "@/lib/astrology/daily";
import { useChart, deviceTimeZone, localDay } from "@/lib/chart";
import { fmtLocal, fmtTime, ordinal } from "@/lib/format";
import { journalPrompt } from "@/lib/journal/core";
import { personalCycles } from "@/lib/numerology/calc";
import { PERSONAL_YEAR } from "@/lib/numerology/meanings";
import { useData } from "@/lib/store";
import { cardImage, DECK } from "@/lib/tarot/deck";
import { GLYPH } from "@/components/astrology/format";
import { Loading } from "@/components/gate";
import { ProfileForm } from "@/components/profile-form";
import { CardBack } from "@/components/tarot/card-back";

export default function Home() {
  const data = useData();
  const chart = useChart(data?.profile);
  const tz = typeof window === "undefined" ? "Asia/Kolkata" : deviceTimeZone();
  const today = useMemo(() => localDay(new Date(), tz), [tz]);
  const facts = useMemo(() => (chart ? dailyFacts(chart.chart, today.start, today.date) : null), [chart, today]);

  if (!data) return <Loading />;
  if (!data.profile || !chart || !facts) return <Welcome />;

  const p = data.profile;
  const firstName = p.name.split(" ")[0];
  const greeting = today.hour < 12 ? "Good morning" : today.hour < 17 ? "Good afternoon" : "Good evening";
  const a = templateAffirmation(facts);
  const [, m, d] = p.birthDate.split("-").map(Number);
  const personal = personalCycles(m, d, today.parts);
  const cardOfDay = data.tarot.find((s) => s.spread === "CARD_OF_DAY" && s.createdAt >= today.start.toISOString());
  const drawn = cardOfDay?.picks[0] ? { card: DECK[cardOfDay.deckOrder[cardOfDay.picks[0] - 1]], reversed: cardOfDay.reversals[cardOfDay.picks[0] - 1] } : null;

  return (
    <div className="flex flex-col gap-6 pt-4">
      <header>
        <p className="text-sm text-muted">{fmtLocal(today.start.toISOString(), tz)}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">
          {greeting}, {firstName}
        </h1>
      </header>

      <section className="card relative overflow-hidden border-accent/40 p-6">
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-accent/10 blur-2xl" />
        <p className="eyebrow">Today&apos;s affirmation</p>
        <blockquote className="mt-3 font-display text-2xl leading-snug font-medium sm:text-3xl">“{a.text}”</blockquote>
        <p className="mt-4 text-sm text-muted">{a.why}</p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="card flex flex-col gap-1 p-4">
          <p className="text-xs font-medium text-muted">Moon today</p>
          <p className="font-display text-xl font-semibold">
            <span className="text-accent">{GLYPH.Moon}</span> {facts.moon.sign}
          </p>
          <p className="text-xs text-muted">
            {ordinal(facts.moon.houseFromMoon)} from your Moon · {facts.moon.nakshatra}
          </p>
          {facts.moon.changes && (
            <p className="text-xs text-muted">
              Into {facts.moon.changes.sign} at {fmtTime(facts.moon.changes.at, tz)}
            </p>
          )}
        </div>
        {facts.dasha && (
          <Link href="/chart/" className="card flex flex-col gap-1 p-4 hover:border-accent/60">
            <p className="text-xs font-medium text-muted">Your dasha</p>
            <p className="font-display text-xl font-semibold">
              {facts.dasha.mahadasha.lord}–{facts.dasha.antardasha.lord}
            </p>
            <p className="text-xs text-muted">Pratyantar: {facts.dasha.pratyantar.lord}</p>
          </Link>
        )}
        {drawn ? (
          <Link href={`/tarot/reading/?id=${cardOfDay!.id}`} className="card flex items-center gap-3 p-4 hover:border-accent/60">
            <div className="relative aspect-[100/172] w-11 shrink-0 overflow-hidden rounded">
              <Image src={cardImage(drawn.card)} alt="" fill sizes="44px" className={`object-cover ${drawn.reversed ? "rotate-180" : ""}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted">Card of the day</p>
              <p className="text-sm font-semibold">{drawn.card.name}</p>
            </div>
          </Link>
        ) : (
          <Link href="/tarot/new/?spread=card-of-the-day" className="card flex items-center gap-3 p-4 hover:border-accent/60">
            <CardBack className="w-11 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted">Card of the day</p>
              <p className="text-sm font-semibold text-accent">{cardOfDay ? "Choose your card" : "Draw today's card"}</p>
            </div>
          </Link>
        )}
        <Link href="/numerology/" className="card flex flex-col gap-1 p-4 hover:border-accent/60">
          <p className="text-xs font-medium text-muted">Personal day</p>
          <p className="font-display text-3xl font-semibold text-accent">{personal.day}</p>
          <p className="text-xs text-muted">{PERSONAL_YEAR[personal.day].split(":")[0]}</p>
        </Link>
      </div>

      <Link href="/week/" className="card flex items-center justify-between gap-3 border-accent/50 bg-accent-soft hover:opacity-90">
        <div>
          <p className="font-semibold">Your week, planet by planet</p>
          <p className="text-sm text-muted">Where each planet was, where it is, and what comes next</p>
        </div>
        <span aria-hidden className="text-xl text-accent">
          →
        </span>
      </Link>

      <Link href="/journal/" className="card flex flex-col gap-1 hover:border-accent/60">
        <span className="eyebrow">Today&apos;s journal prompt</span>
        <span className="font-display text-lg">{journalPrompt(facts)}</span>
      </Link>
    </div>
  );
}

function Welcome() {
  return (
    <div className="flex flex-col gap-10 pt-6">
      <section className="flex flex-col gap-4">
        <p className="eyebrow">Astrology · Tarot · Numerology</p>
        <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-tight">Your chart, read the way a good astrologer would.</h1>
        <p className="text-lg text-muted">
          Grahify calculates your Vedic chart precisely, from planet positions and dashas to this week&apos;s transits. This
          is the try-it version: it runs entirely in your browser and nothing you type leaves your device.
        </p>
      </section>
      <section className="card flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold">Your birth details</h2>
        <ProfileForm />
      </section>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Calculated, not guessed", "Positions, houses and dashas come from astronomical code (sidereal, Lahiri)."],
          ["Your time, your place", "Birthplaces worldwide with the correct historical time zone."],
          ["Private by design", "No account, no server. Delete it all any time from the profile button."],
        ].map(([t, b]) => (
          <div key={t} className="card">
            <h3 className="font-display text-lg font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-muted">{b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
