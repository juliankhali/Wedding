/* =====================================================================
   بانگهێشتنامەی ئاهەنگی گواستنەوە
   EDIT ONLY THIS BLOCK — every name, date, place, text, link and picture.
   ===================================================================== */
const CONFIG = {
  // Couple (groom first, like the reference)
  groom: "ئارام",
  bride: "شیلان",
  initials: "S&A", // written on the wax seal (Latin letters)

  // Cover text (a new line splits it into two lines)
  coverLead: "بە خۆشحاڵییەوە بانگهێشتتان دەکەین\nبۆ ئاهەنگی گواستنەوەی",

  // Date and time of the party (venue's local time)
  eventDate: "2026-10-15T16:30:00",
  eventHours: 7, // length, used for "save the date"

  // Ar-Rum 30:21
  verse: [
    "﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا",
    "لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾",
  ],

  // Welcome letter
  letter: {
    heading: "ئازیزان و خۆشەویستانمان",
    p1: "بە دڵێکی پڕ لە خۆشی، ئامادەبوونتان بە جوانترین دیاری ئەم ڕۆژە دەزانین. هاتنتان ئاهەنگەکەمان جوانتر و خۆشتر دەکات.",
    p2: "پێشوەختە سوپاستان دەکەین بۆ هەموو ئەو خۆشەویستییەی کە پێمان دەبەخشن، و هیوادارین شەوێکی لەبیرنەکراومان پێکەوە هەبێت.",
  },

  // Program (times are shown with Eastern Arabic digits)
  timeline: [
    { time: "16:30", text: "دەستپێکی ئاهەنگ" },
    { time: "18:00", text: "کاتی وێنەگرتن لەگەڵ بووک و زاوا" },
    { time: "20:00", text: "نانی ئێوارە" },
    { time: "21:00", text: "بەردەوامی ئاهەنگەکە" },
    { time: "23:00", text: "کۆتایی ئاهەنگەکە" },
  ],

  // Place
  venue: {
    name: "هۆڵی ڕۆتانا",
    address: "شەقامی ١٠٠ مەتری، هەولێر",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Erbil+Rotana+Hotel",
    embedUrl: "https://maps.google.com/maps?q=Erbil+Rotana+Hotel&z=15&output=embed",
  },

  // Dress code
  dress: {
    text: "بۆ ڕازاندنەوەی زیاتری شەوەکەمان، تکایە بە پۆشاکی فەرمی و ڕێک و پێک ئامادەبن، بۆ ئەوەی هەموومان شەوێکی جوان و لەبیرنەکراو بژین.",
    colors: ["#1b1b1f", "#f3ecdc", "#e6b422", "#a9c1ea", "#2d4db3"], // black, ivory, gold, light blue, royal blue
  },

  // WhatsApp confirmation (number in international format, digits only)
  whatsapp: {
    number: "9647500000000",
    message: "سڵاو 🌸 بە خۆشحاڵییەوە دڵنیاتان دەکەمەوە کە لە ئاهەنگی گواستنەوەی ئارام و شیلان ئامادە دەبم.",
  },

  closing: "لەگەڵ سوپاسی بێ پایان بۆ هەموو ئەو کەسانەی کە لەم ڕۆژە تایبەتەدا هاوبەشی خۆشییەکانمان دەبن. ئامادەبوونتان دەرگای خۆشحاڵییەکانمان زیاتر دەکاتەوە.",

  // Music: "Perfect" by Ed Sheeran, streamed from YouTube (the video id is the part after
  // youtu.be/). The song is copyrighted, so no copy is stored here. Order of use: your own
  // mp3 (assets/perfect.mp3) → YouTube → a soft piano waltz if neither is available.
  song: {
    title: "Perfect", artist: "Ed Sheeran",
    youtube: "2Vv-BfVoq4g",         // plays through YouTube's own embedded player (needs internet)
    file: "assets/perfect.mp3",     // optional: your own mp3; when present it is used instead of YouTube
  },

  // Pictures. A missing file is replaced by drawn artwork.
  images: {
    envelope: "assets/envelope.jpg", // ivory embossed envelope, portrait 9:16
    seal: "assets/seal.jpg",         // cream wax seal with a gold rim and a blank centre (initials are written on it)
    clouds: "assets/clouds.png",     // pastel watercolor clouds, transparent
    cover: "assets/cover.jpg",       // painted arch + lake, portrait 9:16
    couple: "assets/couple.jpg",     // bride & groom illustration
    photo: "assets/photo.jpg",       // real couple photo (closing)
  },
};

