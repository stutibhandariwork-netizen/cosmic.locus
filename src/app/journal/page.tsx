"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Loading } from "@/components/gate";
import { dailyFacts } from "@/lib/astrology/daily";
import { chartFor, deviceTimeZone, localDay } from "@/lib/chart";
import { fmtLocal } from "@/lib/format";
import { journalPrompt } from "@/lib/journal/core";
import { newId, update, useData, type JournalEntry, type TarotSession } from "@/lib/store";
import { viewOf } from "@/lib/tarot/local";
import { DECK } from "@/lib/tarot/deck";

export default function JournalPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Journal />
    </Suspense>
  );
}

function tarotLink(s: TarotSession): JournalEntry["link"] {
  const v = viewOf(s);
  const cards = v.cards.map((c) => `${c.positionName}: ${DECK[c.cardIndex].name}${c.reversed ? " (reversed)" : ""}`).join(" · ");
  return {
    title: s.question ? `${v.spread.title}: “${s.question}”` : v.spread.title,
    summary: v.verdict ? `${v.verdict}. ${cards}` : cards,
    href: `/tarot/reading/?id=${s.id}`,
  };
}

function Journal() {
  const data = useData();
  const tarotId = useSearchParams().get("tarot");
  const tz = deviceTimeZone();
  const today = localDay(new Date(), tz);
  const prompt = useMemo(() => {
    if (!data?.profile) return null;
    return journalPrompt(dailyFacts(chartFor(data.profile).chart, today.start, today.date));
  }, [data?.profile, today.date]); // eslint-disable-line react-hooks/exhaustive-deps
  const [text, setText] = useState("");
  const [answering, setAnswering] = useState(true);
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState(false);

  if (!data) return <Loading />;
  const linkedSession = tarotId ? data.tarot.find((s) => s.id === tarotId) : undefined;
  const link = linkedSession ? tarotLink(linkedSession) : null;

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const entry: JournalEntry = {
      id: newId(),
      text: text.trim(),
      prompt: !link && answering ? prompt : null,
      link,
      date: today.date,
      createdAt: new Date().toISOString(),
    };
    update((d) => ({ ...d, journal: [entry, ...d.journal] }));
    setText("");
    setSaved(true);
  }

  const needle = q.trim().toLowerCase();
  const entries = data.journal.filter(
    (e) => !needle || [e.text, e.prompt ?? "", e.link?.title ?? "", e.link?.summary ?? ""].join("\n").toLowerCase().includes(needle),
  );

  return (
    <div className="flex flex-col gap-8 pt-4">
      <header>
        <p className="eyebrow">Look back</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Journal</h1>
        <p className="mt-2 text-sm text-muted">Saved only on this device.</p>
      </header>

      <form onSubmit={save} className="card flex flex-col gap-4">
        {link ? (
          <div className="rounded-2xl bg-surface-2 p-4">
            <p className="eyebrow">Tarot</p>
            <p className="font-semibold">{link.title}</p>
            <p className="text-sm text-muted">{link.summary}</p>
          </div>
        ) : (
          prompt && (
            <div className="rounded-2xl border border-accent/50 bg-accent-soft p-4">
              <p className="eyebrow">Today&apos;s prompt</p>
              <p className="mt-1 font-display text-lg">{prompt}</p>
              <label className="mt-3 flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={answering} onChange={(e) => setAnswering(e.target.checked)} className="size-4 accent-[var(--primary)]" />
                I&apos;m answering this prompt
              </label>
            </div>
          )
        )}
        <label htmlFor="text" className="sr-only">
          Your entry
        </label>
        <textarea id="text" rows={5} value={text} onChange={(e) => setText(e.target.value)} className="field resize-y" placeholder={link ? "How does this sit with you? What happened?" : "Write freely."} />
        <button className="btn self-start" disabled={!text.trim()}>
          Save
        </button>
        {saved && <p className="text-sm text-muted">Saved.</p>}
      </form>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold">Entries</h2>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search entries" className="field max-w-48 py-2 text-sm" />
        </div>
        {entries.length === 0 ? (
          <p className="text-sm text-muted">{needle ? "Nothing matches." : "Your notes will appear here."}</p>
        ) : (
          <ol className="relative flex flex-col gap-3 border-l border-line pl-4">
            {entries.map((e) => (
              <li key={e.id} className="relative">
                <span aria-hidden className="absolute top-5 -left-[21px] size-2.5 rounded-full bg-accent" />
                <article className="card flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="chip">{e.link ? "Tarot" : e.prompt ? "Prompt" : "Free writing"}</span>
                    <time>{fmtLocal(e.createdAt, tz)}</time>
                  </div>
                  {e.link && (
                    <Link href={e.link.href} className="text-sm font-semibold hover:text-accent">
                      {e.link.title}
                    </Link>
                  )}
                  {(e.link?.summary || e.prompt) && <p className="text-sm text-muted">{e.link?.summary ?? e.prompt}</p>}
                  <p className="rounded-xl border-l-2 border-accent bg-surface-2 px-3 py-2 text-sm whitespace-pre-wrap">{e.text}</p>
                  <button
                    className="self-end text-xs text-muted underline hover:text-warn"
                    onClick={() => update((d) => ({ ...d, journal: d.journal.filter((x) => x.id !== e.id) }))}
                  >
                    Delete
                  </button>
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
