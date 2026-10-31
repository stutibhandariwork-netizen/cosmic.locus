# Grahify · try it

A browser-only version of Grahify, a personal Vedic astrology, tarot and numerology companion.

**Live:** https://stutibhandariwork-netizen.github.io/cosmic.locus/

Everything runs in the visitor's browser: the chart is calculated on the device and birth details, tarot readings and journal entries are kept in that browser's local storage. There are no accounts and no server.

- **Chart:** sidereal zodiac (Lahiri ayanamsa), whole-sign houses, mean nodes, yogas, Vimshottari dasha, Sade Sati, North Indian chart (D1 and D9). Calculated with [astronomy-engine](https://github.com/cosinekitty/astronomy).
- **Week:** this week's transits, planet by planet, against your chart.
- **Tarot:** the 1909 Rider-Waite-Smith deck, five spreads and clarifiers. The deck is shuffled with the Web Crypto API and saved before you pick.
- **Numerology:** birth number, life path, name number (Chaldean or Pythagorean), personal year, month and day.
- **Journal:** notes and daily prompts, stored on your device.

Place data © [GeoNames](https://www.geonames.org/) (CC BY 4.0). For reflection and entertainment.

## Develop

```sh
npm install
npm run dev        # http://localhost:3000/cosmic.locus
npm test
npm run deploy     # build and publish to GitHub Pages
```
