# Makes a NATURAL voice sample for a character: voices/refs/<name>.wav (24 kHz mono, about 15 s). Chatterbox copies this sample, so a natural,
# expressive sample gives a natural voice (the old samples were made with Piper, a robot-style engine, and every line copied its flat delivery).
#   voices/cbenv/bin/python voices/make_natural_ref.py amina af_heart                  writes voices/refs/amina.wav
#   voices/cbenv/bin/python voices/make_natural_ref.py dalia af_sarah --out /tmp/x.wav  write somewhere else to AUDITION first (do not replace the real sample until Dalia picks)
# Options: --speed 1.0 (0.9 = calmer)   --text expressive|calm   --out path
# Then: measure it (voices/measure_voice.py), make the same 4 lines with each candidate (see voices/README.md, "How to choose a voice") and let Dalia LISTEN and pick.
# Needs ./voices/setup_natural_refs.sh once. Kokoro voices are free (Apache 2.0). Never use a real person's voice without their permission.
import sys, os, numpy as np, soundfile as sf
TEXTS = {
    # lively: questions, emphasis and softer moments, so the sample has a wide melody (Chatterbox copies the style of the sample)
    'expressive': "Oh, I know that feeling. Really, I do! Have you ever just sat there, and wondered why everything felt a little quiet inside? It's okay. Truly. Let me tell you something that changed how I see my days. It's small, and it's kind, and it's yours.",
    'calm': "Hey, come sit with me for a minute. You don't have to be perfect to begin. Take a slow breath. Whatever you're carrying, it's okay to set it down for a moment. We'll go one small step at a time, and I'll be right here.",
}
def main():
    a = sys.argv[1:]
    if len(a) < 2: raise SystemExit(__doc__)
    name, voice = a[0], a[1]; speed = float(a[a.index('--speed') + 1]) if '--speed' in a else 1.0
    text = TEXTS[a[a.index('--text') + 1]] if '--text' in a else TEXTS['expressive']
    out = a[a.index('--out') + 1] if '--out' in a else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'refs', name + '.wav')
    from kokoro import KPipeline
    parts = [np.asarray(x) for _, _, x in KPipeline(lang_code=voice[0])(text, voice=voice, speed=speed)]
    y = np.concatenate(parts); sf.write(out, y, 24000); print(f'made {out} ({len(y) / 24000:.1f} s, voice {voice}, speed {speed})')
if __name__ == '__main__': main()
