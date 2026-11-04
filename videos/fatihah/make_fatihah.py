# Al-Fatihah in Amina's voice (a COMPUTER voice, not tajweed: a person who knows the recitation must check it). Output: fatihah_amina.mp3
# The Arabic is copied from the Uthmani text (api.alquran.cloud), verse 1 is the Bismillah. Each verse is made separately (several tries, the best by Arabic speech recognition), then joined with a pause after each verse.
#   CHATTERBOX_PY=/home/user/Robot-videos/voices/cbenv/bin/python python3 videos/fatihah/make_fatihah.py
import sys, os, wave, subprocess, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, ROOT + '/voices')
from human_tts import trim_main_utterance, add_room
from speak import synth_lines
WORK = HERE + '/work'; os.makedirs(WORK, exist_ok=True); SR = 44100
AYAT = [l.strip().lstrip('﻿') for l in open(HERE + '/fatihah_uthmani.txt', encoding='utf-8') if l.strip()]
assert len(AYAT) == 7
CLOSING = [l.strip() for l in open(HERE + '/fatihah_closing.txt', encoding='utf-8') if l.strip()]   # said AFTER the surah (not verses): Ameen, Sadaqallahul Adheem
AYAT = AYAT + CLOSING
TRIES = int(os.environ.get('AR_TRIES', '8')); TEMPO = float(os.environ.get('AR_TEMPO', '1.0'))
rows = []
for i, t in enumerate(AYAT):
    o = f'{WORK}/a{i + 1}.wav'
    if not os.path.exists(o): rows.append(dict(who='AMINA', text=t, emo='sweet', out=o, lang='ar', verify=t, tries=TRIES))
if rows: synth_lines(rows)
def rd(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
def quiet(sec): return (np.random.default_rng(3).standard_normal(int(sec * SR)) * 10 ** (-58 / 20)).astype(np.float32)
out = [quiet(0.6)]
for i in range(len(AYAT)):
    p = f'{WORK}/a{i + 1}.wav'; x = trim_main_utterance(rd(p), SR)
    t = f'{WORK}/a{i + 1}_trim.wav'
    with wave.open(t, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
    add_room(t, 0.13)
    if TEMPO != 1.0: subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', t, '-af', f'atempo={TEMPO}', '-ar', str(SR), '-ac', '1', t.replace('_trim', '_t')], check=True); x = rd(t.replace('_trim', '_t'))
    else: x = rd(t)
    idx = np.where(np.abs(x) > 0.01)[0]; x = x[max(0, idx[0] - int(0.05 * SR)):] if len(idx) else x
    f = int(0.012 * SR); x = x.copy(); x[:f] *= np.linspace(0, 1, f); out.append(x); out.append(quiet(1.2 if i == 0 else (0.5 if i >= 7 else 0.9)))   # a pause after every verse (shorter after Ameen)
y = np.concatenate(out); y = y / max(1.0, np.abs(y).max() / 0.95)
with wave.open(WORK + '/fatihah.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', WORK + '/fatihah.wav', '-af', 'loudnorm=I=-18:TP=-2', '-ar', '44100', '-ac', '1', '-b:a', '128k', HERE + '/fatihah_amina.mp3'], check=True)
print('done', HERE + '/fatihah_amina.mp3', round(len(y) / SR, 1), 'seconds')
