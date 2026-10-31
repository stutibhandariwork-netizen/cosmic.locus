import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Link from "next/link";
import { BottomNav } from "@/components/nav";
import "./globals.css";

const display = Fraunces({ variable: "--font-display", subsets: ["latin"], axes: ["SOFT", "opsz"] });
const body = Manrope({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grahify · try it",
  description: "Your Vedic chart, tarot and numerology, calculated precisely and explained simply. Everything stays on your device.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#14111f" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} min-h-dvh`}>
        <header className="sticky top-0 z-10 border-b border-line/70 bg-bg/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-2 px-4">
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
              <svg viewBox="0 0 32 32" className="size-7 text-accent" aria-hidden>
                <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <ellipse cx="16" cy="16" rx="15" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-20 16 16)" opacity=".7" />
                <circle cx="16" cy="16" r="3" fill="currentColor" />
              </svg>
              Grahify
              <span className="chip ml-1 px-2 py-0 text-[10px]">try it</span>
            </Link>
            <Link href="/settings/" className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2" aria-label="Settings and your data">
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-2xl px-4 pt-4 pb-16">{children}</main>
        <footer className="mx-auto max-w-2xl px-4 pb-28 text-center text-xs text-muted">
          For reflection and entertainment. Everything you enter stays on this device. Place data ©{" "}
          <a className="underline" href="https://www.geonames.org/">
            GeoNames
          </a>{" "}
          (CC BY 4.0). Tarot: Rider-Waite-Smith, 1909 (public domain).
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
