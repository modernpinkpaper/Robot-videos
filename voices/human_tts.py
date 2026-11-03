# HUMAN VOICES with Chatterbox (open-source, natural-sounding). Robots keep using Piper.
# Run with the Chatterbox Python (see voices/setup_chatterbox.sh):
#   $CHATTERBOX_PY voices/human_tts.py lines.json
# lines.json = [ { "who": "DALIA", "text": "Wait, she did WHAT?", "emo": "shock", "out": "/path/l00.wav" }, ... ]
# Optional per line: "lang": "ar" (speak Arabic in the SAME character voice; also "verify": expected Arabic text, "tries": how many attempts, the best by recognition is kept), "voice": use another character's voice (mix and match, e.g. THEO speaking with MARCUS's voice); "pace": 0.9..1.2 (1 = normal), "tone": -2..+2 (semitones, + = brighter), "energy": 0..1 (extra emotion)
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
    'deadpan':  dict(exag=0.38, cfg=0.55, speed=0.96, pitch=-0.4),
    'stern':    dict(exag=0.45, cfg=0.55, speed=0.96, pitch=-0.6),
    'tired':    dict(exag=0.40, cfg=0.55, speed=0.94, pitch=-0.6),
    'sad':      dict(exag=0.42, cfg=0.55, speed=0.94, pitch=-0.5),
    'worried':  dict(exag=0.62, cfg=0.45, speed=1.03, pitch=0.3),
    'shock':    dict(exag=0.70, cfg=0.42, speed=1.05, pitch=0.9),
    'smug':     dict(exag=0.50, cfg=0.50, speed=0.94, pitch=-0.2),
    'dramatic': dict(exag=0.70, cfg=0.45, speed=0.96, pitch=0.0),
}
# VOICE DIRECTION. Every voice has these dimensions; each one has a knob (see voices/README.md):
#   pace (speed) · pitch/tone (semitones) · pitch variety/emotion (exaggeration) · deliberateness (cfg) · pauses/rhythm (pause_scale) · warmth/softness/body (EQ + gentle compression)
# A style is a preset of those knobs. A person can have a default style (PEOPLE[..]['style']) and any line can say "style": "comforting" or override single knobs.
STYLES = {
    # clear but comforting: a little slower, a touch lower, more breathing room between sentences, warm and soft sound, even loudness
    # (v2, after Dalia's feedback: no hard stops, no dead silence, less robotic)
    #   joint = the whole line is spoken in ONE pass, so sentence ends fall and breathe like a person (no gluing sentences together)
    #   room  = a little natural room sound and a soft decay after every word and sentence end (dry digital silence sounds robotic)
    #   temperature = how much the melody varies from take to take
    'comforting': dict(speed_mul=1.0, pitch_add=-0.2, exag_add=0.08, cfg_add=-0.1, pause_scale=1.0, joint=True, temperature=0.9, room=0.13,
                       eq="bass=g=1.8:f=190,treble=g=-1.5:f=7000"),
    # natural conversation: no extra softness, but the same fixes (whole-line speech, room sound, a lively melody)
    'natural': dict(speed_mul=1.0, pitch_add=0.0, exag_add=0.06, cfg_add=-0.05, pause_scale=1.0, joint=True, temperature=0.9, room=0.12, eq=""),
    # bright and friendly, for a younger or livelier person
    'bright': dict(speed_mul=1.03, pitch_add=0.3, exag_add=0.08, cfg_add=0.0, pause_scale=0.9, eq="treble=g=1.2:f=5500"),
}
# One reference voice per person (voices/refs/<name>.wav) plus a base pitch and pace so each sounds different.
PEOPLE = {
    'DALIA':    dict(ref='dalia',    pitch=0.0,  speed=1.00),
    'AMINA':    dict(ref='amina',    pitch=0.0,  speed=0.98, style='comforting'),   # sample = a natural voice (Kokoro af_heart, expressive reading), not Piper; style = clear but comforting
    'MARCUS':   dict(ref='marcus',   pitch=-1.0, speed=0.98),
    'LILY':     dict(ref='lily',     pitch=1.0,  speed=1.04),
    'SOFIA':    dict(ref='sofia',    pitch=0.0,  speed=1.02),
    'GRANDPA':  dict(ref='grandpa',  pitch=-2.0, speed=0.90),
    'KID_BOY':  dict(ref='kid_boy',  pitch=3.5,  speed=1.06),
    'KID_GIRL': dict(ref='kid_girl', pitch=4.0,  speed=1.06),
    'NARRATOR': dict(ref='narrator', pitch=-0.5, speed=0.96),
    # EMOTIONAL ROBOTS characters (characters/expressive). Each has its own reference clip (made by make_refs.py) plus a base pitch and pace.
    'MARA':     dict(ref='mara',     pitch=0.0,  speed=1.00),
    'THEO':     dict(ref='theo',     pitch=-0.5, speed=1.00),
    'PRIYA':    dict(ref='priya',    pitch=0.5,  speed=1.02),
    'JUNE':     dict(ref='june',     pitch=0.0,  speed=0.92),
    'KAI':      dict(ref='kai',      pitch=3.0,  speed=1.04),
    'GUS':      dict(ref='gus',      pitch=-1.5, speed=0.92),
    'ZOE':      dict(ref='zoe',      pitch=0.5,  speed=1.04),
    'FINN':     dict(ref='finn',     pitch=0.5,  speed=1.03),
    'HANA':     dict(ref='hana',     pitch=0.0,  speed=0.98),
    'NINA':     dict(ref='nina',     pitch=3.5,  speed=1.04),
}
HUMANS = set(PEOPLE)

