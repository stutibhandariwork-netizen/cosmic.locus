import { Star8 } from "@/components/art";
import { fillOf, numeralOf } from "@/lib/content/tarot-voice";
import { cardImage, type TarotCard } from "@/lib/tarot/deck";

/** Face-down card: periwinkle with a dashed inner border and a cream star, or a lilac checker for Yes / No. */
export function CardBack({ className = "", variant = "star" }: { className?: string; variant?: "star" | "checker" }) {
  return (
    <div className={`flex aspect-[5/8] overflow-hidden rounded-[14px] border-2 border-cocoa bg-cream ${className}`} aria-hidden>
      {variant === "star" ? (
        <div className="m-1.5 flex flex-1 items-center justify-center rounded-[9px] border-2 border-dashed border-cocoa bg-periwinkle">
          <Star8 size={40} fill="var(--cream)" className="w-[45%] max-w-10 h-auto" />
        </div>
      ) : (
        <div
          className="m-2 flex flex-1 items-center justify-center rounded-[10px] border-2 border-cocoa"
          style={{ background: "repeating-conic-gradient(var(--lilac) 0 25%, var(--cream) 0 50%) 0 0 / 24px 24px" }}
        >
          <div className="grid aspect-square w-1/2 place-items-center rounded-full border-2 border-cocoa bg-cream">
            <Star8 size={48} className="h-auto w-3/5" />
          </div>
        </div>
      )}
    </div>
  );
}

/** Face-up card: the illustration inside a tarot arch, with the numeral and name beneath. */
export function CardFace({ card, reversed = false, size = "sm", className = "" }: { card: TarotCard; reversed?: boolean; size?: "sm" | "lg"; className?: string }) {
  const lg = size === "lg";
  return (
    <div className={`flex aspect-[5/8] flex-col overflow-hidden rounded-[14px] border-2 border-cocoa bg-cream text-cocoa ${lg ? "gap-2 p-2.5" : "gap-1 p-1.5"} ${className}`}>
      <div
        className={`relative min-h-0 flex-1 overflow-hidden border-2 border-cocoa ${lg ? "rounded-[80px_80px_8px_8px]" : "rounded-[40px_40px_8px_8px]"}`}
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
