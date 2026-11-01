# Makes the voices, the timeline (work/timeline.json) and the full audio (work/audio.wav).
# Voices: voices/speak.py (Finn = Chatterbox human voice). Quality gate runs inside.
import sys, os, re, wave, json, subprocess, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, ROOT + '/voices'); sys.path.insert(0, HERE)
from speak import synth_lines   # humans (FINN) = Chatterbox, robots = Piper. Quality gate runs inside.
from plan import SCENES, TOTAL
WORK = HERE + '/work'; os.makedirs(WORK, exist_ok=True); SR = 44100
flat = [(si, li, l) for si, s in enumerate(SCENES) for li, l in enumerate(s['lines'])]
if '--notts' not in sys.argv:
    synth_lines([dict(who=l[0], text=l[1], emo=l[2], out=f'{WORK}/l{i:02d}.wav') for i, (si, li, l) in enumerate(flat)], 'talk')
def load(i):
    w = wave.open(f'{WORK}/l{i:02d}.wav'); return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
# ---- timeline
cursor = 0.0; lines = []; clips = []; scenes = []; k = 0
for si, s in enumerate(SCENES):
    st = cursor; cur = st + s['pre']; first = len(lines); sl = []
    for li, (who, text, emo, gap) in enumerate(s['lines']):
        x = load(k); idx = np.where(np.abs(x) > 0.02)[0]; lead = idx[0] / SR; tail = idx[-1] / SR
        onset = cur + gap; start = onset - lead; v1 = start + tail
        hop = SR // 48; n = len(x) // hop
        env = np.array([np.sqrt((x[j*hop:(j+1)*hop] ** 2).mean()) for j in range(n)])
        ref = np.percentile(env[env > 0.01], 90) if (env > 0.01).any() else 1
        env = np.clip(env / ref, 0, 1); env = np.convolve(env, [0.25, 0.5, 0.25], 'same')
        d = dict(i=k, scene=si, li=li, who=who, text=text, emo=emo, start=round(start, 3), v0=round(onset, 3), v1=round(v1, 3), env=[round(float(e), 2) for e in env])
        lines.append(d); sl.append(d); clips.append((start, x)); cur = v1; k += 1
    end = cur + s['post']
    if si == len(SCENES) - 1: end = TOTAL
    scenes.append(dict(id=s['id'], start=round(st, 3), end=round(end, 3), lines=[d['i'] for d in sl])); cursor = end
    if end > TOTAL + 1e-6: sys.exit('TOO LONG: %s ends at %.2f' % (s['id'], end))
def at(spec, sc, sl):
    m = re.match(r'^(L|E)(\d*)([+-][\d.]+)?$', str(spec)) if isinstance(spec, str) else None
    if not m: return sc['start'] + float(spec)
    off = float(m.group(3) or 0)
    if m.group(1) == 'L': return sl[int(m.group(2))]['v0'] - 0.12 + off + (0.12 if off else 0)
    return sc['end'] + off
for s, sc in zip(SCENES, scenes):
    sl = [lines[i] for i in sc['lines']]
    sc['shots'] = [dict(name=n, t=round(at(a, sc, sl), 3)) for n, a in s['shots']]
speech_end = lines[-1]['v1']
json.dump(dict(scenes=scenes, lines=lines, total=TOTAL), open(WORK + '/timeline.json', 'w'))
for sc in scenes: print(f"{sc['id']:7s} {sc['start']:6.2f} - {sc['end']:6.2f}   shots " + ' '.join(f"{x['name']}@{x['t']:.2f}" for x in sc['shots']))
print('last line ends %.2f of %.1f' % (speech_end, TOTAL))
# ---- audio
N = int(TOTAL * SR); t = np.arange(N) / SR; voices = np.zeros(N, dtype=np.float32)
for start, x in clips:
    a = int(start * SR); b = min(N, a + len(x)); voices[a:b] += x[:b-a] * 0.95
