# Podcast format (optional)

Only use this when Dalia asks for a "podcast" or "episode". It is NOT the animation style.
The character look lives in ../../characters/. This folder is just one TV-studio format that uses it.

## Make an episode
1. Write `pod/eps/eN.py` (copy `e10.py`)
2. `./setup.sh` once, then `python3 pod/mk.py N`, then `./run_ep.sh N` -> `out_epN.mp4`

Lines look like `('MICA','Words.','happy',0.3[,CARD])`. See e10.py.
Run all commands from inside this folder (formats/podcast).
