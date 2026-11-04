// HAND-WRITTEN ACTING BEATS for "Remember Me" (short formula): what each face and body does, tied to the words (rules: menu/QUALITY.md, characters/expressive/behavior.js).
// t: ['L', i, s] = when line i starts (+ s seconds) | ['LE', i, s] = when line i ends | number = seconds from the scene start | ['E', s] = scene end.  d = length, or until = end time.
// Faces: never `thinking` (it looks like an eye roll). Listening = neutral with eyes on the speaker; burdened = worried or sad with the head down.
export const CUES = {
  open: [
    // PROBLEM, ACTED OUT: Dalia is slumped and scrolling (head down, small thumb-flick nods), tired; "not once" lands as a guilty shrug
    { who: 'DALIA', t: ['L', 0, 0], until: ['LE', 0, -1.4], slump: 0.16, look: [0.1, -0.5], face: 'tired' },
    { who: 'DALIA', t: ['L', 0, 0.6], d: 0.5, nod: 0.06 }, { who: 'DALIA', t: ['L', 0, 1.6], d: 0.5, nod: 0.06 },
    { who: 'DALIA', t: ['LE', 0, -1.4], d: 1.6, pose: 'shrug', tilt: -0.12, face: 'embarrassed', slump: 0.16 },
    { who: 'AMINA', t: ['L', 0, 1.2], d: 2.6, face: 'worried', tilt: 0.12, look: [-0.5, 0] },
    { who: 'AMINA', t: ['L', 1, 0], d: 2.2, pose: 'open', face: 'sweet', tilt: 0.13, lean: 0.05 },
    { who: 'DALIA', t: ['L', 1, 1.0], d: 1.6, face: 'relieved', slump: 0.08, nod: 0.07 },
    { who: 'DALIA', t: ['L', 2, 0], d: 1.6, face: 'surprised', pose: 'open', lean: 0.05, tilt: 0.14, slump: 0.06 },
    { who: 'AMINA', t: ['L', 3, 0], d: 2.0, pose: 'open', face: 'sweet', tilt: 0.08 },
    { who: 'DALIA', t: ['L', 3, 0.3], d: 1.8, face: 'neutral', slump: 0.04, nod: 0.07 },
  ],
  verse: [
    // VERSE: Amina is still and reverent. "I will remember you" lands: Dalia's shoulders drop and a hand goes to her heart
    { who: 'AMINA', t: ['L', 0, 0], until: ['LE', 1, 0.2], pose: 'lap', face: 'sweet' },
    { who: 'DALIA', t: ['L', 1, 0], until: ['LE', 1, 0.0], face: 'neutral', look: [0.5, 0.1], slump: 0.1 },
    { who: 'AMINA', t: ['L', 1, 2.0], d: 1.4, nod: 0.08, tilt: 0.08 },
    { who: 'DALIA', t: ['L', 1, 2.2], d: 1.4, face: 'relieved', nod: 0.09, lean: 0.03, slump: 0.05 },
    { who: 'DALIA', t: ['L', 2, 0.2], until: ['LE', 2, 0.4], pose: 'chest', face: 'relieved', slump: 0.03, tilt: 0.1 },
    { who: 'AMINA', t: ['L', 2, 0.4], d: 2.0, face: 'proud', tilt: 0.1, nod: 0.06 },
    { who: 'AMINA', t: ['L', 3, 0.6], d: 1.8, pose: 'open', face: 'sweet' },
    { who: 'DALIA', t: ['L', 3, 1.4], until: ['E', 0], face: 'happy', act: 'nod', slump: 0.02 },
  ],
  habit: [
    // ONE EASY WAY: Amina is warm; Dalia is unsure, tries it (nervous smile), is surprised how small it is, then relaxed
    { who: 'AMINA', t: ['L', 0, 0.2], d: 2.4, pose: 'open', face: 'sweet' },
    { who: 'AMINA', t: ['L', 0, 3.4], d: 2.0, pose: 'point', face: 'happy', nod: 0.05 },
    { who: 'DALIA', t: ['L', 0, 0.4], d: 2.8, pose: 'think', face: 'neutral', tilt: 0.08, slump: 0.04 },
    { who: 'DALIA', t: ['L', 0, 3.8], d: 1.6, face: 'nervous smile', nod: 0.06 },
    { who: 'AMINA', t: ['L', 1, 0.2], d: 2.2, pose: 'chest', face: 'sweet', tilt: 0.1 },
    { who: 'DALIA', t: ['L', 2, 0], until: ['LE', 2, 0.3], pose: 'lap', face: 'nervous smile', nod: 0.1, lean: 0.04 },
    { who: 'AMINA', t: ['L', 2, 0.6], d: 1.4, face: 'proud', act: 'nod' },
    { who: 'DALIA', t: ['L', 3, 0], until: ['LE', 3, 0.3], pose: 'chest', face: 'happy', slump: 0.0, lean: 0.04 },
    { who: 'AMINA', t: ['L', 3, 0.8], until: ['E', 0], face: 'in love', act: 'nod', tilt: 0.1 },
  ],
  close: [
    { who: 'AMINA', t: ['L', 0, 0], d: 2.6, pose: 'open', face: 'sweet', lean: 0.05 },
    { who: 'DALIA', t: ['L', 0, 1.0], d: 2.2, face: 'neutral', nod: 0.08, tilt: 0.08 },
    { who: 'DALIA', t: ['L', 1, 0], until: ['E', 0], pose: 'hips', face: 'happy', slump: 0.0, lean: 0.04 },
    { who: 'AMINA', t: ['L', 1, 0.5], until: ['E', 0], face: 'big smile', pose: 'lap' },
  ],
};
