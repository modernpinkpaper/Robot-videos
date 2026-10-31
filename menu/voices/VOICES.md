# Voices
**Human voices use Chatterbox (natural, with pace, emotion and tone adjusted per line). Robots use Piper.** Always go through `voices/speak.py`. See `voices/README.md`.

All voices are free offline Piper voices (downloaded by `formats/podcast/setup.sh`). The table is in `formats/podcast/pod/voices_cfg.py` as `NAME: (voice, pitch, speed)`. These are computer voices, not real people.

| Character | Sounds like |
|---|---|
| DALIA | warm woman |
| AMINA | calm warm woman |
| MARCUS | deep friendly man |
| LILY | bright young woman |
| SOFIA | clear confident woman |
| GRANDPA | slow deep older man |
| KID_BOY / KID_GIRL | child-like (high pitch) |
| NARRATOR | steady storyteller |
| MICA, HOOKY, CHARGEY, DRAFTY, LISTER, LOGBOT, LEFTY, KRAFT, DUSTY, DYMO, STATUS | the robot cast |

## Changing voices
She can say "deeper", "higher", "grumpy", "slower", "excited". Change the pitch and speed numbers in a copy of the voice entry for that video (pitch below 1 = deeper, above 1 = higher; speed below 1 = faster). Do not edit the shared table for a one-time change: override it inside the video's own plan.
Emotion goes in the line: `(who, text, emotion, gap)`. The face and body follow the emotion; the voice pace follows the speed number.

## Adding a new person or voice
Add a PEOPLE entry in characters/robots.js (look) and a VOICE entry in voices_cfg.py (sound). Only the 8 downloaded Piper voices exist; to add more, add the voice file name to formats/podcast/setup.sh.
