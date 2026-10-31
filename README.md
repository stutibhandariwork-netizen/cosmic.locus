# Cosmic Locus

*Your sky, sunny side up.* A daily reading, your birth chart and tarot, in a warm "Peach Sunrise" design with a "Midnight Zodiac" night theme for the chart.

**Live:** https://stutibhandariwork-netizen.github.io/cosmic.locus/

Everything runs in the visitor's browser: the chart is calculated on the device, and birth details, tarot spreads and journal notes are kept in that browser's local storage. There are no accounts and no server.

- **Today:** a daily reading counted from where today's Moon sits relative to your Moon sign (Vedic) or Sun sign (Western), with love, work and self-care notes, the Moon's phase, and a "Read deeper" page. The same reading all day; a new one tomorrow.
- **Your Locus:** a zodiac wheel and your big three (Sun, Moon, rising), in Vedic (sidereal, Lahiri) or Western (tropical). Vedic mode adds the North Indian chart (D1 and D9), planet placements, yogas, Vimshottari dasha and Saturn cycles. Calculated with [astronomy-engine](https://github.com/cosinekitty/astronomy).
- **Tarot:** card of the day, three cards (past, present, future) and yes / no, plus deeper spreads where you pick your own cards. Every card is pulled from a face-down deck shuffled with the Web Crypto API, and shows the 1909 Rider-Waite-Smith artwork (public domain).
- **Journal:** notes, daily prompts and saved tarot pulls.
- Also: this week's transits, numerology, and a "Comfort reading" setting for a calmer Today screen.

Installable as an app from the browser (web app manifest and icons in `public/`).

Place data © [GeoNames](https://www.geonames.org/) (CC BY 4.0). For reflection and fun.

## Develop

```sh
npm install
DEV_BASE_PATH=/cl npm run dev   # http://localhost:3000/cl/ (the real base path loops in dev)
npm test
npm run deploy                  # build and publish to GitHub Pages
```

Design tokens live in `src/app/globals.css`, illustrations in `src/components/art.tsx`, and the written content (daily readings, big-three lines, tarot meanings) in `src/lib/content/`.
