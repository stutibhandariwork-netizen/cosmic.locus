/**
 * Daily readings in the Cosmic Locus voice, keyed by where today's Moon sits counted from
 * the reader's own sign (their Moon sign in Vedic mode, Sun sign in Western mode).
 * This is classic Moon-transit (gochara) reading: house 1 is the reader's own sign.
 * Six readings and four tile lines per position, so days in a row never repeat.
 */

export interface AreaRead {
  lines: string[]; // tile one-liners (4)
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
      { headline: "All eyes on you, gently.", body: "Feelings sit close to the surface today. Put yourself first in small ways and wear the thing that makes you feel good." },
      { headline: "A fresh-start kind of day.", body: "Your mood sets the tone, so start with what you want, not what others expect. One kind thing for yourself, then the rest." },
      { headline: "Your glow is showing.", body: "People notice you more than usual today. Say hello first and let your warmth do the work." },
      { headline: "Check in with yourself.", body: "Notice how your body feels before you plan the day. Eat well, move a little and go at your own pace." },
      { headline: "Lead with your heart.", body: "Your instincts are clear today. Trust the first feeling and act on one small thing it tells you." },
      { headline: "Your day, your way.", body: "It's a good day to set your own rhythm. Say no to one thing that isn't yours to carry." },
    ],
    love: { lines: ["Say what you feel.", "Let them see you.", "Send the first text.", "Be your own date."], detail: "You're easy to read today, so let that work for you. Tell someone plainly what you'd love." },
    work: { lines: ["Lead with your idea.", "Pitch it yourself.", "Put your name on it.", "Start, don't wait."], detail: "People listen when you go first. Share the idea before you polish it." },
    selfcare: { lines: ["Dress up for you.", "Move your body.", "Eat something fresh.", "A mirror pep talk."], detail: "Your body notices everything today. Eat well, move a little and wear what makes you feel like yourself." },
  },
  2: {
    zone: "money, food, family and the words you choose",
    readings: [
      { headline: "Soft words, full heart.", body: "Today is about what you value and how you speak. Choose your words with care and enjoy a good meal." },
      { headline: "Treat your money kindly.", body: "It's a day for comfort and small luxuries. Count what you have before you buy more." },
      { headline: "Count your blessings, literally.", body: "Look at what you already have, in your wallet and in your life. Gratitude makes the next choice easier." },
      { headline: "Say it sweetly.", body: "Your voice carries extra weight today. Use it to encourage someone, including yourself." },
      { headline: "A taste of comfort.", body: "Food, family and familiar things feel good today. Cook something you love and share it." },
      { headline: "Value what's yours.", body: "Your time and talent are worth something. Name your price, kindly but clearly." },
    ],
    love: { lines: ["Speak softly.", "Cook for someone.", "Kind words win.", "Share a meal."], detail: "Your words land harder than you think today. A warm tone does most of the work." },
    work: { lines: ["Check the numbers.", "Ask for your worth.", "Review one bill.", "Save, don't splurge."], detail: "Money matters are in focus. Look over one budget, invoice or price before you agree to it." },
    selfcare: { lines: ["Eat something nourishing.", "Slow, warm meals.", "Hum a favourite song.", "Comfort, not excess."], detail: "Comfort food is allowed. Make it something that leaves you feeling good an hour later too." },
  },
  3: {
    zone: "courage, effort, messages and short trips",
    readings: [
      { headline: "Brave little steps.", body: "Your courage is up today. Send the message you've been drafting and try the thing you've put off." },
      { headline: "Say it, send it, do it.", body: "Energy is good for effort. Pick one task you've been avoiding and finish it." },
      { headline: "Your voice is your superpower.", body: "Words come easily today. Write, call or post the thing that's been on your mind." },
      { headline: "Get moving.", body: "A short trip or a change of scene will lift you. Take the long way round today." },
      { headline: "Small courage, big result.", body: "Do one thing that scares you a little. You'll feel taller by evening." },
      { headline: "News is on its way.", body: "Messages and chats go well today. Reply quickly and keep the conversation going." },
    ],
    love: { lines: ["Make the first move.", "Flirt a little.", "Reply right away.", "Plan a quick outing."], detail: "You have the nerve today. Send the text, suggest the plan, say the thing." },
    work: { lines: ["Send the email.", "Make the call.", "Clear one hard task.", "Speak up once."], detail: "Effort pays off quickly. Clear the message you've been avoiding before lunch." },
    selfcare: { lines: ["Take a brisk walk.", "Dance in the kitchen.", "Get some fresh air.", "Stretch between tasks."], detail: "Restless energy wants an outlet. A quick walk or a dance in the kitchen counts." },
  },
  4: {
    zone: "home, family, comfort and your inner mood",
    readings: [
      { headline: "Home is the happy place.", body: "You may want comfort and quiet today. Tidy one corner and call someone who feels like home." },
      { headline: "Cosy and close today.", body: "Feelings run a little deeper. Make your space soft and let yourself rest there." },
      { headline: "Roots and rest.", body: "Family and familiar places steady you today. Spend time where you feel safe." },
      { headline: "Nest a little.", body: "Your home wants some love. Fresh flowers, clean sheets or a good meal will do." },
      { headline: "Feel it, then let it go.", body: "Old feelings may drift up today. Name them kindly, then turn to something warm." },
      { headline: "Care, and be cared for.", body: "Look after the people close to you and let them look after you. Both count as productive." },
    ],
    love: { lines: ["Stay in together.", "Call your mother.", "A cosy night in.", "Hug someone long."], detail: "Closeness beats excitement today. Cook together, or call family and simply catch up." },
    work: { lines: ["Work from comfort.", "Quiet tasks first.", "Tidy your desk.", "Plan, don't push."], detail: "You'll focus best somewhere calm. Pick the quiet task and a comfortable chair." },
    selfcare: { lines: ["Tidy one corner.", "Light a candle.", "Warm bath tonight.", "Rest at home."], detail: "A calmer space makes a calmer you. Clear one shelf, one drawer or one bag." },
  },
  5: {
    zone: "joy, romance, creativity and children",
    readings: [
      { headline: "Play is productive.", body: "Today favours fun, romance and creativity. Make something just because you want to." },
      { headline: "Let your heart lead.", body: "Your ideas are lively. Write, draw, cook or flirt; anything that feels like play." },
      { headline: "Bring the sparkle.", body: "You're at your most charming today. Share a laugh and see what opens up." },
      { headline: "Create something small.", body: "Inspiration is close. Ten minutes of making will feel better than an hour of scrolling." },
      { headline: "Romance is in the air.", body: "Sweet gestures land well today. Plan something light and lovely." },
      { headline: "Joy is the point.", body: "Do one thing purely because it makes you happy. You've earned it." },
    ],
    love: { lines: ["Plan a little date.", "Be playful.", "Write a sweet note.", "Laugh together."], detail: "Romance is easy today. Suggest something light and fun, even a walk and an ice cream." },
    work: { lines: ["Pitch the fun idea.", "Try a bold draft.", "Make it creative.", "Show your work."], detail: "Creative thinking is your strength today. Bring the playful option to the table." },
    selfcare: { lines: ["Make something.", "Play some music.", "Doodle for ten minutes.", "Do what feels fun."], detail: "Your heart wants to create. Ten minutes of drawing, writing or cooking will lift your mood." },
  },
  6: {
    zone: "health, routines, daily work and getting past obstacles",
    readings: [
      { headline: "Tidy routines, happy you.", body: "It's a good day for getting on top of things. Clear a few small tasks and look after your body." },
      { headline: "Small wins add up.", body: "You're steady and capable today. Book the appointment, sort the inbox, drink more water." },
      { headline: "Fix one thing.", body: "Little problems are easy to solve today. Pick the one that's been bugging you." },
      { headline: "Body first.", body: "Your health responds well to care today. A walk, water and an early meal will do wonders." },
      { headline: "Helpful hands.", body: "Being useful feels good today. Help someone with something practical." },
      { headline: "Order brings calm.", body: "Make a list and tick things off. A tidy plan clears a busy mind." },
    ],
    love: { lines: ["Show care with help.", "Do one kind chore.", "Listen closely.", "Small favours count."], detail: "Love looks practical today. Do one small useful thing for someone and let it speak for you." },
    work: { lines: ["Clear the to-do list.", "Fix the small things.", "Tidy your inbox.", "Three quick wins."], detail: "You're good at the details today. Knock out three small tasks before the big one." },
    selfcare: { lines: ["Drink more water.", "Book that check-up.", "Stretch at noon.", "Early, light dinner."], detail: "Your body responds well to routine today. Water, a stretch and a proper lunch." },
  },
  7: {
    zone: "partners, close relationships and agreements",
    readings: [
      { headline: "Meet them halfway.", body: "Your relationships are in focus. Someone close is ready to meet you, so say the kind thing first." },
      { headline: "Two is better than one.", body: "Today is about the people beside you. Ask for an opinion and listen well." },
      { headline: "Better together.", body: "Teamwork goes smoothly today. Share the load and share the credit." },
      { headline: "Mirror, mirror.", body: "Others show you something about yourself today. Notice what you admire in them." },
      { headline: "A good day for yes.", body: "Agreements and promises go well. Settle the thing you've been discussing." },
      { headline: "Love is a verb.", body: "Show someone you care with a small action. It matters more than words today." },
    ],
    love: { lines: ["Meet them halfway.", "Ask, then listen.", "Plan together.", "Kind words first."], detail: "Someone is ready to come closer. Make it easy for them with a warm first word." },
    work: { lines: ["Team up.", "Settle the deal.", "Ask a colleague.", "Share the credit."], detail: "Agreements go well today. Partner on a task or settle a deal you've been discussing." },
    selfcare: { lines: ["Lunch with a friend.", "Walk with someone.", "Talk it through.", "Borrow some calm."], detail: "Company refills you today. Share a meal or a long call with someone you trust." },
  },
  8: {
    zone: "rest, change and what goes on beneath the surface",
    readings: [
      { headline: "A slower day, and that's fine.", body: "Energy may dip today. Keep plans light and save big decisions for later." },
      { headline: "Go gently today.", body: "Feelings may run deep. Be kind to yourself and keep things simple." },
      { headline: "Beneath the surface.", body: "You see what others miss today. Trust the quiet hunch, but act on it later." },
      { headline: "Let something go.", body: "It's a good day to release an old worry. Write it down, then put it away." },
      { headline: "Deep and tender.", body: "Closeness matters more than busyness today. Share something real with one person." },
      { headline: "Rest is wise.", body: "Your body is asking for a pause. Listen, and you'll bounce back quickly." },
    ],
    love: { lines: ["Be gentle together.", "Save big talks.", "Hold hands, say less.", "Soft words only."], detail: "Feelings run deep and words can sting. Keep things soft and save big talks for another day." },
    work: { lines: ["Save big decisions.", "Routine work today.", "Double-check details.", "Keep it simple."], detail: "Do the routine work and let the big choices wait a day or two." },
    selfcare: { lines: ["Early night.", "Rest without guilt.", "Quiet evening.", "Deep breaths, often."], detail: "Your energy is lower today, and that's normal. Rest early and you'll feel the difference tomorrow." },
  },
  9: {
    zone: "luck, learning, teachers and travel",
    readings: [
      { headline: "Lucky and looking up.", body: "Good fortune is easier to find today. Read, travel or talk to someone wiser." },
      { headline: "Learn something lovely.", body: "Your outlook is bright. Plan a trip, try a class or ask a big question." },
      { headline: "Faith in yourself.", body: "Trust the path you're on today. Small signs are pointing the right way." },
      { headline: "Wide horizons.", body: "Think bigger than usual today. What would you try if you knew it would work?" },
      { headline: "Thank a teacher.", body: "Gratitude opens doors today. Message someone who helped you grow." },
      { headline: "Adventure calls.", body: "Something new will lift your spirits. Go somewhere, even just a new caf\u00e9." },
    ],
    love: { lines: ["Dream big together.", "Plan a trip.", "Talk about the future.", "Share a big hope."], detail: "Talk about the future today. Plan a trip or share a hope you've kept quiet." },
    work: { lines: ["Ask a mentor.", "Learn one new thing.", "Think long-term.", "Read up on it."], detail: "Advice from someone experienced goes a long way today. Ask the question." },
    selfcare: { lines: ["Read something good.", "Walk somewhere new.", "Look at the sky.", "Say thank you."], detail: "Your mind wants to grow. A chapter, a podcast or a long walk with your thoughts." },
  },
  10: {
    zone: "career, reputation and what you're working toward",
    readings: [
      { headline: "One clear yes.", body: "Your career is in the spotlight. Put your best foot forward and finish something visible." },
      { headline: "Your work is noticed.", body: "It's a strong day for ambition. Speak up and take on the task that matters." },
      { headline: "Step up.", body: "Leadership suits you today. Make the decision others are waiting for." },
      { headline: "Build your name.", body: "What you do today adds to your reputation. Do it well and let it be seen." },
      { headline: "Aim high, kindly.", body: "Go after the goal, but bring people with you. Respect gets results today." },
      { headline: "Proud of you.", body: "Look at how far you've come. Then take one more step forward." },
    ],
    love: { lines: ["Share your goals.", "Celebrate their wins.", "Be proud together.", "Make a plan as two."], detail: "Tell someone close what you're working toward. Their support makes it feel real." },
    work: { lines: ["One clear yes.", "Finish the big thing.", "Speak up in meetings.", "Aim a little higher."], detail: "Your effort is visible today. Say yes to the task that matters and finish it well." },
    selfcare: { lines: ["Stand up tall.", "Proper breakfast first.", "Plan your day.", "A power walk at lunch."], detail: "Confidence suits you today. Good posture, a proper breakfast and a plan for the day." },
  },
  11: {
    zone: "friends, groups, gains and wishes",
    readings: [
      { headline: "Friends bring good news.", body: "Today brings gains and good company. Reach out to friends and let them help." },
      { headline: "Wishes within reach.", body: "Social energy is high. Say yes to the invite and share your plans." },
      { headline: "Your people, your power.", body: "The right friends lift you today. Spend time with the ones who believe in you." },
      { headline: "A small win is coming.", body: "Something you hoped for moves forward. Notice it and celebrate." },
      { headline: "Join in.", body: "Groups and communities are good for you today. Show up and add your voice." },
      { headline: "Generous and glowing.", body: "Give a little and it comes back. Share an opportunity with a friend." },
    ],
    love: { lines: ["Go out together.", "Join the group plan.", "Meet their friends.", "Say yes to fun."], detail: "Being social is good for your heart today. Say yes to the plan with friends." },
    work: { lines: ["Network a little.", "Reconnect with a contact.", "Ask for an intro.", "Share your plans."], detail: "Gains come through people today. Reconnect with one contact or join the group chat." },
    selfcare: { lines: ["Call a friend.", "Laugh out loud.", "Group chat love.", "Celebrate small wins."], detail: "Laughter is medicine today. Ring the friend who always makes you feel lighter." },
  },
  12: {
    zone: "rest, retreat, sleep and letting go",
    readings: [
      { headline: "Rest and let go.", body: "This is a rest day in your chart. Spend less, sleep more and let a few things wait." },
      { headline: "A quiet, dreamy day.", body: "Today is for winding down. Journal, meditate or take a long bath." },
      { headline: "Behind the scenes.", body: "Quiet work goes well today. Finish things off without needing anyone to watch." },
      { headline: "Soft and private.", body: "You may want your own company today. That's healthy; enjoy it." },
      { headline: "Dreams have something to say.", body: "Notice what comes up as you drift off tonight, and write one line in the morning." },
      { headline: "Clear the decks.", body: "Let go of one thing you no longer need. Space invites something new." },
    ],
    love: { lines: ["Quiet time together.", "A film and a cuddle.", "Be soft with them.", "Forgive something small."], detail: "Closeness without pressure. A film, a cuddle, or simply sitting together." },
    work: { lines: ["Wrap things up.", "File and finish.", "Clear the backlog.", "Leave early if you can."], detail: "Finish and file rather than start something new. Clear space for the next cycle." },
    selfcare: { lines: ["Long bath, early bed.", "Screens off sooner.", "Journal before sleep.", "Meditate ten minutes."], detail: "Sleep is the best thing you can do for yourself today. Screens off a little earlier." },
  },
};

/** What Venus says about love, by the house it's passing through (from your sign). */
export const VENUS_HINT: Record<number, string> = {
  1: "you're extra lovable right now",
  2: "treats and comforts feel extra sweet",
  3: "a sweet message would land well",
  4: "home feels cosy and loving",
  5: "romance and fun come easily",
  6: "small acts of care say it best",
  7: "partnerships feel warm and easy",
  8: "closeness runs deep",
  9: "love grows through shared adventures",
  10: "your charm helps at work too",
  11: "friends bring warmth and fun",
  12: "quiet, private affection feels best",
};

/** What Mars says about effort and career, by the house it's passing through. */
export const MARS_HINT: Record<number, string> = {
  1: "your drive is high",
  2: "it's a good time to push for what you're worth",
  3: "bold messages pay off",
  4: "your energy goes into home projects",
  5: "creative risks are worth taking",
  6: "you can get through a lot of work",
  7: "watch for clashes and team up instead",
  8: "pace yourself and don't rush",
  9: "go after the bigger picture",
  10: "your ambition is fired up",
  11: "goals go better with friends",
  12: "work quietly and rest well",
};
