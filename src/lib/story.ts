import { CHAPTERS, MOON_WORD, RISING_WORD, STORY, SUN_WORD } from "./content/plain";
import { currentDasha, type DashaPeriod, type Graha, type NatalChart } from "./engine";
import { bigThree, type ZodiacSystem } from "./sky";

const monthYear = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const year = (iso: string) => new Date(iso).getUTCFullYear();

export interface Chapter {
  lord: Graha;
  period: DashaPeriod;
  name: string;
  theme: string;
}

/** The person's story: who they are (big three), the chapter they're in, and what comes next. */
export function lifeStory(chart: NatalChart, system: ZodiacSystem, now = new Date()) {
  const three = bigThree(chart, system);
  const who = STORY.who(SUN_WORD[three.sun.sign], MOON_WORD[three.moon.sign], three.rising ? RISING_WORD[three.rising.sign] : null);

  const cur = currentDasha(chart.dasha, now);
  if (!cur) return { three, who, now: null, next: null };
  const md = CHAPTERS[cur.mahadasha.lord];
  const ad = CHAPTERS[cur.antardasha.lord];
  const nowLine = STORY.now(md.name, `${year(cur.mahadasha.start)}–${year(cur.mahadasha.end)}`, ad.focus, monthYear(cur.antardasha.end), ad.nudge);

  // The next sub-chapter, or the next chapter if this is the last sub-chapter.
  const mdIndex = chart.dasha.mahadashas.findIndex((m) => m.start === cur.mahadasha.start);
  const ads = chart.dasha.mahadashas[mdIndex].antardashas;
  const adIndex = ads.findIndex((a) => a.start === cur.antardasha.start);
  const nextAd = ads[adIndex + 1];
  const nextMd = chart.dasha.mahadashas[mdIndex + 1];
  const next = nextAd
    ? { line: STORY.nextSub(monthYear(nextAd.start), CHAPTERS[nextAd.lord].focus), lord: nextAd.lord, start: nextAd.start, isChapter: false }
    : nextMd
      ? { line: STORY.nextChapter(String(year(nextMd.start)), CHAPTERS[nextMd.lord].name, CHAPTERS[nextMd.lord].theme), lord: nextMd.lord, start: nextMd.start, isChapter: true }
      : null;

  return {
    three,
    who,
    now: { line: nowLine, mahadasha: cur.mahadasha, antardasha: cur.antardasha, chapter: md, sub: ad },
    next,
  };
}

export type LifeStory = ReturnType<typeof lifeStory>;
