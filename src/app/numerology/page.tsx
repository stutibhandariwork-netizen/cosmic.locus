"use client";

import { useState } from "react";
import { Loading } from "@/components/gate";
import { PageHeader } from "@/components/ui";
import { deviceTimeZone, localDay } from "@/lib/chart";
import { letterValues, type NameSystem } from "@/lib/numerology/calc";
import { NUMBER_MEANINGS, numerologyProfile, PERSONAL_YEAR } from "@/lib/numerology/meanings";
import { useData } from "@/lib/store";
import Link from "next/link";

const SWATCH: Record<string, string> = {
  gold: "#d4a017", orange: "#e8812e", white: "#f7f4ee", silver: "#c0c0c8", yellow: "#f2cc2f", saffron: "#f4a12a",
  grey: "#8a8a94", "electric blue": "#2f6bff", green: "#3a9d5d", pink: "#f2a6c2", "light blue": "#9cc7f2",
  "light green": "#a8dba0", "dark blue": "#1f2e6b", black: "#151515", red: "#cc2f2f", coral: "#f07a63",
};

export default function NumerologyPage() {
  const data = useData();
  const [system, setSystem] = useState<NameSystem>("chaldean");
  const [nameOverride, setNameOverride] = useState<string | null>(null);
  if (!data) return <Loading />;
  if (!data.profile) {
    return (
      <div className="card mt-6 flex flex-col items-start gap-3">
        <p className="font-semibold">Add your birth details first</p>
        <Link href="/" className="btn">
          Start
        </Link>
      </div>
    );
  }

  const profile = data.profile;
  const name = nameOverride ?? profile.name;
  const today = localDay(new Date(), deviceTimeZone());
  const [y, m, d] = profile.birthDate.split("-").map(Number);
  const p = numerologyProfile({ year: y, month: m, day: d }, name, system, today.parts);
  const core = [
    { label: "Birth number", aka: "Mulank · psychic number", n: p.birth.value, from: `Day ${p.birth.compound}` },
    { label: "Life path", aka: "Bhagyank", n: p.lifePath.value, from: `${d}/${m}/${y} → ${p.lifePath.compound}` },
    ...(p.name ? [{ label: "Name number", aka: `Namank · ${system}`, n: p.name.value, from: `“${name}” → ${p.name.compound}` }] : []),
  ];

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Your numbers" sub="Numerology from your birth date and your name." />

      <section className="grid gap-3 sm:grid-cols-3">
        {core.map((c) => {
          const meaning = NUMBER_MEANINGS[c.n];
          return (
            <div key={c.label} className="card flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[15px] font-semibold">{c.label}</p>
                  <p className="text-[13px] text-muted">{c.aka}</p>
                </div>
                <p className="font-display text-5xl leading-none font-semibold text-accent">{c.n}</p>
              </div>
              <p className="font-display text-lg font-semibold">{meaning.title}</p>
              <p className="text-[15px]">{meaning.gifts}</p>
              <p className="text-[13px] text-muted">Watch for: {meaning.watch}</p>
              <p className="mt-auto pt-1 text-[13px] text-muted">
                {c.from}
                {meaning.planet ? ` · ruled by ${meaning.planet}` : ""}
              </p>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="h2">Your name</h2>
        <div className="card flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="label">
              Name to calculate
            </label>
            <input id="name" value={name} onChange={(e) => setNameOverride(e.target.value)} className="field" />
            <p className="hint">Try the spelling you use day to day. Only English letters are counted.</p>
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-surface-2 p-1 text-[15px]" role="radiogroup" aria-label="System">
            {(["chaldean", "pythagorean"] as const).map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={s === system}
                onClick={() => setSystem(s)}
                className={`rounded-full px-3 py-2 font-medium ${s === system ? "bg-surface text-ink shadow-sm" : "text-muted"}`}
              >
                {s === "chaldean" ? "Chaldean" : "Pythagorean"}
              </button>
            ))}
          </div>
        </div>
        {p.name ? (
          <div className="flex flex-wrap gap-1.5" aria-label="Letter values">
            {letterValues(name, system).map((l, i) => (
              <span key={i} className="flex w-8 flex-col items-center rounded-lg border border-line bg-surface py-1">
                <span className="text-[15px] font-semibold">{l.letter}</span>
                <span className="text-[13px] text-accent tabular-nums">{l.value}</span>
              </span>
            ))}
            <span className="ml-1 self-center text-[15px] text-muted">
              = {p.name.compound} → <strong className="text-ink">{p.name.value}</strong>
            </span>
          </div>
        ) : (
          <p className="rounded-xl bg-warn-soft px-4 py-3 text-[15px] text-warn">Name numbers use English letters. Type your name in English above.</p>
        )}
        <p className="text-[13px] text-muted">
          {system === "chaldean"
            ? "Chaldean (common in India) values letters 1–8 by sound; 9 is held sacred and not used."
            : "Pythagorean values A–Z as 1–9 in order and keeps master numbers 11, 22 and 33."}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="h2">Right now</h2>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["Personal year", p.personal.year, String(today.parts.year)],
              ["Personal month", p.personal.month, new Date(Date.UTC(2000, today.parts.month - 1, 1)).toLocaleString("en-IN", { month: "long", timeZone: "UTC" })],
              ["Personal day", p.personal.day, "Today"],
            ] as const
          ).map(([label, n, when]) => (
            <div key={label} className="card flex flex-col items-center gap-1 p-3 text-center">
              <p className="title text-accent">{n}</p>
              <p className="text-[13px] font-semibold">{label}</p>
              <p className="text-[13px] text-muted">{when}</p>
            </div>
          ))}
        </div>
        <p className="text-[15px]">
          <strong>This year: </strong>
          {PERSONAL_YEAR[p.personal.year]}
        </p>
        <p className="text-[15px]">
          <strong>Today: </strong>
          {PERSONAL_YEAR[p.personal.day]}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="h2">Lucky for you</h2>
        <div className="card grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-display text-3xl font-semibold text-accent">{p.lucky.number}</p>
            <p className="text-[13px] text-muted">Number</p>
            <p className="mt-1 text-[13px]">also {p.lucky.supportive.join(", ")}</p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold">{p.lucky.day}</p>
            <p className="text-[13px] text-muted">Day</p>
          </div>
          <div>
            <div className="flex justify-center gap-1.5">
              {p.lucky.colours.map((c) => (
                <span key={c} className="size-7 rounded-full border border-line" style={{ background: SWATCH[c] }} title={c} />
              ))}
            </div>
            <p className="mt-1 text-[13px] text-muted">{p.lucky.colours.join(", ")}</p>
          </div>
        </div>
        <p className="text-[13px] text-muted">Traditional associations of your birth number&apos;s planet, {p.lucky.planet}.</p>
      </section>
    </div>
  );
}
