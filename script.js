(() => {
  const W = window.WEDDING;
  const I18N = window.I18N;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("is-locked");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  /* ==========================================================
     Language
     ========================================================== */
  const params = new URLSearchParams(location.search);
  let lang = [params.get("lang"), store.get("lang"), W.defaultLang, "en"].find((l) => l && I18N[l]);
  const guest = params.get("to") || W.guestName || "";
  const t = (k) => I18N[lang][k] ?? I18N.en[k] ?? "";
  const pick = (obj) => (obj && typeof obj === "object" ? obj[lang] ?? obj.en : obj);

  /* ---------- Dates (Kurdish is formatted by hand; browsers lack it) ---------- */
  const start = new Date(W.date);
  const easternDigits = (s) => String(s).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  const KU = {
    ckb: {
      months: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەممووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"],
      days: ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "هەینی", "شەممە"],
    },
    kmr: {
      months: ["Kanûna Paşîn", "Sibat", "Adar", "Nîsan", "Gulan", "Hezîran", "Tîrmeh", "Tebax", "Îlon", "Cotmeh", "Mijdar", "Kanûn"],
      days: ["Yekşem", "Duşem", "Sêşem", "Çarşem", "Pêncşem", "În", "Şemî"],
    },
  };
  const num = (n, pad = 1) => {
    const s = String(n).padStart(pad, "0");
    return lang === "ckb" || lang === "ar" ? easternDigits(s) : s;
  };
  const hm = (d) => `${num(d.getHours())}:${num(d.getMinutes(), 2)}`;

  const EN_ORD = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth", "Twenty-First", "Twenty-Second", "Twenty-Third", "Twenty-Fourth", "Twenty-Fifth", "Twenty-Sixth", "Twenty-Seventh", "Twenty-Eighth", "Twenty-Ninth", "Thirtieth", "Thirty-First"];
  const EN_ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const EN_TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const enWords = (n) => (n < 20 ? EN_ONES[n] : EN_TENS[Math.floor(n / 10)] + (n % 10 ? `-${EN_ONES[n % 10]}` : ""));
  const enYear = (y) => `Two Thousand${y % 100 ? ` and ${enWords(y % 100)}` : ""}`;

  function dateLong(d) {
    if (lang === "en") {
      const wd = d.toLocaleDateString("en-GB", { weekday: "long" });
      const mo = d.toLocaleDateString("en-GB", { month: "long" });
      return `${wd}, the ${EN_ORD[d.getDate() - 1]} of ${mo}\n${enYear(d.getFullYear())}`;
    }
    if (KU[lang]) return `${KU[lang].days[d.getDay()]}، ${dateShort(d)}`.replace("،", lang === "kmr" ? "," : "،");
    return new Intl.DateTimeFormat(t("locale"), { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
  }
  function dateShort(d, withYear = true) {
    if (KU[lang]) return `${num(d.getDate())} ${KU[lang].months[d.getMonth()]}${withYear ? ` ${num(d.getFullYear())}` : ""}`;
    return new Intl.DateTimeFormat(t("locale"), { day: "numeric", month: "long", ...(withYear ? { year: "numeric" } : {}) }).format(d);
  }
  function timeLine(d) {
    if (lang === "en") {
      const h = d.getHours() % 12 || 12, m = d.getMinutes();
      const part = d.getHours() < 12 ? "in the morning" : d.getHours() < 17 ? "in the afternoon" : "in the evening";
      const clock = m === 0 ? `${enWords(h).toLowerCase()} o'clock` : m === 30 ? `half past ${enWords(h).toLowerCase()}` : d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });
      return `at ${clock} ${part}`;
    }
    if (lang === "ckb") return `کاتژمێر ${num(d.getHours() % 12 || 12)}ی ${d.getHours() < 12 ? "بەیانی" : d.getHours() < 17 ? "دوای نیوەڕۆ" : "ئێوارە"}`;
    if (lang === "kmr") return `saet ${hm(d)}`;
    return `${t("at")} ${new Intl.DateTimeFormat(t("locale"), { hour: "numeric", minute: "2-digit" }).format(d)}`;
  }

  /* ==========================================================
     Links
     ========================================================== */
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(W.venue.mapQuery)}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(W.venue.mapQuery)}&z=15&output=embed`;
  const pad2 = (n) => String(n).padStart(2, "0");
  const gcal = (d) => `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
  const calUrl = () => "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(`${W.bride.en} & ${W.groom.en} Wedding`)}` +
    `&dates=${gcal(start)}/${gcal(new Date(start.getTime() + 5 * 3600e3))}` +
    `&location=${encodeURIComponent(`${W.venue.name.en}, ${W.venue.address.en}`)}` +
    `&details=${encodeURIComponent(mapsUrl)}`;

  /* ==========================================================
     Artwork: Kurdish sun + wax seal
     ========================================================== */
  const rays = Array.from({ length: 21 }, (_, i) => `<path d="M0 -47 L5.2 -25 L-5.2 -25 Z" transform="rotate(${(360 / 21) * i})"/>`).join("");
  $("#sun-g").innerHTML = `${rays}<circle r="21"/>`;

  function blobPath(cx, cy, r, n = 72) {
    const bump = (th, at, w, h) => { let d = Math.abs(th - at); d = Math.min(d, Math.PI * 2 - d); return h * Math.exp(-((d / w) ** 2)); };
    const pts = Array.from({ length: n }, (_, i) => {
      const th = (i / n) * Math.PI * 2;
      const k = 1 + 0.03 * Math.sin(3 * th + 0.7) + 0.022 * Math.sin(5 * th + 2.1) + 0.014 * Math.sin(9 * th + 0.4) + 0.008 * Math.sin(15 * th + 1.3)
        + bump(th, 2.35, 0.16, 0.07) + bump(th, 5.05, 0.12, 0.055) + bump(th, 0.9, 0.1, 0.035);
      return [cx + Math.cos(th) * r * k, cy + Math.sin(th) * r * k];
    });
    let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return `${d} Z`;
  }
  const sealRays = Array.from({ length: 21 }, (_, i) => `<path d="M0 -44 L3.6 -31 L-3.6 -31 Z" transform="rotate(${(360 / 21) * i})"/>`).join("");
  $("#seal-g").innerHTML = `
    <path d="${blobPath(80, 80, 68)}" fill="url(#wax)" filter="url(#wax-dome)"/>
    <circle cx="80" cy="80" r="51" fill="#7a0c14" filter="url(#wax-press)"/>
    <g filter="url(#wax-emboss)" fill="#a01822">
      <circle cx="80" cy="80" r="47" fill="none" stroke="#a01822" stroke-width="2"/>
      <circle cx="80" cy="80" r="43.5" fill="none" stroke="#a01822" stroke-width=".8"/>
      <g transform="translate(80 80)">${sealRays}</g>
      <circle cx="80" cy="80" r="27" fill="none" stroke="#a01822" stroke-width="1.4"/>
      <text x="80" y="89" text-anchor="middle" font-family="Pinyon Script, Great Vibes, cursive" font-size="27" fill="#a01822">${esc(W.initials.replace(" ", " "))}</text>
    </g>`;

  /* ==========================================================
     Render all text for the current language
     ========================================================== */
  function render() {
    const I = I18N[lang];
    document.documentElement.lang = lang === "kmr" ? "ku" : lang;
    document.documentElement.dir = I.dir;

    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });

    const bride = pick(W.bride), groom = pick(W.groom);
    const couple = `${bride} ${I.dir === "rtl" ? "و" : "&"} ${groom}`;
    const coupleFor = lang === "kmr" ? `${bride} û ${groom}` : couple;
    const binds = {
      bride, groom, couple: coupleFor,
      amp: I.dir === "rtl" ? "و" : lang === "kmr" ? "û" : "&",
      monogram: W.initials.split(" ").join(" & "),
      families: pick(W.families),
      dateLong: dateLong(start),
      dateShort: dateShort(start),
      timeLine: timeLine(start),
      venueName: pick(W.venue.name),
      venueCity: pick(W.venue.city),
      venueAddress: pick(W.venue.address),
      hashtag: W.hashtag,
      rsvpBy: fill(t("rsvpBy"), { date: dateShort(new Date(`${W.rsvpBy}T12:00:00`), false) }),
    };
    $$("[data-bind]").forEach((el) => { el.textContent = binds[el.dataset.bind] ?? ""; });
    $$(".hero__date").forEach((el) => { el.innerHTML = esc(binds.dateLong).replace("\n", "<br>"); });

    const sceneTo = $("#scene-to");
    if (sceneTo) sceneTo.textContent = guest ? fill(t("letterForName"), { name: guest }) : t("letterFor");
    document.title = `${coupleFor} · ${lang === "en" ? "Wedding" : t("detailsEyebrow")}`;

    $("#gallery").innerHTML = W.gallery.map((p, i) => `
      <figure class="arch reveal" style="--d:${i * 0.15}s">
        <div class="arch__frame"><img src="${esc(p.src)}" alt="${esc(pick(p.caption))}" loading="lazy" decoding="async" /></div>
        <figcaption>${esc(pick(p.caption))}</figcaption>
      </figure>`).join("");

    const day = W.date.slice(0, 10);
    $("#programme").innerHTML = W.program.map((p, i) => `
      <li class="reveal" style="--d:${i * 0.12}s">
        <time>${esc(lang === "en" ? new Date(`${day}T${p.time}`).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true }) : hm(new Date(`${day}T${p.time}`)))}</time>
        <span class="dot" aria-hidden="true"></span>
        <div><strong>${esc(pick(p.title))}</strong><span>${esc(pick(p.note))}</span></div>
      </li>`).join("");

    $("#cal-link").href = calUrl();
    $("#directions").href = mapsUrl;
    updateRsvp();
    updateSongLabel();
    countdown();

    $$(".hero__card > .rise").forEach((el, i) => el.style.setProperty("--i", i));
    $$("[data-langs] select").forEach((s) => { s.value = lang; });
    if (siteShown) watchReveals(true);
  }

  // Language pickers
  $$("[data-langs]").forEach((box) => {
    const sel = document.createElement("select");
    sel.setAttribute("aria-label", "Language");
    sel.innerHTML = Object.entries(I18N).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("");
    sel.addEventListener("change", () => { lang = sel.value; store.set("lang", lang); render(); });
    box.appendChild(sel);
  });

  // Map: live embed on the real site, a styled link card where embeds are blocked
  $("#map").innerHTML = W.mapEmbed !== false
    ? `<iframe loading="lazy" title="Map" referrerpolicy="no-referrer-when-downgrade" src="${embedUrl}"></iframe>`
    : `<a class="map__open" href="${mapsUrl}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#052019"/></svg><span>Google Maps</span></a>`;
  $("#band-img").src = W.cover;

  /* ==========================================================
     RSVP → WhatsApp
     ========================================================== */
  function updateRsvp() {
    const name = $("#f-name").value.trim() || "—";
    const vars = { name, couple: `${pick(W.bride)} & ${pick(W.groom)}`, guests: $("#f-guests").value };
    let text = fill(t($("#f-yes").checked ? "rsvpYes" : "rsvpNo"), vars);
    const msg = $("#f-msg").value.trim();
    if (msg) text += `\n\n“${msg}”`;
    $("#f-send").href = `https://wa.me/${W.rsvpWhatsApp}?text=${encodeURIComponent(text)}`;
  }
  $("#rsvp-form").addEventListener("input", updateRsvp);
  $("#rsvp-form").addEventListener("change", updateRsvp);
  $("#rsvp-form").addEventListener("submit", (e) => e.preventDefault());
  $("#f-send").addEventListener("click", (e) => {
    if (!$("#f-name").value.trim()) { e.preventDefault(); $("#f-name").focus(); toast(t("nameFirst")); }
  });

  /* ==========================================================
     Countdown
     ========================================================== */
  function countdown() {
    const s = Math.max(0, Math.floor((start - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    $$("#count b").forEach((b) => { const n = num(v[b.dataset.u], 2); if (b.textContent !== n) b.textContent = n; });
  }
  setInterval(countdown, 1000);

  /* ==========================================================
     Sound: effects for the seal and paper, and the music
     ========================================================== */
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, sfxBus = null, musicBus = null, noiseBuf = null, reverb = null;
  function audioInit() {
    if (ctx || !AC) return;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(comp);
    musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(comp);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    // Concert-hall reverb from a decaying noise impulse
    const len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3.2; }
    reverb = ctx.createConvolver(); reverb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.42;
    reverb.connect(wet).connect(musicBus);
  }
  function noise(at, dur, { type = "bandpass", freq = 2000, q = 1, gain = 0.3, curve } = {}) {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    if (curve) { g.gain.setValueAtTime(0, at); g.gain.setValueCurveAtTime(curve.map((v) => v * gain), at, dur); }
    else { g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur); }
    src.connect(f).connect(g).connect(sfxBus);
    src.start(at, Math.random()); src.stop(at + dur + 0.05);
  }
  const sfx = {
    crack() {
      if (!ctx) return;
      const n = ctx.currentTime;
      [0, 0.03, 0.075, 0.12].forEach((o, i) => noise(n + o, 0.05 - i * 0.006, { type: "highpass", freq: 1800 + i * 600, gain: 0.55 - i * 0.1 }));
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(140, n); o.frequency.exponentialRampToValueAtTime(45, n + 0.12);
      g.gain.setValueAtTime(0.35, n); g.gain.exponentialRampToValueAtTime(0.0001, n + 0.16);
      o.connect(g).connect(sfxBus); o.start(n); o.stop(n + 0.2);
    },
    rustle(dur, gain = 0.2) {
      if (!ctx) return;
      const pts = 48, curve = new Float32Array(pts);
      for (let i = 0; i < pts; i++) { const x = i / (pts - 1); curve[i] = Math.sin(Math.PI * x) ** 0.7 * (0.45 + 0.55 * Math.random()); }
      noise(ctx.currentTime, dur, { freq: 2600, q: 0.6, gain, curve });
      noise(ctx.currentTime, dur, { type: "lowpass", freq: 900, q: 0.4, gain: gain * 0.6, curve });
    },
    tick() { if (ctx) noise(ctx.currentTime, 0.03, { type: "highpass", freq: 3000, gain: 0.12 }); },
  };

  /* ---------- Music: the couple's mp3, or an original piano waltz ---------- */
  const audio = $("#audio");
  let songReady = false, songFailed = !W.song?.src, usingPiano = false, playing = false;
  if (W.song?.src) {
    audio.src = W.song.src;
    audio.addEventListener("canplay", () => { songReady = true; }, { once: true });
    audio.addEventListener("error", () => { songFailed = true; });
  }

  const piano = (() => {
    const bpm = 76, beat = 60 / bpm;
    const m = (n) => 440 * 2 ** ((n - 69) / 12);
    // chords: [bass, [chord tones]] — D, Bm, G, A (a waltz in D major)
    const C = { D: [50, [62, 66, 69]], Bm: [47, [62, 66, 71]], G: [43, [62, 67, 71]], A: [45, [61, 64, 69]], Em: [52, [64, 67, 71]] };
    const prog = ["D", "Bm", "G", "A", "D", "Bm", "Em", "A", "D", "Bm", "G", "A", "G", "A", "D", "D"];
    // melody per bar: [beat, midi, beats]
    const mel = [
      [[0, 78, 2], [2, 76, 1]], [[0, 74, 2], [2, 73, 1]], [[0, 71, 1], [1, 74, 1], [2, 79, 1]], [[0, 78, 3]],
      [[0, 78, 1], [1, 81, 1], [2, 78, 1]], [[0, 76, 2], [2, 74, 1]], [[0, 76, 1], [1, 79, 1], [2, 83, 1]], [[0, 81, 2], [2, 79, 1]],
      [[0, 78, 2], [2, 81, 1]], [[0, 86, 2], [2, 83, 1]], [[0, 83, 1], [1, 79, 1], [2, 83, 1]], [[0, 81, 3]],
      [[0, 79, 1.5], [1.5, 78, 0.5], [2, 76, 1]], [[0, 76, 1], [1, 78, 1], [2, 73, 1]], [[0, 74, 3]], [],
    ];
    let bar = 0, nextBar = 0, timer = 0, on = false;
    function note(midi, at, vel, len) {
      const f = m(midi);
      const out = ctx.createGain();
      out.gain.setValueAtTime(0, at);
      out.gain.linearRampToValueAtTime(vel, at + 0.008);
      out.gain.setTargetAtTime(vel * 0.35, at + 0.01, 0.35);
      out.gain.setTargetAtTime(0, at + len, 0.28);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1400 + vel * 5000;
      [1, 2, 3, 4, 5].forEach((h, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = f * h * (1 + 0.0003 * h * h);
        g.gain.value = [1, 0.42, 0.2, 0.1, 0.05][i];
        g.gain.setTargetAtTime(0, at, 0.9 / h);
        o.connect(g).connect(lp); o.start(at); o.stop(at + len + 1.6);
      });
      lp.connect(out); out.connect(musicBus); out.connect(reverb);
    }
    function scheduleBar(i, at) {
      const [bass, tones] = C[prog[i]];
      note(bass, at, 0.32, beat * 2.6);
      note(bass + 12, at + 0.01, 0.12, beat * 2.4);
      [1, 2].forEach((b) => tones.forEach((tn, k) => note(tn, at + b * beat + k * 0.012, 0.085, beat * 0.9)));
      mel[i].forEach(([b, n, d]) => note(n, at + b * beat, 0.26, beat * d * 0.98));
      if (i === 15) note(86, at + beat, 0.12, beat * 2);
    }
    function loop() {
      while (nextBar < ctx.currentTime + 0.4) {
        scheduleBar(bar, nextBar);
        nextBar += beat * 3;
        bar = (bar + 1) % 16;
      }
    }
    return {
      start() { if (on) return; on = true; nextBar = Math.max(nextBar, ctx.currentTime + 0.1); loop(); timer = setInterval(loop, 120); },
      stop() { on = false; clearInterval(timer); },
    };
  })();

  let fadeRaf = 0;
  function fadeAudio(to, ms, done) {
    cancelAnimationFrame(fadeRaf);
    const from = audio.volume, t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      audio.volume = from + (to - from) * k;
      if (k < 1) fadeRaf = requestAnimationFrame(step); else done?.();
    };
    fadeRaf = requestAnimationFrame(step);
  }
  function startPiano(fadeMs) {
    if (!ctx) return;
    usingPiano = true;
    ctx.resume();
    piano.start();
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setTargetAtTime(0.85, ctx.currentTime, fadeMs / 3000);
    setPlaying(true);
  }
  function playMusic(fadeMs = 3500) {
    if (!songFailed && W.song?.src) {
      usingPiano = false;
      audio.volume = 0;
      const p = audio.play();
      if (p) p.then(() => { setPlaying(true); fadeAudio(0.9, fadeMs); }).catch(() => { songFailed = true; startPiano(fadeMs); });
      return;
    }
    startPiano(fadeMs);
  }
  function pauseMusic() {
    if (usingPiano) {
      musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
      setTimeout(() => { if (!playing) piano.stop(); }, 900);
    } else fadeAudio(0, 600, () => audio.pause());
    setPlaying(false);
  }
  function setPlaying(on) {
    playing = on;
    $("#music").classList.toggle("is-playing", on);
    $("#music-btn").setAttribute("aria-label", t(on ? "musicOff" : "musicOn"));
    updateSongLabel();
  }
  function updateSongLabel() {
    const real = !usingPiano && !songFailed && W.song?.src;
    $("#song-title").textContent = real ? `${W.song.title} · ${W.song.artist}` : "Wedding Waltz · Piano";
    $("#song-add").hidden = !!real;
  }
  let labelTimer = 0;
  function flashLabel() {
    const l = $("#music-label");
    l.classList.remove("is-hidden");
    clearTimeout(labelTimer);
    labelTimer = setTimeout(() => l.classList.add("is-hidden"), 6000);
  }
  $("#music-btn").addEventListener("click", () => { audioInit(); playing ? pauseMusic() : playMusic(800); flashLabel(); });
  $("#song-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (usingPiano) { musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.2); setTimeout(() => piano.stop(), 800); }
    audio.src = URL.createObjectURL(file);
    songFailed = false;
    W.song = { ...W.song, src: audio.src };
    playMusic(1500);
    flashLabel();
  });

  /* ==========================================================
     Website behaviour
     ========================================================== */
  let siteShown = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  function watchReveals(instantVisible) {
    $$(".reveal:not(.is-in)").forEach((el) => {
      if (instantVisible) { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) { el.classList.add("is-in"); return; } }
      io.observe(el);
    });
  }

  const nav = $("#nav"), bandImg = $("#band-img"), band = $(".band");
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("is-solid", scrollY > 40);
      const r = band.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        bandImg.style.transform = `translate3d(0, ${p * -12}%, 0) scale(1.05)`;
      }
      ticking = false;
    });
  }, { passive: true });

  let toastTimer = 0;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ==========================================================
     The opening
     ========================================================== */
  // gold dust in the candlelight
  const dust = $("#dust");
  for (let i = 0; i < 26; i++) {
    const d = document.createElement("span");
    const s = 1.5 + Math.random() * 2.5;
    Object.assign(d.style, { left: `${Math.random() * 100}%`, width: `${s}px`, height: `${s}px`, animationDuration: `${12 + Math.random() * 14}s`, animationDelay: `${-Math.random() * 24}s` });
    d.style.setProperty("--dx", `${Math.random() * 90 - 45}px`);
    d.style.setProperty("--o", (0.25 + Math.random() * 0.6).toFixed(2));
    dust.appendChild(d);
  }

  // the envelope leans toward the pointer, like a card held in the hand
  const scene = $("#scene"), tilt = $("#env-tilt");
  scene.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch" || scene.classList.contains("is-opening")) return;
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    tilt.style.setProperty("--tx", `${(-y * 8).toFixed(2)}deg`);
    tilt.style.setProperty("--ty", `${(x * 10).toFixed(2)}deg`);
  });

  const seal = $("#seal"), flap = $("#flap"), flapA = $("#flap-a"), flapB = $("#flap-b"), card = $("#card"), env = $("#env");
  const press = () => { audioInit(); ctx?.resume(); seal.classList.add("is-pressed"); };
  const release = () => seal.classList.remove("is-pressed");
  seal.addEventListener("pointerdown", press);
  seal.addEventListener("pointerleave", release);
  seal.addEventListener("pointercancel", release);

  const ease = {
    out: (x) => 1 - (1 - x) ** 3,
    inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2),
    paper: (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2),
  };
  const tween = (ms, fn) => new Promise((res) => {
    if (reduced) { fn(1); return res(); }
    const t0 = performance.now();
    const step = (now) => { const k = Math.min(1, (now - t0) / ms); fn(k); k < 1 ? requestAnimationFrame(step) : res(); };
    requestAnimationFrame(step);
  });

  function breakSeal() {
    seal.classList.add("is-broken");
    const pieces = $$(".seal__piece", seal);
    const size = seal.offsetWidth;
    const init = [
      { vx: -0.9, vy: -1.3, vr: -140, sx: 1.06 },
      { vx: 1.1, vy: -1.7, vr: 170, sx: 1.1 },
      { vx: 0.7, vy: -0.6, vr: 90, sx: 1.04 },
    ];
    const g = 5.2; // in seal-widths per second²
    tween(1100, (k) => {
      const s = k * 1.1;
      pieces.forEach((p, i) => {
        const v = init[i];
        const x = v.vx * s * size, y = (v.vy * s + 0.5 * g * s * s) * size;
        p.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(v.vr * s).toFixed(1)}deg) scale(${1 + (v.sx - 1) * k})`;
        p.style.opacity = String(Math.max(0, 1 - Math.max(0, k - 0.45) / 0.55));
      });
    });
    setTimeout(sfx.tick, 240);
    setTimeout(sfx.tick, 420);
  }

  function openFlap() {
    env.classList.add("flap-lifting");
    sfx.rustle(1.0, 0.22);
    let behind = false;
    // 1) the paper sticks for a moment, 2) it lifts free, 3) it settles open
    return tween(1150, (k) => {
      let a, b;
      if (k < 0.14) { const q = ease.out(k / 0.14); a = 14 * q; b = -10 * q; }
      else if (k < 0.2) { a = 14; b = -10; }
      else { const q = ease.paper((k - 0.2) / 0.8); a = 14 + (182 - 14) * q; b = -10 - 16 * Math.sin(Math.PI * q) + 10 * q; }
      if (k === 1) { a = 180; b = 0; }
      flapA.style.setProperty("--a", `${a.toFixed(2)}deg`);
      flapB.style.setProperty("--b", `${b.toFixed(2)}deg`);
      flapA.style.setProperty("--shade", (Math.min(a, 90) / 90 * 0.28).toFixed(3));
      $$(".flap__face--out", flap).forEach((f) => f.style.setProperty("--shade", (Math.min(a, 90) / 90 * 0.28).toFixed(3)));
      if (!behind && a > 96) { behind = true; flap.classList.add("is-behind"); }
    });
  }

  const anim = (el, frames, opts) => (reduced ? Promise.resolve() : el.animate(frames, { fill: "forwards", ...opts }).finished);

  let opened = false;
  async function open() {
    if (opened) return;
    opened = true;
    audioInit();
    playMusic(5000);
    scene.classList.add("is-opening");
    tilt.style.setProperty("--tx", "0deg");
    tilt.style.setProperty("--ty", "0deg");

    release();
    seal.classList.add("is-cracked");
    sfx.crack();
    if (navigator.vibrate) navigator.vibrate([14, 40, 22]);
    await wait(reduced ? 0 : 300);
    breakSeal();
    await wait(reduced ? 0 : 200);

    await openFlap();
    await wait(reduced ? 0 : 60);

    // slide the card out with the small tug of paper against paper
    sfx.rustle(1.1, 0.12);
    anim(tilt, [{ transform: "translateY(0)" }, { transform: "translateY(16%)" }], { duration: 1150, easing: "cubic-bezier(.4,0,.2,1)" });
    await anim(card, [
      { transform: "translateY(0) rotate(0deg)" },
      { transform: "translateY(-7%) rotate(-.4deg)", offset: 0.16 },
      { transform: "translateY(-6%) rotate(-.3deg)", offset: 0.24 },
      { transform: "translateY(-60%) rotate(-.8deg)" },
    ], { duration: 1150, easing: "cubic-bezier(.3,.05,.25,1)" });
    await wait(reduced ? 0 : 250);

    // lift it free, then bring it forward as the envelope falls away
    sfx.rustle(0.6, 0.1);
    await anim(card, [{ transform: "translateY(-60%) rotate(-.8deg)" }, { transform: "translateY(-104%) rotate(0deg)" }], { duration: 600, easing: "cubic-bezier(.45,0,.2,1)" });
    card.style.zIndex = 8;
    const parts = [".env__back", ".env__liner", ".env__pocket", ".flap", ".env__shadow", ".seal"].map((s) => $(s, env));
    parts.forEach((p) => anim(p, [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(45%) rotate(2deg)", opacity: 0 }], { duration: 850, easing: "cubic-bezier(.5,0,.75,0)" }));
    await anim(card, [{ transform: "translateY(-104%) rotate(0deg) scale(1)" }, { transform: "translateY(-45%) scale(1.22)" }], { duration: 850, easing: "cubic-bezier(.3,0,.2,1)" });

    showSite();
  }
  seal.addEventListener("click", open);
  // A second tap anywhere skips straight to the website
  scene.addEventListener("click", (e) => { if (opened && !e.target.closest("#seal")) showSite(); });

  function showSite() {
    if (siteShown) return;
    const site = $("#site");
    site.hidden = false;
    siteShown = true;
    scrollTo(0, 0);
    document.body.classList.remove("is-locked");
    requestAnimationFrame(() => {
      site.classList.add("is-in");
      scene.classList.add("is-gone");
      watchReveals(false);
      flashLabel();
    });
    setTimeout(() => scene.remove(), 1600);
  }

  render();
  [W.cover, ...W.gallery.map((g) => g.src)].forEach((src) => { const i = new Image(); i.src = src; });
})();