def style_for(who, text, emo='neutral', pace=None, tone=None, energy=None, style=None, knobs=None):
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
    s['exag'] = max(0.35, min(0.75, s['exag']))   # above about 0.8 speech gets rushed, slurred or garbled; s['cfg'] = max(0.38, min(0.8, s['cfg']))   # low values rush the words
    s['speed'] = (max(0.93, s['speed']) if pace is None else pace) * P['speed']   # never drag: slow lines still need to sound like a person talking
    s['pitch'] = s['pitch'] + P['pitch'] + (tone or 0)
    s['ref'] = os.path.join(REFS, P['ref'] + '.wav')
    priv = os.path.join(REFS, 'private', P['ref'] + '.wav')   # a REAL person's voice sample lives in voices/refs/private/ (git-ignored: the repo is public) and overrides the public sample on this computer only
    if os.path.exists(priv): s['ref'] = priv
    S = dict(STYLES.get(style or P.get('style') or '', {})); S.update({k: v for k, v in (knobs or {}).items() if v is not None})   # a line can override single knobs: speed_mul, pitch_add, exag_add, cfg_add, pause_scale, eq
    s['exag'] = max(0.3, min(0.75, s['exag'] + S.get('exag_add', 0))); s['cfg'] = max(0.2, s['cfg'] + S.get('cfg_add', 0))
    s['speed'] *= S.get('speed_mul', 1.0); s['pitch'] += S.get('pitch_add', 0); s['pause_scale'] = S.get('pause_scale', 1.0); s['eq'] = S.get('eq', ''); s['joint'] = S.get('joint', False); s['temperature'] = S.get('temperature', 0.8); s['room'] = S.get('room', 0.0)
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

_asr_ar = None
def ar_norm(t):
    import unicodedata
    t = unicodedata.normalize('NFKD', t); t = ''.join(c for c in t if not unicodedata.category(c).startswith('M'))
    t = t.replace('\u0640', ''); t = re.sub('[\u0623\u0625\u0622\u0671]', '\u0627', t); t = t.replace('\u0649', '\u064a').replace('\u0629', '\u0647')
    return re.sub(r'[^\u0621-\u064a ]', '', t).strip()
def ar_score(wav, sr, expected):
    """Listen to an Arabic clip with speech recognition (small model) and score it 0..1 against the expected text (vowel marks ignored)."""
    global _asr_ar
    try:
        import difflib, torchaudio
        from faster_whisper import WhisperModel
        if _asr_ar is None: _asr_ar = WhisperModel('small', compute_type='int8')
        a = torchaudio.functional.resample(wav.unsqueeze(0), sr, 16000).squeeze(0).numpy().astype('float32')
        segs, _ = _asr_ar.transcribe(a, language='ar', beam_size=5); heard = ' '.join(x.text for x in segs)
        return difflib.SequenceMatcher(None, ar_norm(expected), ar_norm(heard)).ratio()
    except Exception as ex:
        print('  (no Arabic recogniser:', ex, ')', flush=True); return 0.5

