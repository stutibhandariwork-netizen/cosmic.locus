"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS: Record<string, string> = {
  today: "M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  chart: "M3 3h18v18H3zM3 3l18 18M21 3 3 21M12 3l9 9-9 9-9-9z",
  week: "M4 5h16v15H4zM4 10h16M9 3v4M15 3v4",
  tarot: "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm5 6 1.2 2.5L16 12l-2.8.5L12 15l-1.2-2.5L8 12l2.8-.5Z",
  numbers: "M9 4 7 20M17 4l-2 16M4 9h16M3 15h16",
  journal: "M6 3h11a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 5h6M9 12h6",
};

const ITEMS = [
  { href: "/", label: "Today", icon: "today" },
  { href: "/chart/", label: "Chart", icon: "chart" },
  { href: "/week/", label: "Week", icon: "week" },
  { href: "/tarot/", label: "Tarot", icon: "tarot" },
  { href: "/numerology/", label: "Numbers", icon: "numbers" },
  { href: "/journal/", label: "Journal", icon: "journal" },
];

export function BottomNav() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, "")));
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur" aria-label="Sections">
      <ul className="mx-auto grid max-w-2xl grid-cols-6">
        {ITEMS.map((n) => (
          <li key={n.href}>
            <Link
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${active(n.href) ? "text-accent" : "text-muted"}`}
            >
              <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={ICONS[n.icon]} />
              </svg>
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
