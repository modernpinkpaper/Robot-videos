# Makes the voices (voices/speak.py: Chatterbox for these two), the timeline (work/timeline.json) and the audio (work/audio.wav).
#   python3 build_audio.py            voices + timeline + audio      |   --notts: reuse the voice files already in work/
# NO MUSIC on purpose (Quran lesson): only the voices, very soft whooshes between scenes, and a quiet room / outdoor air.
import sys, os, re, wave, json, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, ROOT + '/voices'); sys.path.insert(0, HERE)
from plan import SCENES
WORK = HERE + '/work'; os.makedirs(WORK, exist_ok=True); SR = 44100
flat = [(si, li, l) for si, s in enumerate(SCENES) for li, l in enumerate(s['lines'])]
if '--notts' not in sys.argv:
    from speak import synth_lines
    rows = [dict(who=l[0], text=(l[4] if len(l) > 4 else l[1]), emo=l[2], out=f'{WORK}/l{i:02d}.wav') for i, (si, li, l) in enumerate(flat)
            if not os.path.exists(f'{WORK}/l{i:02d}.wav') or '--redo' in sys.argv]
    if rows: os.environ.setdefault('VIDEO_FORMAT', 'story'); synth_lines(rows)
def load(i):
    w = wave.open(f'{WORK}/l{i:02d}.wav'); return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
# ---- timeline
cursor = 0.0; lines = []; clips = []; scenes = []; k = 0
for si, s in enumerate(SCENES):
    st = cursor; cur = st + s['pre']; sl = []
    for li, l in enumerate(s['lines']):
        who, text, emo, gap = l[:4]
        x = load(k); idx = np.where(np.abs(x) > 0.02)[0]; lead = idx[0] / SR; tail = idx[-1] / SR
        onset = cur + gap; start = onset - lead; v1 = start + tail
        hop = SR // 48; n = len(x) // hop
        env = np.array([np.sqrt((x[j*hop:(j+1)*hop] ** 2).mean()) for j in range(n)])
        ref = np.percentile(env[env > 0.01], 90) if (env > 0.01).any() else 1
        env = np.clip(env / ref, 0, 1); env = np.convolve(env, [0.25, 0.5, 0.25], 'same')
        d = dict(i=k, scene=si, li=li, who=who, text=text, emo=emo, start=round(start, 3), v0=round(onset, 3), v1=round(v1, 3), env=[round(float(e), 2) for e in env])
        lines.append(d); sl.append(d); clips.append((start, x)); cur = v1; k += 1
    end = cur + s['post']
    scenes.append(dict(id=s['id'], set=s['set'], vo=bool(s.get('vo')), start=round(st, 3), end=round(end, 3), lines=[d['i'] for d in sl])); cursor = end
TOTAL = round(cursor, 2)
def at(spec, sc, sl):
    if spec == 'E': return sc['end']
    m = re.match(r'^(L|E)(\d*)([+-][\d.]+)?$', str(spec)) if isinstance(spec, str) else None
    if not m: return sc['start'] + float(spec)
    off = float(m.group(3) or 0)
    if m.group(1) == 'L': return sl[int(m.group(2))]['v0'] - 0.12 + off + (0.12 if off else 0)
    return sc['end'] + off
for s, sc in zip(SCENES, scenes):
    sl = [lines[i] for i in sc['lines']]
    sc['shots'] = [dict(name=n, t=round(at(a, sc, sl), 3)) for n, a in s['shots']]
    sc['cards'] = [dict(id=c, t0=round(at(a, sc, sl), 3), t1=round(at(b, sc, sl), 3)) for c, a, b in s.get('cards', [])]
json.dump(dict(scenes=scenes, lines=lines, total=TOTAL), open(WORK + '/timeline.json', 'w'))
for sc in scenes: print(f"{sc['id']:6s} {sc['start']:6.2f} - {sc['end']:6.2f}  shots " + ' '.join(f"{x['name']}@{x['t']:.1f}" for x in sc['shots']))
print('TOTAL %.2f s' % TOTAL)
# ---- audio
N = int(TOTAL * SR); t = np.arange(N) / SR; voices = np.zeros(N, dtype=np.float32)
for start, x in clips:
    a = int(start * SR); b = min(N, a + len(x)); voices[a:b] += x[:b-a] * 0.95
sfx = np.zeros(N)
def put(buf, a, s):
    if a >= N: return
    b = min(N, a + len(s)); buf[a:b] += s[:b-a]
def whoosh(ts, d=0.4, g=0.14):
    n = int(d * SR); r = np.random.default_rng(int(ts * 100)).standard_normal(n); u = np.arange(n) / n
    sm = np.convolve(r, np.ones(30) / 30, 'same') - np.convolve(r, np.ones(300) / 300, 'same')
    put(sfx, max(0, int(ts * SR)), sm * np.sin(np.pi * u) ** 2 * g * 3)
for sc in scenes[1:]: whoosh(sc['start'] - 0.2, 0.4, 0.09)
for sc in scenes:
    for sh in sc['shots'][1:]: whoosh(sh['t'] - 0.06, 0.14, 0.025)
# quiet air: soft filtered noise (room tone), a little brighter outdoors (park scene)
r = np.random.default_rng(3).standard_normal(N)
air = np.convolve(r, np.ones(400) / 400, 'same') * 0.018
park = [s for s in scenes if s['set'] == 'park'][0]
air *= 1 + 0.9 * np.clip(1 - np.abs(t - (park['start'] + park['end']) / 2) / ((park['end'] - park['start']) / 2 + 0.3), 0, 1)
air *= np.clip(np.minimum(t / 1.0, (TOTAL - t) / 1.5), 0, 1)
mix = voices + sfx + air
mix *= np.clip(np.minimum(t / 0.2, (TOTAL - t) / 1.2), 0, 1); mix = np.tanh(mix * 0.9); mix = mix / np.abs(mix).max() * 0.9
with wave.open(WORK + '/audio.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio ok')
