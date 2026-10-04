/* =====================================================================
   Wedding invitation (Kurdish Sorani, right-to-left) — embossed lace + pearls
   EDIT ONLY THE CONFIG BLOCK: names, date, venue, map, music and every text.
   ===================================================================== */
const CONFIG = {
  initials: "S&M",                    // signature on the clasp
  names: ["Sivan", "Maswa"],        // first name flies in from the left, second from the right
  eventDate: "2026-10-17T17:30:00",   // local time of the venue (ISO)
  music: {
    youtube: "-dTvseRSrbY",           // YouTube video id of the song ("Buke Delale"); "" to disable
    url: ""                           // or your own mp3 file (e.g. "music.mp3"); used instead of YouTube when set
  },
  venue: {
    name: "Royal Villa",
    address: "هەولێر - شەقامی ١٥٠م نزیک مەزرەعەی شێخ باز",
    city: "هەولێر",
    mapsUrl: "https://maps.google.com/?q=36.248325,44.114342",   // "Directions" button + tap on the map
    mapEmbedUrl: "https://maps.google.com/maps?q=36.248325,44.114342&z=16&output=embed" // live Google map image; "" = drawn map picture
  },
  months: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمموز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"],
  weekdays: ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "هەینی", "شەممە"],

  /* ---- All visible text ---- */
  text: {
    openInvite: "کردنەوەی بانگهێشتنامە",
    invite: "بانگهێشتنامە", occasion: "ئاهەنگی هاوسەرگیری",
    prev: "پێشوو", next: "دواتر",
    tapHint: "دەستی لێبدە بۆ لاپەڕەی دواتر",
    whenTitle: "ڕێکەوت و کات", hour: "کاتژمێر", countLine: "هەتا ڕۆژی بەختەوەری ماوە",
    days: "ڕۆژ", hours: "کاتژمێر", minutes: "خولەک", seconds: "چرکە", countDone: "ئەمڕۆ ڕۆژی بەختەوەرییە",
    venueTitle: "شوێنی ئاهەنگ", directions: "ڕێنمایی لە نەخشە", mapTap: "بۆ کردنەوە لە گووگڵ ماپس دەستی لێبدە",
    joinLine: "خۆشحاڵ دەبین بە ئامادەبوونی بەڕێزتان لە شیرینیەکەمان",
    welcomeTitle: "بەخێربێن",
    welcomeText: "هاتنتان جوانترین دیاریی ئەم ڕۆژەیە. بە دڵێکی پڕ لە خۆشەویستییەوە چاوەڕێتان دەکەین.",
    footThanks: "سوپاس بۆ ئامادەبوونتان لە ڕۆژی تایبەتی ئێمە"
  }
};

/* ===================================================================== */
const $ = s => document.querySelector(s);
const date = new Date(CONFIG.eventDate), TX = CONFIG.text;
const ar = v => String(v).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);          // Eastern Arabic digits

/* Lace, roses, corners, door lace and ornaments are pre-rendered images in /img (made by tools/bake.js),
   so the page never runs SVG lighting filters while you use it. */
const pearls = list => list.map(([x, y, r]) => `<circle cx="${+x + .7}" cy="${+y + 1.1}" r="${r}" fill="rgba(120,90,70,.32)"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#pearl)"/><circle cx="${x - r*.3}" cy="${y - r*.34}" r="${r*.26}" fill="#fff" opacity=".95"/>`).join("");

