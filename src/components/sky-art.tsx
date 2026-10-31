import { SIGN_GLYPH } from "@/lib/content/glyphs";
import { SIGNS } from "@/lib/engine";

/**
 * Fine line art for the sky: constellations, today's sky arc, orbit dividers and the logo.
 * Constellation shapes are simplified, recognisable stick figures, not star charts.
 */

/** Rounds SVG coordinates so the server and the browser print the same numbers. */
const r2 = (n: number) => Math.round(n * 100) / 100;

type Shape = { stars: [number, number][]; lines: [number, number][] };
const chain = (n: number, from = 0): [number, number][] => Array.from({ length: n - 1 - from }, (_, i) => [from + i, from + i + 1]);

export const CONSTELLATIONS: Shape[] = [
  { stars: [[10, 62], [40, 46], [65, 40], [86, 50]], lines: chain(4) }, // Aries
  { stars: [[18, 18], [44, 50], [55, 60], [66, 50], [90, 22], [55, 80]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]] }, // Taurus
  { stars: [[25, 12], [25, 86], [62, 8], [62, 80], [25, 42], [62, 38]], lines: [[0, 1], [2, 3], [4, 5]] }, // Gemini
  { stars: [[50, 50], [50, 14], [24, 86], [80, 80]], lines: [[0, 1], [0, 2], [0, 3]] }, // Cancer
  { stars: [[20, 30], [30, 14], [46, 14], [46, 36], [36, 46], [62, 56], [88, 50], [82, 78], [56, 72]], lines: [...chain(5), [4, 5], [5, 6], [6, 7], [7, 8], [8, 5]] }, // Leo
  { stars: [[12, 30], [34, 40], [55, 34], [76, 46], [60, 66], [40, 82], [88, 76]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 6]] }, // Virgo
  { stars: [[50, 14], [20, 44], [80, 44], [26, 82], [74, 82]], lines: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4]] }, // Libra
  { stars: [[12, 18], [24, 30], [34, 40], [44, 52], [50, 66], [60, 80], [76, 84], [88, 72], [84, 58]], lines: chain(9) }, // Scorpio
  { stars: [[18, 62], [34, 46], [50, 46], [60, 28], [70, 46], [88, 40], [76, 66], [50, 72], [34, 74]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [6, 7], [7, 8], [8, 0], [2, 7]] }, // Sagittarius
  { stars: [[12, 24], [40, 40], [70, 46], [90, 28], [76, 72], [44, 76]], lines: [...chain(6), [5, 0]] }, // Capricorn
  { stars: [[12, 32], [32, 20], [50, 36], [66, 24], [84, 44], [60, 60], [40, 78], [72, 86]], lines: [...chain(5), [2, 5], [5, 6], [5, 7]] }, // Aquarius
  { stars: [[12, 18], [24, 40], [40, 60], [56, 82], [70, 60], [84, 44], [90, 26], [76, 22]], lines: [...chain(8), [7, 5]] }, // Pisces
];

/** A sign's constellation in fine lines, inside a 100×100 box placed at (x, y) with the given size. */
export function Constellation({ sign, x = 0, y = 0, size = 100, stroke = "var(--indigo)", star = "var(--gold)", className }: { sign: number; x?: number; y?: number; size?: number; stroke?: string; star?: string; className?: string }) {
  const c = CONSTELLATIONS[sign];
  const k = size / 100;
  const at = ([px, py]: [number, number]) => [x + px * k, y + py * k] as const;
  return (
    <g className={className} aria-hidden>
      {c.lines.map(([a, b]) => {
        const [x1, y1] = at(c.stars[a]);
        const [x2, y2] = at(c.stars[b]);
        return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={0.9} strokeOpacity={0.55} strokeLinecap="round" />;
      })}
      {c.stars.map((s, i) => {
        const [cx, cy] = at(s);
        return <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2.6 : 1.9} fill={star} className={i % 4 === 0 ? "twinkle" : undefined} style={{ transformBox: "fill-box" }} />;
      })}
    </g>
  );
}

/** A small Moon with its real phase, drawn at (cx, cy). */
function MoonDisc({ cx, cy, r, elongation }: { cx: number; cy: number; r: number; elongation: number }) {
  const e = ((elongation % 360) + 360) % 360;
  const waxing = e < 180;
  const k = Math.cos((e * Math.PI) / 180);
  const rx = Math.abs(k) * r;
  const d = `M${cx} ${cy - r} A${r} ${r} 0 0 ${waxing ? 1 : 0} ${cx} ${cy + r} A${rx} ${r} 0 0 ${(k > 0) === waxing ? 0 : 1} ${cx} ${cy - r} Z`;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--indigo)" stroke="var(--indigo)" strokeWidth={1} />
      {e > 3 && e < 357 && <path d={d} fill="var(--cream)" />}
    </g>
  );
}

/**
 * Today's sky for the Today hero: the zodiac as a dotted arc (Aries at the left, Pisces at the
 * right), the Sun and the Moon (with its real phase) at their real positions, and the reader's
 * own sign as a constellation above.
 */
