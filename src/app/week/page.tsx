"use client";

import Link from "next/link";
import { useMemo } from "react";
import { GLYPH } from "@/components/astrology/format";
import { WithChart } from "@/components/gate";
import { weekStart, weeklyFacts, type PlanetWeek, type SignStay } from "@/lib/astrology/weekly";
import { deviceTimeZone } from "@/lib/chart";
import { utcOffsetMinutes, type NatalChart, type TransitEvent } from "@/lib/engine";
import { LIFE_AREAS } from "@/lib/content/plain";
import { fmtLocal, ordinal } from "@/lib/format";

const EVENT: Record<TransitEvent["type"], (e: TransitEvent) => string> = {
  ingress: (e) => `Enters ${e.toSignName}`,
  station_retrograde: () => "Turns retrograde",
  station_direct: () => "Turns direct",
  combust_start: () => "Becomes combust (too close to the Sun)",
  combust_end: () => "Leaves combustion",
  nakshatra_change: (e) => `Enters ${e.nakshatra}`,
};

export default function WeekPage() {
  return <WithChart>{({ chart }) => <Week chart={chart} />}</WithChart>;
}

function Week({ chart }: { chart: NatalChart }) {
  const tz = deviceTimeZone();
  const facts = useMemo(() => {
    const start = weekStart(new Date(), (d) => utcOffsetMinutes(tz, d));
    return weeklyFacts(chart, start, new Date(start.getTime() + 7 * 86_400_000));
  }, [chart, tz]);
  const hasLagna = facts.reference.lagnaSign !== null;
  const nowIso = new Date().toISOString();
  const houses = (s: Pick<SignStay, "houseFromMoon" | "houseFromLagna">) =>
    `your ${LIFE_AREAS[s.houseFromMoon].short} zone (${ordinal(s.houseFromMoon)} from Moon${hasLagna && s.houseFromLagna ? ` · ${ordinal(s.houseFromLagna)} from lagna` : ""})`;

  return (
    <div className="flex flex-col gap-8">
      <Link href="/" className="link self-start py-2.5">
        ← Today
      </Link>
      <header className="flex flex-col gap-0.5 px-1">
        <h1 className="title">This week</h1>
        <p className="font-bold">
          {fmtLocal(facts.week.start, tz).replace(/ \d{4}$/, "")} – {fmtLocal(new Date(new Date(facts.week.end).getTime() - 1).toISOString(), tz)}
        </p>
        <p className="text-[15px] text-muted">
          Houses counted from your Moon in {facts.reference.moonSign}
          {hasLagna ? ` and your ${facts.reference.lagnaSign} lagna` : ""}.
        </p>
      </header>

      {facts.dasha.atStart && (
        <section className="flex flex-col gap-3">
          <h2 className="h2">Your dasha</h2>
          <div className="card grid grid-cols-3 gap-2 text-center text-[15px]">
            {(["mahadasha", "antardasha", "pratyantar"] as const).map((level) => {
              const p = facts.dasha.atStart![level];
              return (
                <div key={level}>
                  <p className="text-[13px] text-muted capitalize">{level}</p>
                  <p className="font-display text-lg font-semibold">
                    <span className="text-accent">{GLYPH[p.lord]}</span> {p.lord}
                  </p>
                  <p className="text-[13px] text-muted">to {fmtLocal(p.end, tz)}</p>
                </div>
              );
            })}
          </div>
          {facts.dasha.changes.map((c) => (
            <p key={c.level} className="rounded-xl bg-accent-soft px-4 py-2 text-[15px]">
              {fmtLocal(c.date, tz)}: {c.level} changes from {c.from} to <strong>{c.to}</strong>.
            </p>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="h2">Planet by planet</h2>
        {facts.planets.map((p) => (
          <PlanetCard key={p.graha} p={p} tz={tz} houses={houses} future={p.now.since > nowIso} />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="h2">
          <span className="text-accent">{GLYPH.Moon}</span> The Moon this week
        </h2>
        <ol className="card divide-y divide-line p-0">
          {facts.moon.map((m) => (
            <li key={m.from} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[15px]">
              <span className="font-medium">{m.sign}</span>
              <span className="text-[13px] text-muted">{houses(m)}</span>
              <span className="shrink-0 text-[13px] text-muted tabular-nums">{fmtLocal(m.from, tz, true).replace(/ \d{4},/, ",")}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Stay({ s }: { s: SignStay }) {
  return (
    <>
      {s.dignity && <span className={`chip ${s.dignity === "debilitated" ? "text-warn" : "text-good"}`}>{s.dignity}</span>}
      {s.overNatal.length > 0 && <span className="chip">on your natal {s.overNatal.join(", ")}</span>}
    </>
  );
}

function PlanetCard({ p, tz, houses, future }: { p: PlanetWeek; tz: string; houses: (s: Pick<SignStay, "houseFromMoon" | "houseFromLagna">) => string; future: boolean }) {
  return (
    <article className="card flex flex-col gap-4">
      <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
        <span className="text-accent">{GLYPH[p.graha]}</span> {p.graha}
        {p.now.retrograde && p.graha !== "Rahu" && p.graha !== "Ketu" && <span className="chip">retrograde</span>}
        {p.now.combust && <span className="chip text-warn">combust</span>}
      </h3>
      <dl className="grid gap-3 text-[15px]">
        <div className="grid grid-cols-[4.5rem_1fr] gap-2">
          <dt className="text-[13px] font-semibold text-muted uppercase">Before</dt>
          <dd className="flex flex-col gap-1">
            <span>
              <strong>{p.before.signName}</strong> · {houses(p.before)}
            </span>
            <span className="text-[13px] text-muted">
              {fmtLocal(p.before.from, tz)} – {fmtLocal(p.before.to, tz)}
            </span>
            <span className="flex flex-wrap gap-1">
              <Stay s={p.before} />
            </span>
          </dd>
        </div>
        <div className="grid grid-cols-[4.5rem_1fr] gap-2">
          <dt className="text-[13px] font-semibold text-accent uppercase">{future ? "Moving to" : "Now"}</dt>
          <dd className="flex flex-col gap-1">
            <span>
              <strong>{p.now.signName}</strong> {p.now.degree}° · {houses(p.now)}
            </span>
            <span className="text-[13px] text-muted">
              {future ? "From" : "Since"} {fmtLocal(p.now.since, tz)} · {p.now.nakshatra}
            </span>
            <span className="flex flex-wrap gap-1">
              <Stay s={p.now} />
              {p.now.aspectsNatal.length > 0 && <span className="chip">aspects natal {p.now.aspectsNatal.join(", ")}</span>}
            </span>
          </dd>
        </div>
        {p.thisWeek.length > 0 && (
          <div className="grid grid-cols-[4.5rem_1fr] gap-2">
            <dt className="text-[13px] font-semibold text-muted uppercase">This week</dt>
            <dd>
              <ul className="flex flex-col gap-0.5">
                {p.thisWeek.map((e) => (
                  <li key={e.date + e.type}>
                    <span className="text-muted">{fmtLocal(e.date, tz, true)}:</span> {EVENT[e.type](e)}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {p.next && (
          <div className="grid grid-cols-[4.5rem_1fr] gap-2">
            <dt className="text-[13px] font-semibold text-muted uppercase">Next</dt>
            <dd>
              {p.next.signName} on {fmtLocal(p.next.date, tz)} <span className="text-[13px] text-muted">· {houses(p.next)}</span>
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}
