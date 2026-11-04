#!/bin/bash
# Renders the frames in 3 parallel jobs, then joins frames + audio into quran_calm.mp4.  Needs: node playwright, ffmpeg, a web server on :8766 from the repo root
#   cd <repo root> && python3 -m http.server 8766 &      then      videos/quran_calm/make_video.sh
set -e
cd "$(dirname "$0")"; HERE=$(pwd); ROOT=$(cd ../..; pwd)
python3 build_audio.py --notts
N=$(python3 -c "import json,math;print(math.ceil(json.load(open('work/timeline.json'))['total']*24))")
mkdir -p work/frames
JOBS=${JOBS:-3}; PER=$(( (N + JOBS - 1) / JOBS ))
for j in $(seq 0 $((JOBS-1))); do a=$((j*PER)); b=$(( (j+1)*PER )); [ $b -gt $N ] && b=$N; node render.js work/frames $a $b & done; wait
ffmpeg -v error -y -framerate 24 -i work/frames/f_%04d.jpg -i work/audio.wav -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -b:a 160k -shortest quran_calm.mp4
echo "done: $HERE/quran_calm.mp4 ($N frames)"
