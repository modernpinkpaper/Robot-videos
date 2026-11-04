# Remakes the verses whose spoken Arabic is missing words (checked with tools/ar_cover.py): up to 8 candidate takes each, keeps the first that has ALL the words and the ending (else the best).
import sys, os, wave, shutil, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, ROOT + '/voices'); sys.path.insert(0, ROOT + '/tools')
from human_tts import trim_main_utterance
from speak import synth_lines
from ar_cover import cover, hear
from faster_whisper import WhisperModel
M = WhisperModel('small', compute_type='int8'); SR = 44100
A = [l.strip().lstrip('﻿') for l in open(HERE + '/fatihah_uthmani.txt', encoding='utf-8') if l.strip()]
A += [l.strip() for l in open(HERE + '/fatihah_closing.txt', encoding='utf-8') if l.strip()]   # 8 = Ameen, 9 = Sadaqallahul Adheem
W = HERE + '/work'
def rd(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
def trimmed(p, o):
    x = trim_main_utterance(rd(p), SR)
    with wave.open(o, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
todo = [int(v) for v in sys.argv[1:]] or [1, 6, 7]
for v in todo:
    best = None
    for k in range(8):
        raw = f'{W}/c{v}_{k}.wav'
        synth_lines([dict(who='AMINA', text=A[v - 1], emo='sweet', out=raw, lang='ar', verify=A[v - 1], tries=3)])
        tr = f'{W}/c{v}_{k}_trim.wav'; trimmed(raw, tr); h = hear(tr, M); w_, t_, ok = cover(A[v - 1], h)
        print(f'verse {v} take {k}: whole {w_:.2f} tail {t_:.2f} {"OK" if ok else "no"} | {h}', flush=True)
        if best is None or (ok, w_ + t_) > best[0]: best = ((ok, w_ + t_), raw)
        if ok: break
    shutil.copy(best[1], f'{W}/a{v}.wav'); print('verse', v, 'kept', best[1], 'ok' if best[0][0] else 'BEST EFFORT (still incomplete)', flush=True)
