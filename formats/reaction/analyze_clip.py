# LISTENS to the clip Dalia reacts to and finds the moments a real person would react to.
#   python3 analyze_clip.py clip.mp4 [start end]      prints JSON: [{t, kind, strength, text}]   (t = seconds in the clip)
# kinds: laugh  gasp  shake  nod  tilt  sympathy  startle  cut
# How: (1) speech recognition gives sentences and their end times, (2) word lists decide what each sentence is (funny, shocking, absurd,
# something to agree with, a question, something sad), (3) sudden loud sounds are "startle", (4) hard video cuts are weak "cut" events.
# Needs numpy and ffmpeg. faster-whisper is optional (without it only sounds and cuts are used).
import sys, re, json, subprocess
import numpy as np

SR = 16000
LAUGH = ['haha', 'ha ha', 'hahaha', 'lol', 'laughing', 'laughs', 'laughter', 'funny', 'joke', 'jokes', 'hilarious', 'giggle', 'cracking up', 'dying']
SHOCK = ['whoa', 'wow', 'oh my god', 'oh my gosh', 'omg', 'what the', 'are you kidding', 'no way', 'unbelievable', 'cannot believe', "can't believe", 'shocked', 'out of nowhere', 'arrested', 'passed away', 'died', 'screaming', 'blood']
ABSURD = ['never', 'crazy', 'insane', 'ridiculous', 'worst', 'kicked', 'fired', 'stupid', 'wrong', 'nonsense', 'scam', 'terrible', 'awful', 'impossible', 'seriously', 'really', 'excuse', 'makes no sense', "doesn't make sense", 'hypocrite', 'lied', 'lying', 'liar', 'cheat', 'rude', 'disrespect']
AGREE = ['exactly', "that's right", 'you are right', "you're right", 'true', 'correct', 'i agree', 'makes sense', 'good point', 'of course', 'obviously', 'absolutely', 'definitely', "that's why", 'facts', 'right?', 'you know?']
SAD = ['sad', 'cry', 'crying', 'cried', 'hurt', 'hurts', 'lonely', 'lost my', 'heartbroken', 'struggling', 'struggle', 'afraid', 'scared', 'exhausted', 'tired of', 'tears']

def has(text, words): return sum(1 for w in words if w in text)

def load_audio(path, a, b):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(a)] + (['-t', str(b - a)] if b else []) + ['-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-']
    raw = subprocess.run(cmd, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768

def loud_spikes(x, a):
    """Sudden loud sounds (a bang, a shout, a scream) compared with the sound just before."""
    if len(x) < SR: return []
    h = SR // 10; n = len(x) // h; rms = np.array([np.sqrt((x[i * h:(i + 1) * h] ** 2).mean()) for i in range(n)]); out = []; last = -9
    for i in range(5, n):
        base = np.median(rms[max(0, i - 25):i]) + 1e-4
        if rms[i] > 0.08 and rms[i] > 3.2 * base and i * 0.1 - last > 3: out.append(dict(t=round(a + i * 0.1, 2), kind='startle', strength=float(min(1, rms[i] / (6 * base))), text='sudden sound')); last = i * 0.1
    return out

def cuts(path, a, b):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(a)] + (['-t', str(b - a)] if b else []) + ['-i', path, '-vf', "select='gt(scene,0.38)',showinfo", '-an', '-f', 'null', '-']
    err = subprocess.run(cmd, capture_output=True, text=True).stderr; out = []
    for m in re.finditer(r'pts_time:([0-9.]+)', err): out.append(dict(t=round(a + float(m.group(1)), 2), kind='cut', strength=0.3, text='cut'))
    return out

def speech(x, a):
    try: from faster_whisper import WhisperModel
    except Exception: return []
    segs, _ = WhisperModel('base', compute_type='int8').transcribe(x, language='en', beam_size=5, vad_filter=True); out = []
    for s in segs:
        text = s.text.strip(); low = text.lower(); k = None; st = 0.5
        laugh, shock, absurd, agree, sad = has(low, LAUGH), has(low, SHOCK), has(low, ABSURD), has(low, AGREE), has(low, SAD)
        excl = low.count('!') + (1 if text.isupper() and len(text) > 8 else 0)
        if laugh: k, st = 'laugh', 0.6 + 0.2 * laugh
        elif shock or excl >= 2: k, st = 'gasp', 0.6 + 0.15 * (shock + excl)
        elif sad: k, st = 'sympathy', 0.55 + 0.1 * sad
        elif absurd: k, st = 'shake', 0.5 + 0.15 * absurd
        elif agree: k, st = 'nod', 0.5 + 0.1 * agree
        elif text.endswith('?'): k, st = 'tilt', 0.4
        elif len(text.split()) >= 7: k, st = 'nod', 0.32              # listening: a small nod after a longer statement
        if k: out.append(dict(t=round(a + s.end, 2), kind=k, strength=float(min(1, st)), text=text[:80]))
    return out

if __name__ == '__main__':
    path = sys.argv[1]; a = float(sys.argv[2]) if len(sys.argv) > 2 else 0; b = float(sys.argv[3]) if len(sys.argv) > 3 else 0
    x = load_audio(path, a, b); ev = []
    try: ev += speech(x, a)
    except Exception as e: print('speech recognition skipped:', e, file=sys.stderr)
    try: ev += loud_spikes(x, a)
    except Exception as e: print('sound check skipped:', e, file=sys.stderr)
    try: ev += cuts(path, a, b)
    except Exception as e: print('cut check skipped:', e, file=sys.stderr)
    print(json.dumps(sorted(ev, key=lambda e: e['t'])))
