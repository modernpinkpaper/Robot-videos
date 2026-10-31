# THE FIT SHEET: one picture with a frame for every spoken line and every reaction, each labeled with what was said or done.
# LOOK AT IT before sending any video. For each cell ask: does the face, pose and head direction fit the words and the moment?
#   python3 tools/fit_sheet.py video.mp4 timeline.json out.jpg
# timeline.json can be: the reaction tool's work/reaction.json, a video's work/timeline.json, or a podcast epN.json (anything with "lines").
import sys, json, subprocess, os, textwrap
from PIL import Image, ImageDraw, ImageFont

def moments(D):
    out = []
    if 'talks' in D:                                                             # reaction video
        caps = D.get('caps', [])
        for t in D['talks']:
            txt = ' '.join(c['text'] for c in caps if c['t0'] >= t['v0'] - 0.05 and c['t1'] <= t['v1'] + 0.3)
            out.append(((t['v0'] + t['v1']) / 2, f"SAYS ({t.get('emo', '')}): {txt}"))
        for r in D.get('reacts', []):
            out.append(((r['t0'] + r['t1']) / 2, f"{r['kind'].upper()} {r.get('face', '')}  [{r.get('why', '')[:40]}]"))
    for l in D.get('lines', []):                                                 # story / skit / podcast / talk
        a = l.get('v0', l.get('start')); b = l.get('v1', l.get('end', a))
        if a is None: continue
        out.append(((a + (b or a)) / 2, f"{l.get('who', '')} ({l.get('emo', '')}): {l.get('text', '')}"))
    return sorted(out)

def main(video, tl, outp, cols=4, cap=16):
    ms = moments(json.load(open(tl)))
    if not ms: raise SystemExit('no moments found in ' + tl)
    if len(ms) > cap: ms = [ms[int(i * (len(ms) - 1) / (cap - 1))] for i in range(cap)]
    tw = 216; font = ImageFont.load_default()
    for fp in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'):
        if os.path.exists(fp): font = ImageFont.truetype(fp, 11); break
    cells = []
    for t, label in ms:
        tmp = outp + '.tmp.jpg'; subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', video, '-frames:v', '1', '-vf', f'scale={tw}:-1', tmp], check=True)
        cells.append((Image.open(tmp).copy(), f'{t:5.1f}s  ' + label)); os.remove(tmp)
    th = cells[0][0].height; lh = 74; rows = (len(cells) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * tw, rows * (th + lh)), (250, 247, 253)); d = ImageDraw.Draw(sheet)
    for i, (im, label) in enumerate(cells):
        x, y = (i % cols) * tw, (i // cols) * (th + lh); sheet.paste(im, (x, y))
        for k, line in enumerate(textwrap.wrap(label, 36)[:5]): d.text((x + 4, y + th + 3 + k * 13), line, fill=(40, 30, 70), font=font)
    sheet.save(outp, quality=88); print('fit sheet:', outp, f'({len(cells)} moments)')

if __name__ == '__main__': main(*sys.argv[1:4])