/* ---------- Page frame: raised double line, arch with ogee (inward-notched) shoulders ---------- */
function framePath(w, h, i, n) {
  const x0 = i, x1 = w - i, yb = h - i, rb = 16, r = (x1 - x0) / 2 - n, yk = i + r + 10, ys = yk + 48;
  return `M${x0 + rb} ${yb}L${x1 - rb} ${yb}Q${x1} ${yb} ${x1} ${yb - rb}L${x1} ${ys}` +
    `C${x1} ${ys - 22} ${x1 - n} ${ys - 14} ${x1 - n} ${yk}A${r} ${r} 0 0 0 ${x0 + n} ${yk}` +
    `C${x0 + n} ${ys - 14} ${x0} ${ys - 22} ${x0} ${ys}L${x0} ${yb - rb}Q${x0} ${yb} ${x0 + rb} ${yb}Z`;
}
let frameKey = "";
function drawFrames() {                      /* the embossed frame is drawn once into a bitmap and shared by every page */
  const st = document.querySelector(".stage"), w = st.clientWidth, h = st.clientHeight; if (!w || frameKey === w + "x" + h) return;
  frameKey = w + "x" + h;
  const EF = 'filter="url(#emboss)"';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${document.getElementById("emboss").outerHTML}<radialGradient id="face" cx="50%" cy="20%" r="90%"><stop offset="0" stop-color="#FBF7F1"/><stop offset="1" stop-color="#F2EADF"/></radialGradient></defs>` +
    `<path d="${framePath(w, h, 8, 26)}" fill="url(#face)" opacity=".7"/>` +
    `<path d="${framePath(w, h, 10, 26)}" fill="none" stroke="#F4ECE4" stroke-width="9" stroke-linejoin="round" ${EF}/>` +
    `<path d="${framePath(w, h, 24, 24)}" fill="none" stroke="#F4ECE4" stroke-width="3" stroke-linejoin="round" ${EF}/>` +
    `<path d="${framePath(w, h, 19, 25)}" fill="none" stroke="rgba(201,174,133,.7)" stroke-width=".7" stroke-linejoin="round"/></svg>`;
  const img = new Image();
  img.onload = () => {
    const k = Math.min(window.devicePixelRatio || 1, 2), cv = document.createElement("canvas"); cv.width = w * k; cv.height = h * k;
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
    cv.toBlob(b => { const url = URL.createObjectURL(b); document.querySelectorAll(".frame-bg").forEach(el => el.style.backgroundImage = `url(${url})`); });
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
const refresh = () => { allPearls(); drawFrames(); };

/* ---------------------------------------------------------------------
   Pearl rows: equal-spaced pearls along an arch outline or an oval.
   --------------------------------------------------------------------- */
function archPoly(w, h, i, rb) {
  const R = (w - 2*i) / 2, cx = w / 2, cy = i + R, p = [], S = 400;
  const seg = (a, b, n) => { for (let k = 0; k < n; k++) p.push([a[0] + (b[0]-a[0]) * k / n, a[1] + (b[1]-a[1]) * k / n]); };
  seg([i + rb, h - i], [w - i - rb, h - i], S/4);
  for (let k = 0; k < S/8; k++) { const t = Math.PI/2 * (1 - k / (S/8)); p.push([w - i - rb + Math.cos(t) * rb, h - i - rb + Math.sin(t) * rb]); }
  seg([w - i, h - i - rb], [w - i, cy], S/2);
  for (let k = 0; k < S; k++) { const t = Math.PI * k / S; p.push([cx + R * Math.cos(t), cy - R * Math.sin(t)]); }
  seg([i, cy], [i, h - i - rb], S/2);
  for (let k = 0; k < S/8; k++) { const t = Math.PI - Math.PI/2 * k / (S/8); p.push([i + rb + Math.cos(t) * rb, h - i - rb + Math.sin(t) * rb]); }
  return p;
}
function ovalPoly(w, h, i) { const p = [], rx = w/2 - i, ry = h/2 - i; for (let k = 0; k < 360; k++) { const t = k * Math.PI / 180; p.push([w/2 + rx * Math.cos(t), h/2 + ry * Math.sin(t)]); } return p; }
function spaced(poly, gap) {
  const cum = [0]; for (let k = 1; k <= poly.length; k++) { const a = poly[k - 1], b = poly[k % poly.length]; cum.push(cum[k - 1] + Math.hypot(b[0]-a[0], b[1]-a[1])); }
  const L = cum[poly.length], n = Math.max(8, Math.round(L / gap)), out = []; let j = 1;
  for (let k = 0; k < n; k++) { const t = k * L / n; while (cum[j] < t) j++;
    const a = poly[j - 1], b = poly[j % poly.length], f = (t - cum[j-1]) / ((cum[j] - cum[j-1]) || 1); out.push([a[0] + (b[0]-a[0]) * f, a[1] + (b[1]-a[1]) * f]); }
  return out;
}
function placePearls(el) {
  const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
  const d = el.dataset, inset = +d.inset || 8, r = +d.r || 2, gap = +d.gap || 9;
  const poly = d.pearls === "arch" ? archPoly(w, h, inset, +d.rb || 14) : ovalPoly(w, h, inset);
  const list = spaced(poly, gap).map(([x, y]) => [x.toFixed(1), y.toFixed(1), r]);
  let svg = el.querySelector(":scope > svg.pearls");
  if (!svg) { svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("class", "pearls"); svg.setAttribute("aria-hidden", "true"); el.prepend(svg); }
  svg.setAttribute("width", w); svg.setAttribute("height", h); svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.innerHTML = pearls(list);
}
const allPearls = () => document.querySelectorAll("[data-pearls]").forEach(placePearls);

/* ---------- Music: your mp3, else the YouTube song, else a soft built-in melody; fades in ---------- */
const music = (() => {
  let ctx, master, audio, yt, on = false, fade;
  const notes = [392, 494, 587, 523, 440, 523, 659, 587, 392, 494, 587, 784, 659, 587, 523, 494];
  const setMuted = m => $("#muteBtn").classList.toggle("muted", m);
  function synth() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(.55, ctx.currentTime + 3.5);   // fade in
    let i = 0;
    const play = () => { const f = notes[i++ % notes.length], t = ctx.currentTime;
      [f, f / 2].forEach((fr, k) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = fr;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(k ? .05 : .09, t + .04); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8);
        o.connect(g).connect(master); o.start(t); o.stop(t + 1.9); }); };
    play(); setInterval(play, 700);
  }
  function ramp(set, max) { let v = 0; clearInterval(fade); fade = setInterval(() => { v = Math.min(max, v + 3); set(v); if (v >= max) clearInterval(fade); }, 120); }
  function youtube(id) {                       // YouTube's own embedded player (needs internet + https); falls back to the soft melody
    let done = false; const fallback = () => { if (!done) { done = true; if (on) synth(); } };
    const make = () => {
      const box = document.createElement("div"); box.id = "ytp"; box.style.cssText = "position:fixed;width:2px;height:2px;left:-20px;top:0;opacity:0;pointer-events:none"; document.body.appendChild(box);
      yt = new YT.Player("ytp", { width: "2", height: "2", videoId: id, playerVars: { autoplay: 1, loop: 1, playlist: id, controls: 0, playsinline: 1, rel: 0 },
        events: { onReady: e => { e.target.setVolume(0); e.target.playVideo(); done = true; ramp(v => e.target.setVolume(v), 70); }, onError: fallback } });
    };
    if (window.YT && YT.Player) make();
    else { window.onYouTubeIframeAPIReady = make; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; s.onerror = fallback; document.head.appendChild(s); setTimeout(fallback, 5000); }
  }
  return {
    start() { try {
      on = true;
      if (CONFIG.music.url) { audio = audio || Object.assign(new Audio(CONFIG.music.url), { loop: true, volume: 0 }); audio.play().catch(() => {}); ramp(v => audio.volume = v / 100, 70); }
      else if (CONFIG.music.youtube) youtube(CONFIG.music.youtube);
      else synth();
      setMuted(false); } catch (e) {} },
    toggle() { on = !on;
      if (audio) on ? audio.play() : audio.pause();
      if (yt && yt.playVideo) on ? yt.playVideo() : yt.pauseVideo();
      if (ctx) on ? ctx.resume() : ctx.suspend();
      setMuted(!on); }
  };
})();

/* ---------- Text ---------- */
function fillText() {
  document.querySelectorAll("[data-t]").forEach(el => el.textContent = TX[el.dataset.t]);
  const [a, b] = CONFIG.names, d = date.getDate(), m = ar(date.getMonth() + 1), y = date.getFullYear(), wd = CONFIG.weekdays[date.getDay()];
  const H = date.getHours(), mi = date.getMinutes(), part = H < 12 ? "بەیانی" : H < 17 ? "دوای نیوەڕۆ" : H < 21 ? "ئێوارە" : "شەو";
  const hm = ar(`${H % 12 || 12}:${String(mi).padStart(2, "0")}`) + "ی " + part;       // e.g. ٧:٠٠ی ئێوارە
  $("#sig").textContent = CONFIG.initials;
  $("#name1").textContent = a;
  $("#name2").textContent = b;
  $("#heroDate").textContent = `${wd} ${ar(d)}/${m}/${ar(y)}`;
  $("#introDate").textContent = `${ar(d)}/${m}/${ar(y)} · ${hm}`;
  $("#iDate").textContent = `${wd}\n${ar(d)}/${ar(date.getMonth() + 1)}/${ar(y)}`;
  $("#iPlace").textContent = `${CONFIG.venue.name}\n${CONFIG.venue.city}`;
  $("#iTime").textContent = `${TX.hour}\n${hm}`;
  $("#vName").textContent = CONFIG.venue.name; $("#vAddress").textContent = CONFIG.venue.address;
  $("#directions").href = CONFIG.venue.mapsUrl; $("#mapHit").href = CONFIG.venue.mapsUrl;
  if (CONFIG.venue.mapEmbedUrl) {            // live Google map picture; if Google Maps can't be reached the drawn map stays
    const f = $("#mapFrame"), ctl = new AbortController(); setTimeout(() => ctl.abort(), 4000);
    fetch(CONFIG.venue.mapEmbedUrl, { mode: "no-cors", signal: ctl.signal }).then(() => { f.src = CONFIG.venue.mapEmbedUrl; f.hidden = false; }).catch(() => {});
  }
  document.title = `${a} & ${b}`;
}

/* ---------- Countdown ---------- */
function tick() {
  const s = Math.max(0, Math.floor((date - Date.now()) / 1000)), p = n => ar(String(n).padStart(2, "0"));
  $("#cd-d").textContent = p(Math.floor(s / 86400)); $("#cd-h").textContent = p(Math.floor(s % 86400 / 3600));
  $("#cd-m").textContent = p(Math.floor(s % 3600 / 60)); $("#cd-s").textContent = p(s % 60);
  if (!s) document.querySelector('[data-t="countLine"]').textContent = TX.countDone;
}

/* ---------- Pages: one Next / Previous control ---------- */
const pages = [...document.querySelectorAll(".page")], prevBtn = $("#prevBtn"), nextBtn = $("#nextBtn");
let cur = 0, tappedOnce = false;
function showHint() {
  const h = $("#hint");
  if (cur !== 0 || tappedOnce || !document.body.classList.contains("open")) { h.classList.remove("show"); return; }
  const r = nextBtn.getBoundingClientRect(); h.style.left = (r.left + r.width / 2) + "px"; h.classList.add("show");
}
function go(n) {
  if (n < 0 || n >= pages.length || n === cur) return;
  cur = n; tappedOnce = true;
  pages.forEach((p, i) => { p.dataset.pos = i < cur ? "before" : i > cur ? "after" : "active"; p.style.setProperty("--d", ".35s"); });
  prevBtn.hidden = cur === 0; nextBtn.hidden = cur === pages.length - 1;
  showHint();
}
pages.forEach((p, i) => p.dataset.pos = i ? "after" : "active");
prevBtn.hidden = true;
prevBtn.onclick = () => go(cur - 1); nextBtn.onclick = () => go(cur + 1);
/* swipe + keys (RTL: swipe right → next page) */
let sx = null;
addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 55) go(cur + (dx > 0 ? 1 : -1)); });
addEventListener("keydown", e => { if (e.key === "ArrowLeft") go(cur + 1); if (e.key === "ArrowRight") go(cur - 1); });

/* paint every page once, invisibly, behind the closed doors so the first page change is already smooth */
function warmPages() {
  pages.slice(1).forEach(p => p.classList.add("warm"));
  requestAnimationFrame(() => requestAnimationFrame(() => pages.forEach(p => p.classList.remove("warm"))));
}

/* ---------- Init ---------- */
fillText(); tick();
document.querySelectorAll("img").forEach(i => i.decode && i.decode().catch(() => {}));   // decode every picture up front so page changes never stall setInterval(tick, 1000);
requestAnimationFrame(refresh);
let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { refresh(); showHint(); }, 120); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
setTimeout(warmPages, 900);
$("#muteBtn").onclick = () => music.toggle();
let opened = false;
function openInvitation() {
  if (opened) return; opened = true;
  $("#seal").classList.add("go"); music.start();                                   // clasp glows and fades, music fades in
  pages[0].style.setProperty("--d", "1.1s");                                       // names arrive once the doors are apart
  setTimeout(() => { document.body.classList.add("open"); }, 650);                 // panels slide apart
  setTimeout(() => { showHint(); }, 4600);                                          // tap tip appears after the first page has settled
  setTimeout(() => { document.body.classList.remove("locked"); }, 2300);
  setTimeout(() => { document.body.classList.add("done"); }, 2600);                 // doors are gone: stop rendering them
}
$("#seal").onclick = openInvitation; $("#openInvite").onclick = openInvitation;
