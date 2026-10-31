import type { TarotCard, YesNoNature } from "../tarot/deck";

/**
 * Upright meanings in the Cosmic Locus voice: a short headline and one sentence ending in
 * something to do. Same order as DECK (majors, then wands, cups, swords, pentacles).
 */
const VOICE: [headline: string, line: string][] = [
  // Major arcana
  ["Say yes to something new.", "Take the first small step, even without the whole map."],
  ["You already have what you need.", "Pick one thing you're good at and start with it."],
  ["Your quiet knowing is right.", "Get still for five minutes and listen before you decide."],
  ["Let yourself be looked after.", "Eat something lovely, slowly, and let comfort count."],
  ["A little structure, a lot of calm.", "Set one clear boundary and keep it kindly."],
  ["Lean on what has worked before.", "Ask someone wiser, or try the tried-and-true way first."],
  ["Choose with your whole heart.", "Pick what matches your values, then commit to it."],
  ["Steer, don't drift.", "Name where you're heading today and move toward it."],
  ["Gentle is powerful.", "Meet the hard thing with patience instead of force."],
  ["A quiet hour does wonders.", "Take some time alone and let your own answer surface."],
  ["Things are turning your way.", "Stay flexible and say yes when the opening comes."],
  ["Fair and clear wins today.", "Be honest about what's yours to fix, then fix it."],
  ["Pause and see it sideways.", "Let something wait and look at it from a new angle."],
  ["Make room for what's next.", "Let one thing end gracefully so something new can begin."],
  ["Slow, sweet and balanced.", "Mix work with rest and take the middle path today."],
  ["Notice what's holding on to you.", "Loosen one habit that no longer feels good."],
  ["A shake-up that clears the air.", "Let the wobbly thing go and rebuild on solid ground."],
  ["Hope is quietly coming back.", "Rest, refill and let one small wish be enough today."],
  ["Not everything needs an answer yet.", "Trust your feelings and give unclear things a little time."],
  ["Warmth is on its way.", "Go out, be seen and enjoy something just because it's fun."],
  ["Answer the call.", "Forgive yourself for the past and step into the next chapter."],
  ["Look how far you've come.", "Celebrate what you've finished before you start anything new."],
  // Wands
  ["A spark worth following.", "Write down the idea that excites you and take one step on it."],
  ["The big picture is calling.", "Sketch a plan for where you'd love to be next."],
  ["Your ships are coming in.", "Keep looking ahead; what you started is beginning to grow."],
  ["A little celebration is due.", "Gather your people and mark a happy moment."],
  ["Friendly competition, not a fight.", "Let others have their say, then add yours with good humour."],
  ["Take the win.", "Accept the compliment and let yourself be proud."],
  ["Stand your ground, kindly.", "Hold on to what matters to you without needing to argue."],
  ["Things are moving fast.", "Reply to that message and ride the momentum."],
  ["Nearly there, keep going.", "Rest a moment, then take the last few steps."],
  ["Put one thing down.", "Hand off or drop one task so you can carry the rest."],
  ["Curiosity leads the way.", "Try something new just to see what happens."],
  ["Bold moves, warm heart.", "Go for it, and look where you're leaping."],
  ["Shine without shrinking.", "Walk in like you belong, because you do."],
  ["Lead with your vision.", "Share your idea and invite others to build it with you."],
  // Cups
  ["Your heart is filling up.", "Say yes to love, kindness or a new friendship."],
  ["A lovely connection.", "Reach out to someone you feel easy with."],
  ["Friends make it better.", "Plan a get-together or send the group chat some love."],
  ["Look up, there's something new.", "Notice the offer you might be overlooking."],
  ["Not everything is lost.", "Let yourself feel it, then turn to what's still here."],
  ["Sweet memories, soft heart.", "Call someone from the old days or revisit a childhood joy."],
  ["Lots of dreams, pick one.", "Choose the option that feels real, not just shiny."],
  ["It's okay to walk on.", "Leave behind what no longer fills you up."],
  ["A wish is coming true.", "Enjoy what you have and let yourself feel satisfied."],
  ["Home is where the heart is happy.", "Spend time with the people who feel like family."],
  ["A sweet surprise.", "Stay open to a soft message or a creative idea."],
  ["Follow your heart, gently.", "Make the romantic or creative offer you've been dreaming of."],
  ["Care for you, too.", "Listen to your feelings with the kindness you give others."],
  ["Calm waters, steady heart.", "Stay kind and balanced, even if others get stormy."],
  // Swords
  ["Clarity cuts through.", "Say the true thing simply and clearly."],
  ["Take a breath before you choose.", "Gather a little more information, then decide."],
  ["Let the hurt be felt.", "Be gentle with your heart and talk to someone you trust."],
  ["Rest is productive.", "Take a proper break today; your mind needs it."],
  ["Choose peace over winning.", "Let go of an argument that isn't worth the cost."],
  ["Calmer waters ahead.", "Keep moving gently toward what feels lighter."],
  ["Be clever, be honest.", "Make a smart plan and keep it above board."],
  ["You're freer than you feel.", "Take one small step out of the box you've drawn."],
  ["Worry is louder than reality.", "Write your worries down and share one with a friend."],
  ["The hard part is over.", "Let this chapter close and look toward the dawn."],
  ["Ask good questions.", "Stay curious and check the facts before you share."],
  ["Think fast, speak kind.", "Act on your idea, but slow your words down."],
  ["Clear and kind.", "Say what you need honestly, with a warm tone."],
  ["Wise words win.", "Make the decision with a clear head and a fair heart."],
  // Pentacles
  ["A real opportunity.", "Say yes to the practical offer and plant the seed."],
  ["Juggle with a smile.", "Keep things flexible and drop what isn't needed."],
  ["Teamwork shines.", "Ask for help or offer yours; together it's better."],
  ["Hold on, but not too tight.", "Protect your energy and money without closing your heart."],
  ["Help is closer than you think.", "Reach out; someone would love to help."],
  ["Give and receive.", "Share a little, and let yourself accept kindness too."],
  ["Growing, slowly but surely.", "Check on your progress and keep tending your garden."],
  ["Practice makes lovely.", "Spend focused time on a skill you're building."],
  ["Enjoy what you've built.", "Treat yourself to a small luxury you've earned."],
  ["Roots that hold.", "Invest in something that lasts, for you and your people."],
  ["Learn something useful.", "Start a course, a plan or a new healthy habit."],
  ["Slow and steady wins.", "Do the next sensible task, then the next one."],
  ["Cosy, capable you.", "Look after your home, body and budget with love."],
  ["Steady success.", "Make a grounded choice about money or work today."],
];

