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

/** Whole-sign houses as life areas (index = house number). */
export const LIFE_AREAS: Record<number, { zone: string; short: string }> = {
  1: { zone: "you-and-your-body zone", short: "you and your body" },
  2: { zone: "money-and-values zone", short: "money and values" },
  3: { zone: "courage-and-messages zone", short: "courage and messages" },
  4: { zone: "home-and-family zone", short: "home and family" },
  5: { zone: "creativity-and-romance zone", short: "creativity and romance" },
  6: { zone: "work-routines-and-health zone", short: "work routines and health" },
  7: { zone: "partnership zone", short: "partnerships" },
  8: { zone: "intimacy-and-big-changes zone", short: "intimacy and big changes" },
  9: { zone: "luck-travel-and-beliefs zone", short: "luck, travel and beliefs" },
  10: { zone: "career zone", short: "career and reputation" },
  11: { zone: "friends-and-wins zone", short: "friends and wins" },
  12: { zone: "rest-and-inner-world zone", short: "rest and the inner world" },
};

/** A short mood for each nakshatra (lunar mansion), in order from Ashwini. */
export const NAKSHATRA_MOOD = [
  "a quick-start mood", // Ashwini
  "an intense, creative mood", // Bharani
  "a sharp, cleansing mood", // Krittika
  "a growing, abundant mood", // Rohini
  "a curious, searching mood", // Mrigashira
  "a stormy, clearing mood", // Ardra
  "a fresh-start mood", // Punarvasu
  "a nourishing mood", // Pushya
  "a perceptive, guarded mood", // Ashlesha
  "a proud, ancestral mood", // Magha
  "a playful, restful mood", // Purva Phalguni
  "a generous, loyal mood", // Uttara Phalguni
  "a skilful, hands-on mood", // Hasta
  "a bright, crafting mood", // Chitra
  "an independent, breezy mood", // Swati
  "a determined, goal-set mood", // Vishakha
  "a devoted, friendly mood", // Anuradha
  "a protective, senior mood", // Jyeshtha
  "a getting-to-the-root mood", // Mula
  "an unstoppable, hopeful mood", // Purva Ashadha
  "a steady, victorious mood", // Uttara Ashadha
  "a listening, learning mood", // Shravana
  "a rhythmic, prosperous mood", // Dhanishta
  "a healing, private mood", // Shatabhisha
  "a fiery, idealistic mood", // Purva Bhadrapada
  "a deep, calm mood", // Uttara Bhadrapada
  "a gentle, guiding mood", // Revati
];

/** Saturn's cycles over the natal Moon, framed as growth. */
export const SATURN_PLAIN = {
  sade_sati: {
    title: "Your 7½-year growing-up test",
    term: "Sade Sati",
    what: "Saturn passes over the signs around your Moon",
    past: "Behind you. Those years built the steadiness you have now.",
    now: "You're in it now. It asks for patience and steady effort, and it rewards what you build carefully. Keep routines simple and lean on people you trust.",
    next: "Ahead. A season for slowing down, simplifying and building something solid. Nothing to fear; it's a time when effort really counts.",
  },
  ashtama_shani: {
    title: "A Saturn pressure point",
    term: "Ashtama Shani",
    what: "Saturn is 8th from your Moon",
    past: "Behind you. You came through it, and you know your own strength better for it.",
    now: "You're in it now. Keep plans simple, rest more and look after your health. It passes, and it teaches resilience.",
    next: "Ahead. A good time to keep life simple and look after yourself; plan big moves around it if you can.",
  },
};

export interface YogaPlain {
  headline: string;
  meaning: string;
  nudge: string;
  /** For the harder combinations: a gentle note that puts it in proportion. */
  gentle?: string;
}

