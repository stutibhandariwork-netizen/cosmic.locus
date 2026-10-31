"use client";

import { useEffect, useState } from "react";
import { CardBack } from "./card-back";

/**
 * The shuffled deck spread face down in a scrollable fan. Tap a card to lift it, then pull it.
 * Positions are 1-based places in the shuffled deck, so the card is fixed before anyone chooses.
 */
export function DeckFan({
  positions,
  prompt,
  onPull,
  variant = "sun",
}: {
  positions: number[];
  prompt: string;
  onPull: (position: number) => void;
  variant?: "sun" | "moon";
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [fanned, setFanned] = useState(false);

  // Cards start stacked and fan out once, like a deck spread across the table.
  useEffect(() => {
    const id = requestAnimationFrame(() => setFanned(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className="px-1 text-center font-display text-xl leading-snug font-semibold" aria-live="polite">
        {prompt}
      </p>
      <div className="-mx-4 overflow-x-auto px-4 pt-8 pb-5 [scrollbar-width:thin]" role="listbox" aria-label="The deck, face down">
        <div className="flex w-max pr-6 pl-1">
          {positions.map((p, i) => {
            const on = selected === p;
            const wave = (i % 13) - 6; // a gentle repeating arc along the row
            return (
              <button
                key={p}
                type="button"
                role="option"
                aria-selected={on}
                aria-label={`Card ${i + 1} of ${positions.length}`}
                onClick={() => setSelected(on ? null : p)}
                className={`relative -ml-[44px] w-[74px] shrink-0 rounded-[14px] first:ml-0 ${on ? "z-10" : ""}`}
                style={{
                  transform: fanned ? `translateY(${wave * wave * 0.35}px) rotate(${wave * 1.4}deg)` : `translateX(${-i * 30}px)`,
                  transition: `transform 600ms cubic-bezier(.2,.8,.2,1) ${Math.min(i, 30) * 12}ms`,
                }}
              >
                <span className={`block transition-transform duration-200 ${on ? "-translate-y-7" : "hover:-translate-y-2"}`}>
                  <CardBack variant={variant} className={`w-[74px] ${on ? "shadow-glow" : ""}`} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-center text-[15px] text-muted">Scroll through the deck and tap the card that calls to you.</p>
      <button type="button" className="btn btn-wide" disabled={selected === null} onClick={() => selected !== null && (onPull(selected), setSelected(null))}>
        {selected === null ? "Choose a card first" : "Pull this card"}
      </button>
    </div>
  );
}
