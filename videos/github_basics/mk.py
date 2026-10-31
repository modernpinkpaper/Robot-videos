# Makes the voices, the timing file (timeline.json) and the audio mix (audio.wav) for this video.
# Run from anywhere:  python3 videos/github_basics/mk.py
import sys, os, wave, json, subprocess, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
from piper import PiperVoice
try: from piper import SynthesisConfig
except ImportError: SynthesisConfig = None
from script import SCENES, VOICE
SR = 44100; OUT = HERE + '/build'; os.makedirs(OUT, exist_ok=True)
vc = {}
def voice(n):
    if n not in vc: vc[n] = PiperVoice.load(f'{ROOT}/formats/podcast/voices/{n}.onnx')
    return vc[n]
flat = [(si, li, l) for si, s in enumerate(SCENES) for li, l in enumerate(s['lines'])]
if '--notts' not in sys.argv:
    for k, (si, li, l) in enumerate(flat):
        vn, pitch, ls = VOICE[l[0]]; v = voice(vn); raw = f'{OUT}/r{k:02d}.wav'; fin = f'{OUT}/l{k:02d}.wav'
        with wave.open(raw, 'wb') as w:
            if SynthesisConfig: v.synthesize_wav(l[1], w, syn_config=SynthesisConfig(length_scale=ls))
            else: v.synthesize_wav(l[1], w)
        sr = v.config.sample_rate
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', f'asetrate={int(sr*pitch)},aresample={SR},atempo={1/pitch:.4f},highpass=f=90,loudnorm=I=-18:TP=-2', '-ac', '1', '-ar', str(SR), fin], check=True)
def load(k):
    w = wave.open(f'{OUT}/l{k:02d}.wav'); return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
cursor = 0.0; k = 0; clips = []; scenes = []
for si, s in enumerate(SCENES):
    t0 = cursor; lines = []
    for li, l in enumerate(s['lines']):
        who, text, emo, gap, card = l; x = load(k); idx = np.where(np.abs(x) > 0.02)[0]; lead = idx[0] / SR; tail = idx[-1] / SR
        onset = cursor + gap; start = onset - lead; v1 = start + tail
        hop = SR // 48; n = len(x) // hop
        env = np.array([np.sqrt((x[j*hop:(j+1)*hop] ** 2).mean()) for j in range(n)]); ref = np.percentile(env[env > 0.01], 90) if (env > 0.01).any() else 1
        env = np.convolve(np.clip(env / ref, 0, 1), [0.25, 0.5, 0.25], 'same')
        d = dict(who=who, text=text, emo=emo, e0=round(start, 3), v0=round(onset, 3), v1=round(v1, 3), env=[round(float(e), 2) for e in env], card=card)
        lines.append(d); clips.append((start, x)); cursor = v1; k += 1
    t1 = cursor + (1.2 if si == len(SCENES) - 1 else 0.7)
    scenes.append(dict(id=s['id'], step=s['step'], t0=round(t0, 3), t1=round(t1, 3), lines=lines)); cursor = t1
END = cursor + (3.0)  # last scene holds a little longer
scenes[-1]['t1'] = round(END, 3); total = END
json.dump(dict(scenes=scenes, total=round(total, 3)), open(HERE + '/build/timeline.json', 'w'))
print(f'total {total:.1f}s, {int(total*24)} frames')
# ---- audio mix: voices + gentle music + whooshes between scenes + a ding when a card pops
N = int(total * SR); voices = np.zeros(N, dtype=np.float32)
for start, x in clips:
    a = int(start * SR); b = min(N, a + len(x)); voices[a:b] += x[:b-a] * 0.95
t = np.arange(N) / SR
def follow(sig, win=0.12): kk = int(win * SR); return np.convolve(np.abs(sig), np.ones(kk) / kk, 'same')
duck = 1 - 0.65 * np.clip(follow(voices) * 14, 0, 1)
bpm = 80; beat = 60 / bpm; bar = 4 * beat; midi = lambda m: 440 * 2 ** ((m - 69) / 12)
chords = [[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,65]]; music = np.zeros(N)
for b in range(int(total / bar) + 2):
    ch = chords[b % 4]; t0 = b * bar
    for j, m in enumerate(ch):
        for rep in range(2):
            a = int((t0 + rep * 2 * beat + j * 0.04) * SR)
            if a >= N: continue
            tt = np.arange(min(int(1.8 * SR), N - a)) / SR
            music[a:a+len(tt)] += (np.sin(2*np.pi*midi(m)*tt) + 0.3*np.sin(2*np.pi*midi(m)*2*tt)) * np.exp(-tt * 2.4) * 0.05
    for q in range(4):
        a = int((t0 + q * beat) * SR)
        if a >= N: continue
        tt = np.arange(min(int(0.9 * beat * SR), N - a)) / SR; music[a:a+len(tt)] += np.sin(2*np.pi*midi(ch[0]-12)*tt) * np.exp(-tt * 3.5) * 0.09 * (1 if q % 2 == 0 else 0.6)
sfx = np.zeros(N)
def ding(ts, f=1320, g=0.14):
    a = int(ts * SR)
    if a >= N: return
    tt = np.arange(int(0.7 * SR)) / SR; s = (np.sin(2*np.pi*f*tt) + 0.5*np.sin(2*np.pi*f*1.5*tt)) * np.exp(-tt*7) * g; b = min(N, a + len(s)); sfx[a:b] += s[:b-a]
def whoosh(ts, d=0.5, g=0.14):
    a = int(ts * SR); n = int(d * SR)
    if a < 0 or a >= N: return
    r = np.random.default_rng(int(ts*10)).standard_normal(n); tt = np.arange(n) / n; kk = np.convolve(r, np.ones(24)/24, 'same') * np.sin(np.pi*tt)**2 * g; b = min(N, a+n); sfx[a:b] += kk[:b-a]
for s in scenes[:-1]: whoosh(s['t1'] - 0.25, 0.5)
for s in scenes:
    for l in s['lines']:
        if l['card']: ding(l['v0'] + 0.12, 1568 if l['card']['k'] != 'dont' else 440, 0.07)
for j, f in enumerate([784, 988, 1175, 1568]): ding(END - 2.6 + j * 0.12, f, 0.12)
mix = voices + music * duck * 0.9 + sfx
mix *= np.clip(np.minimum(t / 0.4, (total - t) / 1.5), 0, 1); mix = np.tanh(mix * 0.9); mix = mix / np.abs(mix).max() * 0.9
with wave.open(HERE + '/build/audio.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio ok')
