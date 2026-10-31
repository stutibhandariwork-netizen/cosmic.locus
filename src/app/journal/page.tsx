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
import { PageHeader } from "@/components/ui";
import { voiceOf } from "@/lib/content/tarot-voice";
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

/** A card pulled on the Tarot screen (card of the day, 3 cards, yes/no), passed as ?card=1,2,3&spread=three. */
function cardsLink(param: string, spread: string | null): JournalEntry["link"] {
  const cards = param.split(",").map(Number).filter((i) => Number.isInteger(i) && i >= 0 && i < DECK.length).map((i) => DECK[i]);
  if (!cards.length) return null;
  if (spread === "three" && cards.length === 3) {
    return {
      title: "Past, present, future",
      summary: cards.map((c, i) => `${["Past", "Present", "Future"][i]}: ${c.name}`).join(" · "),
      href: "/tarot/",
    };
  }
  return { title: `Card of the day: ${cards[0].name}`, summary: `${voiceOf(cards[0]).headline} ${voiceOf(cards[0]).line}`, href: "/tarot/" };
}

function Journal() {
  const data = useData();
  const params = useSearchParams();
  const tarotId = params.get("tarot");
  const cardParam = params.get("card");
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
  const link = linkedSession ? tarotLink(linkedSession) : cardParam ? cardsLink(cardParam, params.get("spread")) : null;

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
    <div className="flex flex-col gap-8">
      <PageHeader title="Journal" sub="Your notes, kept only on this device." />

      <form onSubmit={save} className="card flex flex-col gap-4">
        {link ? (
          <div className="rounded-[18px] border-2 border-outline bg-lilac p-4 text-cocoa">
            <p className="text-[13px] font-bold tracking-[0.14em] uppercase">Tarot</p>
            <p className="font-bold">{link.title}</p>
            <p className="text-[15px]">{link.summary}</p>
          </div>
        ) : (
          prompt && (
            <div className="rounded-[18px] border-2 border-outline bg-butter p-4 text-cocoa">
              <p className="text-[13px] font-bold tracking-[0.14em] uppercase">Today&apos;s prompt</p>
              <p className="mt-1 font-display text-xl leading-snug font-semibold">{prompt}</p>
              <label className="mt-2 flex min-h-11 items-center gap-2.5 text-[15px]">
                <input type="checkbox" checked={answering} onChange={(e) => setAnswering(e.target.checked)} className="size-[22px] accent-[var(--rust)]" />
                I&apos;m answering this prompt
              </label>
            </div>
          )
        )}
        <label htmlFor="text" className="sr-only">
          Your entry
        </label>
        <textarea id="text" rows={5} value={text} onChange={(e) => setText(e.target.value)} className="field resize-y" placeholder={link ? "How does this sit with you?" : "Write freely. Nobody else will see it."} />
        <button className="btn self-start" disabled={!text.trim()}>
          Save
        </button>
        {saved && (
          <p className="text-[15px]" role="status">
            Saved. Lovely work.
          </p>
        )}
      </form>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="h2">Your notes</h2>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search entries" className="field max-w-44" />
        </div>
        {entries.length === 0 ? (
          <p className="text-[15px] text-muted">{needle ? "Nothing matches that search." : "Your first note will show up here. Start with one line about today."}</p>
        ) : (
          <ol className="relative flex flex-col gap-3 border-l-2 border-line pl-4">
            {entries.map((e) => (
              <li key={e.id} className="relative">
                <span aria-hidden className="absolute top-5 -left-[22px] size-3 rounded-full border-2 border-outline bg-ochre" />
                <article className="card gap-2 p-4">
                  <div className="flex items-center justify-between text-[13px] text-muted">
                    <span className="chip">{e.link ? "Tarot" : e.prompt ? "Prompt" : "Free writing"}</span>
                    <time>{fmtLocal(e.createdAt, tz)}</time>
                  </div>
                  {e.link && (
                    <Link href={e.link.href} className="font-bold underline decoration-2 underline-offset-4">
                      {e.link.title}
                    </Link>
                  )}
                  {(e.link?.summary || e.prompt) && <p className="text-[15px] text-muted">{e.link?.summary ?? e.prompt}</p>}
                  <p className="whitespace-pre-wrap">{e.text}</p>
                  <button
                    className="min-h-11 self-end px-2 text-[15px] font-bold text-label underline"
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
