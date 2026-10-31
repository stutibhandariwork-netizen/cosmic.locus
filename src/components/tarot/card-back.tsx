import { fillOf, numeralOf } from "@/lib/content/tarot-voice";
import { cardImage, type TarotCard } from "@/lib/tarot/deck";

/**
 * Face-down card: fine gold sun-and-moon line art on indigo. The "moon" back (Yes / No) puts a
 * large crescent and a star map at the centre instead.
 */
export function CardBack({ className = "", variant = "sun" }: { className?: string; variant?: "sun" | "moon" }) {
  const gold = "var(--gold)";
  return (
    <div className={`aspect-[5/8] overflow-hidden rounded-[14px] bg-gradient-to-b from-indigo to-indigo-deep shadow-glow ${className}`} aria-hidden>
      <svg viewBox="0 0 50 80" className="block size-full" preserveAspectRatio="none">
        <rect x="3" y="3" width="44" height="74" rx="4" fill="none" stroke={gold} strokeWidth="0.6" />
        <rect x="5" y="5" width="40" height="70" rx="3" fill="none" stroke={gold} strokeWidth="0.3" strokeDasharray="0.6 1.4" />
        {[[10, 10], [40, 10], [10, 70], [40, 70], [25, 9], [25, 71]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.8" fill={gold} />
        ))}
        {variant === "sun" ? (
          <g fill="none" stroke={gold} strokeWidth="0.6" strokeLinecap="round">
            <circle cx="25" cy="40" r="13" strokeDasharray="0.5 1.6" />
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * Math.PI) / 6;
              const r2 = (n: number) => Math.round(n * 100) / 100;
              return <line key={i} x1={r2(25 + 7.5 * Math.cos(a))} y1={r2(40 + 7.5 * Math.sin(a))} x2={r2(25 + 10.5 * Math.cos(a))} y2={r2(40 + 10.5 * Math.sin(a))} />;
            })}
            <circle cx="25" cy="40" r="5.5" fill={gold} fillOpacity="0.9" />
            <path d="M27.4 36 a4.6 4.6 0 1 0 0 8 a3.7 3.7 0 1 1 0 -8 Z" fill="var(--indigo)" stroke="none" />
            <path d="M25 22 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 Z M25 51.6 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 Z" fill={gold} stroke="none" />
          </g>
        ) : (
          <g fill={gold}>
            <path d="M29 28 a12 12 0 1 0 0 24 a9.5 9.5 0 1 1 0 -24 Z" />
            {[[14, 22], [36, 20], [38, 56], [12, 58], [33, 44], [18, 40]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 2 ? 0.7 : 1.1} />
            ))}
            <path d="M14 22 L18 40 L12 58 M36 20 L33 44 L38 56" fill="none" stroke={gold} strokeWidth="0.3" strokeOpacity="0.6" />
          </g>
        )}
      </svg>
    </div>
  );
}

/** Face-up card: the illustration inside a tarot arch, with the numeral and name beneath. */
export function CardFace({ card, reversed = false, size = "sm", className = "" }: { card: TarotCard; reversed?: boolean; size?: "sm" | "lg"; className?: string }) {
  const lg = size === "lg";
  return (
    <div className={`flex aspect-[5/8] flex-col overflow-hidden rounded-[14px] border border-gold bg-cream text-cocoa shadow-glow ${lg ? "gap-2 p-2.5" : "gap-1 p-1.5"} ${className}`}>
      <div
        className={`relative min-h-0 flex-1 overflow-hidden border border-gold-deep/60 ${lg ? "rounded-[80px_80px_8px_8px]" : "rounded-[40px_40px_8px_8px]"}`}
        style={{ background: fillOf(card) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
        <img src={cardImage(card)} alt="" loading="lazy" className={`size-full object-cover object-top ${reversed ? "rotate-180" : ""}`} />
      </div>
      <div className="text-center">
        {lg && <p className="text-[13px] font-bold tracking-[0.14em]">{numeralOf(card)}</p>}
        <p className={`font-display leading-tight font-semibold ${lg ? "text-lg tracking-[0.08em] uppercase" : "text-[13px]"}`}>{card.name}</p>
        {reversed && <p className="text-[13px] font-bold">Reversed</p>}
      </div>
    </div>
  );
}