def trim_main_utterance(x, sr, lead=0.06, tail=0.20, fade=0.24):
    """The multilingual (Arabic) voice finishes the word and then keeps making a faint babble or hiss for 1 to 2 seconds. Keep only the real word(s):
    find the loud runs, take the loudest one, and keep a following run only if it is nearly as loud (a second word of the same phrase). Cut the rest and fade out softly."""
    import numpy as np
    x = np.asarray(x, dtype=np.float32); win = max(1, int(0.01 * sr)); n = len(x) // win
    if n < 5: return x
    db = 20 * np.log10(np.sqrt((x[:n * win].reshape(n, win) ** 2).mean(1)) + 1e-9); pk = db.max(); on = db > pk - 30
    runs = []; i = 0; gap = int(0.12 / 0.01)
    while i < n:
        if on[i]:
            j = i
            while j < n and (on[j] or on[j:j + gap].any()): j += 1
            runs.append([i, j, float(db[i:j].mean())]); i = j
        else: i += 1
    if not runs: return x
    main = max(runs, key=lambda r: (r[1] - r[0]) * (r[2] - (pk - 60)))
    k = runs.index(main); start, end, mean = runs[k]
    for r in runs[k + 1:]:                       # a following run only counts if it is a real continuation (close and nearly as loud)
        if r[0] - end <= int(0.35 / 0.01) and r[2] >= mean - 8: end = r[1]
        else: break
    for r in reversed(runs[:k]):                 # same for a run just before
        if start - r[1] <= int(0.35 / 0.01) and r[2] >= mean - 8: start = r[0]
        else: break
    ext = 0
    while end + ext < n and ext < 30 and db[end + ext] > pk - 42: ext += 1      # keep the soft ending of the last word (up to 0.3 s), but never bridge into the babble
    end += ext
    a = max(0, int((start * 0.01 - lead) * sr)); b = min(len(x), int((end * 0.01 + tail) * sr)); y = x[a:b].copy()
    f = min(len(y), int(fade * sr)); y[-f:] *= np.linspace(1, 0, f) ** 1.5
    return y

def add_room(path, wet=0.13, tail=0.45, tone_db=-56):
    """Natural room: a short soft reverb tail (so words and sentence ends decay instead of stopping), and a very quiet room tone (so the gaps are never digital silence)."""
    import wave, numpy as np
    try: from scipy.signal import fftconvolve
    except ImportError:
        def fftconvolve(a, b):
            n = len(a) + len(b) - 1; m = 1 << (n - 1).bit_length(); return np.fft.irfft(np.fft.rfft(a, m) * np.fft.rfft(b, m), m)[:n]
    w = wave.open(path); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768; w.close()
    rng = np.random.default_rng(7); n = int(0.38 * sr); t = np.arange(n) / sr
    ir = rng.standard_normal(n) * np.exp(-t * 6.9 / 0.30); ir[0] = 0; ir = np.convolve(ir, np.ones(5) / 5, 'same')   # decays by 60 dB in about 0.3 s, a small soft room
    ir /= np.abs(ir).sum() + 1e-9; ir *= 3.2
    x = np.concatenate([x, np.zeros(int(tail * sr), dtype=np.float32)]); y = x + wet * fftconvolve(x, ir)[:len(x)]
    pink = np.cumsum(rng.standard_normal(len(y))); pink = pink - np.convolve(pink, np.ones(2400) / 2400, 'same'); pink /= (np.abs(pink).max() + 1e-9)   # soft low rumble
    y = y + pink * 10 ** (tone_db / 20) * 3 + rng.standard_normal(len(y)) * 10 ** ((tone_db - 8) / 20)
    pk = np.abs(y).max(); y = y / pk * min(pk, 0.92) if pk > 0.92 else y
    with wave.open(path, 'wb') as o: o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes((y * 32767).astype('<i2').tobytes())

def soften_caps(t):
    # Keep emphasis (the model hears the energy) but avoid spelling out ALL CAPS letter by letter.
    return re.sub(r"\b([A-Z]{3,})\b", lambda m: m.group(1).capitalize(), t)

