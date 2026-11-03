#!/bin/bash
# OPTIONAL one-time setup, only needed to MAKE a new natural voice sample (voices/refs/<name>.wav). Videos do not need it: the samples are already in voices/refs/.
# Run AFTER ./setup_chatterbox.sh.   ./voices/setup_natural_refs.sh
set -e
cd "$(dirname "$0")"
PY=$(pwd)/cbenv/bin/python
uv pip install --python "$PY" kokoro soundfile praat-parselmouth librosa resemblyzer      # Kokoro = small open voice model (natural, expressive); parselmouth = measures a voice
V=$("$PY" -c "import spacy;print('.'.join(spacy.__version__.split('.')[:2]))")
uv pip install --python "$PY" "https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-${V}.0/en_core_web_sm-${V}.0-py3-none-any.whl"   # Kokoro needs this language helper
echo "Done. Make a sample:  $PY voices/make_natural_ref.py <name> <kokoro_voice>      (voices: af_heart af_sarah af_bella af_sky af_nicole bf_emma bf_isabella)"
