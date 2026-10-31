# THE REACTION RULEBOOK: how a person behaves while watching a clip. Pure rules, no AI guessing and no script needed.
# plan_reactions() turns (a) what the clip contains (analyze_clip.py) and (b) where the reactor talks into a timeline of small human moves.
#
# Rules (all of them can be changed here):
#  1. BASELINE: eyes and head are on the clip (down and to the left). Tiny movements and blinks happen on their own.
#  2. REACTIONS come from the clip: laugh at a joke, gasp at a shock or a sudden sound, shake the head at something absurd or negative,
#     nod at something true, tilt the head at a question, look sympathetic at something sad.
#  3. TIMING: a person reacts a moment AFTER the thing (0.2 to 0.45 s), at the end of a sentence, not exactly on it.
#  4. VARIETY: never the same reaction twice in a row; at least 2.8 s between reactions; the repeat of a mood gets a little bigger.
#  5. CAMERA LOOKS: now and then (every 9 to 17 s) the reactor looks up at the camera for about a second without saying anything,
#     with a face that fits the mood (side eye, skeptical, deadpan, smirk, eye roll). After a big moment there is often a look to the camera.
#  6. THE REACTOR TALKS: no reactions or looks while talking; at the start of talking the head turns to the camera.
#  7. A SCRIPT can force a reaction at an exact time; automatic ones stay out of its way (1.2 s).
import random

DUR = {'nod': 1.7, 'shake': 1.6, 'laugh': 2.3, 'gasp': 1.5, 'tilt': 1.6, 'sympathy': 2.2, 'startle': 1.2, 'lean': 1.3, 'cut': 1.0, 'facepalm': 2.0, 'hop': 1.2}
FACE = {'nod': ['neutral', 'happy'], 'shake': ['cringe', 'disgusted', 'unimpressed', 'worried'], 'laugh': ['laugh', 'giggle'], 'gasp': ['gasp', 'shocked', 'surprised'],
        'tilt': ['confused', 'thinking', 'skeptical'], 'sympathy': ['sad', 'hurt', 'worried'], 'startle': ['surprised', 'gasp'], 'lean': ['surprised'], 'cut': ['surprised'],
        'facepalm': ['cringe'], 'hop': ['excited']}
GLANCE_FACE = {'shake': ['side eye', 'skeptical', 'eye roll'], 'gasp': ['shocked', 'side eye'], 'startle': ['surprised', 'side eye'], 'laugh': ['smirk'],
               'nod': ['smirk', 'unimpressed'], 'tilt': ['skeptical'], 'sympathy': ['unimpressed', 'worried'], 'facepalm': ['eye roll', 'cringe'],
               None: ['deadpan', 'skeptical', 'unimpressed']}      # a plain look with nothing special behind it stays flat and dry
EMO_FACE = {'happy': 'happy', 'excited': 'excited', 'sweet': 'happy', 'deadpan': 'deadpan', 'stern': 'annoyed', 'tired': 'tired', 'dramatic': 'shocked', 'shock': 'shocked',
            'worried': 'worried', 'smug': 'smug', 'laugh': 'laugh', 'neutral': 'neutral', 'sad': 'sad'}
ACT_KIND = {'nod': 'nod', 'shake': 'shake', 'gasp': 'gasp', 'laugh': 'laugh', 'facepalm': 'facepalm', 'lean': 'lean', 'hop': 'hop', 'tilt': 'tilt'}

def out_time(segs, t):
    """clip second -> video second (the clip pauses while the reactor talks)."""
    for kind, a, b, ot in segs:
        if kind == 'play' and a - 1e-6 <= t < b: return ot + (t - a)
    return None

