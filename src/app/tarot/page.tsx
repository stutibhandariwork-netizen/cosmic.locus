"use client";

import Link from "next/link";
import { useState } from "react";
import { Loading } from "@/components/gate";
import { DeckFan } from "@/components/tarot/deck-fan";
import { allPositions, CardOfTheDay, freshDeck, TurnedCard } from "@/components/tarot/today-card";
import { LinkRow, NextStep, PageHeader, Segmented } from "@/components/ui";
import { voiceOf, YES_NO_ANSWER } from "@/lib/content/tarot-voice";
import { deviceTimeZone } from "@/lib/chart";
import { fmtLocal } from "@/lib/format";
import { useData, type Data } from "@/lib/store";
import { DECK } from "@/lib/tarot/deck";
import { SPREADS, spreadByKey } from "@/lib/tarot/spreads";

type Mode = "day" | "three" | "yesno";

export default function TarotPage() {
  const data = useData();
  const [mode, setMode] = useState<Mode>("day");
  if (!data) return <Loading />;
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Tarot" sub="Take a breath, then pull." />
      <Segmented
        label="Reading type"
        value={mode}
        onChange={setMode}
        options={[
          { id: "day", label: "Today" },
          { id: "three", label: "3 cards" },
          { id: "yesno", label: "Yes / No" },
        ]}
      />
      {mode === "day" && <CardOfTheDay data={data} />}
      {mode === "three" && <ThreeCards />}
      {mode === "yesno" && <YesNo />}
      <MoreReadings data={data} />
    </div>
  );
}

const POSITIONS = ["Past", "Present", "Future"];

function ThreeCards() {
  const [order, setOrder] = useState(freshDeck);
  const [picks, setPicks] = useState<number[]>([]);
  const cards = picks.map((p) => DECK[order[p - 1]]);
  const done = picks.length === 3;
  return (
    <div className="flex flex-col gap-4">
      <p className="px-1">Think of what&apos;s on your mind. Then pull three cards: one for the past, one for now and one for what&apos;s coming.</p>
      <div className="grid grid-cols-3 gap-2.5">
        {POSITIONS.map((pos, i) => (
          <div key={pos} className="flex flex-col items-stretch gap-2">
            <p className="text-center text-[13px] font-bold tracking-[0.14em] text-label uppercase">{pos}</p>
            {cards[i] ? (
              <TurnedCard card={cards[i]} className="w-full" />
            ) : (
              <div
                className={`grid aspect-[5/8] place-items-center rounded-[14px] border-2 border-dashed text-[13px] font-bold ${i === picks.length ? "border-rust text-label" : "border-line text-muted"}`}
              >
                {i === picks.length ? "Next" : i + 1}
              </div>
            )}
            {cards[i] && <p className="text-center text-sm leading-snug">{voiceOf(cards[i]).headline}</p>}
          </div>
        ))}
      </div>
      {!done ? (
        <DeckFan
          key={order.join()}
          positions={allPositions.filter((p) => !picks.includes(p))}
          prompt={`Pull a card for your ${POSITIONS[picks.length].toLowerCase()}.`}
          onPull={(p) => setPicks([...picks, p])}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          <NextStep href={`/journal/?card=${cards.map((c) => c.index).join(",")}&spread=three`} label="Write about these cards" />
          <button
            type="button"
            className="btn-ghost self-center"
            onClick={() => {
              setPicks([]);
              setOrder(freshDeck());
            }}
          >
            Shuffle again
          </button>
        </div>
      )}
    </div>
  );
}

function YesNo() {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState(false);
  const [order, setOrder] = useState(freshDeck);
  const [pick, setPick] = useState<number | null>(null);
  const card = pick ? DECK[order[pick - 1]] : null;

  const reset = () => {
    setPick(null);
    setAsked(false);
    setQuestion("");
    setOrder(freshDeck());
  };

  if (!asked) {
    return (
      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          setAsked(true);
        }}
      >
        <label htmlFor="yn-q" className="h2">
          What would you like to ask?
        </label>
        <p className="text-[15px] text-muted">Make it a yes-or-no question. You can also keep it in your head and leave this empty.</p>
        <textarea
          id="yn-q"
          rows={2}
          maxLength={200}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="field resize-none"
          placeholder="Should I take the new job?"
        />
        <button className="btn mt-1 self-start">Shuffle the deck</button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {question.trim() && <p className="self-stretch px-1 font-display text-xl leading-snug font-semibold">“{question.trim()}”</p>}
      {!card ? (
        <div className="self-stretch">
          <DeckFan positions={allPositions} variant="moon" prompt="Hold your question in mind and pull one card." onPull={setPick} />
        </div>
      ) : (
        <>
          <TurnedCard card={card} back="moon" className="w-[170px] rounded-2xl shadow-glow" />
          <div className="flex flex-col gap-1 self-stretch rounded-[20px] border border-outline bg-surface px-4 py-3.5" aria-live="polite">
            <p className="font-display text-2xl font-semibold">{YES_NO_ANSWER[card.nature]}</p>
            <p>
              {card.name}: {voiceOf(card).line}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 self-stretch">
            <NextStep href={`/journal/?card=${card.index}&spread=yesno${question.trim() ? `&q=${encodeURIComponent(question.trim())}` : ""}`} label="Write about this answer" />
            <button type="button" className="btn-ghost self-center" onClick={reset}>
              Ask another question
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MoreReadings({ data }: { data: Data }) {
  const spreads = SPREADS.filter((s) => ["THREE_CARD", "LOVE", "CAREER", "MONEY"].includes(s.key));
  const recent = data.tarot.slice(0, 5);
  const tz = deviceTimeZone();
  return (
    <div className="mt-8 flex flex-col gap-3">
      <h2 className="h2 px-1">Deeper spreads</h2>
      <p className="px-1 text-[15px]">Pick your own cards from the full deck, add a question, and draw a clarifier if you want more.</p>
      {spreads.map((s) => (
        <LinkRow key={s.key} href={`/tarot/new/?spread=${s.slug}`} title={s.key === "THREE_CARD" ? "Your question" : s.title} sub={s.blurb} />
      ))}
      {recent.length > 0 && (
        <>
          <h2 className="h2 mt-6 px-1">Your recent spreads</h2>
          <ul className="card gap-0 divide-y divide-line p-0">
            {recent.map((r) => {
              const spread = spreadByKey(r.spread);
              const done = r.picks.length >= spread.positions.length;
              return (
                <li key={r.id}>
                  <Link href={`/tarot/reading/?id=${r.id}`} className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 hover:bg-surface-2">
                    <span className="min-w-0">
                      <span className="block font-bold">{spread.title}</span>
                      {r.question && <span className="block truncate text-[15px] text-muted">{r.question}</span>}
                    </span>
                    <span className="shrink-0 text-[15px] text-muted">{done ? fmtLocal(r.createdAt, tz) : "Continue"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
