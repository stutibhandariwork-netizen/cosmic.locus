"use client";

import { useEffect, useState } from "react";
import type { TarotCard } from "@/lib/tarot/deck";
import { CardBack, CardFace } from "./card-back";

interface Props {
  /** Unique per reading and slot, used to flip each card only the first time it is seen. */
  seenKey: string;
  card: TarotCard;
  reversed: boolean;
  size?: "md" | "sm";
}

const seenStore = {
  has(key: string) {
    try {
      return sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  },
  add(key: string) {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable: the card just flips again next time
    }
  },
};

/** A tarot card that turns over the first time it appears. */
export function FlipCard({ seenKey, card, reversed, size = "md" }: Props) {
  const [faceUp, setFaceUp] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    if (seenStore.has(seenKey) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInstant(true);
      setFaceUp(true);
      return;
    }
    const t = setTimeout(() => {
      setFaceUp(true);
      seenStore.add(seenKey);
    }, 150);
    return () => clearTimeout(t);
  }, [seenKey]);

  return (
    <Flip faceUp={faceUp} instant={instant} className={size === "md" ? "w-40" : "w-24"} label={`${card.name}${reversed ? ", reversed" : ""}`}>
      <CardBack className="size-full" />
      <CardFace card={card} reversed={reversed} className="size-full" />
    </Flip>
  );
}

/** Two faces in a 3D flip. Children: [back, front]. */
export function Flip({ faceUp, instant = false, className = "", label, children }: { faceUp: boolean; instant?: boolean; className?: string; label?: string; children: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className={`aspect-[5/8] [perspective:1200px] ${className}`} role={label ? "img" : undefined} aria-label={faceUp ? label : undefined}>
      <div className={`relative size-full [transform-style:preserve-3d] ${instant ? "" : "transition-transform duration-700 ease-out"} ${faceUp ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="absolute inset-0 [backface-visibility:hidden]">{children[0]}</div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden={!faceUp}>
          {children[1]}
        </div>
      </div>
    </div>
  );
}
