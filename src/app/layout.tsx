import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { BottomNav, TopBar } from "@/components/nav";
import { BASE } from "@/lib/base-path";
import "./globals.css";

const display = Fraunces({ variable: "--font-display", subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"] });
const body = DM_Sans({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Cosmic Locus",
  description: "Your sky, sunny side up. Daily readings, your birth chart and tarot. Everything stays on your device.",
  manifest: `${BASE}/manifest.webmanifest`,
  icons: { icon: `${BASE}/icon.svg`, apple: `${BASE}/apple-touch-icon.png` },
  appleWebApp: { capable: true, title: "Cosmic Locus", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#FFF6EC",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} min-h-dvh`}>
        <TopBar />
        <main className="mx-auto w-full max-w-[480px] px-4 pt-6 pb-8">{children}</main>
        <footer className="mx-auto max-w-[480px] px-5 pb-32 text-[13px] text-muted">
          For reflection and fun. Everything you enter stays on this device. Place data ©{" "}
          <a className="underline" href="https://www.geonames.org/">
            GeoNames
          </a>{" "}
          (CC BY 4.0). Tarot art: Rider-Waite-Smith, 1909 (public domain).
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
