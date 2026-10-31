"use client";

import { newId, update, type TarotSession } from "@/lib/store";
import { DECK } from "./deck";
import { cardAt, checkClarifier, checkPick, shuffleDeck, usedPositions, type PickError } from "./shuffle";
import { spreadByKey, yesNoVerdict, type SpreadKey } from "./spreads";

export const PICK_MESSAGES: Record<PickError, string> = {
  out_of_range: "Choose a number from 1 to 78.",
  already_drawn: "That card has already been drawn. Choose another.",
  spread_complete: "All the cards for this spread are drawn.",
  not_complete: "Finish the spread before drawing a clarifier.",
  bad_target: "That card already has a clarifier.",
};

/** Shuffles and saves the deck before any card is chosen. Returns the new reading's id. */
export function startReading(spread: SpreadKey, question: string | null): string {
  const { order, reversals } = shuffleDeck();
  const session: TarotSession = {
    id: newId(),
    spread,
    question,
    createdAt: new Date().toISOString(),
    deckOrder: order,
    reversals,
    picks: [],
    clarifiers: [],
  };
  update((d) => ({ ...d, tarot: [session, ...d.tarot] }));
  return session.id;
}

/** Draws the card at a face-down position (1-78). Returns an error message, or null. */
export function drawCard(session: TarotSession, position: number, clarifyPick?: number): string | null {
  const needed = spreadByKey(session.spread).positions.length;
  const err = clarifyPick === undefined ? checkPick(session, position, needed) : checkClarifier(session, clarifyPick, position, needed);
  if (err) return PICK_MESSAGES[err];
  update((d) => ({
    ...d,
    tarot: d.tarot.map((s) =>
      s.id !== session.id
        ? s
        : clarifyPick === undefined
          ? { ...s, picks: [...s.picks, position] }
          : { ...s, clarifiers: [...s.clarifiers, { forPick: clarifyPick, position }] },
    ),
  }));
  return null;
}

export function viewOf(s: TarotSession) {
  const spread = spreadByKey(s.spread);
  const cards = s.picks.map((pos, i) => ({ deckPosition: pos, ...cardAt(s, pos), positionName: spread.positions[i].name }));
  return {
    spread,
    cards,
    clarifiers: s.clarifiers.map((c) => ({ deckPosition: c.position, ...cardAt(s, c.position), forPick: c.forPick })),
    complete: cards.length >= spread.positions.length,
    used: [...usedPositions(s)],
    verdict: s.spread === "YES_NO" && cards[0] ? yesNoVerdict(DECK[cards[0].cardIndex], cards[0].reversed) : null,
  };
}

/**
 * A quick pull from the Tarot screen (card of the day): the deck was shuffled when the fan
 * appeared and is saved with the pick. Quick pulls are read upright.
 */
export function saveQuickReading(spread: SpreadKey, order: number[], picks: number[], question: string | null = null): string {
  const session: TarotSession = {
    id: newId(),
    spread,
    question,
    createdAt: new Date().toISOString(),
    deckOrder: order,
    reversals: order.map(() => false),
    picks,
    clarifiers: [],
  };
  update((d) => ({ ...d, tarot: [session, ...d.tarot] }));
  return session.id;
}
