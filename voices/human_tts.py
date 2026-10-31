# HUMAN VOICES with Chatterbox (open-source, natural-sounding). Robots keep using Piper.
# Run with the Chatterbox Python (see voices/setup_chatterbox.sh):
#   $CHATTERBOX_PY voices/human_tts.py lines.json
# lines.json = [ { "who": "DALIA", "text": "Wait, she did WHAT?", "emo": "shock", "out": "/path/l00.wav" }, ... ]
# Optional per line: "pace": 0.9..1.2 (1 = normal), "tone": -2..+2 (semitones, + = brighter), "energy": 0..1 (extra emotion)
#
# Every line gets its own pace, emotion and tone chosen from (a) the emotion tag and (b) what the words say:
#   !  more energy      ?  brighter, slightly slower      ...  slower, softer      ALL CAPS words  emphasis
#   very short line  a touch slower      long line  a touch faster      commas and full stops  natural pauses
import sys, os, re, json, subprocess, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
REFS = os.path.join(HERE, 'refs')

# Chatterbox knobs: exaggeration = how emotional (0.25 flat ... 1.0 very dramatic), cfg = lower is slower and more deliberate.
# speed/pitch are applied after (ffmpeg): speed 1 = normal, pitch in semitones.
EMO = {
    'neutral':  dict(exag=0.50, cfg=0.50, speed=1.00, pitch=0.0),
    'happy':    dict(exag=0.62, cfg=0.45, speed=1.04, pitch=0.4),
    'excited':  dict(exag=0.68, cfg=0.45, speed=1.04, pitch=0.6),
    'sweet':    dict(exag=0.52, cfg=0.50, speed=0.97, pitch=0.3),
    'laugh':    dict(exag=0.68, cfg=0.42, speed=1.03, pitch=0.5),
    'deadpan':  dict(exag=0.25, cfg=0.60, speed=0.95, pitch=-0.4),
    'stern':    dict(exag=0.45, cfg=0.55, speed=0.96, pitch=-0.6),
    'tired':    dict(exag=0.30, cfg=0.60, speed=0.88, pitch=-0.8),
    'sad':      dict(exag=0.38, cfg=0.55, speed=0.88, pitch=-0.6),
    'worried':  dict(exag=0.62, cfg=0.45, speed=1.03, pitch=0.3),
    'shock':    dict(exag=0.70, cfg=0.42, speed=1.05, pitch=0.9),
    'smug':     dict(exag=0.50, cfg=0.50, speed=0.94, pitch=-0.2),
    'dramatic': dict(exag=0.70, cfg=0.45, speed=0.96, pitch=0.0),
}
# One reference voice per person (voices/refs/<name>.wav) plus a base pitch and pace so each sounds different.
PEOPLE = {
    'DALIA':    dict(ref='dalia',    pitch=0.0,  speed=1.00),
    'AMINA':    dict(ref='amina',    pitch=0.0,  speed=0.98),
    'MARCUS':   dict(ref='marcus',   pitch=-1.0, speed=0.98),
    'LILY':     dict(ref='lily',     pitch=1.0,  speed=1.04),
    'SOFIA':    dict(ref='sofia',    pitch=0.0,  speed=1.02),
    'GRANDPA':  dict(ref='grandpa',  pitch=-2.0, speed=0.90),
    'KID_BOY':  dict(ref='kid_boy',  pitch=3.5,  speed=1.06),
    'KID_GIRL': dict(ref='kid_girl', pitch=4.0,  speed=1.06),
    'NARRATOR': dict(ref='narrator', pitch=-0.5, speed=0.96),
}
HUMANS = set(PEOPLE)

def style_for(who, text, emo='neutral', pace=None, tone=None, energy=None):
    """Pick pace, emotion and tone for one line from its emotion tag and its words."""
    s = dict(EMO.get(emo, EMO['neutral'])); P = PEOPLE.get(who, PEOPLE['DALIA'])
    ex, q = text.count('!'), text.count('?')
    caps = len([w for w in re.findall(r"[A-Za-z']+", text) if len(w) > 2 and w.isupper()])
    s['exag'] += 0.03 * min(ex, 3) + 0.03 * min(q, 2) + 0.04 * min(caps, 2)
    s['pitch'] += 0.25 * min(q, 2) + 0.2 * min(ex, 2)
    if '...' in text or '…' in text: s['speed'] -= 0.05; s['exag'] -= 0.05
    n = len(text)
    if n < 25: s['speed'] -= 0.03
    elif n > 120: s['speed'] += 0.03
    if q: s['speed'] -= 0.02
    if energy is not None: s['exag'] = 0.3 + 0.7 * energy
    s['exag'] = max(0.25, min(0.75, s['exag']))   # above about 0.8 speech gets rushed, slurred or garbled; s['cfg'] = max(0.38, min(0.8, s['cfg']))   # low values rush the words
    s['speed'] = (s['speed'] if pace is None else pace) * P['speed']
    s['pitch'] = s['pitch'] + P['pitch'] + (tone or 0)
    s['ref'] = os.path.join(REFS, P['ref'] + '.wav')
    return s

