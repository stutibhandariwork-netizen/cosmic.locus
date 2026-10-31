"use client";

import Link from "next/link";
import { Star8 } from "@/components/art";
import { WELCOME } from "@/lib/content/onboarding";
import { update } from "@/lib/store";

const seen = () => update((d) => ({ ...d, seenWelcome: true }));

/** Shown once, straight after onboarding: three good first steps. */
export function WelcomeGuide({ name }: { name: string }) {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1 px-1">
        <p className="eyebrow">{WELCOME.eyebrow(name)}</p>
        <h1 className="title">{WELCOME.title}</h1>
        <p>{WELCOME.sub}</p>
      </header>
      <ol className="flex flex-col gap-3">
        {WELCOME.steps.map((s, i) => (
          <li key={s.href}>
            <Link href={s.href} onClick={seen} className="card flex-row items-center gap-4 hover:bg-surface-2">
              <span className="relative grid size-12 shrink-0 place-items-center" aria-hidden>
                <Star8 size={48} />
                <span className="absolute font-display text-lg font-semibold text-cocoa">{i + 1}</span>
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-display text-xl leading-tight font-semibold">{s.title}</span>
                <span className="text-[15px] text-muted">{s.sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn-wide mt-2" onClick={seen}>
        {WELCOME.today}
      </button>
    </div>
  );
}