export const voiceOf = (card: TarotCard) => {
  const [headline, line] = VOICE[card.index];
  return { headline, line };
};

export const YES_NO_ANSWER: Record<YesNoNature, string> = {
  yes: "Yes, warmly.",
  maybe: "Maybe. Give it time.",
  no: "Not yet, and that's okay.",
};

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

/** Small label above the card name: the Roman numeral for majors and pips, the suit for court cards. */
export function numeralOf(card: TarotCard): string {
  if (card.arcana === "major") return ROMAN[card.index];
  const rank = (card.index - 22) % 14; // 0 = ace
  if (rank === 0) return `ACE · ${card.suit!.toUpperCase()}`;
  return rank < 10 ? `${ROMAN[rank + 1]} · ${card.suit!.toUpperCase()}` : card.suit!.toUpperCase();
}

const MAJOR_FILLS = ["var(--blush)", "var(--lilac)", "var(--butter)", "var(--periwinkle)", "var(--peach)"];
const SUIT_FILLS = { wands: "var(--peach)", cups: "var(--periwinkle)", swords: "var(--lilac)", pentacles: "var(--butter)" } as const;

/** Pastel panel colour for the placeholder artwork. */
export const fillOf = (card: TarotCard) => (card.suit ? SUIT_FILLS[card.suit] : MAJOR_FILLS[card.index % MAJOR_FILLS.length]);
