# Cosmic Locus

*Your sky, sunny side up.* A daily reading, your birth chart and tarot, in a warm "Peach Sunrise" design with a "Midnight Zodiac" night theme for the chart.

**Live:** https://stutibhandariwork-netizen.github.io/cosmic.locus/

Everything runs in the visitor's browser: the chart is calculated on the device, and birth details, tarot spreads and journal notes are kept in that browser's local storage. There are no accounts and no server.

- **Onboarding:** an intro, birth details (with why the time matters), Vedic or Western, then the chart wheel drawing itself, and a one-time "Your sky is ready" guide.
- **Today:** today's real sky (Sun, Moon phase, your constellation) and a four-step ritual: read your day, pull today's card, your affirmation, write one line. The reading opens with what the Moon is doing in your chart, rotates daily so it never repeats on consecutive days, and adds a line from Venus, Mars or your life chapter.
- **Your Locus:** your story in three lines, the zodiac wheel and your big three, in Vedic (sidereal, Lahiri) or Western (tropical). Life chapters (Vimshottari dasha), Saturn cycles, yogas and planets lead with plain words and keep the real terms alongside; Astrologer mode adds degrees, padas and every yoga checked. Calculated with [astronomy-engine](https://github.com/cosinekitty/astronomy).
- **Tarot:** card of the day, three cards (past, present, future) and yes / no, plus deeper spreads where you pick your own cards. Every card is pulled from a face-down deck shuffled with the Web Crypto API, and shows the 1909 Rider-Waite-Smith artwork (public domain).
- **Journal:** notes, daily prompts and saved tarot pulls, with optional one-way sync to a Google Doc (needs a Google client ID at build time).
- Also: this week's transits, numerology, a "Comfort reading" setting, download and restore a backup, and a home-screen reminder from the second visit.

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
