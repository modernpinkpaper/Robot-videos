# usage: CHATTERBOX_PY=... python3 formats/quran_lessons/build_audio.py videos/<name> [--notts]
# Makes realistic voices (Chatterbox via voices/speak.py), the timeline (work/timeline.json) and the audio (work/audio.wav, voices + a very soft pad).
import sys, os, re, wave, json, importlib.util, numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, ROOT + '/voices')
VID = os.path.abspath(sys.argv[1]); WORK = VID + '/work'; os.makedirs(WORK, exist_ok=True); SR = 44100
spec = importlib.util.spec_from_file_location('plan', VID + '/plan.py'); P = importlib.util.module_from_spec(spec); spec.loader.exec_module(P)
SCENES, TOTAL = P.SCENES, P.TOTAL
flat = [(si, l) for si, s in enumerate(SCENES) for l in s['lines']]
if '--notts' not in sys.argv:
    from speak import synth_lines
    synth_lines([dict(who=l[0], text=l[1], emo=l[2], out=f'{WORK}/l{i:02d}.wav') for i, (si, l) in enumerate(flat)], 'story')
def load(i):
    w = wave.open(f'{WORK}/l{i:02d}.wav'); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    if w.getframerate() != SR:
        import subprocess; subprocess.run(['ffmpeg','-v','error','-y','-i',f'{WORK}/l{i:02d}.wav','-ar',str(SR),'-ac','1',f'{WORK}/r{i:02d}.wav'],check=True)
        w = wave.open(f'{WORK}/r{i:02d}.wav'); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    return x
cursor = 0.0; lines = []; clips = []; scenes = []; k = 0
for si, s in enumerate(SCENES):
    st = cursor; cur = st + s['pre']; sl = []
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
    if si == len(SCENES) - 1: end = max(end, TOTAL) if TOTAL else end
    scenes.append(dict(id=s['id'], start=round(st, 3), end=round(end, 3), lines=[d['i'] for d in sl])); cursor = end
TOTAL = scenes[-1]['end']
def at(spec, sc, sl):
    m = re.match(r'^(L|E)(\d*)([+-][\d.]+)?$', str(spec)) if isinstance(spec, str) else None
    if not m: return sc['start'] + float(spec)
    off = float(m.group(3) or 0)
    if m.group(1) == 'L': return sl[int(m.group(2))]['v0'] - 0.12 + off + (0.12 if off else 0)
    return sc['end'] + off
for s, sc in zip(SCENES, scenes):
    sl = [lines[i] for i in sc['lines']]; sc['shots'] = [dict(name=n, t=round(at(a, sc, sl), 3)) for n, a in s['shots']]
json.dump(dict(scenes=scenes, lines=lines, total=TOTAL), open(WORK + '/timeline.json', 'w'))
for sc in scenes: print(f"{sc['id']:7s} {sc['start']:6.2f} - {sc['end']:6.2f}   " + ' '.join(f"{x['name']}@{x['t']:.2f}" for x in sc['shots']))
N = int(TOTAL * SR); voices = np.zeros(N, dtype=np.float32)
for start, x in clips:
    a = int(start * SR); b = min(N, a + len(x)); voices[a:b] += x[:b-a] * 0.95
t = np.arange(N) / SR; midi = lambda m: 440 * 2 ** ((m - 69) / 12); music = np.zeros(N)
k2 = int(0.15 * SR); duck = 1 - 0.7 * np.clip(np.convolve(np.abs(voices), np.ones(k2) / k2, 'same') * 14, 0, 1)
for b, ch in enumerate([[57,60,64],[53,57,60],[48,52,55],[55,59,62]] * 20):
    t0 = b * 4.0
    if t0 >= TOTAL: break
    for m in ch:
        tt = np.arange(int(5 * SR)) / SR; s_ = np.sin(2*np.pi*midi(m)*tt) * np.minimum(tt / 1.2, 1) * np.exp(-tt * 0.45) * 0.018
        a = int(t0 * SR); e = min(N, a + len(s_)); music[a:e] += s_[:e-a]
fade = np.minimum(1, np.minimum(t / 0.6, (TOTAL - t) / 1.2))
mix = (voices + music * duck) * fade; mix = mix / max(1, np.abs(mix).max() / 0.92)
with wave.open(WORK + '/audio.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio total %.1fs' % TOTAL)
