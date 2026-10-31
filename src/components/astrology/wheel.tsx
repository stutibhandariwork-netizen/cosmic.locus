import { STAR8 } from "@/components/art";
import { SIGNS } from "@/lib/engine";
import { SIGN_ABBR, type bigThree } from "@/lib/sky";

const C = 150;
/** Aries is centred at the top and signs run clockwise; a longitude maps to an angle from the top. */
const point = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) };
};
const angleOf = (longitude: number) => longitude - 15;

const DOTS = [
  { key: "sun", label: "Sun", r: 84, size: 9, fill: "var(--ochre)" },
  { key: "moon", label: "Moon", r: 68, size: 7, fill: "var(--blush)" },
  { key: "rising", label: "Rising", r: 54, size: 6, fill: "var(--periwinkle)" },
] as const;

/** The zodiac wheel with the big three placed at their real longitudes. */
export function ZodiacWheel({ three }: { three: ReturnType<typeof bigThree> }) {
  const label = `Birth chart wheel. Sun in ${three.sun.signName}, Moon in ${three.moon.signName}${three.rising ? `, rising sign ${three.rising.signName}` : ""}.`;
  return (
    <svg viewBox="0 0 300 300" className="mx-auto block aspect-square w-full max-w-[300px]" role="img" aria-label={label}>
      <circle cx={C} cy={C} r={149} fill="var(--night-card)" stroke="var(--blush)" strokeWidth="2" />
      {SIGNS.map((_, i) => {
        const a = point(i * 30 + 15, 100);
        const b = point(i * 30 + 15, 148);
        return <line key={`d${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--night-line)" strokeWidth="1" />;
      })}
      {SIGN_ABBR.map((abbr, i) => {
        const p = point(i * 30, 125);
        const sun = i === three.sun.sign;
        return (
          <text
            key={abbr}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-display), Georgia, serif"
            fontSize="13"
            letterSpacing="1"
            fontWeight={sun ? 600 : 400}
            fill={sun ? "var(--ochre)" : "var(--blush)"}
          >
            {abbr}
          </text>
        );
      })}
      <circle cx={C} cy={C} r={100} fill="var(--night-ink)" stroke="var(--lilac)" strokeWidth="1.5" />
      <circle cx={C} cy={C} r={39} fill="none" stroke="var(--ochre)" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={STAR8} transform={`translate(${C - 20} ${C - 20}) scale(${40 / 24})`} fill="var(--ochre)" />
      {DOTS.map((d) => {
        const at = three[d.key];
        if (!at) return null;
        const p = point(angleOf(at.longitude), d.r);
        return <circle key={d.key} cx={p.x} cy={p.y} r={d.size} fill={d.fill} stroke="var(--night-ink)" strokeWidth="2" />;
      })}
    </svg>
  );
}
