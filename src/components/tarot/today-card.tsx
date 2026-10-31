"use client";

import { useEffect, useState } from "react";
import { NextStep, ReadingCard } from "@/components/ui";
import { voiceOf } from "@/lib/content/tarot-voice";
import { deviceTimeZone, localDay } from "@/lib/chart";
import type { Data } from "@/lib/store";
import { DECK, type TarotCard } from "@/lib/tarot/deck";
import { saveQuickReading } from "@/lib/tarot/local";
import { DECK_SIZE, shuffleDeck } from "@/lib/tarot/shuffle";
import { CardBack, CardFace } from "./card-back";
import { DeckFan } from "./deck-fan";
import { Flip } from "./flip-card";

/** Today's card of the day, if it has been pulled. */
export function todaysCard(data: Data) {
  const todayStart = localDay(new Date(), deviceTimeZone()).start.toISOString();
  const s = data.tarot.find((x) => x.spread === "CARD_OF_DAY" && x.createdAt >= todayStart && x.picks.length > 0);
  return s ? { session: s, card: DECK[s.deckOrder[s.picks[0] - 1]] } : null;
}

/** Turns a just-pulled card face up once; a card already seen this visit stays face up. */
export function TurnedCard({ card, seenKey, size = "sm", back = "sun", className = "" }: { card: TarotCard; seenKey?: string; size?: "sm" | "lg"; back?: "sun" | "moon"; className?: string }) {
  const [up, setUp] = useState(false);
  const [instant, setInstant] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = !!seenKey && sessionStorage.getItem(seenKey) === "1";
      if (seenKey) sessionStorage.setItem(seenKey, "1");
    } catch {
      // storage unavailable: the card just turns again
    }
    if (seen) {
      setInstant(true);
      setUp(true);
      return;
    }
    const t = setTimeout(() => setUp(true), 120);
    return () => clearTimeout(t);
  }, [seenKey]);
  return (
    <Flip faceUp={up} instant={instant} className={className} label={card.name}>
      <CardBack variant={back} className="size-full" />
      <CardFace card={card} size={size} className="size-full" />
    </Flip>
  );
}

export const freshDeck = () => shuffleDeck().order;
export const allPositions = Array.from({ length: DECK_SIZE }, (_, i) => i + 1);

/**
 * One card a day: pulled from the deck, saved, and shown again for the rest of the day.
 * `compact` is the smaller version on Today.
 */
export function CardOfTheDay({ data, compact = false, onPulled }: { data: Data; compact?: boolean; onPulled?: () => void }) {
  const today = todaysCard(data);
  const [order] = useState(freshDeck);

  if (!today) {
    return (
      <DeckFan
        positions={allPositions}
        prompt="Take a breath and ask what today needs from you."
        onPull={(p) => {
          saveQuickReading("CARD_OF_DAY", order, [p]);
          onPulled?.();
        }}
      />
    );
  }
  const { card, session } = today;
  const v = voiceOf(card);
  const next = <NextStep href={`/journal/?card=${card.index}&spread=day`} label="Write about this card" />;
  if (compact) {
    return (
      <div className="card">
        <div className="flex gap-4">
          <TurnedCard card={card} seenKey={`day:${session.id}`} className="w-24 shrink-0 rounded-[14px]" />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="eyebrow">Card of the day</p>
            <p className="font-display text-[22px] leading-tight font-semibold">{v.headline}</p>
            <p className="text-[15px]">{v.line}</p>
          </div>
        </div>
        {next}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <TurnedCard card={card} size="lg" seenKey={`day:${session.id}`} className="w-[180px] self-center rounded-[14px] shadow-glow" />
      <ReadingCard eyebrow="Card of the day" headline={v.headline}>
        <p>{v.line}</p>
        <p className="text-[15px] text-muted">Your card stays with you all day. Come back tomorrow to pull a new one.</p>
        {next}
      </ReadingCard>
    </div>
  );
}
