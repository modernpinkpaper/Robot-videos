"""ARABIC SOURCE CHECK: every Arabic word or phrase SHOWN on a card must be a piece of the Quran text (Uthmani, api.alquran.cloud) of the verses you cite.
  python3 tools/arabic_source_check.py videos/<name>/cards.js 49:6 94:5 94:6 ...      (list the verse references the video uses)
Why: typing marks by hand gives a different mark order (found in "Stop a rumor": the key word did not match). Copy from the source; this check proves it.
Spoken text in plan.py is not checked here (it is only for the voice, not shown)."""
import re, sys, json, unicodedata, urllib.request
NF = lambda t: unicodedata.normalize('NFC', t)   # marks typed in another ORDER look the same on screen: compare in the standard normal form
path, refs = sys.argv[1], sys.argv[2:]
src = ''
for r in refs:
    d = json.load(urllib.request.urlopen(f'https://api.alquran.cloud/v1/ayah/{r}/quran-uthmani'))
    src += ' ' + d['data']['text'].lstrip('﻿')
src = NF(re.sub(r'\s+', ' ', src))
txt = open(path, encoding='utf-8').read(); bad = 0
for run in re.findall(r'[؀-ۿݐ-ݿﭐ-﷿][؀-ۿݐ-ݿﭐ-﷿ ]*[؀-ۿݐ-ݿﭐ-﷿]|[؀-ۿ]', txt):
    run = re.sub(r'[\uFD3E\uFD3F\u0660-\u0669]', '', run); run = re.sub(r' +', ' ', run).strip()   # verse-number ornaments are decoration, not text
    if len(run) < 2 or re.fullmatch(r'[٠-٩۝۞ ]+', run): continue
    ok = NF(run) in src
    if not ok: bad += 1
    print(('OK   ' if ok else 'NOT IN SOURCE  ') + run)
print('all shown Arabic is in the Quran source' if not bad else f'{bad} item(s) NOT found in the source: copy them from the text, do not type them')
sys.exit(1 if bad else 0)