/* ===================================================================== */
(() => {
  const C = CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ar = (v) => String(v).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]); // Eastern Arabic digits
  const pad2 = (n) => String(n).padStart(2, "0");
  const start = new Date(C.eventDate);
  // Make sure the page is right-to-left Kurdish and locked until the envelope opens
  document.documentElement.lang = "ckb"; document.documentElement.dir = "rtl"; document.body.classList.add("locked");

  /* ---------- helpers ---------- */
  const imageOk = (src) => new Promise((res) => { if (!src) return res(false); const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = src; });
  const asBg = (el, src) => { el.style.backgroundImage = `url("${src}")`; };
  async function rasterize(svg, w, h) {
    const url = ART.uri(svg);
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      cv.getContext("2d").drawImage(img, 0, 0, w, h);
      return await new Promise((res) => cv.toBlob((b) => res(b ? URL.createObjectURL(b) : url), "image/jpeg", 0.92));
    } catch { return url; }
  }

  /* ---------- fill the page from CONFIG ---------- */
  const [g, b] = [C.groom, C.bride];
  document.title = `${g} و ${b} · بانگهێشتنامە`;
  $("#cover-lead").textContent = C.coverLead;
  $("#name1").textContent = g;
  $("#name2").textContent = b;
  $("#verse-text").innerHTML = C.verse.map(esc).join("<br>");
  $("#lt-h").textContent = C.letter.heading;
  $("#lt-p1").textContent = C.letter.p1;
  $("#lt-p2").textContent = C.letter.p2;
  $("#loc-name").textContent = C.venue.name;
  $("#loc-addr").textContent = C.venue.address;
  $("#map-btn").href = C.venue.mapsUrl;
  $("#dress-text").textContent = C.dress.text;
  $("#sw").innerHTML = C.dress.colors.map((c) => `<i style="background:${esc(c)}"></i>`).join("");
  $("#close-text").textContent = C.closing;
  $("#wa-btn").href = `https://wa.me/${C.whatsapp.number}?text=${encodeURIComponent(C.whatsapp.message)}`;

  $("#tl").innerHTML = C.timeline.map((t, i) =>
    `<li class="rv" style="--d:${(i * 0.08).toFixed(2)}s"><div class="it"><b>${ar(esc(t.time))}</b><span>${esc(t.text)}</span></div></li>`).join("");

  /* ---------- calendar (week starts on Saturday) ---------- */
  (function calendar() {
    const y = start.getFullYear(), m = start.getMonth();
    $("#cal-title").textContent = `مانگی ${ar(m + 1)}ی ${ar(y)}`;
    const heads = ["ش", "ی", "د", "س", "چ", "پ", "ھ"]; // Sat … Fri
    const offset = (new Date(y, m, 1).getDay() + 1) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    let html = heads.map((h) => `<i>${h}</i>`).join("") + "<b></b>".repeat(offset);
    for (let d = 1; d <= days; d++) html += `<b${d === start.getDate() ? ' class="on"' : ""}>${ar(d)}</b>`;
    $("#cal-grid").innerHTML = html;

    const gd = (d) => `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
    const end = new Date(start.getTime() + C.eventHours * 3600e3);
    $("#cal-btn").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(`${g} و ${b} · ئاهەنگی گواستنەوە`)}&dates=${gd(start)}/${gd(end)}` +
      `&location=${encodeURIComponent(`${C.venue.name}، ${C.venue.address}`)}&details=${encodeURIComponent(C.venue.mapsUrl)}`;
  })();

  /* ---------- countdown ---------- */
  function tick() {
    const s = Math.max(0, Math.floor((start - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    $$("#cd b").forEach((el) => { const t = ar(pad2(v[el.dataset.u])); if (el.textContent !== t) el.textContent = t; });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- map ---------- */
  $("#map").innerHTML = window.NO_EMBED
    ? `<a class="map__fallback" href="${esc(C.venue.mapsUrl)}" target="_blank" rel="noopener"><span>نەخشە</span></a>`
    : `<iframe title="نەخشە" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${esc(C.venue.embedUrl)}"></iframe>`;

  /* ---------- pictures (real files win; drawn art is the fallback) ---------- */
  (async function pictures() {
    const I = C.images;
    const [hasEnv, hasSeal, hasCover, hasCouple, hasPhoto, hasClouds] = await Promise.all([I.envelope, I.seal, I.cover, I.couple, I.photo, I.clouds].map(imageOk));
    // envelope
    const envUrl = hasEnv ? I.envelope : await rasterize(ART.envelopeSVG(), 1080, 1920);
    document.documentElement.style.setProperty("--envimg", `url("${envUrl}")`);
    // seal
    if (hasSeal) { $("#seal").classList.add("pic"); $("#seal").innerHTML = `<img src="${esc(I.seal)}" alt="" /><span class="seal__ini" dir="ltr">${esc(C.initials)}</span>`; }
    else $("#seal").innerHTML = ART.sealSVG(esc(C.initials));
    // watercolor clouds (picture) instead of the drawn ones
    if (hasClouds) { document.documentElement.style.setProperty("--cloudimg", `url("${I.clouds}")`); document.body.classList.add("cloud-photo"); }
    // cover / couple / photo
    const coverUrl = hasCover ? I.cover : ART.uri(ART.coverSVG());
    asBg($("#cover-img"), coverUrl);
    asBg($("#couple"), hasCouple ? I.couple : ART.uri(ART.coupleSVG()));
    asBg($("#photo"), hasPhoto ? I.photo : coverUrl);
  })();

  /* =====================================================================
     SOUND: seal crack, paper, a soft chime, and the music
     ===================================================================== */
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx, sfxBus, musicBus, noiseBuf, reverb;
  function audioInit() {
    if (ctx || !AC) return;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor(); comp.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.8; sfxBus.connect(comp);
    musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(comp);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const len = ctx.sampleRate * 3, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3.2; }
    reverb = ctx.createConvolver(); reverb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.4; reverb.connect(wet).connect(musicBus);
  }
  function noise(at, dur, { type = "bandpass", freq = 2000, q = 1, gain = 0.3, curve } = {}) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = freq; fl.Q.value = q;
    const gn = ctx.createGain();
    if (curve) { gn.gain.setValueAtTime(0, at); gn.gain.setValueCurveAtTime(curve.map((v) => v * gain), at, dur); }
    else { gn.gain.setValueAtTime(gain, at); gn.gain.exponentialRampToValueAtTime(0.0001, at + dur); }
    s.connect(fl).connect(gn).connect(sfxBus); s.start(at, Math.random()); s.stop(at + dur + 0.05);
  }
  const sfx = {
    crack() {
      if (!ctx) return; const n = ctx.currentTime;
      [0, 0.03, 0.08].forEach((o, i) => noise(n + o, 0.05, { type: "highpass", freq: 1800 + i * 700, gain: 0.45 - i * 0.1 }));
      const o = ctx.createOscillator(), gn = ctx.createGain();
      o.frequency.setValueAtTime(130, n); o.frequency.exponentialRampToValueAtTime(45, n + 0.12);
      gn.gain.setValueAtTime(0.28, n); gn.gain.exponentialRampToValueAtTime(0.0001, n + 0.16);
      o.connect(gn).connect(sfxBus); o.start(n); o.stop(n + 0.2);
    },
    paper(dur, gain) {
      if (!ctx) return;
      const pts = 40, curve = new Float32Array(pts);
      for (let i = 0; i < pts; i++) curve[i] = Math.sin(Math.PI * (i / (pts - 1))) ** 0.8 * (0.5 + 0.5 * Math.random());
      noise(ctx.currentTime, dur, { freq: 2400, q: 0.6, gain, curve });
      noise(ctx.currentTime, dur, { type: "lowpass", freq: 800, q: 0.4, gain: gain * 0.6, curve });
    },
    chime() {
      if (!ctx) return; const n = ctx.currentTime;
      [659.25, 830.61, 987.77, 1318.5].forEach((f, i) => {
        const o = ctx.createOscillator(), gn = ctx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        gn.gain.setValueAtTime(0, n + i * 0.11); gn.gain.linearRampToValueAtTime(0.12, n + i * 0.11 + 0.01); gn.gain.exponentialRampToValueAtTime(0.0001, n + i * 0.11 + 1.6);
        o.connect(gn); gn.connect(sfxBus); gn.connect(reverb); o.start(n + i * 0.11); o.stop(n + i * 0.11 + 1.7);
      });
    },
  };

  /* music: assets/music.mp3, or an original piano waltz */
  const audio = $("#audio"), musicBtn = $("#music");
  let songOk = false, usingPiano = false, playing = false, muted = false;
  if (C.song.file) { audio.src = C.song.file; audio.addEventListener("canplay", () => { songOk = true; }, { once: true }); audio.addEventListener("error", () => { songOk = false; }); }
  // A small caption: the song name while it plays, or a hint to add the file while the piano stands in
  const songTag = $("#addsong"), songTagText = $("#addsong-t");
  function showSongName() {
    songTagText.textContent = `${C.song.title} · ${C.song.artist}`; songTag.classList.add("static"); songTag.hidden = false;
    setTimeout(() => { songTag.hidden = true; }, 6500);
  }

  /* YouTube: a hidden official embedded player, prepared at page load so that the tap on the
     seal can start it (phones only allow sound that starts from a tap). */
  const yt = { player: null, ready: false, failed: !C.song.youtube || !!window.NO_EMBED || location.protocol === "file:", using: false };
  function prepareYouTube() {
    if (yt.failed) return;
    const host = document.createElement("div");
    host.id = "yt";
    host.style.cssText = "position:fixed;left:-500px;top:0;width:220px;height:220px;opacity:.01;pointer-events:none;z-index:-1";
    host.innerHTML = '<div id="yt-player"></div>';
    document.body.appendChild(host);
    const make = () => {
      try {
        yt.player = new YT.Player("yt-player", {
          videoId: C.song.youtube, width: 220, height: 220,
          playerVars: { controls: 0, disablekb: 1, fs: 0, modestbranding: 1, playsinline: 1, rel: 0, loop: 1, playlist: C.song.youtube, origin: location.origin },
          events: {
            onReady: () => { yt.ready = true; },
            onError: () => { yt.failed = true; if (yt.using) { yt.using = false; startPiano(); } },
            onStateChange: (e) => { if (e.data === 1) yt.playing = true; },
          },
        });
      } catch { yt.failed = true; }
    };
    if (window.YT && YT.Player) make();
    else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); make(); };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api"; tag.async = true; tag.onerror = () => { yt.failed = true; };
      document.head.appendChild(tag);
    }
  }
  let ytFade = 0;
  function ytVolume(to, ms, done) {
    cancelAnimationFrame(ytFade);
    let from = 0; try { from = yt.player.getVolume(); } catch { /* not ready */ }
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      try { yt.player.setVolume(Math.round(from + (to - from) * k)); } catch { /* ignore */ }
      k < 1 ? (ytFade = requestAnimationFrame(step)) : done?.();
    };
    ytFade = requestAnimationFrame(step);
  }
  // Called from the tap: start the prepared player and wait a moment for it to really play.
  function playYouTube() {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function go() {
        if (yt.failed) return reject(new Error("youtube unavailable"));
        if (!yt.ready) return Date.now() - t0 > 4500 ? reject(new Error("youtube slow")) : setTimeout(go, 150);
        try { yt.player.setVolume(0); yt.player.playVideo(); } catch { return reject(new Error("youtube error")); }
        const check = () => (yt.playing ? resolve() : Date.now() - t0 > 6500 ? reject(new Error("youtube blocked")) : setTimeout(check, 200));
        check();
      })();
    });
  }
  prepareYouTube();

  const piano = (() => {
    const beat = 60 / 76, m = (n) => 440 * 2 ** ((n - 69) / 12);
    const CH = { D: [50, [62, 66, 69]], Bm: [47, [62, 66, 71]], G: [43, [62, 67, 71]], A: [45, [61, 64, 69]], Em: [52, [64, 67, 71]] };
    const prog = ["D", "Bm", "G", "A", "D", "Bm", "Em", "A", "D", "Bm", "G", "A", "G", "A", "D", "D"];
    const mel = [
      [[0, 78, 2], [2, 76, 1]], [[0, 74, 2], [2, 73, 1]], [[0, 71, 1], [1, 74, 1], [2, 79, 1]], [[0, 78, 3]],
      [[0, 78, 1], [1, 81, 1], [2, 78, 1]], [[0, 76, 2], [2, 74, 1]], [[0, 76, 1], [1, 79, 1], [2, 83, 1]], [[0, 81, 2], [2, 79, 1]],
      [[0, 78, 2], [2, 81, 1]], [[0, 86, 2], [2, 83, 1]], [[0, 83, 1], [1, 79, 1], [2, 83, 1]], [[0, 81, 3]],
      [[0, 79, 1.5], [1.5, 78, 0.5], [2, 76, 1]], [[0, 76, 1], [1, 78, 1], [2, 73, 1]], [[0, 74, 3]], [],
    ];
    let bar = 0, next = 0, timer = 0, on = false;
    function note(midi, at, vel, len) {
      const out = ctx.createGain();
      out.gain.setValueAtTime(0, at); out.gain.linearRampToValueAtTime(vel, at + 0.008);
      out.gain.setTargetAtTime(vel * 0.35, at + 0.01, 0.35); out.gain.setTargetAtTime(0, at + len, 0.28);
      const lp = ctx.createBiquadFilter(); lp.frequency.value = 1400 + vel * 5000;
      [1, 2, 3, 4, 5].forEach((h, i) => {
        const o = ctx.createOscillator(), gn = ctx.createGain();
        o.frequency.value = m(midi) * h * (1 + 0.0003 * h * h);
        gn.gain.value = [1, 0.42, 0.2, 0.1, 0.05][i]; gn.gain.setTargetAtTime(0, at, 0.9 / h);
        o.connect(gn).connect(lp); o.start(at); o.stop(at + len + 1.6);
      });
      lp.connect(out); out.connect(musicBus); out.connect(reverb);
    }
    function loop() {
      while (next < ctx.currentTime + 0.4) {
        const [bass, tones] = CH[prog[bar]];
        note(bass, next, 0.32, beat * 2.6); note(bass + 12, next + 0.01, 0.12, beat * 2.4);
        [1, 2].forEach((bt) => tones.forEach((tn, k) => note(tn, next + bt * beat + k * 0.012, 0.085, beat * 0.9)));
        mel[bar].forEach(([bt, n, d]) => note(n, next + bt * beat, 0.26, beat * d * 0.98));
        next += beat * 3; bar = (bar + 1) % 16;
      }
    }
    return {
      start() { if (on) return; on = true; next = Math.max(next, ctx.currentTime + 0.1); loop(); timer = setInterval(loop, 120); },
      stop() { on = false; clearInterval(timer); },
    };
  })();

  let fadeRaf = 0;
  function fadeAudio(to, ms, done) {
    cancelAnimationFrame(fadeRaf);
    const from = audio.volume, t0 = performance.now();
    const step = (now) => { const k = Math.min(1, (now - t0) / ms); audio.volume = Math.min(1, Math.max(0, from + (to - from) * k)); k < 1 ? (fadeRaf = requestAnimationFrame(step)) : done?.(); };
    fadeRaf = requestAnimationFrame(step);
  }
  function startPiano() {
    if (!ctx) return;
    usingPiano = true; ctx.resume(); piano.start();
    musicBus.gain.cancelScheduledValues(ctx.currentTime); musicBus.gain.setTargetAtTime(0.85, ctx.currentTime, 1.2);
    playing = true; songTagText.textContent = `زیادکردنی گۆرانی ${C.song.title}`; songTag.classList.remove("static"); songTag.hidden = false;
  }
  function playMusic() {
    musicBtn.hidden = false;
    if (songOk) {
      usingPiano = false; yt.using = false; audio.volume = 0;
      audio.play().then(() => { playing = true; fadeAudio(0.9, 3000); showSongName(); }).catch(() => { songOk = false; startPiano(); });
    } else if (!yt.failed) {
      usingPiano = false; yt.using = true;
      playYouTube().then(() => { playing = true; ytVolume(90, 3000); showSongName(); }).catch(() => { yt.using = false; try { yt.player.pauseVideo(); } catch { /* ignore */ } startPiano(); });
    } else startPiano();
  }
  function setMuted(v) {
    muted = v; musicBtn.classList.toggle("muted", v);
    if (usingPiano) { if (v) musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.15); else { ctx.resume(); piano.start(); musicBus.gain.setTargetAtTime(0.85, ctx.currentTime, 0.4); } }
    else if (yt.using) { if (v) ytVolume(0, 350, () => yt.player.pauseVideo()); else { yt.player.playVideo(); ytVolume(90, 800); } }
    else if (v) fadeAudio(0, 400, () => audio.pause());
    else { audio.play().catch(() => {}); fadeAudio(0.9, 800); }
  }
  musicBtn.addEventListener("click", () => setMuted(!muted));
  $("#songfile").addEventListener("change", (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (usingPiano) { musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.2); setTimeout(() => piano.stop(), 800); }
    if (yt.using) { yt.using = false; try { yt.player.pauseVideo(); } catch { /* ignore */ } }
    audio.src = URL.createObjectURL(file); songOk = true; muted = false; musicBtn.classList.remove("muted"); songTag.hidden = true; playMusic();
  });

  /* =====================================================================
     SCRATCH-OFF DATE CARDS
     ===================================================================== */
  (function scratch() {
    const values = { day: ar(start.getDate()), month: ar(start.getMonth() + 1), year: ar(start.getFullYear()) };
    const cards = $$(".sc");
    const hand = $("#hand");
    let touched = false, doneCount = 0;

    cards.forEach((card) => {
      $(".sc__num", card).textContent = values[card.dataset.k];
      const cv = $("canvas", card), box = cv.parentElement, cx = cv.getContext("2d", { willReadFrequently: true });
      let dpr = 1, drawing = false, last = null, moves = 0, finished = false;

      function paint() {
        const w = cv.width, h = cv.height;
        cx.globalCompositeOperation = "source-over";
        const gr = cx.createLinearGradient(0, 0, w, h);
        gr.addColorStop(0, "#d9e5fb"); gr.addColorStop(0.45, "#bccff4"); gr.addColorStop(0.75, "#c9d9f7"); gr.addColorStop(1, "#b3c7f0");
        cx.fillStyle = gr; cx.fillRect(0, 0, w, h);
        const band = cx.createLinearGradient(0, h, w, 0); // a soft diagonal shine, like foil
        band.addColorStop(0.3, "rgba(255,255,255,0)"); band.addColorStop(0.5, "rgba(255,255,255,.55)"); band.addColorStop(0.7, "rgba(255,255,255,0)");
        cx.fillStyle = band; cx.fillRect(0, 0, w, h);
        for (let i = 0; i < 90; i++) { // light sparkle grain
          cx.fillStyle = `rgba(255,255,255,${(0.15 + Math.random() * 0.35).toFixed(2)})`;
          cx.beginPath(); cx.arc(Math.random() * w, Math.random() * h, (0.6 + Math.random() * 1.6) * dpr, 0, 6.283); cx.fill();
        }
        cx.fillStyle = "rgba(45,77,179,.16)"; cx.font = `700 ${Math.round(h * 0.42)}px Vazirmatn, sans-serif`; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText("؟", w / 2, h / 2 + h * 0.03);
      }
      function size() {
        const r = box.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 3);
        cv.width = Math.max(2, Math.round(r.width * dpr)); cv.height = Math.max(2, Math.round(r.height * dpr)); paint();
      }
      size(); addEventListener("resize", () => { if (!touched) size(); });

      function cleared() {
        const { width: w, height: h } = cv, data = cx.getImageData(0, 0, w, h).data;
        let clear = 0, total = 0;
        for (let y = 0; y < h; y += 6) for (let x = 0; x < w; x += 6) { total++; if (data[(y * w + x) * 4 + 3] < 40) clear++; }
        return clear / total;
      }
      function reveal() {
        if (finished) return; finished = true; card.classList.add("done"); doneCount++;
        if (navigator.vibrate) navigator.vibrate(15);
        if (doneCount === cards.length) setTimeout(confetti, 450);
      }
      function scratchTo(x, y) {
        cx.globalCompositeOperation = "destination-out"; cx.lineCap = "round"; cx.lineJoin = "round"; cx.lineWidth = 30 * dpr;
        cx.beginPath(); if (last) cx.moveTo(last.x, last.y); else cx.moveTo(x, y); cx.lineTo(x + 0.01, y + 0.01); cx.stroke();
        last = { x, y };
        if (++moves % 5 === 0 && cleared() > 0.5) reveal();
      }
      const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr }; };
      cv.addEventListener("pointerdown", (e) => {
        touched = true; hand.classList.add("gone"); drawing = true; last = null; cv.setPointerCapture(e.pointerId); const p = pos(e); scratchTo(p.x, p.y);
      });
      cv.addEventListener("pointermove", (e) => { if (!drawing) return; const p = pos(e); scratchTo(p.x, p.y); });
      const stop = () => { drawing = false; last = null; if (!finished && cleared() > 0.5) reveal(); };
      cv.addEventListener("pointerup", stop); cv.addEventListener("pointercancel", stop);
      box.tabIndex = 0; box.setAttribute("role", "button"); box.setAttribute("aria-label", "بیسڕەوە");
      box.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } });
    });
  })();

  function confetti() {
    const cv = $("#confetti"), cx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    const r = $("#scratch").getBoundingClientRect(), ox = (r.left + r.width / 2) * dpr, oy = (r.top + r.height / 2) * dpr;
    const colors = ["#2d4db3", "#6f86d6", "#f4c542", "#ff9dbd", "#a9c1ea", "#ffffff"];
    const ps = Array.from({ length: reduced ? 0 : 110 }, () => {
      const a = Math.random() * 6.283, s = (3 + Math.random() * 8) * dpr;
      return { x: ox, y: oy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4 * dpr, w: (4 + Math.random() * 6) * dpr, h: (3 + Math.random() * 5) * dpr, rot: Math.random() * 6.283, vr: (Math.random() - 0.5) * 0.4, c: colors[Math.floor(Math.random() * colors.length)], star: Math.random() < 0.25 };
    });
    let t = 0;
    (function frame() {
      cx.clearRect(0, 0, cv.width, cv.height); t++;
      ps.forEach((p) => {
        p.vy += 0.22 * dpr; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.globalAlpha = Math.max(0, 1 - t / 130); cx.fillStyle = p.c;
        if (p.star) { cx.font = `${p.w * 2.4}px sans-serif`; cx.textAlign = "center"; cx.fillText("✦", 0, 0); } else cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cx.restore();
      });
      if (t < 130) requestAnimationFrame(frame); else cx.clearRect(0, 0, cv.width, cv.height);
    })();
  }

  // drifting rose petals over the cover (decoration only)
  (function petals() {
    if (reduced) return;
    const cover = $("#cover");
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("i"); p.className = "petal"; p.setAttribute("aria-hidden", "true");
      p.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;--s:${(9 + Math.random() * 8).toFixed(1)}px;--t:${(16 + Math.random() * 14).toFixed(1)}s;--d:${(-Math.random() * 24).toFixed(1)}s;--x:${(Math.random() * 90 - 30).toFixed(0)}px`;
      cover.appendChild(p);
    }
  })();

  /* =====================================================================
     SCROLL EFFECTS
     ===================================================================== */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  const clouds = $$(".cloud-decor[data-par]");
  let ticking = false;
  function parallax() {
    ticking = false;
    clouds.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect(), p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.setProperty("--px", `${(p * 160 * parseFloat(el.dataset.par) * 10).toFixed(1)}px`);
    });
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });

  /* =====================================================================
     OPEN THE ENVELOPE
     ===================================================================== */
  const env = $("#env"), seal = $("#seal"), page = $("#page");
  let opened = false;
  seal.addEventListener("pointerdown", () => { audioInit(); ctx?.resume(); });
  seal.addEventListener("click", async () => {
    if (opened) return; opened = true;
    audioInit(); playMusic();
    env.classList.add("pressed"); sfx.crack();
    if (navigator.vibrate) navigator.vibrate([12, 30, 18]);
    await wait(550);
    env.classList.add("open"); sfx.paper(1.6, 0.16); sfx.chime();
    await wait(1300);
    scrollTo(0, 0);
    document.body.classList.remove("locked");
    page.setAttribute("aria-hidden", "false");
    page.classList.add("in");
    $$(".rv").forEach((el) => io.observe(el));
    parallax();
    env.classList.add("done");
    await wait(1300);
    env.remove();
  });
})();
