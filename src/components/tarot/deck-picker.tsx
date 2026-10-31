"use client";

import { useState } from "react";
import type { TarotSession } from "@/lib/store";
import { drawCard } from "@/lib/tarot/local";
import { CardBack } from "./card-back";

/** The face-down deck: tap a card in the fan (then confirm) or type its number. */
export function DeckPicker({ session, used, prompt, clarifyPick, onDone }: { session: TarotSession; used: number[]; prompt: string; clarifyPick?: number; onDone?: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const taken = new Set(used);
  const positions = Array.from({ length: 78 }, (_, i) => i + 1).filter((p) => !taken.has(p));

  function draw(position: number) {
    const err = drawCard(session, position, clarifyPick);
    if (err) return setError(err);
    setError(null);
    setSelected(null);
    setTyped("");
    onDone?.();
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center font-display text-lg font-semibold">{prompt}</p>
      <div className="-mx-4 overflow-x-auto px-4 pt-6 pb-3 [scrollbar-width:thin]" role="listbox" aria-label="Face-down cards">
        <div className="flex w-max pr-8 pl-2">
          {positions.map((p, i) => {
            const isSel = selected === p;
            return (
              <button
                key={p}
                type="button"
                role="option"
                aria-selected={isSel}
                aria-label={`Card ${p}`}
                onClick={() => setSelected(isSel ? null : p)}
                className={`group relative -ml-7 w-14 shrink-0 first:ml-0 focus-visible:outline-none ${isSel ? "z-10" : ""}`}
                style={{ rotate: `${((i % 9) - 4) * 0.6}deg` }}
              >
                <span className={`block transition-transform duration-200 ${isSel ? "-translate-y-5" : "group-hover:-translate-y-2"}`}>
                  <CardBack className={`w-14 ${isSel ? "drop-shadow-[0_0_10px_rgba(229,180,94,.7)]" : "drop-shadow"}`} />
                </span>
                <span className={`mt-1 block text-center text-[13px] tabular-nums ${isSel ? "font-bold text-accent" : "text-muted"}`}>{p}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <button className="btn w-full max-w-xs" disabled={selected === null} onClick={() => selected && draw(selected)}>
          {selected ? `Draw card ${selected}` : "Tap a card in the fan"}
        </button>
        <form
          className="flex items-center gap-2 text-[15px]"
          onSubmit={(e) => {
            e.preventDefault();
            if (typed) draw(Number(typed));
          }}
        >
          <label htmlFor={`num-${clarifyPick ?? "main"}`} className="text-muted">
            or type a number
          </label>
          <input
            id={`num-${clarifyPick ?? "main"}`}
            inputMode="numeric"
            maxLength={2}
            value={typed}
            onChange={(e) => setTyped(e.target.value.replace(/\D/g, ""))}
            className="field w-16 px-2 py-2 text-center"
            placeholder="1–78"
          />
          <button className="btn-ghost min-h-10 px-4" disabled={!typed}>
            Draw
          </button>
        </form>
        {error && (
          <p className="text-[15px] text-warn" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
