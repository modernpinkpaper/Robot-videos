#!/bin/bash
# One-time setup for the human voices (Chatterbox). Works on a normal computer or a cloud session; no GPU needed (slower on CPU).
#   ./voices/setup_chatterbox.sh      then use:  export CHATTERBOX_PY="$(pwd)/voices/cbenv/bin/python"
set -e
cd "$(dirname "$0")"
command -v uv >/dev/null || pip install uv
uv venv --python 3.11 cbenv
source cbenv/bin/activate
uv pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu   # on a GPU machine, install the normal torch instead
uv pip install chatterbox-tts "setuptools<81"   # setuptools<81: the watermark library needs pkg_resources
echo "Model (about 3 GB) downloads the first time you speak a line."
echo "export CHATTERBOX_PY=\"$(pwd)/cbenv/bin/python\""
