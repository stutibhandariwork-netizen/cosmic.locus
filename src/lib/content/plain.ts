import type { Graha } from "../engine";

/**
 * Plain-language readings of chart terms. Each item leads with what it means for you,
 * and keeps the real astrological name alongside it so the jargon is never hidden.
 */

/** Vimshottari dasha lords as life chapters. */
export const CHAPTERS: Record<Graha, { name: string; theme: string; focus: string; nudge: string }> = {
  Sun: { name: "spotlight chapter", theme: "purpose, recognition and stepping up", focus: "being seen and taking the lead", nudge: "say yes when you're asked to step forward" },
  Moon: { name: "heart-and-home chapter", theme: "feelings, family and belonging", focus: "home, family and how you feel", nudge: "make time for the people who feel like home" },
  Mars: { name: "courage chapter", theme: "drive, action and standing your ground", focus: "energy, courage and getting things moving", nudge: "start the thing you've been putting off" },
  Rahu: { name: "big-ambitions chapter", theme: "bold moves, new places and unexpected paths", focus: "big leaps and doing things differently", nudge: "follow the opportunity that excites you, with your eyes open" },
  Jupiter: { name: "growth chapter", theme: "learning, luck, wisdom and expansion", focus: "learning, teachers and good fortune", nudge: "sign up, study, and ask the wise people around you" },
  Saturn: { name: "building chapter", theme: "hard work, patience and lasting foundations", focus: "steady work and long-term plans", nudge: "keep showing up; slow progress here really lasts" },
  Mercury: { name: "learning-and-talking chapter", theme: "ideas, skills and deals", focus: "learning, talking and deal-making", nudge: "say yes to conversations" },
  Ketu: { name: "letting-go chapter", theme: "looking inward and clearing what's done", focus: "reflection and letting go", nudge: "clear out what you've outgrown and leave space" },
  Venus: { name: "love-and-beauty chapter", theme: "relationships, comfort and creativity", focus: "love, beauty and enjoying life", nudge: "make room for pleasure and the people you love" },
};

/** One-word moods for the big three, by sign (0 = Aries). */
export const SUN_WORD = ["bold", "steady", "curious", "caring", "radiant", "thoughtful", "graceful", "intense", "adventurous", "ambitious", "original", "dreamy"];
export const MOON_WORD = ["fiery", "calm", "restless", "tender", "proud", "careful", "harmony-loving", "deep", "free-spirited", "steady", "independent", "sensitive"];
export const RISING_WORD = ["direct", "easygoing", "chatty", "warm", "sunny", "polished", "charming", "magnetic", "upbeat", "composed", "unusual", "gentle"];

export const STORY = {
  title: "Your story in three lines",
  who: (sun: string, moon: string, rising: string | null) =>
    rising ? `${cap(sun)} on the outside, ${moon} on the inside, and ${rising} to meet.` : `${cap(sun)} on the outside and ${moon} on the inside.`,
  now: (md: string, years: string, ad: string, until: string, nudge: string) =>
    `You're in your ${md} (${years}). Until ${until}, the focus is ${ad}, so ${nudge}.`,
  nextSub: (from: string, focus: string) => `From ${from}, the focus turns to ${focus}.`,
  nextChapter: (from: string, name: string, theme: string) => `From ${from}, your ${name} begins: ${theme}.`,
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