/** Yogas and doshas in plain words. Neecha Bhanga is keyed "neecha_bhanga". */
export const YOGA_PLAIN: Record<string, YogaPlain> = {
  budhaditya: {
    headline: "A sharp mind that gets noticed",
    meaning: "Your Sun and Mercury sit together, so your thinking and your sense of self work as a team. You explain things well.",
    nudge: "Use it in meetings, pitches and anywhere you need to make a case.",
  },
  gajakesari: {
    headline: "Wisdom and good fortune that find you",
    meaning: "Jupiter stands strong from your Moon, which brings good sense, generosity and people who want to help you.",
    nudge: "Say yes to teachers and mentors, and share what you know.",
  },
  neecha_bhanga: {
    headline: "A weak spot that turns into a strength",
    meaning: "One planet starts out in its hardest sign, but other parts of your chart lift it. What feels like a struggle early on often becomes a real gift.",
    nudge: "Be patient with the area that felt hard when you were younger; it grows into one of your strengths.",
  },
  grahan: {
    headline: "Strong feelings and a searching mind",
    meaning: "Your Sun or Moon sits with one of the lunar nodes, which can bring intense moods, big questions and a pull towards the unusual.",
    nudge: "Ground yourself with routines, sleep and people who steady you.",
    gentle: "Traditionally called an eclipse yoga. It's common, and it often shows up as depth and intuition.",
  },
  mangal_dosha: {
    headline: "You love with fire",
    meaning: "You're passionate and direct, and sometimes quick to argue. You do best with someone who has their own spark.",
    nudge: "Channel the heat into exercise and shared projects, and cool down before big talks.",
    gentle: "Traditionally called Mangal Dosha. It's very common and often softened by other parts of your chart.",
  },
  kaal_sarp: {
    headline: "A life with a strong storyline",
    meaning: "All your planets sit on one side of the lunar nodes, so life tends to move in big, focused chapters with clear turning points.",
    nudge: "When things feel stuck, trust that your chapters change; keep going.",
    gentle: "Traditionally called Kaal Sarp Yoga. Many successful people have it, and modern astrologers read it as focus, not misfortune.",
  },
  ruchaka: {
    headline: "Courage and drive that lead",
    meaning: "Mars is strong and well placed, giving you energy, boldness and the will to protect what matters.",
    nudge: "Take on the challenge others avoid; just pick your battles.",
  },
  bhadra: {
    headline: "A quick, clever communicator",
    meaning: "Mercury is strong and well placed, giving you wit, skill with words and a head for business.",
    nudge: "Write, teach, trade or negotiate: your words are your tools.",
  },
  hamsa: {
    headline: "Goodness and good judgement",
    meaning: "Jupiter is strong and well placed, bringing wisdom, kindness and a respected voice.",
    nudge: "People trust your advice; give it generously.",
  },
  malavya: {
    headline: "Charm, taste and a love for beautiful things",
    meaning: "Venus is strong and well placed. People are drawn to how you make spaces and moments feel.",
    nudge: "Make beauty part of your work, not just your weekends.",
  },
  shasha: {
    headline: "Staying power that builds something big",
    meaning: "Saturn is strong and well placed, giving discipline, patience and the ability to lead over the long run.",
    nudge: "Play the long game; your consistency is your superpower.",
  },
  chandra_mangal: {
    headline: "Feelings that turn into action",
    meaning: "Your Moon and Mars sit together, so when you care about something you move on it, and you have a knack for making things happen.",
    nudge: "Let a strong feeling become a plan, not a quarrel.",
  },
  kemadruma: {
    headline: "An independent heart",
    meaning: "Your Moon stands without close planetary neighbours, so you learn to be your own support and can feel things on your own terms.",
    nudge: "Build a few close, steady friendships and let them in.",
    gentle: "Traditionally called Kemadruma Yoga. It's often cancelled by other planets, and many people with it are deeply self-reliant.",
  },
};

export const yogaPlain = (key: string): YogaPlain | undefined => YOGA_PLAIN[key.startsWith("neecha_bhanga") ? "neecha_bhanga" : key];
