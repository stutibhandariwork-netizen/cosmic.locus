/** Small brand shapes: the 8-point star and the Moon phase icon. Decorative. */

export const STAR8 =
  "M12 0 L13.15 9.23 L16.95 7.05 L14.77 10.85 L24 12 L14.77 13.15 L16.95 16.95 L13.15 14.77 L12 24 L10.85 14.77 L7.05 16.95 L9.23 13.15 L0 12 L9.23 10.85 L7.05 7.05 L10.85 9.23 Z";

export function Star8({ size = 24, fill = "var(--gold)", stroke = "var(--gold-deep)", strokeWidth = 0.8, className, style }: { size?: number; fill?: string; stroke?: string; strokeWidth?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className} style={style}>
      <path d={STAR8} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

/** The current Moon, lit from the correct side. `elongation` is the Moon's angle from the Sun (0 new, 180 full). */
export function MoonPhaseIcon({ elongation, size = 28 }: { elongation: number; size?: number }) {
  const r = 10;
  const e = ((elongation % 360) + 360) % 360;
  const waxing = e < 180;
  // Terminator ellipse: x-radius shrinks to 0 at the quarters.
  const k = Math.cos((e * Math.PI) / 180); // 1 new, -1 full
  const rx = Math.abs(k) * r;
  const outerSweep = waxing ? 1 : 0; // lit limb on the right while waxing
  const innerSweep = (k > 0) === waxing ? 0 : 1;
  const d = `M12 2 A${r} ${r} 0 0 ${outerSweep} 12 22 A${rx} ${r} 0 0 ${innerSweep} 12 2 Z`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="var(--indigo)" />
      {e > 3 && e < 357 && <path d={d} fill="var(--gold-soft)" />}
    </svg>
  );
}
