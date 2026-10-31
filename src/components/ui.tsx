import Link from "next/link";
import { Star8 } from "./art";

export function ReadingCard({ eyebrow, headline, children, action, className = "" }: { eyebrow: React.ReactNode; headline: React.ReactNode; children?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <section className={`card ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="headline">{headline}</h2>
      {children}
      {action && <div className="mt-1 self-start">{action}</div>}
    </section>
  );
}

export const AREA_FILL = { love: "bg-blush", work: "bg-periwinkle", selfcare: "bg-lilac", money: "bg-butter" } as const;

export function AreaTile({ href, title, line, area }: { href: string; title: string; line: string; area: keyof typeof AREA_FILL }) {
  return (
    <Link href={href} className={`tile ${AREA_FILL[area]} hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--cocoa)] transition`}>
      <span className="font-display text-lg font-semibold">{title}</span>
      <span className="text-sm leading-snug">{line}</span>
    </Link>
  );
}

/** Pill-shaped segmented control. Buttons report their state with aria-pressed. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  compact = false,
  className = "",
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  /** Size to the labels instead of filling the width. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`${compact ? "flex" : "grid gap-1"} rounded-full border-2 border-outline bg-surface p-[2px] ${className}`}
      style={compact ? undefined : { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={o.id === value}
          onClick={() => onChange(o.id)}
          className={`rounded-full text-sm transition ${compact ? "min-h-10 px-3.5" : "min-h-[42px] px-3"} ${o.id === value ? "bg-primary font-bold text-primary-ink" : "font-medium text-ink hover:bg-surface-2"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function StarProgress({ step, of }: { step: number; of: number }) {
  return (
    <div className="flex gap-1.5" role="img" aria-label={`Step ${step} of ${of}`}>
      {Array.from({ length: of }, (_, i) => (
        <Star8 key={i} size={22} fill={i < step ? "var(--ochre)" : "none"} strokeWidth={1} />
      ))}
    </div>
  );
}

export function PageHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-1">
      <div className="flex min-w-0 flex-col gap-0.5">
        <h1 className="title">{title}</h1>
        {sub && <p className="text-[15px] text-muted">{sub}</p>}
      </div>
      {right}
    </header>
  );
}

/** A row that links to another page, for secondary destinations. */
export function LinkRow({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <Link href={href} className="flex min-h-14 items-center justify-between gap-3 rounded-[18px] border-2 border-outline bg-surface px-4 py-3 hover:bg-surface-2">
      <span className="flex min-w-0 flex-col">
        <span className="font-bold">{title}</span>
        <span className="text-[15px] text-muted">{sub}</span>
      </span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

/** The one clear next thing to do, at the end of every reading. */
export function NextStep({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="mt-1 flex min-h-12 items-center justify-between gap-3 rounded-full border-2 border-outline bg-surface px-4 py-2 text-left hover:bg-surface-2"
    >
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-[13px] font-bold tracking-[0.14em] text-label uppercase">Next</span>
        <span className="font-bold">{label}</span>
      </span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

/** Heading for one step of Today's ritual, with a star that fills in when it's done. */
export function RitualHeading({ n, title, done }: { n: number; title: string; done: boolean }) {
  return (
    <h2 className="flex items-center gap-2 px-1 font-display text-xl font-semibold">
      <Star8 size={22} fill={done ? "var(--ochre)" : "none"} strokeWidth={1} />
      <span>
        {n} · {title}
      </span>
      <span className="sr-only">{done ? "(done)" : "(to do)"}</span>
    </h2>
  );
}
