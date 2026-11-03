# Makes the voices (voices/speak.py, Dalia = Chatterbox), the timeline (work/timeline.json) and the audio (work/audio.wav).
#   python3 build_audio.py            real voices      python3 build_audio.py --fake   silent placeholder lines (to test the look)
#   python3 build_audio.py --notts    reuse the voice files already in work/
import sys, os, re, wave, json, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, ROOT + '/voices'); sys.path.insert(0, HERE)
from plan import SCENES, L, CARDS
WORK = HERE + '/work'; os.makedirs(WORK, exist_ok=True); SR = 44100
rows = [dict(who=l[0], text=l[1], emo=l[2], out=f'{WORK}/l{i:02d}.wav') for i, l in enumerate(SCENES[0]['lines'])]
if '--fake' in sys.argv:
    for r in rows:
        n = int(SR * max(1.6, len(r['text'].split()) * 0.33)); x = (np.sin(np.arange(n) / SR * 2 * np.pi * 220) * 0.2 * 32767).astype('<i2')
        with wave.open(r['out'], 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(x.tobytes())
elif '--notts' not in sys.argv:
    from speak import synth_lines
    synth_lines(rows, 'talk')
def load(i):
    w = wave.open(f'{WORK}/l{i:02d}.wav'); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    if w.getframerate() != SR: raise SystemExit('expected 44100 Hz')
    return x
# ---- timeline: every line follows the one before it, with a pause (gap)
S = SCENES[0]; cur = S['pre']; lines = []; clips = []
for k, l in enumerate(L):
    card, text, emo, gap, face, cap = l
    x = load(k); idx = np.where(np.abs(x) > 0.02)[0]; lead = idx[0] / SR; tail = idx[-1] / SR
    onset = cur + gap; start = onset - lead; v1 = start + tail
    hop = SR // 48; n = len(x) // hop
    env = np.array([np.sqrt((x[j*hop:(j+1)*hop] ** 2).mean()) for j in range(n)])
    ref = np.percentile(env[env > 0.01], 90) if (env > 0.01).any() else 1
    env = np.clip(env / ref, 0, 1); env = np.convolve(env, [0.25, 0.5, 0.25], 'same')
    lines.append(dict(i=k, card=card, who='DALIA', text=text, emo=emo, face=face, cap=cap, start=round(start, 3), v0=round(onset, 3), v1=round(v1, 3), env=[round(float(e), 2) for e in env]))
    clips.append((start, x)); cur = v1
TOTAL = round(cur + S['post'], 2)
cards = []
for c in range(len(CARDS)):
    ls = [d for d in lines if d['card'] == c]; cards.append(dict(i=c, show=round(ls[0]['v0'] - 0.3, 3), hide=round(ls[-1]['v1'] + 0.3, 3)))
# ---- shots: a new shot on every line, and a second one inside long lines. Reaction lines get close-ups, reading lines get moving wides.
READ = ['push', 'low', 'dollySide', 'orbit', 'zoom', 'dollyWide']; REACT = ['close1', 'zoom', 'close2', 'push', 'low', 'close3']
shots = [dict(name='dollyWide', t=0.0)]; ri = 0; ci = 0
def pick(pool, k, last):
    for j in range(len(pool)):
        n = pool[(k + j) % len(pool)]
        if n != last: return n
for d in lines:
    pool = REACT if d['cap'] else READ;
    n = pick(pool, ci if d['cap'] else ri, shots[-1]['name'])
    if d['cap']: ci += 1
    else: ri += 1
    t0 = max(shots[-1]['t'] + 1.2, d['v0'] - 0.12)
    shots.append(dict(name=n, t=round(t0, 3)))
    dur = d['v1'] - d['v0']
    if dur > 3.4:
        n2 = pick(READ if not d['cap'] else REACT, ri + ci + 2, n); shots.append(dict(name=n2, t=round(d['v0'] + dur * 0.5, 3)))
shots.append(dict(name='pull', t=round(lines[-1]['v1'] + 0.35, 3)))
scenes = [dict(id='read', start=0, end=TOTAL, lines=[d['i'] for d in lines], shots=shots)]
json.dump(dict(scenes=scenes, lines=lines, cards=cards, total=TOTAL), open(WORK + '/timeline.json', 'w'))
print('total %.2f s, %d lines, %d shots' % (TOTAL, len(lines), len(shots)))
# ---- audio: voice + soft quiet music + a small pop when each card appears
N = int(TOTAL * SR); t = np.arange(N) / SR; voices = np.zeros(N, dtype=np.float32)
for start, x in clips:
    a = int(start * SR); b = min(N, a + len(x)); voices[a:b] += x[:b-a] * 0.95
def follow(sig, win=0.12): k = int(win * SR); return np.convolve(np.abs(sig), np.ones(k) / k, 'same')
duck = 1 - 0.6 * np.clip(follow(voices) * 14, 0, 1)
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
CH = [[57,60,64,69],[53,57,60,65],[48,52,55,60],[55,59,62,67]]   # Am F C G, soft
bpm = 84; beat = 60 / bpm; bar = 4 * beat; music = np.zeros(N)
def tone(m, dur, att=0.01, dec=2.5, g=0.05, w=(1, .35, .12)):
    tt = np.arange(int(dur * SR)) / SR; f = midi(m)
    return sum(a * np.sin(2*np.pi*f*(j+1)*tt) for j, a in enumerate(w)) * np.minimum(tt / att, 1) * np.exp(-tt * dec) * g
def put(buf, a, s):
    if a >= N or a < 0: return
    b = min(N, a + len(s)); buf[a:b] += s[:b-a]
for b in range(int(TOTAL / bar) + 2):
    t0 = b * bar; ch = CH[b % 4]
    for j, m in enumerate(ch): put(music, int((t0 + j * 0.25) * SR), tone(m, 3.0, 0.08, 1.2, 0.05, (1, .2, .05)))
    put(music, int(t0 * SR), tone(ch[0] - 24, bar, 0.02, 0.9, 0.14, (1, .2, 0)))
music *= np.clip(np.minimum(t / 0.8, (TOTAL - t) / 2.0), 0, 1)
sfx = np.zeros(N)
def pop(ts, g=0.16):
    tt = np.arange(int(0.18 * SR)) / SR; put(sfx, int(ts * SR), np.sin(2*np.pi*(300 + 700*np.exp(-tt*30))*tt) * np.exp(-tt*22) * g)
def whoosh(ts, d=0.16, g=0.05):
    n = int(d * SR); r = np.random.default_rng(int(ts * 100)).standard_normal(n); u = np.arange(n) / n
    sm = np.convolve(r, np.ones(30) / 30, 'same') - np.convolve(r, np.ones(300) / 300, 'same'); put(sfx, max(0, int(ts * SR)), sm * np.sin(np.pi * u) ** 2 * g * 3)
for c in cards: pop(c['show'] + 0.02)
for sh in shots[1:]: whoosh(sh['t'] - 0.06)
mix = voices + music * duck * 0.5 + sfx
mix *= np.clip(np.minimum(t / 0.2, (TOTAL - t) / 1.2), 0, 1); mix = np.tanh(mix * 0.9); mix = mix / np.abs(mix).max() * 0.9
with wave.open(WORK + '/audio.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio ok')
