"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Loading } from "@/components/gate";
import { DeckPicker } from "@/components/tarot/deck-picker";
import { FlipCard } from "@/components/tarot/flip-card";
import { useData, type TarotSession } from "@/lib/store";
import { DECK } from "@/lib/tarot/deck";
import { viewOf } from "@/lib/tarot/local";

export default function ReadingPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Reading />
    </Suspense>
  );
}

function Reading() {
  const id = useSearchParams().get("id");
  const data = useData();
  if (!data) return <Loading />;
  const session = data.tarot.find((s) => s.id === id);
  if (!session) {
    return (
      <p className="pt-6 text-[15px] text-muted">
        This reading isn&apos;t on this device. <Link href="/tarot/" className="underline">Back to tarot</Link>
      </p>
    );
  }
  return <ReadingView session={session} />;
}

function ReadingView({ session }: { session: TarotSession }) {
  const v = viewOf(session);
  const { spread } = v;
  const many = spread.positions.length > 1;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <Link href="/tarot/" className="link inline-block self-start py-2.5">
          ← Tarot
        </Link>
        <p className="eyebrow mt-2">{spread.title}</p>
        {session.question ? (
          <h1 className="mt-2 font-display text-2xl leading-snug font-semibold">“{session.question}”</h1>
        ) : (
          <h1 className="mt-2 font-display text-3xl font-semibold">{spread.title}</h1>
        )}
      </header>

      <div className="flex justify-center gap-3">
        {spread.positions.map((p, i) => {
          const c = v.cards[i];
          return (
            <div key={p.name} className="flex flex-col items-center gap-2">
              {c ? (
                <FlipCard seenKey={`${session.id}:${c.deckPosition}`} card={DECK[c.cardIndex]} reversed={c.reversed} size={many ? "sm" : "md"} />
              ) : (
                <div className={`${many ? "w-20" : "w-36 sm:w-44"} grid aspect-[100/172] place-items-center rounded-[7%] border-2 border-dashed border-line text-[13px] text-muted`}>
                  {i + 1}
                </div>
              )}
              <p className="max-w-24 text-center text-[13px] font-medium text-muted">{p.name}</p>
            </div>
          );
        })}
      </div>

      {!v.complete && (
        <DeckPicker
          session={session}
          used={v.used}
          prompt={many ? `Choose card ${v.cards.length + 1} of ${spread.positions.length} · ${spread.positions[v.cards.length].name}` : "Choose your card"}
        />
      )}

      {v.complete && (
        <>
          {v.verdict && (
            <div className="card flex flex-col items-center gap-1 border-accent/60 bg-accent-soft text-center">
              <p className="text-[13px] font-semibold tracking-[0.14em] text-muted uppercase">The cards say</p>
              <p className="font-display text-5xl font-semibold">{v.verdict}</p>
              <p className="text-[15px] text-muted">
                {DECK[v.cards[0].cardIndex].name}, {v.cards[0].reversed ? "reversed: it softens the card's leaning" : "upright"}
              </p>
            </div>
          )}
          {v.cards.map((c, i) => (
            <CardDetail key={c.deckPosition} session={session} index={i} />
          ))}
          <Link href={`/journal/?tarot=${session.id}`} className="btn-ghost self-start">
            Add a note to your journal
          </Link>
        </>
      )}

      <p className="text-center text-[13px] text-muted">
        Deck shuffled with your browser&apos;s secure random generator and saved before you chose.
      </p>
    </div>
  );
}

function CardDetail({ session, index }: { session: TarotSession; index: number }) {
  const v = viewOf(session);
  const c = v.cards[index];
  const card = DECK[c.cardIndex];
  const side = c.reversed ? card.reversed : card.upright;
  const clarifier = v.clarifiers.find((x) => x.forPick === index);
  const [picking, setPicking] = useState(false);
  const position = v.spread.positions[index];

  return (
    <section className="card flex flex-col gap-4">
      <div className="flex gap-4">
        <FlipCard seenKey={`${session.id}:${c.deckPosition}:detail`} card={card} reversed={c.reversed} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold tracking-wide text-accent uppercase">{c.positionName}</p>
          <h2 className="font-display text-xl font-semibold">{card.name}</h2>
          <span className={`chip mt-1 ${c.reversed ? "text-warn" : "text-good"}`}>{c.reversed ? "Reversed" : "Upright"}</span>
          <p className="mt-2 text-[13px] text-muted">{side.keywords.join(" · ")}</p>
        </div>
      </div>
      <p className="text-[15px] text-muted">
        <span className="font-semibold text-ink">In the classic deck: </span>
        {card.scene}
      </p>
      <p className="text-[15px] leading-relaxed">
        {side.meaning} <span className="text-muted">Here it speaks to {position.asks}.</span>
      </p>

      {clarifier ? (
        <div className="flex gap-3 rounded-3xl bg-surface-2 p-3">
          <FlipCard seenKey={`${session.id}:${clarifier.deckPosition}`} card={DECK[clarifier.cardIndex]} reversed={clarifier.reversed} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold tracking-wide text-accent uppercase">Clarifier</p>
            <p className="font-semibold">
              {DECK[clarifier.cardIndex].name}
              {clarifier.reversed ? " (reversed)" : ""}
            </p>
            <p className="mt-1 text-[15px]">{(clarifier.reversed ? DECK[clarifier.cardIndex].reversed : DECK[clarifier.cardIndex].upright).meaning}</p>
          </div>
        </div>
      ) : picking ? (
        <div className="rounded-3xl border border-line bg-surface-2 p-4">
          <DeckPicker session={session} used={v.used} prompt={`Choose a clarifier for ${card.name}`} clarifyPick={index} onDone={() => setPicking(false)} />
          <button className="mt-2 w-full text-center text-[15px] text-muted underline" onClick={() => setPicking(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="btn-ghost self-start" onClick={() => setPicking(true)}>
          Draw a clarifier card
        </button>
      )}
    </section>
  );
}
