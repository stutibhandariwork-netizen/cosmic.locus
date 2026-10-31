import { STAR8 } from "@/components/art";
import { SIGNS } from "@/lib/engine";
import { SIGN_GLYPH } from "@/lib/content/glyphs";
import { SIGN_ABBR, type bigThree } from "@/lib/sky";

const C = 150;
/** Aries is centred at the top and signs run clockwise; a longitude maps to an angle from the top. */
const point = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) };
};
const angleOf = (longitude: number) => longitude - 15;

const DOTS = [
  { key: "sun", label: "Sun", r: 84, size: 9, fill: "var(--gold)" },
  { key: "moon", label: "Moon", r: 68, size: 7, fill: "var(--blush)" },
  { key: "rising", label: "Rising", r: 54, size: 6, fill: "var(--periwinkle)" },
] as const;

/** The zodiac wheel with the big three placed at their real longitudes. `draw` animates the wheel drawing itself (the onboarding reveal); skipped under reduced motion. */
export function ZodiacWheel({ three, draw = false, className = "" }: { three: ReturnType<typeof bigThree>; draw?: boolean; className?: string }) {
  const label = `Birth chart wheel. Sun in ${three.sun.signName}, Moon in ${three.moon.signName}${three.rising ? `, rising sign ${three.rising.signName}` : ""}.`;
  return (
    <svg viewBox="0 0 300 300" className={`mx-auto block aspect-square w-full max-w-[300px] ${draw ? "wheel-draw" : ""} ${className}`} role="img" aria-label={label}>
      <circle cx={C} cy={C} r={149} fill="var(--indigo-deep)" stroke="var(--gold)" strokeWidth="1.5" pathLength={1} className="draw-line" />
      {SIGNS.map((_, i) => {
        const a = point(i * 30 + 15, 100);
        const b = point(i * 30 + 15, 148);
        return <line key={`d${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--indigo-line)" strokeWidth="1" pathLength={1} className="draw-line" style={{ animationDelay: `${300 + i * 60}ms` }} />;
      })}
      {SIGN_ABBR.map((abbr, i) => {
        const p = point(i * 30, 125);
        const g = { x: p.x, y: p.y - 9 };
        const sun = i === three.sun.sign;
        return (
          <g key={abbr}>
          <text
            x={g.x}
            y={g.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            className="glyph draw-fade"
            style={{ fill: sun ? "var(--gold)" : "var(--gold-soft)", fillOpacity: sun ? 1 : 0.7, animationDelay: `${600 + i * 70}ms` }}
          >
            {SIGN_GLYPH[i]}
          </text>
          <text
            x={p.x}
            y={p.y + 6}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-display), Georgia, serif"
            fontSize="12"
            letterSpacing="1"
            fontWeight={sun ? 600 : 400}
            className="draw-fade"
            style={{ fill: sun ? "var(--gold)" : "var(--cream)", animationDelay: `${600 + i * 70}ms` }}
          >
            {abbr}
          </text>
          </g>
        );
      })}
      <circle cx={C} cy={C} r={100} fill="var(--indigo)" stroke="var(--gold-soft)" strokeOpacity={0.5} strokeWidth="1" pathLength={1} className="draw-line" style={{ animationDelay: "200ms" }} />
      <circle cx={C} cy={C} r={39} fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="2 4" />
      <path d={STAR8} transform={`translate(${C - 20} ${C - 20}) scale(${40 / 24})`} fill="var(--gold)" className="draw-fade" style={{ animationDelay: "1500ms" }} />
      {DOTS.map((d) => {
        const at = three[d.key];
        if (!at) return null;
        const p = point(angleOf(at.longitude), d.r);
        return <circle key={d.key} cx={p.x} cy={p.y} r={d.size} fill={d.fill} stroke="var(--indigo-deep)" strokeWidth="2" className="draw-fade" style={{ animationDelay: `${1700 + DOTS.indexOf(d) * 250}ms` }} />;
      })}
    </svg>
  );
}
