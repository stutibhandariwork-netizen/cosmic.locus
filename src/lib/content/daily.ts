/**
 * Daily readings in the Cosmic Locus voice, keyed by where today's Moon sits counted from
 * the reader's own sign (their Moon sign in Vedic mode, Sun sign in Western mode).
 * This is classic Moon-transit (gochara) reading: house 1 is the reader's own sign.
 */

export interface AreaRead {
  line: string; // tile one-liner
  detail: string; // one or two sentences for "Read deeper"
}

export interface HouseRead {
  zone: string; // what this part of the chart is about, for the explanation
  readings: { headline: string; body: string }[];
  love: AreaRead;
  work: AreaRead;
  selfcare: AreaRead;
}

export const DAILY: Record<number, HouseRead> = {
  1: {
    zone: "you: your body, mood and how you show up",
    readings: [
      { headline: "All eyes on you, gently.", body: "The Moon is visiting your own sign, so feelings sit close to the surface. Put yourself first in small ways. Wear the thing that makes you feel good." },
      { headline: "A fresh-start kind of day.", body: "Your mood sets the tone today. Start with what you want, not what others expect. One kind thing for yourself, then the rest." },
    ],
    love: { line: "Say what you feel.", detail: "You're easy to read today, so let that work for you. Tell someone plainly what you'd love." },
    work: { line: "Lead with your idea.", detail: "People listen when you go first. Share the idea before you polish it." },
    selfcare: { line: "Dress up for you.", detail: "Your body notices everything today. Eat well, move a little and wear what makes you feel like yourself." },
  },
  2: {
    zone: "money, food, family and the words you choose",
    readings: [
      { headline: "Soft words, full heart.", body: "Today is about what you value and how you speak. Choose your words with care and enjoy a good meal. Check one bill before you spend." },
      { headline: "Treat your money kindly.", body: "It's a day for comfort and small luxuries. Count what you have before buying more. Say the kind thing first." },
    ],
    love: { line: "Speak softly.", detail: "Your words land harder than you think today. A warm tone does most of the work." },
    work: { line: "Check the numbers.", detail: "Money matters are in focus. Look over one budget, invoice or price before you agree to it." },
    selfcare: { line: "Eat something nourishing.", detail: "Comfort food is allowed. Make it something that leaves you feeling good an hour later too." },
  },
  3: {
    zone: "courage, effort, messages and short trips",
    readings: [
      { headline: "Brave little steps.", body: "Your courage is up today. Send the message you've been drafting and try the thing you've been putting off. Short trips and quick chats go well." },
      { headline: "Say it, send it, do it.", body: "Energy is good for effort today. Pick one task you've been avoiding and finish it. A sibling or neighbour may have good news." },
    ],
    love: { line: "Make the first move.", detail: "You have the nerve today. Send the text, suggest the plan, say the thing." },
    work: { line: "Send the email.", detail: "Effort pays off quickly. Clear the message you've been avoiding before lunch." },
    selfcare: { line: "Take a brisk walk.", detail: "Restless energy wants an outlet. A quick walk or a dance in the kitchen counts." },
  },
  4: {
    zone: "home, family, comfort and your inner mood",
    readings: [
      { headline: "Home is the happy place.", body: "The Moon is in your home zone, so you may want comfort and quiet. Tidy one corner and call someone who feels like home. Staying in is a perfectly good plan." },
      { headline: "Cosy and close today.", body: "Feelings run a little deeper today. Make your space soft and let yourself rest there. Small comforts count." },
    ],
    love: { line: "Stay in together.", detail: "Closeness beats excitement today. Cook together, or call family and simply catch up." },
    work: { line: "Work from comfort.", detail: "You'll focus best somewhere calm. Pick the quiet task and a comfortable chair." },
    selfcare: { line: "Tidy one corner.", detail: "A calmer space makes a calmer you. Clear one shelf, one drawer or one bag." },
  },
  5: {
    zone: "joy, romance, creativity and children",
    readings: [
      { headline: "Play is productive.", body: "Today favours fun, romance and creativity. Make something just because you want to. A little playfulness clears your head." },
      { headline: "Let your heart lead.", body: "Your ideas are lively today. Write, draw, cook or flirt; anything that feels like play. Joy is the point." },
    ],
    love: { line: "Plan a little date.", detail: "Romance is easy today. Suggest something light and fun, even a walk and an ice cream." },
    work: { line: "Pitch the fun idea.", detail: "Creative thinking is your strength today. Bring the playful option to the table." },
    selfcare: { line: "Make something.", detail: "Your heart wants to create. Ten minutes of drawing, writing or cooking will lift your mood." },
  },
  6: {
    zone: "health, routines, daily work and getting past obstacles",
    readings: [
      { headline: "Tidy routines, happy you.", body: "This is a good day for getting on top of things. Clear a few small tasks and look after your body. You'll handle any friction with ease." },
      { headline: "Small wins add up.", body: "You're steady and capable today. Book the appointment, sort the inbox, drink more water. Progress loves a routine." },
    ],
    love: { line: "Show care with help.", detail: "Love looks practical today. Do one small useful thing for someone and let it speak for you." },
    work: { line: "Clear the to-do list.", detail: "You're good at the details today. Knock out three small tasks before the big one." },
    selfcare: { line: "Drink more water.", detail: "Your body responds well to routine today. Water, a stretch and a proper lunch." },
  },
  7: {
    zone: "partners, close relationships and agreements",
    readings: [
      { headline: "Meet them halfway.", body: "The Moon lights up your relationships. Someone close is ready to meet you halfway, so say the kind thing first. Partnerships of all kinds go well." },
      { headline: "Two is better than one.", body: "Today is about the people beside you. Ask for an opinion and listen well. Plans made together stick." },
    ],
    love: { line: "Meet them halfway.", detail: "Someone is ready to come closer. Make it easy for them with a warm first word." },
    work: { line: "Team up.", detail: "Agreements go well today. Partner on a task or settle a deal you've been discussing." },
    selfcare: { line: "Lunch with a friend.", detail: "Company refills you today. Share a meal or a long call with someone you trust." },
  },
  8: {
    zone: "rest, change and what goes on beneath the surface",
    readings: [
      { headline: "A slower day, and that's fine.", body: "The Moon is in a quieter part of your chart, so energy may dip. Keep plans light and save big decisions for later. Rest is the most useful thing you can do." },
      { headline: "Go gently today.", body: "Today asks for patience. Feelings may run deep, so be kind to yourself and keep things simple. An early night will help." },
    ],
    love: { line: "Be gentle together.", detail: "Feelings run deep and words can sting. Keep things soft and save big talks for another day." },
    work: { line: "Save big decisions.", detail: "Do the routine work and let the big choices wait a day or two." },
    selfcare: { line: "Early night.", detail: "Your energy is lower today, and that's normal. Rest early and you'll feel the difference tomorrow." },
  },
  9: {
    zone: "luck, learning, teachers and travel",
    readings: [
      { headline: "Lucky and looking up.", body: "Good fortune is easier to find today. Read, travel or talk to someone wiser. Say thank you to someone who taught you something." },
      { headline: "Learn something lovely.", body: "Your outlook is bright today. Plan a trip, try a class or simply ask a big question. Faith in yourself is well placed." },
    ],
    love: { line: "Dream big together.", detail: "Talk about the future today. Plan a trip or share a hope you've kept quiet." },
    work: { line: "Ask a mentor.", detail: "Advice from someone experienced goes a long way today. Ask the question." },
    selfcare: { line: "Read something good.", detail: "Your mind wants to grow. A chapter, a podcast or a long walk with your thoughts." },
  },
  10: {
    zone: "career, reputation and what you're working toward",
    readings: [
      { headline: "One clear yes.", body: "The Moon highlights your career. Put your best foot forward and finish something visible. Others see your effort today." },
      { headline: "Your work is noticed.", body: "It's a strong day for ambition. Speak up in the meeting and take on the task that matters. Then celebrate a little." },
    ],
    love: { line: "Share your goals.", detail: "Tell someone close what you're working toward. Their support makes it feel real." },
    work: { line: "One clear yes.", detail: "Your effort is visible today. Say yes to the task that matters and finish it well." },
    selfcare: { line: "Stand up tall.", detail: "Confidence suits you today. Good posture, a proper breakfast and a plan for the day." },
  },
  11: {
    zone: "friends, groups, gains and wishes",
    readings: [
      { headline: "Friends bring good news.", body: "Today brings gains and good company. Reach out to friends or groups and let them help. A hope you've held may move forward." },
      { headline: "Wishes within reach.", body: "Social energy is high today. Say yes to the invite and share your plans. Good things come through people." },
    ],
    love: { line: "Go out together.", detail: "Being social is good for your heart today. Say yes to the plan with friends." },
    work: { line: "Network a little.", detail: "Gains come through people today. Reconnect with one contact or join the group chat." },
    selfcare: { line: "Call a friend.", detail: "Laughter is medicine today. Ring the friend who always makes you feel lighter." },
  },
  12: {
    zone: "rest, retreat, sleep and letting go",
    readings: [
      { headline: "Rest and let go.", body: "The Moon is in your rest zone. Spend less, sleep more and let a few things wait. Quiet time now refills you for the days ahead." },
      { headline: "A quiet, dreamy day.", body: "Today is for winding down and letting go. Journal, meditate or take a long bath. Your dreams may have something to say." },
    ],
    love: { line: "Quiet time together.", detail: "Closeness without pressure. A film, a cuddle, or simply sitting together." },
    work: { line: "Wrap things up.", detail: "Finish and file rather than start something new. Clear space for the next cycle." },
    selfcare: { line: "Long bath, early bed.", detail: "Sleep is the best thing you can do for yourself today. Screens off a little earlier." },
  },
};