def plan_reactions(events, segs, talks, forced, total, seed=7, glances=True):
    rng = random.Random(seed)
    busy = [(t['v0'] - 0.5, t['v1'] + 0.6) for t in talks] + [(f['t0'] - 1.2, f['t1'] + 1.2) for f in forced]
    free = lambda a, b: not any(a < y and b > x for x, y in busy)
    cands = []
    for e in events:
        ot = out_time(segs, e['t'])
        if ot is None: continue
        cands.append(dict(kind=e['kind'], strength=e['strength'], at=ot, text=e.get('text', '')))
    cands.sort(key=lambda c: c['at']); chosen = []; last_end = -9; last_kind = None; mood = []
    for c in cands:
        t0 = c['at'] + rng.uniform(0.2, 0.45); kind = c['kind']
        if t0 - last_end < 2.8 - 0.0 and c['strength'] < 0.85: continue                    # rule 4: breathing room
        if kind == 'cut' and (c['strength'] < 0.3 or rng.random() < 0.7): continue         # cuts are weak: only now and then
        if kind == last_kind:                                                               # rule 4: not the same twice in a row
            alt = {'shake': 'nod', 'nod': 'tilt', 'laugh': 'nod', 'gasp': 'shake', 'tilt': 'nod', 'sympathy': 'nod', 'startle': 'gasp'}.get(kind)
            if not alt or c['strength'] < 0.6: continue
            kind = alt
        d = DUR.get(kind, 1.5)
        if not free(t0, t0 + d): continue
        recent = [m for m in mood if t0 - m[0] < 20 and m[1] == kind]                       # the repeat of a mood gets a little bigger
        amp = min(1.0, 0.55 + 0.4 * c['strength'] + 0.12 * len(recent))
        chosen.append(dict(t0=round(t0, 3), t1=round(t0 + d, 3), kind=kind, face=rng.choice(FACE.get(kind, ['neutral'])), amp=round(amp, 2), why=c['text'], auto=True))
        mood.append((t0, kind)); last_end = t0 + d; last_kind = kind
    out = list(chosen)
    if glances:                                                                              # rule 5: silent looks at the camera
        t = rng.uniform(5.0, 8.0)
        while t < total - 1.5:
            d = rng.uniform(0.75, 1.3); prev = [c for c in chosen if c['t1'] <= t and t - c['t1'] < 4]
            ok = free(t, t + d) and not any(c['t0'] - 0.3 < t + d and c['t1'] + 0.1 > t for c in chosen)
            if ok:
                k = prev[-1]['kind'] if prev else None
                out.append(dict(t0=round(t, 3), t1=round(t + d, 3), kind='glance', face=rng.choice(GLANCE_FACE.get(k, GLANCE_FACE[None])), amp=1.0, why='looks at the camera', auto=True))
                t += d + rng.uniform(9, 17)
            else: t += 0.7
        for c in chosen:                                                                     # after a big moment, often a look to the camera
            if c['kind'] in ('gasp', 'shake', 'startle', 'laugh') and c['amp'] > 0.8 and rng.random() < 0.7:
                a = c['t1'] + 0.2; d = rng.uniform(0.8, 1.2)
                if free(a, a + d) and not any(o['kind'] == 'glance' and o['t0'] - 1 < a + d and o['t1'] + 1 > a for o in out):
                    out.append(dict(t0=round(a, 3), t1=round(a + d, 3), kind='glance', face=rng.choice(GLANCE_FACE.get(c['kind'], GLANCE_FACE[None])), amp=1.0, why='looks at the camera after a big moment', auto=True))
    return sorted(out, key=lambda r: r['t0'])

def forced_from_script(act, emo, t0, dur):
    kind = ACT_KIND.get(act, 'nod'); face = EMO_FACE.get(emo) or FACE.get(kind, ['neutral'])[0]
    return dict(t0=round(t0, 3), t1=round(t0 + dur, 3), kind=kind, face=face, amp=1.0, why='script', auto=False)

def cues_to_reacts(cues, segs, rng_seed=3):
    """Cues are written by the director (Claude) AFTER reading the clip's transcript, so they fit the meaning.
    cue = { "at": clip second, "kind": nod|shake|laugh|gasp|tilt|sympathy|facepalm|lean|glance, "face": optional face name, "dur": optional seconds }"""
    rng = random.Random(rng_seed); out = []
    for c in cues:
        ot = out_time(segs, c['at'])
        if ot is None:                                    # the clip is paused at that moment: use the start of that pause
            ot = next((o for k, a, b, o in segs if k == 'freeze' and abs(a - c['at']) < 0.05), None)
            if ot is None: continue
        kind = c['kind']; d = c.get('dur') or (rng.uniform(0.8, 1.3) if kind == 'glance' else DUR.get(kind, 1.5))
        face = c.get('face') or rng.choice((GLANCE_FACE.get(None) if kind == 'glance' else FACE.get(kind, ['neutral'])))
        t0 = ot + c.get('delay', rng.uniform(0.2, 0.4))
        out.append(dict(t0=round(t0, 3), t1=round(t0 + d, 3), kind=kind, face=face, amp=c.get('amp', 1.0), why=c.get('why', 'cue'), auto=False))
    return out
