// HAND-WRITTEN ACTING BEATS for "Stop a rumor" (short formula + phone close-ups). Faces: never `thinking` (looks like an eye roll). Listening = neutral with the eyes on the speaker; burdened = worried or sad with the head down.
// t: ['L', i, s] = when line i starts (+ s seconds) | ['LE', i, s] = when line i ends | number = seconds from the scene start | ['E', s] = scene end.  d = length, or until = end time.
// Phone close-ups hide the room, so the beats under them still run (the voice carries the acting there); the faces matter most in the room shots between them.
export const CUES = {
  open: [
    // L0 shock, L1 eager (sending), L2 "oh no" (the problem lands), L3-L4 Amina is kind
    { who: 'DALIA', t: ['L', 0, 0], until: ['LE', 0, 0.2], face: 'shocked', pose: 'open', lean: 0.04, slump: 0.06 },
    { who: 'DALIA', t: ['L', 1, 0], until: ['LE', 1, 0.2], face: 'excited', pose: 'point', lean: 0.05, nod: 0.08 },
    { who: 'DALIA', t: ['L', 2, 0], d: 1.8, face: 'scared', pose: 'shrug', slump: 0.12, tilt: -0.1 },
    { who: 'DALIA', t: ['L', 2, 1.6], d: 2.2, face: 'embarrassed', look: [-0.2, -0.5], slump: 0.14 },
    { who: 'AMINA', t: ['L', 0, 0.4], until: ['L', 3, 0], face: 'worried', tilt: 0.1, look: [-0.5, 0] },
    { who: 'AMINA', t: ['L', 3, 0], d: 2.4, pose: 'open', face: 'sweet', tilt: 0.12, lean: 0.05 },
    { who: 'DALIA', t: ['L', 3, 0.5], d: 2.0, face: 'embarrassed', slump: 0.1, nod: 0.06 },
    { who: 'AMINA', t: ['L', 4, 0], d: 1.8, pose: 'chest', face: 'sweet', tilt: 0.08 },
    { who: 'DALIA', t: ['L', 4, 0.2], d: 1.6, face: 'neutral', nod: 0.08, slump: 0.06 },
  ],
  verse: [
    // reverent: Amina is still while the verse is read (the phone shows it); Dalia understands and lights up
    { who: 'AMINA', t: ['L', 0, 0], until: ['L', 3, 0], pose: 'lap', face: 'sweet' },
    { who: 'DALIA', t: ['L', 0, 0.5], until: ['L', 3, 0], face: 'neutral', look: [0.5, 0.1], slump: 0.08 },
    { who: 'AMINA', t: ['L', 2, 0.3], d: 2.0, pose: 'open', face: 'proud', tilt: 0.1, nod: 0.06 },
    { who: 'DALIA', t: ['L', 3, 0], until: ['LE', 3, 0.3], pose: 'chest', face: 'relieved', slump: 0.02, nod: 0.09, tilt: 0.1 },
    { who: 'AMINA', t: ['L', 3, 0.8], until: ['E', 0], face: 'relieved', act: 'nod', tilt: 0.1 },
  ],
  habit: [
    // ONE EASY WAY: Amina is warm; Dalia tries it (nervous smile), then is happy that Layla is fine
    { who: 'AMINA', t: ['L', 0, 0.2], d: 2.6, pose: 'open', face: 'sweet' },
    { who: 'AMINA', t: ['L', 0, 3.6], d: 1.8, pose: 'point', face: 'happy', nod: 0.05 },
    { who: 'DALIA', t: ['L', 0, 0.4], d: 3.0, pose: 'think', face: 'neutral', tilt: 0.08, slump: 0.05 },
    { who: 'DALIA', t: ['L', 0, 4.0], d: 1.6, face: 'nervous smile', nod: 0.06 },
    { who: 'AMINA', t: ['L', 1, 0.2], d: 2.4, pose: 'chest', face: 'sweet', tilt: 0.1 },
    { who: 'DALIA', t: ['L', 2, 0], until: ['LE', 2, 0.3], pose: 'lap', face: 'nervous smile', nod: 0.1, lean: 0.04 },
    { who: 'AMINA', t: ['L', 2, 0.6], d: 1.4, face: 'proud', act: 'nod' },
    { who: 'DALIA', t: ['L', 3, 0], until: ['LE', 3, 0.3], pose: 'hips', face: 'happy', slump: 0.0, lean: 0.04 },
    { who: 'AMINA', t: ['L', 3, 0.8], until: ['E', 0], face: 'giggle', act: 'nod', tilt: 0.1 },
  ],
  close: [
    { who: 'AMINA', t: ['L', 0, 0], d: 3.0, pose: 'open', face: 'sweet', lean: 0.05 },
    { who: 'DALIA', t: ['L', 0, 1.2], d: 2.2, face: 'neutral', nod: 0.08, tilt: 0.08 },
    { who: 'AMINA', t: ['L', 0, 1.8], d: 1.6, face: 'in love', tilt: 0.1 },
    { who: 'DALIA', t: ['L', 1, 0], until: ['E', 0], pose: 'chest', face: 'happy', slump: 0.0 },
    { who: 'AMINA', t: ['L', 1, 0.5], until: ['E', 0], face: 'big smile', pose: 'lap' },
  ],
};
