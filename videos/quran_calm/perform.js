// HAND-WRITTEN ACTING BEATS for "Heart Calm": what each face and body does, tied to the words (rules: menu/QUALITY.md, characters/EXPRESSIONS.md).
// t: ['L', i, s] = when line i starts (+ s seconds) | ['LE', i, s] = when line i ends | number = seconds from the scene start | ['E', s] = scene end.  d = length, or until = end time.
// Every important line has a face beat AND a body beat. Serious moments stay still and soft (hand on heart, hands together). Listeners react a beat AFTER (automatic layer in characters/expressive/behavior.js fills the rest).
export const CUES = {
  open: [
    // hook: Dalia is heavy and says it half to herself; "on mute?" ends with a small helpless shrug
    { who: 'DALIA', t: ['L', 0, 0], until: ['LE', 0, 0], slump: 0.17, look: [0.15, -0.45] },
    { who: 'DALIA', t: ['LE', 0, -1.5], d: 1.9, pose: 'shrug', tilt: -0.12, face: 'sad' },
    { who: 'AMINA', t: ['L', 0, 1.4], d: 2.8, face: 'worried', tilt: 0.12, look: [-0.5, 0] },
    // Amina: hand on heart for "Your heart isn't broken", open palms for "can help", one point for the three names
    { who: 'AMINA', t: ['L', 1, 0], d: 2.2, pose: 'chest', face: 'sweet', tilt: 0.13, lean: 0.05 },
    { who: 'AMINA', t: ['L', 1, 2.3], d: 2.0, pose: 'open', face: 'happy' },
    { who: 'AMINA', t: ['LE', 1, -1.7], d: 1.9, pose: 'point', face: 'happy', nod: 0.06 },
    { who: 'DALIA', t: ['L', 1, 2.6], d: 2.2, face: 'neutral', tilt: 0.1 },
    // "Three? That is it?": surprise, a lean back, then Amina smiles
    { who: 'DALIA', t: ['L', 2, 0], d: 1.7, face: 'surprised', pose: 'shrug', lean: -0.06, tilt: 0.14, slump: 0.1 },
    { who: 'AMINA', t: ['L', 2, 0.5], d: 1.4, face: 'happy', act: 'nod' },
    { who: 'AMINA', t: ['L', 3, 0], d: 2.4, pose: 'open', face: 'sweet', tilt: 0.08 },
    { who: 'DALIA', t: ['L', 3, 0.3], d: 2.6, face: 'relieved', slump: 0.07, nod: 0.07 },
  ],
  verse: [
    // the verse: Amina is still and reverent (hands together). Dalia listens with soft eyes and lets her shoulders drop at "hearts find calm"
    { who: 'AMINA', t: ['L', 0, 0], until: ['LE', 2, 0.2], pose: 'lap', face: 'sweet' },
    { who: 'DALIA', t: ['L', 1, 0], until: ['L', 2, 1.4], face: 'neutral', look: [0.5, 0.1] },
    { who: 'AMINA', t: ['L', 1, 2.0], d: 1.5, nod: 0.08, tilt: 0.08 },
    { who: 'DALIA', t: ['L', 1, 2.6], d: 1.4, nod: 0.09, lean: 0.03 },
    { who: 'AMINA', t: ['L', 2, 0.2], d: 1.4, tilt: -0.06, nod: 0.05 },
    { who: 'DALIA', t: ['L', 2, 1.5], d: 2.6, face: 'relieved', slump: 0.04, nod: 0.09 },
    // "Calm. That's the word I've been missing.": a hand to her own heart
    { who: 'DALIA', t: ['L', 3, 0.4], d: 2.8, pose: 'chest', face: 'relieved', slump: 0.03, tilt: 0.1 },
    { who: 'AMINA', t: ['L', 3, 0.5], d: 2.2, face: 'proud', tilt: 0.1, nod: 0.06 },
    // the refrain: a point at "Remember Allah", hand on heart at "your heart finds calm"
    { who: 'AMINA', t: ['L', 4, 1.3], d: 1.6, pose: 'point', face: 'sweet' },
    { who: 'AMINA', t: ['LE', 4, -2.1], d: 2.2, pose: 'chest', face: 'sweet', tilt: 0.1 },
    { who: 'DALIA', t: ['LE', 4, -0.6], d: 1.5, face: 'happy', act: 'nod' },
    // breathe with me: both close their eyes and breathe slowly (shoulders and head rise and fall) until the scene ends
    { who: 'AMINA', t: ['L', 5, 1.0], until: ['E', 0], pose: 'lap', face: 'relieved', breath: 4.4 },
    { who: 'DALIA', t: ['L', 5, 1.1], until: ['E', 0], pose: 'lap', face: 'relieved', breath: 4.4, slump: 0.02 },
  ],
  words: [
    // say it with me: Amina says the word with open palms, Dalia repeats it with effort, Amina approves; the meaning gets a matching gesture
    { who: 'AMINA', t: ['L', 0, 0], until: ['LE', 0, 0], pose: 'open', face: 'sweet' },
    { who: 'DALIA', t: ['L', 1, 0], d: 1.1, face: 'nervous smile', nod: 0.1, lean: 0.04 },
    { who: 'AMINA', t: ['L', 1, 0.5], d: 1.2, face: 'proud', act: 'nod' },
    { who: 'AMINA', t: ['L', 2, 0], d: 1.6, pose: 'think', face: 'sweet' },
    { who: 'AMINA', t: ['L', 3, 0], d: 1.5, pose: 'open', face: 'sweet' },
    { who: 'DALIA', t: ['L', 4, 0], d: 1.1, face: 'nervous smile', nod: 0.1, lean: 0.04 },
    { who: 'AMINA', t: ['L', 4, 0.5], d: 1.2, face: 'proud', act: 'nod' },
    { who: 'AMINA', t: ['L', 5, 0], d: 1.6, pose: 'chest', face: 'sweet', tilt: 0.1 },
    { who: 'AMINA', t: ['L', 6, 0], d: 1.5, pose: 'open', face: 'sweet' },
    { who: 'DALIA', t: ['L', 7, 0], d: 1.3, face: 'nervous smile', nod: 0.1, lean: 0.04 },
    { who: 'AMINA', t: ['L', 7, 0.6], d: 1.2, face: 'proud', act: 'nod' },
    // "Calm. Settled. Safe.": Amina's hands come together slowly; Dalia's shoulders drop
    { who: 'AMINA', t: ['L', 8, 0], until: ['LE', 8, 0.4], pose: 'lap', face: 'sweet', nod: 0.05 },
    { who: 'DALIA', t: ['L', 8, 0.8], d: 2.6, face: 'relieved', slump: 0.02 },
    // the lost-kid picture: she thinks of it and lights up
    { who: 'DALIA', t: ['L', 9, 0], until: ['LE', 9, 0.3], face: 'happy', tilt: 0.14, lean: 0.05, pose: 'open' },
    { who: 'AMINA', t: ['LE', 9, 0.1], d: 1.6, face: 'giggle', act: 'nod', tilt: 0.1 },
  ],
  store: [
    // Nina is lost (eyes search left and right, small and worried); Mara arrives; Nina lights up, arms up, runs in
    { who: 'NINA', t: 0.3, d: 1.2, look: [-0.7, 0.05], face: 'worried', pose: 'idle', slump: 0.05 },
    { who: 'NINA', t: 1.4, d: 1.2, look: [0.7, 0.05], face: 'scared', slump: 0.06 },
    { who: 'NINA', t: 2.6, d: 1.0, look: [0.8, 0.1], face: 'surprised', lean: 0.04 },
    { who: 'NINA', t: 3.2, d: 1.8, face: 'relieved', pose: 'armsUp', act: 'hop' },
    { who: 'MARA', t: 3.3, d: 1.7, face: 'happy', pose: 'open', tilt: 0.1 },
  ],
  habit: [
    // Dalia is embarrassed about "just habit": looks away, rubs her chin; Amina is gentle (tilt) and never corrects her
    { who: 'DALIA', t: ['L', 0, 0], until: ['LE', 0, 0.6], face: 'embarrassed', look: [-0.3, -0.45], pose: 'think', slump: 0.1 },
    { who: 'AMINA', t: ['L', 0, 1.0], d: 3.2, face: 'worried', tilt: 0.13, lean: 0.04 },
    { who: 'AMINA', t: ['L', 1, 0.2], d: 2.2, pose: 'open', face: 'sweet' },
    { who: 'DALIA', t: ['L', 1, 2.3], d: 2.2, face: 'relieved', slump: 0.04, nod: 0.08 },
    // the verse is serious and tender: stillness, a hand on the heart at "remember Me"
    { who: 'AMINA', t: ['L', 2, 0], until: ['LE', 2, 0.3], pose: 'chest', face: 'sweet' },
    { who: 'DALIA', t: ['L', 2, 1.0], until: ['LE', 2, 0.4], face: 'proud', nod: 0.06, slump: 0.02 },
    { who: 'AMINA', t: ['L', 2, 2.0], d: 1.6, tilt: 0.11, lean: 0.03 },
    { who: 'DALIA', t: ['L', 2, 2.7], d: 1.3, act: 'nod' },
    { who: 'AMINA', t: ['LE', 2, -2.0], d: 1.4, nod: 0.09, face: 'sweet' },
    { who: 'DALIA', t: ['LE', 2, -1.2], d: 1.6, face: 'in love', tilt: 0.1 },
    { who: 'DALIA', t: ['L', 3, 0], d: 2.2, face: 'happy', pose: 'hips', lean: 0.05, tilt: 0.1, slump: 0.0 },
    { who: 'AMINA', t: ['L', 3, 0.4], d: 1.6, face: 'happy', act: 'nod' },
  ],
  act1: [
    // PAUSE: she reaches for the phone, freezes for ten seconds, eyes close, hand to heart, then the coffee joke
    { who: 'DALIA', t: ['L', 0, 0], until: ['L', 0, 1.2], face: 'sleepy', look: [0.9, -0.5] },
    { who: 'DALIA', t: ['L', 0, 1.0], until: ['LE', 0, -0.9], pose: 'reach', face: 'sleepy', look: [0.9, -0.5], lean: 0.06 },
    { who: 'DALIA', t: ['LE', 0, -1.0], until: ['LE', 0, 0.3], pose: 'reach', face: 'worried', look: [0.5, -0.3] },
    { who: 'DALIA', t: ['L', 1, 0], until: ['LE', 1, 0.4], pose: 'chest', face: 'relieved', slump: 0.02, nod: 0.05 },
    { who: 'DALIA', t: ['L', 2, 0], d: 2.2, face: 'laugh', lean: -0.05 },
    { who: 'DALIA', t: ['L', 3, 0], until: ['LE', 3, 0.3], face: 'happy', slump: 0.0, act: 'nod' },
  ],
  act2: [
    // NOTICE: she walks with her eyes down, stops and looks up; wonder; arms open; slow turn of the head for "anywhere"
    { who: 'DALIA', t: ['L', 0, 3.4], until: ['LE', 0, 0.4], look: [0, 0.9], nod: -0.3, face: 'surprised', lean: -0.04 },
    { who: 'DALIA', t: ['L', 1, 0], d: 1.6, look: [0, 0.9], nod: -0.3, face: 'surprised', lean: -0.05 },
    { who: 'DALIA', t: ['L', 1, 1.5], until: ['LE', 1, 0.5], look: [0, 0.8], nod: -0.28, face: 'happy', pose: 'open' },
    { who: 'DALIA', t: ['L', 2, 0], d: 2.6, face: 'happy', pose: 'open', look: [0.2, 0.5], turn: 0.3, nod: -0.15, lean: 0.03 },
    { who: 'DALIA', t: ['L', 2, 2.5], d: 2.4, face: 'happy', pose: 'armsUp', look: [-0.2, 0.4], turn: -0.3, nod: -0.1, lean: -0.03 },
    { who: 'DALIA', t: ['L', 2, 4.9], until: ['LE', 2, 0.5], face: 'relieved', pose: 'open', look: [0.1, 0.2], turn: 0.1, nod: 0.05, lean: 0.0 },
  ],
  act3: [
    // TALK: she sits quietly, hand on heart while she "talks"; unsure ("messy?") then relieved ("Especially then.")
    { who: 'DALIA', t: ['L', 0, 0], until: ['LE', 0, 0.3], pose: 'lap', face: 'neutral', slump: 0.04 },
    { who: 'DALIA', t: ['L', 1, 0], until: ['LE', 1, 0.3], pose: 'chest', face: 'relieved', nod: 0.05 },
    { who: 'DALIA', t: ['L', 2, 0], until: ['LE', 2, 0.2], pose: 'think', face: 'worried', tilt: 0.12, look: [-0.3, -0.3] },
    { who: 'DALIA', t: ['L', 3, 0.2], d: 2.6, pose: 'chest', face: 'relieved', slump: 0.0, nod: 0.1 },
  ],
  close: [
    // recall: Dalia searches her memory (looks up, hand to chin), then answers with a nod for each word; the last lines are calm and happy
    { who: 'AMINA', t: ['L', 0, 0], until: ['LE', 0, 0.4], pose: 'open', face: 'happy', tilt: 0.1 },
    { who: 'DALIA', t: ['L', 0, 0.8], until: ['L', 1, 0.0], pose: 'think', face: 'neutral', look: [-0.2, 0.5] },
    { who: 'DALIA', t: ['L', 1, 0], until: ['LE', 1, 0.3], pose: 'point', face: 'proud', nod: 0.08 },
    { who: 'AMINA', t: ['L', 1, 0.9], d: 1.7, face: 'proud', act: 'nod' },
    { who: 'AMINA', t: ['L', 2, 0], d: 1.6, pose: 'open', face: 'sweet', tilt: 0.1 },
    { who: 'DALIA', t: ['L', 2, 0.2], until: ['L', 3, 0.0], face: 'neutral', tilt: 0.1, look: [0.4, 0.3] },
    { who: 'DALIA', t: ['L', 3, 0], until: ['LE', 3, 0.3], pose: 'chest', face: 'happy', slump: 0.0 },
    { who: 'AMINA', t: ['L', 3, 0.8], d: 2.2, face: 'in love', act: 'nod', tilt: 0.1 },
    { who: 'AMINA', t: ['L', 4, 0], d: 2.0, pose: 'open', face: 'sweet', lean: 0.05 },
    { who: 'DALIA', t: ['L', 5, 0], until: ['E', 0], pose: 'chest', face: 'happy', slump: 0.0 },
    { who: 'AMINA', t: ['L', 5, 0.5], until: ['E', 0], face: 'big smile', pose: 'lap' },
  ],
};
