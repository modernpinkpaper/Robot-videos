# AUDIO CHECK: finds the sound problems the speech recognizer and the fit sheet cannot see. It cannot judge how a voice SOUNDS; a person must listen.
#   python3 tools/audio_check.py videos/<name>            (needs work/timeline.json, work/audio.wav and the line files work/l*.wav)
# Checks (numbers only, numpy only):
#  1. STRAY SOUND: anything louder than -42 dB while nobody is speaking (babble after a word, clicks, hiss). Scene-change whooshes show up here too: judge them by their level.
#  2. HARD STOPS: a line whose sound falls to almost nothing (55 dB under the loudest word) within 0.12 s of its last word: no natural decay, it sounds cut off.
#  3. DIGITAL SILENCE: more than 2% of a line is exact zeros (jarring, robotic).
#  4. LEVEL MATCH: each character's median speaking level should be within 4 dB of the others.
import sys, os, json, wave, numpy as np
d = sys.argv[1]; W = os.path.join(d, 'work')
def load(p):
    w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768, w.getframerate()
def env(x, sr, win=0.05):
    n = int(win * sr); m = len(x) // n; return 20 * np.log10(np.sqrt((x[:m * n].reshape(m, n) ** 2).mean(1)) + 1e-9)
T = json.load(open(os.path.join(W, 'timeline.json'))); x, sr = load(os.path.join(W, 'audio.wav')); db = env(x, sr); t = np.arange(len(db)) * 0.05
speech = np.zeros(len(db), bool)
for l in T['lines']: speech |= (t >= l['v0'] - 0.15) & (t <= l['v1'] + 0.45)
warn = []
i = 0; runs = []
while i < len(db):
    if not speech[i] and db[i] > -42:
        j = i
        while j < len(db) and not speech[j] and db[j] > -42: j += 1
        if (j - i) * 0.05 >= 0.2: runs.append((round(float(t[i]), 1), round(float(t[j - 1] + 0.05), 1), round(float(db[i:j].mean()))))
        i = j
    else: i += 1
sp_level = float(np.median(db[speech])) if speech.any() else -30
print(f'speaking level about {sp_level:.0f} dB; quiet parts median {np.median(db[~speech]):.0f} dB')
for a, b, l in runs:
    tag = 'a scene change whoosh? ' if any(abs(a - sc['start'] + 0.2) < 0.45 for sc in T['scenes']) else ''
    msg = f'stray sound {a}s to {b}s at {l} dB {tag}'.strip()
    print(' ', msg)
    if not tag or l > sp_level - 8: warn.append(f'{msg}. ' + ('Too loud for a whoosh.' if tag else 'Listen to it: babble, click or hiss after a word?'))
who = {}
for l in T['lines']:
    p = os.path.join(W, f"l{l['i']:02d}.wav")
    if not os.path.exists(p): continue
    y, sr2 = load(p); e = env(y, sr2, 0.01); pk = e.max(); last = int(np.where(e > pk - 25)[0][-1]); after = e[last:]; low = np.where(after < pk - 55)[0]; fall = (low[0] if len(low) else len(after)) * 0.01
    z = np.abs(y) < 1e-5; zlen = 0; run = 0
    for v in z:                      # only real silent STRETCHES (10 ms or more of exact zeros) count; isolated zero samples in a quiet fade are just rounding
        if v: run += 1
        else:
            if run >= int(0.01 * sr2): zlen += run
            run = 0
    if run >= int(0.01 * sr2): zlen += run
    zero = zlen / max(1, len(y)) * 100; who.setdefault(l['who'], []).append(float(np.median(e[e > pk - 30])))
    if fall < 0.12: warn.append(f"line {l['i']} ({l['who']}: {l['text'][:30]}): sound drops to nothing in {fall:.2f} s after the last word (hard stop).")
    if zero > 2: warn.append(f"line {l['i']} ({l['who']}): {zero:.0f}% pure digital silence.")
lv = {k: float(np.median(v)) for k, v in who.items()}
print('median level per character:', {k: round(v) for k, v in lv.items()})
if lv and max(lv.values()) - min(lv.values()) > 4: warn.append(f'levels differ by {max(lv.values()) - min(lv.values()):.1f} dB between characters.')
print('\nWARNINGS:\n - ' + '\n - '.join(warn) if warn else '\nAudio checks pass (this says nothing about how it SOUNDS: listen).')
