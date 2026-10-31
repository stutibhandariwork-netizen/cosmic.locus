"use client";

import Link from "next/link";
import { CardBack } from "@/components/tarot/card-back";
import { fmtLocal } from "@/lib/format";
import { useData } from "@/lib/store";
import { DECK } from "@/lib/tarot/deck";
import { SPREADS, spreadByKey } from "@/lib/tarot/spreads";

export default function TarotHome() {
  const data = useData();
  const daily = SPREADS.find((s) => s.key === "CARD_OF_DAY")!;
  const general = SPREADS.filter((s) => s.key === "THREE_CARD" || s.key === "YES_NO");
  const areas = SPREADS.filter((s) => ["LOVE", "CAREER", "MONEY"].includes(s.key));
  const recent = data?.tarot.slice(0, 6) ?? [];

  return (
    <div className="flex flex-col gap-10 pt-4">
      <header>
        <p className="eyebrow">Rider-Waite-Smith · 78 cards</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Tarot</h1>
        <p className="mt-2 text-muted">
          Each reading starts with a fresh, securely shuffled deck. The order is fixed before you choose, so your picks are
          really yours.
        </p>
      </header>

      <Link href={`/tarot/new/?spread=${daily.slug}`} className="card flex items-center gap-4 border-accent/50 bg-accent-soft">
        <CardBack className="w-14 shrink-0 drop-shadow" />
        <div className="flex-1">
          <h2 className="font-display text-xl font-semibold">{daily.title}</h2>
          <p className="text-sm text-muted">{daily.blurb}</p>
        </div>
        <span className="btn shrink-0 px-5">Draw</span>
      </Link>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold">Readings</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {general.map((s) => (
            <Link key={s.key} href={`/tarot/new/?spread=${s.slug}`} className="card transition hover:border-accent/60">
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold">Life areas</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {areas.map((s) => (
            <Link key={s.key} href={`/tarot/new/?spread=${s.slug}`} className="card transition hover:border-accent/60">
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.positions.map((p) => p.name).join(" · ")}</p>
            </Link>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-semibold">Recent</h2>
          <ul className="card divide-y divide-line p-0">
            {recent.map((r) => {
              const spread = spreadByKey(r.spread);
              const first = r.picks[0] ? DECK[r.deckOrder[r.picks[0] - 1]] : null;
              return (
                <li key={r.id}>
                  <Link href={`/tarot/reading/?id=${r.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-2">
                    <div className="min-w-0">
                      <p className="font-medium">{spread.title}</p>
                      <p className="truncate text-xs text-muted">{r.question ?? (first ? first.name : "Not drawn yet")}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted">
                      {r.picks.length >= spread.positions.length ? fmtLocal(r.createdAt, Intl.DateTimeFormat().resolvedOptions().timeZone) : "Continue"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
