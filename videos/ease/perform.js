// HAND-WRITTEN ACTING BEATS for "With hardship comes ease": what each face and body does, tied to the words (rules: menu/QUALITY.md, characters/expressive/behavior.js).
// t: ['L', i, s] = when line i starts (+ s seconds) | ['LE', i, s] = when line i ends | number = seconds from the scene start | ['E', s] = scene end.  d = length, or until = end time.
// Every important line has a face beat AND a body beat. Serious moments stay still and soft. The automatic layer (listening, nods at sentence ends) fills the rest.
export const CUES = {
  open: [
    // "I know I should talk to Allah. But I never know what to say.": heavy, a little guilty; a helpless shrug on "what to say"
    { who: 'DALIA', t: ['L', 0, 0], until: ['LE', 0, 0], slump: 0.16, look: [0.15, -0.45] },
    { who: 'DALIA', t: ['LE', 0, -1.6], d: 1.9, pose: 'shrug', tilt: -0.12, face: 'embarrassed' },
    { who: 'AMINA', t: ['L', 0, 1.4], d: 2.6, face: 'worried', tilt: 0.12, look: [-0.5, 0] },
    // Amina: open arms for "closer than you think", open palms for "three small ways", one point for the three names
    { who: 'AMINA', t: ['L', 1, 0], d: 2.3, pose: 'open', face: 'sweet', tilt: 0.13, lean: 0.05 },
    { who: 'AMINA', t: ['L', 1, 2.4], d: 1.8, pose: 'open', face: 'happy' },
    { who: 'AMINA', t: ['LE', 1, -1.7], d: 1.9, pose: 'point', face: 'happy', nod: 0.06 },
    { who: 'DALIA', t: ['L', 1, 1.2], d: 2.6, face: 'neutral', tilt: 0.1, slump: 0.1 },
    // "Closer? How close?": curious, leans in
    { who: 'DALIA', t: ['L', 2, 0], d: 1.7, face: 'surprised', pose: 'shrug', lean: 0.05, tilt: 0.14, slump: 0.08 },
    { who: 'AMINA', t: ['L', 2, 0.5], d: 1.4, face: 'happy', act: 'nod' },
    { who: 'AMINA', t: ['L', 3, 0], d: 2.0, pose: 'open', face: 'sweet', tilt: 0.08 },
    { who: 'DALIA', t: ['L', 3, 0.3], d: 2.4, face: 'relieved', slump: 0.06, nod: 0.07 },
  ],
  verse: [
    // the verse: Amina is still and reverent. Dalia listens with soft eyes; "near" lands: her shoulders drop and a hand goes to her heart
    { who: 'AMINA', t: ['L', 0, 0], until: ['LE', 2, 0.2], pose: 'lap', face: 'sweet' },
    { who: 'DALIA', t: ['L', 1, 0], until: ['L', 2, 1.2], face: 'neutral', look: [0.5, 0.1] },
    { who: 'AMINA', t: ['L', 1, 2.2], d: 1.5, nod: 0.08, tilt: 0.08 },
    { who: 'DALIA', t: ['L', 1, 2.6], d: 1.4, nod: 0.09, lean: 0.03 },
    { who: 'DALIA', t: ['L', 2, 1.3], d: 2.6, face: 'relieved', slump: 0.04, nod: 0.09 },
    { who: 'AMINA', t: ['L', 2, 0.2], d: 1.4, tilt: -0.06, nod: 0.05 },
    { who: 'DALIA', t: ['L', 3, 0.3], d: 2.8, pose: 'chest', face: 'relieved', slump: 0.03, tilt: 0.1 },
    { who: 'AMINA', t: ['L', 3, 0.5], d: 2.2, face: 'proud', tilt: 0.1, nod: 0.06 },
    // the refrain: a point at "Allah is near", a hand on the heart for "Call on Him"
    { who: 'AMINA', t: ['L', 4, 1.3], d: 1.6, pose: 'point', face: 'sweet' },
    { who: 'AMINA', t: ['LE', 4, -1.8], d: 2.0, pose: 'chest', face: 'sweet', tilt: 0.1 },
    { who: 'DALIA', t: ['LE', 4, -0.6], d: 1.5, face: 'happy', act: 'nod' },
    // breathe with me: eyes closed, slow breathing (shoulders and head rise and fall) until the scene ends
    { who: 'AMINA', t: ['L', 5, 1.0], until: ['E', 0], pose: 'lap', face: 'relieved', breath: 4.4 },
    { who: 'DALIA', t: ['L', 5, 1.1], until: ['E', 0], pose: 'lap', face: 'relieved', breath: 4.4, slump: 0.02 },
  ],
  words: [
    // say it with me: Amina says the word with open palms, Dalia repeats it with effort, Amina approves; each meaning has its own gesture
    { who: 'AMINA', t: ['L', 0, 0], until: ['LE', 0, 0], pose: 'open', face: 'sweet' },
    { who: 'DALIA', t: ['L', 0, 0.8], d: 1.5, face: 'neutral', tilt: 0.1, nod: 0.07 },
    { who: 'DALIA', t: ['L', 0, 2.9], d: 1.4, face: 'happy', nod: 0.09, lean: 0.03 },
    { who: 'DALIA', t: ['L', 1, 0], d: 1.1, face: 'nervous smile', nod: 0.1, lean: 0.04 },
    { who: 'AMINA', t: ['L', 1, 0.5], d: 1.2, face: 'proud', act: 'nod' },
    { who: 'AMINA', t: ['L', 2, 0], d: 1.6, pose: 'chest', face: 'sweet', tilt: 0.1 },            // near: close to me
    { who: 'AMINA', t: ['L', 3, 0], d: 1.5, pose: 'open', face: 'sweet' },
    { who: 'DALIA', t: ['L', 4, 0], d: 1.1, face: 'nervous smile', nod: 0.1, lean: 0.04 },
    { who: 'AMINA', t: ['L', 4, 0.5], d: 1.2, face: 'proud', act: 'nod' },
    { who: 'AMINA', t: ['L', 5, 0], d: 1.6, pose: 'open', face: 'happy' },                         // I answer
    { who: 'AMINA', t: ['L', 6, 0], d: 1.5, pose: 'open', face: 'sweet' },
    { who: 'DALIA', t: ['L', 7, 0], d: 1.3, face: 'nervous smile', nod: 0.1, lean: 0.04 },
    { who: 'AMINA', t: ['L', 7, 0.6], d: 1.2, face: 'proud', act: 'nod' },
    { who: 'AMINA', t: ['L', 8, 0], until: ['LE', 8, 0.4], pose: 'point', face: 'sweet', nod: 0.05 },   // he calls me: a point
    { who: 'DALIA', t: ['L', 8, 0.8], d: 2.4, face: 'relieved', slump: 0.02 },
    // the picture of calling her mom: she lights up
    { who: 'DALIA', t: ['L', 9, 0], until: ['LE', 9, 0.3], face: 'happy', tilt: 0.14, lean: 0.05, pose: 'open' },
    { who: 'AMINA', t: ['LE', 9, 0.1], d: 1.6, face: 'giggle', act: 'nod', tilt: 0.1 },
  ],
  night: [
    // a little girl wakes, scared, calls out with her arms up; her mom walks in; she is relieved at once
    { who: 'NINA', t: 0.2, d: 1.3, look: [-0.7, 0.05], face: 'scared', slump: 0.05 },
    { who: 'NINA', t: 1.4, d: 1.4, look: [0.7, 0.05], face: 'worried', pose: 'armsUp', slump: 0.04 },
    { who: 'NINA', t: 2.8, d: 1.0, look: [0.8, 0.1], face: 'surprised', lean: 0.04 },
    { who: 'NINA', t: 3.4, d: 1.8, face: 'relieved', pose: 'armsUp', act: 'hop' },
    { who: 'MARA', t: 3.4, d: 1.7, face: 'happy', pose: 'open', tilt: 0.1 },
  ],
  habit: [
    // "I'm not good at this": embarrassed, a shrug; Amina is gentle (tilt, open palms), the verse's "no special words"
    { who: 'DALIA', t: ['L', 0, 0], until: ['LE', 0, 0.6], face: 'embarrassed', look: [-0.3, -0.45], pose: 'shrug', slump: 0.1, tilt: -0.1 },
    { who: 'AMINA', t: ['L', 0, 1.0], d: 3.0, face: 'worried', tilt: 0.13, lean: 0.04 },
    { who: 'AMINA', t: ['L', 1, 0.2], d: 2.4, pose: 'open', face: 'sweet' },
    { who: 'AMINA', t: ['LE', 1, -2.2], d: 2.2, pose: 'chest', face: 'sweet', tilt: 0.1 },
    { who: 'DALIA', t: ['L', 1, 1.8], d: 2.4, face: 'relieved', slump: 0.04, nod: 0.08 },
    { who: 'DALIA', t: ['L', 2, 0], d: 2.2, face: 'happy', pose: 'hips', lean: 0.05, tilt: 0.1, slump: 0.0 },
    { who: 'AMINA', t: ['L', 2, 0.4], d: 1.6, face: 'happy', act: 'nod' },
  ],
  act1: [
    // SPOT: she walks with her worry, looks up and around for a small ease (a breeze), then relaxes and thanks Allah
    { who: 'DALIA', t: ['L', 0, 0], until: ['L', 1, 0.2], face: 'worried', look: [0.0, -0.45], slump: 0.09 },
    { who: 'DALIA', t: ['L', 1, 0.3], d: 2.6, face: 'neutral', look: [0, 0.8], nod: -0.25, pose: 'open', lean: -0.02 },
    { who: 'DALIA', t: ['L', 1, 3.0], d: 2.4, face: 'relieved', look: [0, 0.4], nod: -0.1, pose: 'chest', slump: 0.02 },
    { who: 'DALIA', t: ['L', 1, 5.2], until: ['E', 0], face: 'happy', pose: 'chest', slump: 0.0 },
  ],
  act2: [
    // QUOTE: she sits quietly, tries the Arabic phrase with effort, then is proud that she quoted the Quran
    { who: 'DALIA', t: ['L', 0, 0], until: ['LE', 0, 0.3], pose: 'lap', face: 'neutral', slump: 0.04 },
    { who: 'DALIA', t: ['L', 1, 0], until: ['LE', 1, 0.3], pose: 'lap', face: 'neutral', tilt: 0.1, look: [0.2, 0.2] },
    { who: 'DALIA', t: ['L', 1, 1.6], d: 1.3, pose: 'lap', face: 'neutral', nod: 0.08 },
    { who: 'DALIA', t: ['L', 1, 4.2], d: 1.4, pose: 'lap', face: 'nervous smile', tilt: -0.08, lean: 0.03 },
    { who: 'DALIA', t: ['L', 2, 0], until: ['LE', 2, 0.3], pose: 'lap', face: 'nervous smile', nod: 0.08, lean: 0.03 },
    { who: 'DALIA', t: ['L', 3, 0.2], until: ['E', 0], pose: 'chest', face: 'proud', slump: 0.0, nod: 0.1 },
  ],
  act3: [
    // STEP: she listens, gets ready, then does the first tiny task (washes her face, reaches for the book) and ends with energy: "I step"
    { who: 'DALIA', t: ['L', 0, 0], until: ['LE', 0, 0.3], face: 'neutral', tilt: 0.1, look: [0.3, 0.2] },
    { who: 'DALIA', t: ['L', 1, 0.2], d: 2.0, face: 'determined', nod: 0.06, lean: 0.03 },
    { who: 'DALIA', t: ['L', 2, 0.2], d: 2.4, face: 'worried', pose: 'lap', slump: 0.06 },
    { who: 'DALIA', t: ['L', 2, 2.8], d: 2.2, face: 'relieved', pose: 'chest', slump: 0.02 },
    { who: 'DALIA', t: ['L', 2, 5.0], until: ['LE', 2, 0.2], face: 'happy', pose: 'reach', lean: 0.07 },
    { who: 'DALIA', t: ['L', 3, 0], until: ['E', 0], face: 'happy', pose: 'point', lean: 0.05, slump: 0.0, nod: 0.06 },
  ],
  close: [
    // recall: she searches her memory (looks up, hand to chin), answers with a nod for each word; the last lines are calm and happy
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
