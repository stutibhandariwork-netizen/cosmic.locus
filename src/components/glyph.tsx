import { PLANET_GLYPH, SIGN_GLYPH } from "@/lib/content/glyphs";
import type { Graha } from "@/lib/engine";

/** A zodiac or planet symbol in a symbol font. Decorative: the name always sits next to it. */
export function Glyph({ sign, planet, className = "" }: { sign?: number; planet?: Graha; className?: string }) {
  const g = sign !== undefined ? SIGN_GLYPH[sign] : planet ? PLANET_GLYPH[planet] : "";
  return (
    <span className={`glyph ${className}`} aria-hidden>
      {g}
    </span>
  );
}
