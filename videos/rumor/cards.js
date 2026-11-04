// Info cards for "Stop a rumor". The Arabic is copied from the Uthmani Quran text (api.alquran.cloud, checked). The meanings in simple English are ours (not word for word).
export const CARDS = {
  copy: `<div class="num">COPY THIS</div><div class="ar word" style="font-size:70px">فَتَبَيَّنُوٓا۟</div><div class="tr">fa-tabayyanu</div><div class="mean">check it first</div><div class="tip">Say it before you share. A Quran word (Al-Hujurat 49:6).</div>`,
  recap: `<div class="num">THE LESSON</div><div class="head" style="margin:4px 0 8px">Check before you share.</div><div class="step"><b>1</b><span>EASY WAY</span></div><div class="body">Say <b>fa-tabayyanu</b> before you forward.</div><div class="num" style="margin-top:8px">TRY IT FOR 7 DAYS</div><div class="ar small">فَتَبَيَّنُوٓا۟ أَن تُصِيبُوا۟ قَوْمًۢا بِجَهَٰلَةٍۢ</div>`,
};

const qwords = (txt, a, b) => txt.split(' ').map((w, i, arr) => `<i data-f="${(a + (b - a) * i / arr.length).toFixed(3)}">${w}</i>`).join(' ');
export const PHONES = {
  post: `<div class="apphd"><b>Cousins \u{1F319}</b><small>12 people</small></div><div class="msgs">
    <div class="bub" data-f="0.03"><span class="nm">Hana</span>OMG did you see this?? \u{1F633}</div>
    <div class="shot" data-f="0.2"><div class="tag">\u{1F6A8} BREAKING</div><div class="hl">Layla FIRED for stealing at work!!</div><div class="sm">Forward to everyone before it gets deleted</div></div>
    <div class="bub" data-f="0.6"><span class="nm">Hana</span>Spread it \u{1F525}</div></div>`,
  sent: `<div class="apphd"><b>Forward to...</b></div><div class="msgs">
    <div class="row" data-f="0.04"><span class="av">\u{1F465}</span><div>Cousins \u{1F319}<small>Sent ✓✓</small></div></div>
    <div class="row" data-f="0.22"><span class="av">\u{1F485}</span><div>Work girls<small>Sent ✓✓</small></div></div>
    <div class="row" data-f="0.4"><span class="av">\u{1F3E0}</span><div>Family<small>Sent ✓✓</small></div></div>
    <div class="bub" data-f="0.7" style="margin-top:26px"><span class="nm">Layla</span>Who told you this?? That's NOT true \u{1F622}</div></div>`,
  quran: `<div class="qpage"><div class="qhd"><span>‹</span><b>Al-Hujurat · 49:6</b><span>⋯</span></div>
    <div class="qar" data-f="0.0"><mark>يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِن جَآءَكُمْ فَاسِقٌۢ بِنَبَإٍۢ <b class="key" data-f="0.45">فَتَبَيَّنُوٓا۟</b> أَن تُصِيبُوا۟ قَوْمًۢا بِجَهَٰلَةٍۢ فَتُصْبِحُوا۟ عَلَىٰ مَا فَعَلْتُمْ نَٰدِمِينَ</mark></div>
    <div class="qlab" data-f="0.05">SIMPLE MEANING</div><div class="qen">${qwords("If a wrongdoer brings you news, check it first. Or you might hurt people without knowing, and then regret it.", 0.12, 0.92)}</div></div>`,
  check: `<div class="apphd"><b>Layla \u{1F49B}</b><small>online</small></div><div class="msgs">
    <div class="bub out" data-f="0.08">Hey, I saw a post about you. Is it true?</div>
    <div class="bub" data-f="0.45"><span class="nm">Layla</span>No! Thank you for asking me \u{1F49B}</div>
    <div class="bigstep" data-f="0.75">✋ STOP → \u{1F50D} CHECK → ✅ SHARE</div></div>`,
};
