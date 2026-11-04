"""ARABIC COVERAGE: does the spoken Arabic contain ALL the words, especially the END? (the normal Arabic score can say 0.93 while the voice drops the last words).
  voices/cbenv/bin/python -I tools/ar_cover.py <wav> "<expected arabic>"   or import cover(expected, heard)
Found with Dalia's Fatihah: verse 7 never said "wa lad-dallin". A take passes only when the whole text matches (>= 0.8) AND the tail (last 8 letters) matches (>= 0.6)."""
import re, sys, difflib
def norm(t):
    t = re.sub(r'[ً-ٰٟۖ-ۭـ]', '', t)
    t = re.sub(r'[آأإٱ]', 'ا', t).replace('ى', 'ي').replace('ة', 'ه')
    return re.sub(r'[^ء-ي]', '', t)
def cover(expected, heard):
    e, h = norm(expected), norm(heard); whole = difflib.SequenceMatcher(None, e, h).ratio()
    n = min(8, len(e)); tail = difflib.SequenceMatcher(None, e[-n:], h[-n:]).ratio()
    return whole, tail, (whole >= 0.8 and tail >= 0.6)
def hear(wav, model=None):
    from faster_whisper import WhisperModel
    m = model or WhisperModel('small', compute_type='int8'); segs, _ = m.transcribe(wav, language='ar', beam_size=5)
    return ' '.join(s.text.strip() for s in segs)
if __name__ == '__main__':
    h = hear(sys.argv[1]); print(h); print('whole %.2f tail %.2f %s' % cover(sys.argv[2], h)[:3] if False else cover(sys.argv[2], h))
