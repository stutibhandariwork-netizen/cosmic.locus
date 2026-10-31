"use client";

import Link from "next/link";
import { useState } from "react";
import { Loading } from "@/components/gate";
import { CardBack, CardFace } from "@/components/tarot/card-back";
import { Flip } from "@/components/tarot/flip-card";
import { LinkRow, PageHeader, ReadingCard, Segmented } from "@/components/ui";
import { voiceOf, YES_NO_ANSWER } from "@/lib/content/tarot-voice";
import { deviceTimeZone, localDay } from "@/lib/chart";
import { fmtLocal } from "@/lib/format";
import { seedOf } from "@/lib/sky";
import { useData, type Data } from "@/lib/store";
import { DECK, type TarotCard } from "@/lib/tarot/deck";
import { DECK_SIZE, shuffleDeck } from "@/lib/tarot/shuffle";
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
          { id: "day", label: "Today’s card" },
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

/** Same card all day for the same person; a new one tomorrow. */
function CardOfTheDay({ data }: { data: Data }) {
  const day = localDay(new Date(), deviceTimeZone());
  const who = data.profile ? [data.profile.name, data.profile.birthDate] : ["guest"];
  const card = DECK[seedOf(...who, day.date, "card-of-the-day") % DECK_SIZE];
  const v = voiceOf(card);
  return (
    <div className="flex flex-col gap-4">
      <CardFace card={card} size="lg" className="w-[180px] self-center shadow-[6px_6px_0_var(--lilac)]" />
      <ReadingCard
        eyebrow="Card of the day"
        headline={v.headline}
        action={
          <Link href={`/journal/?card=${card.index}&spread=day`} className="btn">
            Save to journal
          </Link>
        }
      >
        <p>{v.line}</p>
      </ReadingCard>
    </div>
  );
}

const drawCards = (n: number): TarotCard[] => shuffleDeck().order.slice(0, n).map((i) => DECK[i]);
const POSITIONS = ["Past", "Present", "Future"];

function ThreeCards() {
  const [cards, setCards] = useState(() => drawCards(3));
  const [up, setUp] = useState([false, false, false]);
  const all = up.every(Boolean);
  return (
    <div className="flex flex-col gap-4">
      <p className="px-1">Think of what&apos;s on your mind, then tap each card to turn it over.</p>
      <div className="grid grid-cols-3 gap-2.5">
        {cards.map((c, i) => (
          <div key={POSITIONS[i]} className="flex flex-col items-stretch gap-2">
            <p className="text-center text-[13px] font-bold tracking-[0.14em] text-label uppercase">{POSITIONS[i]}</p>
            <button
              type="button"
              aria-label={up[i] ? `${POSITIONS[i]}: ${c.name}` : `Turn over the ${POSITIONS[i]} card`}
              onClick={() => setUp(up.map((u, j) => (j === i ? !u : u)))}
              className="rounded-[14px]"
            >
              <Flip faceUp={up[i]} className="w-full">
                <CardBack className="size-full" />
                <CardFace card={c} className="size-full" />
              </Flip>
            </button>
            {up[i] && <p className="text-center text-sm leading-snug">{voiceOf(c).headline}</p>}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setUp([false, false, false]);
            setTimeout(() => setCards(drawCards(3)), 350);
          }}
        >
          Shuffle again
        </button>
        {all && (
          <Link href={`/journal/?card=${cards.map((c) => c.index).join(",")}&spread=three`} className="btn">
            Save to journal
          </Link>
        )}
      </div>
    </div>
  );
}

function YesNo() {
  const [card, setCard] = useState(() => drawCards(1)[0]);
  const [up, setUp] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="self-stretch px-1">Ask a yes-or-no question in your head, then tap the card.</p>
      <button
        type="button"
        aria-label={up ? `${card.name}: ${YES_NO_ANSWER[card.nature]}` : "Turn over your yes or no card"}
        onClick={() => setUp(true)}
        className="rounded-2xl"
      >
        <Flip faceUp={up} className="w-[170px] rounded-2xl shadow-[6px_6px_0_var(--blush)]">
          <CardBack variant="checker" className="size-full" />
          <CardFace card={card} className="size-full" />
        </Flip>
      </button>
      {up && (
        <>
          <div className="flex flex-col gap-1 self-stretch rounded-[20px] border-2 border-outline bg-surface px-4 py-3.5" aria-live="polite">
            <p className="font-display text-2xl font-semibold">{YES_NO_ANSWER[card.nature]}</p>
            <p>
              {card.name}: {voiceOf(card).line}
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setUp(false);
              setTimeout(() => setCard(drawCards(1)[0]), 350);
            }}
          >
            Ask another question
          </button>
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