def main(path):
    import torch, torchaudio as ta
    from chatterbox.tts import ChatterboxTTS
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = ChatterboxTTS.from_pretrained(device=dev); sr = model.sr
    ml = None   # the multilingual model is loaded only if a row has a "lang" (like "ar")
    for row in json.load(open(path)):
        who = row.get('voice', row['who']).upper(); st = style_for(who, row['text'], row.get('emo', 'neutral'), row.get('pace'), row.get('tone'), row.get('energy'), row.get('style'), {k: row.get(k) for k in ('speed_mul', 'pitch_add', 'exag_add', 'cfg_add', 'pause_scale', 'eq', 'joint', 'temperature', 'room')})
        if row.get('ref'): st['ref'] = row['ref']   # a row can point at any voice sample file (used to audition voices)
        cur_sr = sr
        if row.get('lang') and row['lang'] != 'en':
            if ml is None:
                from chatterbox.mtl_tts import ChatterboxMultilingualTTS
                ml = ChatterboxMultilingualTTS.from_pretrained(device=dev)
            best = None
            for attempt in range(int(row.get('tries', 4))):
                w = ml.generate(row['text'], language_id=row['lang'], audio_prompt_path=st['ref'], exaggeration=min(0.6, st['exag']), cfg_weight=st['cfg']).squeeze(0)
                sc = ar_score(w, ml.sr, row.get('verify', row['text'])) if row['lang'] == 'ar' else 1.0
                print(f"  {row['lang']} try {attempt + 1}: score {sc:.2f}, {w.shape[0] / ml.sr:.1f}s", flush=True)
                if best is None or sc > best[0]: best = (sc, w)
                if sc >= 0.95: break
            import numpy as np; audio = torch.from_numpy(trim_main_utterance(best[1].numpy(), ml.sr)).unsqueeze(0); cur_sr = ml.sr; rates = [2.0]   # cut the babble after the word
            if best[0] < 0.7: print(f"  WARNING: best score only {best[0]:.2f} for {row['text']}", flush=True)
            raw = tempfile.mktemp(suffix='.wav'); ta.save(raw, audio, cur_sr)
            pf = 2 ** (st['pitch'] / 12.0); tempo = st['speed'] / pf
            af = f"asetrate={int(cur_sr * pf)},aresample=44100,atempo={max(0.5, min(2.0, tempo)):.4f},highpass=f=70" + ("," + st["eq"] if st.get("eq") else "") + ",loudnorm=I=-18:TP=-2"
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', af, '-ar', '44100', '-ac', '1', row['out']], check=True); os.remove(raw)
            if st.get('room'): add_room(row['out'], st['room'])
            print('made', who, row.get('emo', 'neutral'), row['lang'], f"best={best[0]:.2f}", '->', row['out'], flush=True)
            continue
        parts = []; rates = []
        for sent, pause in (pieces(row['text']) if not st.get('joint') else [(re.sub(r'\s+', ' ', row['text'].strip()), 0.0)]):
            e = st['exag'] + (0.02 if sent.endswith('!') else 0)
            n_words = max(1, len(sent.split())); max_dur = 1.2 + 0.7 * n_words          # a sentence can never take longer than this
            cfg = st['cfg']
            best_take = None                                                                # keep the best take, not the last one
            for attempt in range(5 if n_words <= 4 else 4):                                 # the model sometimes rambles or garbles short lines: retry calmer, keep the best
                wav = model.generate(soften_caps(sent), audio_prompt_path=st['ref'], exaggeration=min(0.75, e), cfg_weight=cfg, temperature=st.get('temperature', 0.8)).squeeze(0)
                ok = wav.shape[0] / sr <= max_dur; sc = 0.0
                if ok:
                    sc, wps = clarity(wav, sr, sent)
                    ok = sc >= 0.92 and wps <= 3.9                                          # words must be recognised, and not rushed
                    if not ok: print(f'  retry: clarity {sc:.2f}, {wps:.1f} words/s', flush=True)
                else: print(f'  retry ({wav.shape[0] / sr:.1f}s for {n_words} words)', flush=True)
                if best_take is None or sc > best_take[0]: best_take = (sc, wav)
                if ok: break
                e = max(0.3, e - 0.12); cfg = min(0.8, cfg + 0.08)
            else:
                wav = best_take[1]
                if wav.shape[0] / sr > max_dur:
                    wav = wav[:int(sr * max_dur)].clone(); n = int(sr * 0.12); wav[-n:] = wav[-n:] * torch.linspace(1, 0, n)
            rates.append(n_words / max(0.4, wav.shape[0] / sr)); parts.append(wav); parts.append(torch.zeros(int(sr * pause * st['pause_scale'])))
        audio = torch.cat(parts[:-1]).unsqueeze(0)           # no pause after the last sentence
        raw = tempfile.mktemp(suffix='.wav'); ta.save(raw, audio, sr)
        # pace (tempo) and tone (pitch) without changing the other: shift pitch by resampling, then correct the tempo
        avg = sum(rates) / len(rates); gov = min(1.0, 3.3 / avg) if avg > 3.3 else 1.0     # pace governor: never faster than about 3.3 words a second
        pf = 2 ** (st['pitch'] / 12.0); tempo = st['speed'] * gov / pf
        af = f"asetrate={int(sr * pf)},aresample=44100,atempo={max(0.5, min(2.0, tempo)):.4f},highpass=f=70" + ("," + st["eq"] if st.get("eq") else "") + ",loudnorm=I=-18:TP=-2"
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', af, '-ar', '44100', '-ac', '1', row['out']], check=True); os.remove(raw)
        if st.get('room'): add_room(row['out'], st['room'])
        print('made', who, row.get('emo', 'neutral'), f"exag={st['exag']:.2f} speed={st['speed']:.2f} pitch={st['pitch']:+.1f}", '->', row['out'], flush=True)

if __name__ == '__main__': main(sys.argv[1])
