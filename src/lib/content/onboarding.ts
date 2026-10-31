/** Onboarding and birth-details copy, kept in one place so it can be translated later. */

export const FORM_ERRORS = {
  name: "What should we call you? Add a name to carry on.",
  date: "That birth date doesn't look quite right. Have another look?",
  time: "Add your birth time, or tick the box if you're not sure.",
  place: "Pick your birth place from the list as you type.",
} as const;

export const INTRO = {
  promise: "Your sky, read for you every day.",
  sub: "A daily reading from your birth chart, a tarot card to pull, and the story your stars tell.",
  sampleEyebrow: "Read from your Moon in Cancer",
  sampleHeadline: "A fresh-start kind of day.",
  sampleBody: "The Moon is back in your own sign, so feelings sit close to the surface.",
  privacy: "Takes a minute. Everything stays on your phone.",
  cta: "Find my sky",
};

export const DETAILS = {
  title: "Hello, starlight.",
  sub: "Let's find your place in the sky.",
  timeWhy: "Your exact time sets your rising sign (lagna) and which life areas each planet touches.",
  timeUnknownLabel: "I'm not sure of my time.",
  timeUnknownNote:
    "That's fine. You'll still get your Sun and Moon signs, daily readings and tarot. Your rising sign and life areas need the time, and you can add it later in Settings.",
  next: "Next",
};

export const SYSTEM = {
  title: "Which sky is yours?",
  sub: "Two ways of reading the same stars. You can switch any time.",
  reassure:
    "Not the sign you expected? Vedic signs are often one sign earlier than the magazine sign. Both are correct; they measure from different starting points.",
  vedic: { title: "Vedic", text: "Measured against the stars (sidereal zodiac, Lahiri ayanamsa), as Indian astrologers read it. Your day is read from your Moon sign." },
  western: { title: "Western", text: "The tropical zodiac most magazines use. Your day is read from your Sun sign." },
  cta: "Show me my sky",
  back: "Back to my details",
};

export const REVEAL = {
  line: (name: string) => `This is the sky the day you were born, ${name}.`,
  sub: "Calculated for your exact birth time and place.",
  cta: "See what it means",
};

export const WELCOME = {
  eyebrow: (name: string) => `Welcome, ${name}`,
  title: "Your sky is ready.",
  sub: "Three good places to start. Each takes a minute.",
  steps: [
    { title: "Meet your big three", sub: "Your Sun, Moon and rising sign, and what they say about you.", href: "/locus/#big-three" },
    { title: "Pull your first card", sub: "Shuffle the deck and pick today's tarot card.", href: "/tarot/" },
    { title: "See the chapter you're in", sub: "The life chapter you're in now (your dasha), and what comes next.", href: "/locus/#chapters" },
  ],
  today: "Take me to today",
};

export const CONTACT = {
  title: "Where can we reach you?",
  sub: "So we know who's using Cosmic Locus. We'll never share it.",
  email: "Email",
  emailHint: "you@example.com",
  phone: "Phone (optional)",
  phoneHint: "+91 98765 43210",
  consent:
    "I agree that Cosmic Locus saves my email (and phone, if I add one), my first name and the dates I visit. My birth details stay on this phone. I can remove my email any time in Settings.",
  errors: {
    email: "That email doesn't look quite right. Have another look?",
    phone: "That phone number doesn't look right. Use digits, with your country code if you like.",
    consent: "Tick the box to say it's okay, then carry on.",
  },
  next: "Next",
  existingTitle: "Stay in touch",
  existingSub: "Add your email so we know you're here. Your birth details stay on this phone.",
  later: "Not now",
};
