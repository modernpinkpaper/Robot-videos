# Gets the words and times from the clip you will react to, so you can decide where the reactions go.
#   pip install faster-whisper      python3 formats/reaction/transcribe.py clip.mp4
# Prints:  [12.4 - 15.1] words said...   Use these times as the "at" of your beats in script.json.
import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 's16le', '-ac', '1', '-ar', '16000', '-'])
audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768       # pass an array (not a path): avoids an av version error
segs, _ = WhisperModel('base', compute_type='int8').transcribe(audio)
for s in segs: print(f'[{s.start:6.1f} - {s.end:6.1f}] {s.text.strip()}')
