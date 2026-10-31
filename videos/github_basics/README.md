# GitHub basics (explainer video, 9:16)

A teaching video for someone new to GitHub. Fifth-grade words, one idea at a time.
Story: Mica (teacher robot) explains GitHub to "You" (a new learner). Chargey is the teammate who reviews.
One running example the whole way: a **cookie recipe book**.

Order of ideas: what GitHub is -> **Repo** -> **Commit** -> **Branch** -> **Pull request** -> **Merge** -> recap.
Each idea has: a simple definition card, a 3D picture, a DO card and a DON'T card.
The step bar at the top shows where you are (Repo, Commit, Branch, Pull request, Merge). Captions are on screen the whole time.

Uses the normal robot look (`characters/`) and the normal camera style (`camera/`). Not the podcast format.

## Files
- `script.py`   all the lines (edit the words here), the cards, and who speaks.
- `mk.py`       makes the voices (piper), `build/timeline.json` and `build/audio.wav`.
- `index.html`  the 3D scenes, acting, camera plan and on-screen words.
- `render.js`   renders frames in a headless browser. `run.sh` does everything and makes `github_basics.mp4`.

## Make it again
1. one time: `pip install piper-tts numpy`, playwright + chromium, ffmpeg, and the voices in `formats/podcast/voices` (amy, ryan, kristin)
2. `python3 videos/github_basics/mk.py`
3. `videos/github_basics/run.sh`  (slow, about 15 minutes)
Quick stills to check a moment: `node videos/github_basics/render.js times <outDir> 12 48.5` (needs the server `python3 -m http.server 8766` in the repo root).