export function TodaySky({ sunLongitude, moonLongitude, elongation, sign, calm = false }: { sunLongitude: number; moonLongitude: number; elongation: number; sign: number; calm?: boolean }) {
  const W = 340;
  const H = calm ? 136 : 158;
  const cx = W / 2;
  const cy = H + 2;
  const r = 150;
  const ry = H - 28; // leaves room above the arc for the Sun and its glow
  const along = (lon: number, rr = r) => {
    const a = Math.PI * (1 - lon / 360); // 0° (Aries) at the left end, 360° at the right
    return { x: cx + rr * Math.cos(a), y: cy - rr * Math.sin(a) * (ry / r) };
  };
  const sun = along(sunLongitude);
  const close = Math.abs(((moonLongitude - sunLongitude + 540) % 360) - 180) > 168; // near new moon: keep them apart
  const moon = along(moonLongitude, close ? r - 24 : r);
  const label = `Today's sky: the Sun in ${SIGNS[Math.floor(sunLongitude / 30)].en} and the Moon in ${SIGNS[Math.floor(moonLongitude / 30)].en}, above your sign, ${SIGNS[sign].en}.`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id="sun-glow">
          <stop offset="0" stopColor="var(--gold)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {!calm && <Constellation sign={sign} x={cx - 34} y={H - 86} size={68} />}
      <path d={`M ${cx - r} ${cy} A ${r} ${ry} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--indigo)" strokeOpacity={0.45} strokeWidth={1.2} strokeDasharray="1.5 5" strokeLinecap="round" />
      {SIGN_GLYPH.map((g, i) => {
        const tick = along(i * 30, r);
        const tick2 = along(i * 30, r - 7);
        const mid = along(i * 30 + 15, r - 16);
        return (
          <g key={i}>
            {i > 0 && <line x1={tick.x} y1={tick.y} x2={tick2.x} y2={tick2.y} stroke="var(--indigo)" strokeOpacity={0.4} strokeWidth={1} />}
            <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="central" fontSize={i === sign ? 13 : 10} className="glyph" style={{ fill: i === sign ? "var(--indigo)" : "var(--cocoa)", fillOpacity: i === sign ? 1 : 0.55 }}>
              {g}
            </text>
          </g>
        );
      })}
      <circle cx={sun.x} cy={sun.y} r={26} fill="url(#sun-glow)" />
      <g stroke="var(--gold-deep)" strokeWidth={1.4} strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1={sun.x + 14 * Math.cos(a)} y1={sun.y + 14 * Math.sin(a)} x2={sun.x + 19 * Math.cos(a)} y2={sun.y + 19 * Math.sin(a)} />;
        })}
      </g>
      <circle cx={sun.x} cy={sun.y} r={10} fill="var(--gold)" stroke="var(--gold-deep)" strokeWidth={1.2} className="sun-wake" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <MoonDisc cx={moon.x} cy={moon.y} r={8} elongation={elongation} />
    </svg>
  );
}

/** A dotted orbit line with a small star: the divider under the Today hero. */
export function OrbitDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 18" preserveAspectRatio="none" className={`block h-[18px] w-full ${className}`} aria-hidden>
      <path d="M0 4 Q170 22 340 4" fill="none" stroke="var(--indigo)" strokeOpacity={0.35} strokeWidth={1} strokeDasharray="1.5 5" strokeLinecap="round" />
      <circle cx={170} cy={13} r={2.4} fill="var(--gold)" />
    </svg>
  );
}

/** The logo: a sun inside a zodiac ring, with a crescent moon. */
export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx={24} cy={24} r={23} fill="var(--indigo)" />
      <circle cx={24} cy={24} r={19} fill="none" stroke="var(--gold)" strokeWidth={1} strokeDasharray="1 2.6" />
      <g stroke="var(--gold)" strokeWidth={1.4} strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          return <line key={i} x1={r2(24 + 10.5 * Math.cos(a))} y1={r2(24 + 10.5 * Math.sin(a))} x2={r2(24 + 14 * Math.cos(a))} y2={r2(24 + 14 * Math.sin(a))} />;
        })}
      </g>
      <circle cx={24} cy={24} r={8} fill="var(--gold)" />
      <path d="M27.5 18.5 a6.5 6.5 0 1 0 0 11 a5.2 5.2 0 1 1 0 -11 Z" fill="var(--indigo)" />
    </svg>
  );
}

/** Night turning to dawn: two constellations and a line-art sun rising at the bottom edge. */
export function DawnSky({ height }: { height: number }) {
  const W = 375;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden>
      <Constellation sign={4} x={22} y={14} size={86} stroke="var(--gold-soft)" star="var(--gold-soft)" />
      <Constellation sign={7} x={262} y={10} size={90} stroke="var(--gold-soft)" star="var(--gold-soft)" />
      {[[140, 22], [210, 40], [120, 70], [330, 120], [40, 120], [250, 90]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 1 : 1.5} fill="var(--cream)" fillOpacity={0.8} className={i % 3 === 0 ? "twinkle" : undefined} style={{ transformBox: "fill-box" }} />
      ))}
      <g className="sun-wake" style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
        <circle cx={W / 2} cy={height + 18} r={78} fill="url(#dawn-glow)" />
        <g stroke="var(--gold)" strokeWidth={1.6} strokeLinecap="round">
          {Array.from({ length: 11 }, (_, i) => {
            const a = Math.PI + (i + 0.5) * (Math.PI / 11);
            return <line key={i} x1={r2(W / 2 + 52 * Math.cos(a))} y1={r2(height + 18 + 52 * Math.sin(a))} x2={r2(W / 2 + 66 * Math.cos(a))} y2={r2(height + 18 + 66 * Math.sin(a))} />;
          })}
        </g>
        <circle cx={W / 2} cy={height + 18} r={44} fill="var(--gold)" stroke="var(--gold-deep)" strokeWidth={1.5} />
      </g>
      <defs>
        <radialGradient id="dawn-glow">
          <stop offset="0.5" stopColor="var(--gold-soft)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--gold-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