def follow(sig, win=0.12): k = int(win * SR); return np.convolve(np.abs(sig), np.ones(k) / k, 'same')
duck = 1 - 0.55 * np.clip(follow(voices) * 14, 0, 1)
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
MAJ = [[60,64,67,71],[55,59,62,67],[57,60,64,69],[53,57,60,65]]   # C G Am F
MIN = [[57,60,64,69],[53,57,60,65],[48,52,55,60],[55,59,62,67]]   # Am F C G (soft, sad)
WARM = [[60,64,67,71],[53,57,60,65],[57,60,64,69],[55,59,62,67]]
bpm = 92; beat = 60 / bpm; bar = 4 * beat; music = np.zeros(N)
bench = dict(start=999, end=999); fin = dict(start=999, end=999)
def tone(m, dur, att=0.01, dec=2.5, g=0.05, w=(1, .35, .12)):
    tt = np.arange(int(dur * SR)) / SR; f = midi(m)
    s = sum(a * np.sin(2*np.pi*f*(j+1)*tt) for j, a in enumerate(w)); return s * np.minimum(tt / att, 1) * np.exp(-tt * dec) * g
def put(buf, a, s):
    if a >= N: return
    b = min(N, a + len(s)); buf[a:b] += s[:b-a]
for b in range(int(TOTAL / bar) + 2):
    t0 = b * bar; sad = bench['start'] - 0.2 <= t0 < bench['end'] - 0.4; warm = t0 >= fin['start'] - 0.2
    ch = (MIN if sad else (WARM if warm else MAJ))[b % 4]
    for j, m in enumerate(ch):
        if sad: put(music, int((t0 + j * 0.25) * SR), tone(m, 3.0, 0.08, 1.2, 0.05, (1, .2, .05)))
        else:
            for q in range(4): put(music, int((t0 + q * beat + j * 0.02) * SR), tone(m + 12 * (j % 2 == 0), 1.2, 0.01, 4.0, 0.03))
    put(music, int(t0 * SR), tone(ch[0] - 24, bar, 0.02, 0.9, 0.16, (1, .2, 0)))
    if not sad:
        r = np.random.default_rng(b)
        for q in range(8):
            a = int((t0 + q * beat / 2) * SR); put(music, a, r.standard_normal(int(0.05 * SR)) * np.exp(-np.arange(int(0.05 * SR)) / SR * 100) * 0.018 * (1.4 if q % 2 else 0.7))
            if q % 4 == 0: tt = np.arange(int(0.22 * SR)) / SR; put(music, a, np.sin(2*np.pi*(55 + 80*np.exp(-tt*28))*tt) * np.exp(-tt*13) * 0.11)
music *= np.clip(np.minimum(t / 0.8, (TOTAL - t) / 2.0), 0, 1)
sfx = np.zeros(N)
def whoosh(ts, d=0.4, g=0.14):
    n = int(d * SR); r = np.random.default_rng(int(ts * 100)).standard_normal(n); u = np.arange(n) / n
    sm = np.convolve(r, np.ones(30) / 30, 'same') - np.convolve(r, np.ones(300) / 300, 'same')
    put(sfx, max(0, int(ts * SR)), sm * np.sin(np.pi * u) ** 2 * g * 3)
def ding(ts, f=1320, g=0.12):
    tt = np.arange(int(0.8 * SR)) / SR; put(sfx, int(ts * SR), (np.sin(2*np.pi*f*tt) + 0.4*np.sin(2*np.pi*f*2*tt)) * np.exp(-tt * 6) * g)
def clap(ts, d, g=0.12):
    n = int(d * SR); r = np.random.default_rng(5).standard_normal(n); lp = np.convolve(r, np.ones(6) / 6, 'same')
    am = np.abs(np.convolve(np.random.default_rng(6).standard_normal(n), np.ones(900) / 900, 'same')); am = am / am.max()
    put(sfx, int(ts * SR), lp * am * np.minimum(np.arange(n) / (0.3 * SR), 1) * np.minimum((n - np.arange(n)) / (0.8 * SR), 1) * g)
for sc in scenes:
    for sh in sc['shots'][1:]: whoosh(sh['t'] - 0.06, 0.16, 0.05)
for j, f in enumerate([523, 659, 784, 1047]): ding(0.25 + j * 0.1, f, 0.10)
for li in (2, 6): ding(lines[li]['v0'] - 0.05, 988, 0.12); ding(lines[li]['v0'] + 0.08, 1319, 0.10)
for j, f in enumerate([784, 988, 1175, 1568, 1976]): ding(lines[-1]['v1'] + 0.5 + j * 0.12, f, 0.11)
mix = voices + music * duck * 0.6 + sfx
mix *= np.clip(np.minimum(t / 0.2, (TOTAL - t) / 1.2), 0, 1); mix = np.tanh(mix * 0.9); mix = mix / np.abs(mix).max() * 0.9
with wave.open(WORK + '/audio.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio ok')
