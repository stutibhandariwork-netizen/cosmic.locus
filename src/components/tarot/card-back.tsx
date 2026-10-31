import { Sparkle, Star8 } from "@/components/art";
import { fillOf, numeralOf } from "@/lib/content/tarot-voice";
import type { TarotCard } from "@/lib/tarot/deck";

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

/**
 * Face-up card, placeholder artwork until illustrations are commissioned:
 * an arch-topped pastel panel with the numeral and the card's name.
 */
export function CardFace({ card, reversed = false, size = "sm", className = "" }: { card: TarotCard; reversed?: boolean; size?: "sm" | "lg"; className?: string }) {
  const lg = size === "lg";
  return (
    <div className={`flex aspect-[5/8] flex-col overflow-hidden rounded-[14px] border-2 border-cocoa bg-cream text-cocoa ${lg ? "gap-2 p-2.5" : ""} ${className}`}>
      <div
        className={`relative flex flex-1 flex-col items-center justify-center gap-1 overflow-hidden text-center ${lg ? "rounded-[80px_80px_8px_8px]" : "m-1.5 rounded-[40px_40px_9px_9px] p-2"}`}
        style={{ background: fillOf(card) }}
      >
        {lg ? (
          <>
            <Star8 size={88} className={`twinkle ${reversed ? "rotate-180" : ""}`} strokeWidth={0.5} />
            <Sparkle size={14} fill="var(--cream)" className="twinkle twinkle-2 absolute top-[22%] left-[16%]" />
            <Sparkle size={12} fill="var(--rust)" className="twinkle twinkle-3 absolute top-[16%] right-[18%]" />
            <Sparkle size={16} fill="var(--cream)" className="twinkle absolute right-[20%] bottom-[18%]" />
            <span className="absolute inset-x-0 bottom-0 h-5 border-t-2 border-cocoa bg-cream/60" />
          </>
        ) : (
          <>
            <span className="text-[13px] font-bold tracking-[0.12em]">{numeralOf(card)}</span>
            <span className="font-display text-[17px] leading-[1.1] font-semibold">{card.name}</span>
            {reversed && <span className="mt-1 text-[13px] font-bold">Reversed</span>}
          </>
        )}
      </div>
      {lg && (
        <div className="text-center">
          <p className="text-[13px] font-bold tracking-[0.14em]">{numeralOf(card)}</p>
          <p className="font-display text-lg leading-tight font-semibold tracking-[0.08em] uppercase">{card.name}</p>
          {reversed && <p className="text-[13px] font-bold">Reversed</p>}
        </div>
      )}
    </div>
  );
}
