# Making every character feel human: the plan (DRAFT, waiting for Dalia's picks)

Goal: every character, in every video, moves and reacts like a real person. This is built ONCE in the shared character code, so it applies to ALL videos and ALL characters automatically. Nothing is merged to main until Dalia approves the outline and sees a test video.

Status key: DONE = built and checked in frames. STARTED = first version exists. TODO = not built yet.

## A. The face
| # | What real people do | Status |
|---|---|---|
| A1 | **Blink** at natural, uneven times; blink when the eyes move or a thought changes; slow blinks when tired or sad; sometimes a double blink | STARTED (simple blink every 4 s) |
| A2 | **Eyes are never still**: tiny jumps, looking at the listener, looking away up or sideways when thinking, down when shy or sad, a quick look at something just mentioned | STARTED (tiny movement, glances in the brain video) |
| A3 | **Eyebrows do half the talking**: lift on stressed words, pinch when thinking, inner-up for empathy, one brow higher | TODO (brows move only with the chosen face now) |
| A4 | **Real lip sync**: mouth shapes for the actual sounds (oo, ee, ah, m/b/p closed, f/v teeth on lip), not just open and close with loudness | TODO |
| A5 | **Feelings move like feelings**: fast start, small overshoot, settle; feelings arrive a beat AFTER the words (0.2 to 0.4 s); fade back to a resting face; never a frozen neutral | STARTED (smooth blends) |
| A6 | **Micro-expressions and mixed feelings**: a quick flash of doubt, a smile with worried eyes, a held-back laugh | TODO |
| A7 | **Imperfect faces**: slight asymmetry, one side of the smile bigger | STARTED (some faces) |
| A8 | **Listening faces**: while someone else speaks, look at them, nod, small "mm-hm" faces, react after the line | TODO |
| A9 | **Each person has their own resting face and range** (Gus frowns by default, Zoe has wide eyes, Hana barely moves her face) | TODO |
| A10 | Body-to-face links: blush, tears that pool and fall, sweat | DONE (blush, tears, sweat) |

## B. The body
| # | What real people do | Status |
|---|---|---|
| B1 | **Walk**: steps match the ground (no sliding), legs and arms swing opposite, body bobs and leans, head stays level | DONE (`human.js`) |
| B2 | Walk details: start and stop (a lean to begin, a settle to finish), turning in an arc, different walks per person (Gus waddles, Finn takes long strides, kids skip), sitting down and standing up, stairs, running | TODO |
| B3 | **Standing is never still**: breathing, shifting weight, rocking | DONE (breathing, weight shifts) |
| B4 | **Fidgets**: touch hair, push up glasses, scratch neck, tuck a scarf, cross arms, tap a foot | TODO |
| B5 | **Gestures tied to the words**: small beats on key words, pointing at things talked about, hand to chest for sincere, shrug (shoulders + brows + head), hand to mouth for surprise, hand to chin for thinking | STARTED (beats, point, open hands) |
| B6 | **Animation basics**: anticipation (a small move before the big one), follow-through (head arrives after the body), overlap (not everything moves at once) | TODO |
| B7 | **Secondary motion**: bun, pigtails and long hair swing, hijab and scarf sway, lanyard and badge swing, glasses slide, belly bounces when laughing | TODO |
| B8 | **Posture shows feeling**: slump when sad, chest out when proud, shrink when scared, lean in when interested, lean back when doubtful | STARTED (small leans) |
| B9 | **Head**: nods on stress, tilts, turns toward who is speaking, looks away | STARTED |
| B10 | **Space**: face the person they talk to, step closer or back, stand at an angle (not always straight to the camera), group positions that are not a straight line | TODO |
| B11 | **Touching the world**: pick up and hold things, lean on a desk, use a phone, hands never pass through the body or furniture | TODO |
| B12 | **Together**: handshake, hug, high five, passing an object, copying each other's posture, eye contact, interrupting | TODO |

## C. Timing
Not like a metronome: pauses, hesitations, speed that changes, a gesture that starts just BEFORE its word, a breath before a long sentence, a blink at the end of a sentence, a reaction that comes late. Each character gets its own tempo. TODO

## D. Voice and sound
Natural voices are set up (Chatterbox). Still to add: breaths before sentences, small fillers ("well", "um") where they fit, laughs and sighs, footsteps, cloth rustle, quiet room sound. The breath should match a small chest and shoulder lift. STARTED

## E. A "motion personality" for each of the 12
One small profile per character (tempo, energy, gesture size, posture, walk, resting face, blink rate, habits). Proposed:
| Character | Moves like |
|---|---|
| mara | calm, small economical moves, steady eyes, slow blinks, straightens her badge |
| theo | relaxed and warm, wide gestures, rocks on his heels, rubs his beard, big laugh |
| priya | poised, quick head tilts, flicks her hair, sharp eyebrow lifts |
| june | gentle and slow, hands folded, pushes up her glasses, small careful steps |
| kai | bouncy kid, fidgets, looks around, hops, quick short steps |
| gus | heavy and slow, light stomp, big shrugs, hands on hips, huffs |
| zoe | fast and dramatic, big gestures, bun bounces, squeals |
| finn | lanky, long strides, nervous energy, adjusts his glasses, touches his neck |
| hana | very still, deadpan, one raised eyebrow, slow turns |
| dalia | warm and expressive, bold brow work, animated hands (Dalia should tell us her real habits) |
| nina | 6 years old: skips, twirls her dress, wiggles, tilts her head, looks up at people |
| amina | warm attentive listener, nods, tucks her scarf, soft laugh behind her hand |

## F. Believable physics and the camera
No sliding feet, no hands through bodies or desks, weight and inertia. Camera: a tiny handheld shake, reaction cuts to the listener, cut on the action (see `camera/CAMERA.md`). PARTLY

## How it will be built
1. All of it goes into the shared code (`characters/expressive/`), so `actor.js` and `human.js` give it to every video without changes to each video.
2. One profile per character (section E) in `ROSTER`.
3. A new check in the fit sheet: for each moment, does the face, eyes, head, hands and feet fit the words (and the character)?
4. A test video with 2 or 3 characters talking and reacting to each other.
5. When Dalia approves the test video: update `menu/QUALITY.md` and the guide, then merge to main.

## Suggested order
1. Eyes, brows and blinks (A1 to A3): the biggest change for the least work.
2. Real lip sync (A4).
3. Motion personalities and listening faces (A8, A9, E).
4. Fidgets, secondary motion, anticipation (B4, B6, B7).
5. Walk details, sitting, space and touching things (B2, B10, B11).
6. Two-person moments: handshake, hug, copying posture (B12).
7. Sound details (D).

## Scope question for Dalia
Do the older robots and cute people (dot eyes) get the body parts of this too (walk, breathing, gestures, fidgets)? Their faces are simple, so face work (section A) would stay with the emotional robots. Suggested: yes, body parts only, after the emotional robots are done.
