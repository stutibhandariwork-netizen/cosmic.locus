/** Brand illustrations from the design handoff (assets/*.svg), as components. All decorative unless labelled. */

const FLAME = "M94 60 C92 50 102 46 98 36 C95 29 101 24 100 14 C107 25 109 35 104 44 C101 50 107 54 106 60 Z";
const SPIKE = "M95 60 L100 44 L105 60 Z";
export const STAR8 =
  "M12 0 L13.15 9.23 L16.95 7.05 L14.77 10.85 L24 12 L14.77 13.15 L16.95 16.95 L13.15 14.77 L12 24 L10.85 14.77 L7.05 16.95 L9.23 13.15 L0 12 L9.23 10.85 L7.05 7.05 L10.85 9.23 Z";
export const SPARKLE = "M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z";

interface SunProps {
  size?: number;
  /** "awake" = open smile (logo, Today); "rising" = eyes closed, peach face (onboarding). */
  mood?: "awake" | "rising";
  face?: string;
  rays?: string;
  label?: string;
  className?: string;
}

export function SunFace({ size = 150, mood = "awake", face = "var(--butter)", rays = "var(--ochre)", label, className }: SunProps) {
  const flames = mood === "rising" ? [0, 45, 90, 270, 315] : [0, 45, 90, 135, 180, 225, 270, 315];
  const spikes = mood === "rising" ? [22.5, 67.5, 292.5, 337.5] : [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
      <g fill={rays} stroke="var(--cocoa)" strokeWidth="2.5" strokeLinejoin="round">
        {flames.map((r) => (
          <path key={`f${r}`} d={FLAME} transform={`rotate(${r} 100 100)`} />
        ))}
        {spikes.map((r) => (
          <path key={`s${r}`} d={SPIKE} transform={`rotate(${r} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="42" fill={face} stroke="var(--cocoa)" strokeWidth="3" />
      {mood === "rising" ? (
        <>
          <circle cx="80" cy="108" r="6" fill="var(--cheek)" />
          <circle cx="120" cy="108" r="6" fill="var(--cheek)" />
          <g fill="none" stroke="var(--cocoa)" strokeWidth="3" strokeLinecap="round">
            <path d="M80 92 q5 -5 10 0" />
            <path d="M110 92 q5 -5 10 0" />
          </g>
        </>
      ) : (
        <>
          <circle cx="80" cy="111" r="7" fill="var(--cheek)" />
          <circle cx="120" cy="111" r="7" fill="var(--cheek)" />
          <g fill="none" stroke="var(--cocoa)" strokeWidth="3" strokeLinecap="round">
            <path d="M78 96 q7 6 14 0" />
            <path d="M108 96 q7 6 14 0" />
            <path d="M100 99 q-4 9 2 11" />
            <path d="M90 118 q10 7 20 0" />
          </g>
        </>
      )}
    </svg>
  );
}

export function Star8({ size = 24, fill = "var(--ochre)", stroke = "var(--cocoa)", strokeWidth = 0.8, className, style }: { size?: number; fill?: string; stroke?: string; strokeWidth?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className} style={style}>
      <path d={STAR8} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

export function Sparkle({ size = 14, fill = "var(--rust)", className, style }: { size?: number; fill?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className} style={style}>
      <path d={SPARKLE} fill={fill} />
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
      <circle cx="12" cy="12" r="10" fill="var(--night-ink)" />
      {e > 3 && e < 357 && <path d={d} fill="var(--butter)" />}
    </svg>
  );
}

/** Peach tarot arch with the sun, used as the logo. */
export function LogoArch({ size = 72 }: { size?: number }) {
  return (
    <span
      className="relative grid place-items-center overflow-hidden border-2 border-cocoa bg-peach"
      style={{ width: size, height: size * 1.15, borderRadius: `${size}px ${size}px 10px 10px` }}
      aria-hidden
    >
      <span className="absolute inset-[5px] border-[1.5px] border-dashed border-rust" style={{ borderRadius: `${size}px ${size}px 6px 6px` }} />
      <SunFace size={size * 0.8} />
    </span>
  );
}