def pieces(text):
    """Split into sentences so each can get its own energy; returns [(sentence, pause_after_seconds)]."""
    text = re.sub(r'\s+', ' ', text.strip()); out = []
    for m in re.finditer(r'[^.!?…]+(?:\.\.\.|[.!?…])*', text):
        t = m.group(0).strip()
        if not t: continue
        pause = 0.38 if t.endswith('...') else (0.26 if t[-1:] in '.!' else 0.3 if t[-1:] == '?' else 0.1)
        out.append((t, pause))
    return out or [(text, 0.1)]


_asr = None
def clarity(wav, sr, sent):
    """Listen to the line with speech recognition. Returns (how much of the text was recognised 0..1, words per second)."""
    global _asr
    try:
        import difflib, numpy as np, torchaudio
        from faster_whisper import WhisperModel
        if _asr is None: _asr = WhisperModel('base', compute_type='int8')
        a = torchaudio.functional.resample(wav.unsqueeze(0), sr, 16000).squeeze(0).numpy().astype('float32')
        segs, _ = _asr.transcribe(a, language='en', beam_size=5); heard = ' '.join(x.text for x in segs)
        norm = lambda t: re.sub(r"[^a-z' ]", '', t.lower().replace('-', ' ')).split()
        n = norm(sent); h = norm(heard)
        return difflib.SequenceMatcher(None, n, h).ratio(), len(n) / max(0.5, wav.shape[0] / sr)
    except Exception as ex:                                                              # no recogniser installed: skip the check
        return 1.0, 0.0

def soften_caps(t):
    # Keep emphasis (the model hears the energy) but avoid spelling out ALL CAPS letter by letter.
    return re.sub(r"\b([A-Z]{3,})\b", lambda m: m.group(1).capitalize(), t)

def main(path):
    import torch, torchaudio as ta
    from chatterbox.tts import ChatterboxTTS
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = ChatterboxTTS.from_pretrained(device=dev); sr = model.sr
    for row in json.load(open(path)):
        who = row['who'].upper(); st = style_for(who, row['text'], row.get('emo', 'neutral'), row.get('pace'), row.get('tone'), row.get('energy'))
        parts = []; rates = []
        for sent, pause in pieces(row['text']):
            e = st['exag'] + (0.02 if sent.endswith('!') else 0)
            n_words = max(1, len(sent.split())); max_dur = 1.2 + 0.7 * n_words          # a sentence can never take longer than this
            cfg = st['cfg']
            for attempt in range(4):                                                        # the model sometimes rambles: retry calmer, then cut
                wav = model.generate(soften_caps(sent), audio_prompt_path=st['ref'], exaggeration=min(0.75, e), cfg_weight=cfg).squeeze(0)
                ok = wav.shape[0] / sr <= max_dur
                if ok:
                    sc, wps = clarity(wav, sr, sent)
                    ok = sc >= 0.92 and wps <= 3.9                                          # words must be recognised, and not rushed
                    if not ok: print(f'  retry: clarity {sc:.2f}, {wps:.1f} words/s', flush=True)
                else: print(f'  retry ({wav.shape[0] / sr:.1f}s for {n_words} words)', flush=True)
                if ok: break
                e = max(0.3, e - 0.12); cfg = min(0.8, cfg + 0.08)
            else:
                wav = wav[:int(sr * max_dur)]; n = int(sr * 0.12); wav[-n:] = wav[-n:] * torch.linspace(1, 0, n)
            rates.append(n_words / max(0.4, wav.shape[0] / sr)); parts.append(wav); parts.append(torch.zeros(int(sr * pause)))
        audio = torch.cat(parts[:-1]).unsqueeze(0)           # no pause after the last sentence
        raw = tempfile.mktemp(suffix='.wav'); ta.save(raw, audio, sr)
        # pace (tempo) and tone (pitch) without changing the other: shift pitch by resampling, then correct the tempo
        avg = sum(rates) / len(rates); gov = min(1.0, 3.3 / avg) if avg > 3.3 else 1.0     # pace governor: never faster than about 3.3 words a second
        pf = 2 ** (st['pitch'] / 12.0); tempo = st['speed'] * gov / pf
        af = f"asetrate={int(sr * pf)},aresample=44100,atempo={max(0.5, min(2.0, tempo)):.4f},highpass=f=70,loudnorm=I=-18:TP=-2"
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', af, '-ar', '44100', '-ac', '1', row['out']], check=True); os.remove(raw)
        print('made', who, row.get('emo', 'neutral'), f"exag={st['exag']:.2f} speed={st['speed']:.2f} pitch={st['pitch']:+.1f}", '->', row['out'], flush=True)

if __name__ == '__main__': main(sys.argv[1])
