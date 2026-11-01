# Makes the voices (voices/speak.py: Chatterbox for Dalia), the timeline (work/timeline.json) and the full audio (work/audio.wav).
import sys, os, re, wave, json, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, ROOT + '/voices'); sys.path.insert(0, HERE)
from plan import LINES, GAPS, PRE, POST, SHOTS
WORK = HERE + '/work'; os.makedirs(WORK, exist_ok=True); SR = 44100
if '--notts' not in sys.argv:
    from speak import synth_lines
    os.environ['VIDEO_FORMAT'] = 'talk'
    todo = [dict(r, out=f'{WORK}/l{i:02d}.wav') for i, r in enumerate(LINES) if not os.path.exists(f'{WORK}/l{i:02d}.wav')]
    if todo: synth_lines(todo, 'talk')
def load(i):
    w = wave.open(f'{WORK}/l{i:02d}.wav'); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    if w.getnchannels() == 2: x = x.reshape(-1, 2).mean(1)
    if w.getframerate() != SR:
        import subprocess; subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{WORK}/l{i:02d}.wav', '-ac', '1', '-ar', str(SR), f'{WORK}/n{i:02d}.wav'], check=True)
        w = wave.open(f'{WORK}/n{i:02d}.wav'); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    return x
cur = PRE; lines = []; clips = []
for k, l in enumerate(LINES):
    x = load(k); idx = np.where(np.abs(x) > 0.02)[0]; lead = idx[0] / SR; tail = idx[-1] / SR
    onset = cur + GAPS[k]; start = onset - lead; v1 = start + tail
    hop = SR // 48; n = len(x) // hop
    env = np.array([np.sqrt((x[j*hop:(j+1)*hop] ** 2).mean()) for j in range(n)])
    ref = np.percentile(env[env > 0.01], 90) if (env > 0.01).any() else 1
    env = np.clip(env / ref, 0, 1); env = np.convolve(env, [0.25, 0.5, 0.25], 'same')
    lines.append(dict(i=k, who=l['who'], text=l['text'], emo=l['emo'], start=round(start, 3), v0=round(onset, 3), v1=round(v1, 3), env=[round(float(e), 2) for e in env]))
    clips.append((start, x)); cur = v1
TOTAL = round(cur + POST, 2); END = TOTAL
def at(spec):
    m = re.match(r'^(L|E)(\d*)([+-][\d.]+)?$', str(spec)) if isinstance(spec, str) else None
    if not m: return float(spec)
    off = float(m.group(3) or 0)
    if m.group(1) == 'L': return lines[int(m.group(2))]['v0'] - 0.12 + off + (0.12 if off else 0)
    return END + off
shots = [dict(name=n, t=round(at(a), 3)) for n, a in SHOTS]
json.dump(dict(scenes=[dict(id='talk', start=0, end=TOTAL, lines=list(range(len(lines))), shots=shots)], lines=lines, total=TOTAL), open(WORK + '/timeline.json', 'w'))
print(' '.join(f"{s['name']}@{s['t']:.2f}" for s in shots)); print('last line ends %.2f of %.2f' % (lines[-1]['v1'], TOTAL))
# ---- audio: voice + a quiet, serious beat + whooshes on cuts
N = int(TOTAL * SR); t = np.arange(N) / SR; voices = np.zeros(N, dtype=np.float32)
for start, x in clips:
    a = int(start * SR); b = min(N, a + len(x)); voices[a:b] += x[:b-a] * 0.95
def follow(sig, win=0.12): k = int(win * SR); return np.convolve(np.abs(sig), np.ones(k) / k, 'same')
duck = 1 - 0.6 * np.clip(follow(voices) * 14, 0, 1)
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
MIN = [[57,60,64,69],[53,57,60,65],[48,52,55,60],[55,59,62,67]]
bpm = 84; beat = 60 / bpm; bar = 4 * beat; music = np.zeros(N)
def tone(m, dur, att=0.01, dec=2.5, g=0.05, w=(1, .35, .12)):
    tt = np.arange(int(dur * SR)) / SR; f = midi(m)
    s = sum(a * np.sin(2*np.pi*f*(j+1)*tt) for j, a in enumerate(w)); return s * np.minimum(tt / att, 1) * np.exp(-tt * dec) * g
def put(buf, a, s):
    if a >= N: return
    b = min(N, a + len(s)); buf[a:b] += s[:b-a]
for b in range(int(TOTAL / bar) + 2):
    t0 = b * bar; ch = MIN[b % 4]
    for j, m in enumerate(ch): put(music, int((t0 + j * 0.25) * SR), tone(m, 3.0, 0.08, 1.2, 0.045, (1, .2, .05)))
    put(music, int(t0 * SR), tone(ch[0] - 24, bar, 0.02, 0.9, 0.14, (1, .2, 0)))
    for q in range(4):
        a = int((t0 + q * beat) * SR); tt = np.arange(int(0.22 * SR)) / SR
        if q % 2 == 0: put(music, a, np.sin(2*np.pi*(55 + 80*np.exp(-tt*28))*tt) * np.exp(-tt*13) * 0.10)
music *= np.clip(np.minimum(t / 0.8, (TOTAL - t) / 2.0), 0, 1)
sfx = np.zeros(N)
def whoosh(ts, d=0.16, g=0.05):
    n = int(d * SR); r = np.random.default_rng(int(ts * 100)).standard_normal(n); u = np.arange(n) / n
    sm = np.convolve(r, np.ones(30) / 30, 'same') - np.convolve(r, np.ones(300) / 300, 'same'); put(sfx, max(0, int(ts * SR)), sm * np.sin(np.pi * u) ** 2 * g * 3)
for s in shots[1:]: whoosh(s['t'] - 0.06)
mix = voices + music * duck * 0.6 + sfx
mix *= np.clip(np.minimum(t / 0.2, (TOTAL - t) / 1.2), 0, 1); mix = np.tanh(mix * 0.9); mix = mix / np.abs(mix).max() * 0.9
with wave.open(WORK + '/audio.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio ok')
