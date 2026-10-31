"use client";

import { useState } from "react";
import type { TarotSession } from "@/lib/store";
import { drawCard } from "@/lib/tarot/local";
import { DeckFan } from "./deck-fan";

/** The saved, shuffled deck for a spread, fanned out face down. Pulling a card records it on the reading. */
export function DeckPicker({ session, used, prompt, clarifyPick, onDone }: { session: TarotSession; used: number[]; prompt: string; clarifyPick?: number; onDone?: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const taken = new Set(used);
  const positions = Array.from({ length: 78 }, (_, i) => i + 1).filter((p) => !taken.has(p));

  return (
    <div className="flex flex-col gap-2">
      <DeckFan
        key={used.length}
        positions={positions}
        prompt={prompt}
        onPull={(p) => {
          const err = drawCard(session, p, clarifyPick);
          setError(err);
          if (!err) onDone?.();
        }}
      />
      {error && (
        <p className="text-center text-[15px]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
