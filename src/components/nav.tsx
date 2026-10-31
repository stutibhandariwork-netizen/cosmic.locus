"use client";

import Link from "next/link";
import { LogoMark } from "@/components/sky-art";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { startInstallWatch } from "@/lib/install";
import { useData } from "@/lib/store";

const ICONS = {
  today: (
    <>
      <path d="M6 21V11a6 6 0 0 1 12 0v10" />
      <path d="M4 21h16" />
    </>
  ),
  locus: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    </>
  ),
  tarot: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M12 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
    </>
  ),
  journal: (
    <>
      <path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19a2 2 0 0 1 2-2h14" />
    </>
  ),
};

const ITEMS = [
  { href: "/", label: "Today", icon: "today", match: ["/day", "/settings", "/week"] },
  { href: "/locus/", label: "Locus", icon: "locus", match: ["/numerology"] },
  { href: "/tarot/", label: "Tarot", icon: "tarot", match: [] },
  { href: "/journal/", label: "Journal", icon: "journal", match: [] },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const data = useData();

  // Count visits and catch the install prompt (for the "add to home screen" card).
  useEffect(startInstallWatch, []);
  // Onboarding is a full-screen sheet with no tab bar.
  if (pathname === "/" && !data?.profile) return null;

  const active = (n: (typeof ITEMS)[number]) =>
    n.href === "/" ? pathname === "/" || n.match.some((m) => pathname.startsWith(m)) : pathname.startsWith(n.href.replace(/\/$/, "")) || n.match.some((m) => pathname.startsWith(m));
  return (
    <nav aria-label="Main" className={`fixed inset-x-0 bottom-0 z-20 bg-bg pb-[max(env(safe-area-inset-bottom),12px)] border-t border-[var(--tab-line)]`}>
      <ul className="mx-auto grid max-w-[480px] grid-cols-4 px-1 pt-1.5">
        {ITEMS.map((n) => {
          const on = active(n);
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-[3px] text-[13px] ${on ? "font-bold text-[var(--tab-active)]" : "font-medium text-ink"}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[n.icon]}
                </svg>
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Wordmark and Settings button above every page except Today (which has its own) and onboarding. */
export function TopBar() {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/settings")) return null;
  return (
    <div className="mx-auto flex max-w-[480px] items-center justify-between px-4 pt-3 -mb-3">
      <Link href="/" className="flex min-h-11 items-center gap-2 font-display text-lg font-semibold text-indigo">
        <LogoMark size={28} />
        Cosmic Locus
      </Link>
      <Link href="/settings/" aria-label="Settings" className="grid size-11 place-items-center rounded-full border border-outline bg-surface text-indigo hover:bg-surface-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="8" cy="17" r="2" />
        </svg>
      </Link>
    </div>
  );
}
