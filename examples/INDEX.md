# Example library: no guessing

Each choice on the menu has a REFERENCE: a real video, a sample, or a reel. When making a new video, find the choice here, open the reference's source files (and extract frames from the video), and **match it**. Do not guess what a format, camera move or voice "should" look like.

Status key: GOOD = Dalia picked it as the best example. DRAFT = a working example, not yet confirmed as "best". EMPTY = no example yet (make one, then ask Dalia to confirm it).

## 1. FORMAT references
| Format | Reference | Status | What to copy from it |
|---|---|---|---|
| Story | `videos/no_lies/no_lies.mp4` (60s, "What if nobody lied?") | DRAFT | 8 scenes, a clear turn, sets per scene, whip-pan between scenes. Source: `plan.py`, `shots.js`, `sets.js` |
| Story (short, product/tool) | `videos/one_minute/one_minute.mp4` (44s, "The 1-Minute Machine") | DRAFT | Problem, rule, build, payoff, question to the viewer. A tool-building story. |
| Talking to the camera | `videos/disagree/disagree.mp4` (34s, "How the smartest people disagree") | DRAFT | One person, a hook, 3 steps, one closing line. Cuts on lines. Source: `plan.py`, `index.html` |
| Podcast | `examples/podcast/ep10_a_monday_in_the_print_room.mp4` (2:49) | DRAFT | Studio, six robots, info cards, ON AIR. Source: `formats/podcast/pod/eps/e10.py` |
| Skit | none yet | EMPTY | Make one (see `menu/formats/skit.md`), then ask Dalia to confirm it |
| Reaction | none yet | EMPTY | Make one (see `menu/formats/reaction.md`) |
| Explainer | none yet | EMPTY | Make one (see `menu/formats/explainer.md`) |

## 1b. CHARACTER STYLE references
| Style | Reference | Status | What to copy |
|---|---|---|---|
| Emotional robots (real-face characters) | `characters/expressive/preview/` (`03_cast_all.png`, `cast_<name>.png`, `faces_*.png`, `05_motion_demo.mp4`) | GOOD (Dalia approved the look) | Faces, poses, motion. Recipe: `menu/cast/emotional_robots.md` |

## 2. CAMERA references
Watch `examples/camera/camera_reel.mp4` (38s). It shows every shot on the same stage with its name on screen:
1 aerial, 2 wide, 3 pushIn, 4 closeUp, 5 zoomLens, 6 lowAngle, 7 orbit, 8 dolly, 9 pan, 10 dollyZoom, 11 crane, 12 pullBack, 13 splitScreen (whip-pan between each).
Real uses in finished videos (look at the shot names in each video's `shots.js` or `plan.py`):
| Move | Best example in a real video |
|---|---|
| Aerial opening, whip-pan, split screen, orbit, dolly zoom, crane, pull back | `videos/no_lies/` (has all of them) |
| Talking-head camera (push, orbit, zoom, low, dolly side, pull) | `videos/disagree/` (shots: dollyWide, close1, low, push, close2, orbit, zoom, dollySide, pull) |
| Product / tool story (button close-up, dolly zoom on the payoff, counter) | `videos/one_minute/` (runBtn, runDz, runCounter, endPull) |
Status of "best camera video": DRAFT until Dalia names the favourite.

## 3. VOICE references
Listen to `examples/voices/<name>.mp3`. Each is the character saying "Hi, I am NAME. This is how I sound...". All are free computer voices (Piper), tuned by pitch and speed in `formats/podcast/pod/voices_cfg.py`.
- Humans: dalia, amina, marcus, lily, sofia, grandpa, kid_boy, kid_girl, narrator
- Robots: mica, hooky, chargey, drafty, lister, logbot, lefty, kraft, dusty, dymo, status
Where voices are used in real videos: no_lies (mica, chargey, drafty, hooky, kraft, lister, dymo, logbot), disagree (dalia), one_minute (dalia, mica), podcast ep10 (mica, lefty, kraft, dusty, dymo, status).
Status: samples = DRAFT. Dalia confirms or changes which voice each character keeps (say "change marcus to deeper").

## How Dalia updates this
- "Mark X as the best skit" -> set Status to GOOD for that row and point it at the video.
- "That camera move is my favourite: <video>" -> add it to the CAMERA table.
- "Change MARCUS to a deeper voice" -> edit his pitch in `voices_cfg.py`, run `python3 examples/voices/make_samples.py`, and re-commit the new sample.
When she merges a new video, add a row here the same day: format, length, what it shows best.
