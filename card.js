(() => {
  const C = window.CARD;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  };

  let lang = [params.get("lang"), store.get("card-lang"), C.defaultLang, "en"].find((l) => l && C.words[l]);
  const guest = params.get("to") || C.guestName;
  const w = (k) => C.words[lang][k] ?? C.words.en[k] ?? "";
  const pick = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.en : v);
  const rtl = () => w("dir") === "rtl";

  /* ---------- artwork ---------- */
  ["top", "bottom", "left", "right"].forEach((k) => { $(`#f-${k}`).innerHTML = ART.flap(k); });
  $("#pampas").innerHTML = ART.pampas();
  $("#crest").innerHTML = ART.baroqueFrame();
  $("#seal").innerHTML = ART.seal();
  const finaleEl = $("#finale");

  /* ---------- photo artwork (optional, overrides the drawn art) ---------- */
  const useImage = (src, apply) => { if (!src) return; const im = new Image(); im.onload = () => apply(`url("${src}")`); im.src = src; };
  const IMG = C.images || {};
  useImage(IMG.envelope, (u) => ["top", "bottom", "left", "right"].forEach((k) => {
    const el = $(`#f-${k}`); el.classList.add("photo"); el.style.setProperty("--img", u);
  }));
  useImage(IMG.paper, (u) => { $("#card").classList.add("photo"); $("#card").style.setProperty("--img", u); });
  useImage(IMG.pampas, (u) => { $("#pampas").classList.add("photo"); $("#pampas").style.setProperty("--img", u); });
  useImage(IMG.frame, (u) => { finaleEl.classList.add("photo"); finaleEl.style.setProperty("--img", u); });
  useImage(IMG.seal, (u) => { $("#seal").classList.add("photo"); $("#seal").style.setProperty("--img", u); });

  /* ---------- text ---------- */
  const couple = () => `${pick(C.bride)} ${w("amp")} ${pick(C.groom)}`;
  const content = () => ({
    bride: pick(C.bride), groom: pick(C.groom), i1: C.initials[0], i2: C.initials[1],
    date: pick(C.date), time: pick(C.time), venue: pick(C.venue), address: pick(C.address),
    rsvpBy: pick(C.rsvpBy), rsvpName: pick(C.rsvpName), phone: C.phone, website: C.website,
  });

  // Split text into letters (Latin) or words (Arabic script, so letters stay joined),
  // each with a slightly random delay so the words "materialise".
  function split(el, text) {
    const parts = rtl() || /[؀-ۿ]/.test(text) ? text.split(/(\s+)/) : [...text];
    const order = parts.map((_, i) => i).sort(() => Math.random() - 0.5);
    const rank = new Map(order.map((idx, r) => [idx, r]));
    const step = rtl() ? 0.12 : 0.05;
    el.innerHTML = "";
    parts.forEach((p, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = p;
      s.style.setProperty("--d", `${(rank.get(i) * step + Math.random() * 0.02).toFixed(3)}s`);
      el.appendChild(s);
    });
  }

  function render() {
    const d = C.words[lang];
    document.documentElement.lang = lang === "kmr" ? "ku" : lang;
    document.documentElement.dir = d.dir;
    const c = content();
    $$("[data-w]").forEach((el) => (el.classList.contains("act") || el.closest(".intro, .hint, .replay") ? (el.textContent = w(el.dataset.w)) : split(el, w(el.dataset.w))));
    $$("[data-c]").forEach((el) => (el.closest(".mono") ? (el.textContent = c[el.dataset.c]) : split(el, c[el.dataset.c] ?? "")));
    $(".amp").textContent = w("amp");
    $("#for-guest").textContent = guest ? w("forGuest").replace("{name}", guest) : couple();
    document.title = `${couple()} · Invitation`;
    links();
  }

  /* ---------- links for the final screen ---------- */
  function links() {
    const pad = (n) => String(n).padStart(2, "0");
    const g = (s) => { const x = new Date(s); return `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`; };
    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.mapQuery)}`;
    $("#a-rsvp").href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(w("rsvpMsg").replace("{couple}", couple()))}`;
    $("#a-cal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(`${C.bride.en} & ${C.groom.en} Wedding`)}&dates=${g(C.start)}/${g(C.end)}` +
      `&location=${encodeURIComponent(`${C.venue.en}, ${C.address.en}`)}&details=${encodeURIComponent(maps)}`;
    $("#a-map").href = maps;
  }

  const sel = $("#lang");
  sel.innerHTML = Object.entries(C.words).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("");
  sel.value = lang;
  sel.addEventListener("change", () => { lang = sel.value; store.set("card-lang", lang); render(); });

  /* ==========================================================
     Sound: seal crack + paper, and the music
     ========================================================== */
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
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3.2; }
    reverb = ctx.createConvolver(); reverb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.4; reverb.connect(wet).connect(musicBus);
  }
  function noise(at, dur, { type = "bandpass", freq = 2000, q = 1, gain = 0.3, curve } = {}) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = freq; fl.Q.value = q;
    const g = ctx.createGain();
    if (curve) { g.gain.setValueAtTime(0, at); g.gain.setValueCurveAtTime(curve.map((v) => v * gain), at, dur); }
    else { g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur); }
    s.connect(fl).connect(g).connect(sfxBus); s.start(at, Math.random()); s.stop(at + dur + 0.05);
  }
  const sfx = {
    crack() {
      if (!ctx) return;
      const n = ctx.currentTime;
      [0, 0.03, 0.08].forEach((o, i) => noise(n + o, 0.05, { type: "highpass", freq: 1800 + i * 700, gain: 0.5 - i * 0.12 }));
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(130, n); o.frequency.exponentialRampToValueAtTime(45, n + 0.12);
      g.gain.setValueAtTime(0.3, n); g.gain.exponentialRampToValueAtTime(0.0001, n + 0.16);
      o.connect(g).connect(sfxBus); o.start(n); o.stop(n + 0.2);
    },
    paper(dur, gain) {
      if (!ctx) return;
      const pts = 40, curve = new Float32Array(pts);
      for (let i = 0; i < pts; i++) curve[i] = Math.sin(Math.PI * (i / (pts - 1))) ** 0.8 * (0.5 + 0.5 * Math.random());
      noise(ctx.currentTime, dur, { freq: 2400, q: 0.6, gain, curve });
      noise(ctx.currentTime, dur, { type: "lowpass", freq: 800, q: 0.4, gain: gain * 0.6, curve });
    },
  };

  // Music: the couple's mp3 if present, otherwise an original piano waltz.
  const audio = $("#audio");
  let songOk = !!C.song?.src, usingPiano = false, playing = false, muted = false;
  if (songOk) { audio.src = C.song.src; audio.addEventListener("error", () => { songOk = false; }); }

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
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = m(midi) * h * (1 + 0.0003 * h * h);
        g.gain.value = [1, 0.42, 0.2, 0.1, 0.05][i]; g.gain.setTargetAtTime(0, at, 0.9 / h);
        o.connect(g).connect(lp); o.start(at); o.stop(at + len + 1.6);
      });
      lp.connect(out); out.connect(musicBus); out.connect(reverb);
    }
    function loop() {
      while (next < ctx.currentTime + 0.4) {
        const [bass, tones] = CH[prog[bar]];
        note(bass, next, 0.32, beat * 2.6); note(bass + 12, next + 0.01, 0.12, beat * 2.4);
        [1, 2].forEach((b) => tones.forEach((tn, k) => note(tn, next + b * beat + k * 0.012, 0.085, beat * 0.9)));
        mel[bar].forEach(([b, n, d]) => note(n, next + b * beat, 0.26, beat * d * 0.98));
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
    const step = (now) => { const k = Math.min(1, (now - t0) / ms); audio.volume = from + (to - from) * k; k < 1 ? (fadeRaf = requestAnimationFrame(step)) : done?.(); };
    fadeRaf = requestAnimationFrame(step);
  }
  function startPiano() {
    if (!ctx) return;
    usingPiano = true; ctx.resume(); piano.start();
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setTargetAtTime(0.85, ctx.currentTime, 1.2);
    playing = true; $("#addsong").hidden = false;
  }
  function playMusic() {
    $("#mute").hidden = false;
    if (songOk) {
      usingPiano = false; audio.volume = 0;
      audio.play().then(() => { playing = true; fadeAudio(0.9, 3000); }).catch(() => { songOk = false; startPiano(); });
    } else startPiano();
  }
  function setMuted(m) {
    muted = m;
    $("#mute").classList.toggle("muted", m);
    $("#mute").setAttribute("aria-label", m ? "Play music" : "Mute music");
    if (usingPiano) { if (m) { musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.15); } else { ctx.resume(); piano.start(); musicBus.gain.setTargetAtTime(0.85, ctx.currentTime, 0.4); } }
    else if (m) fadeAudio(0, 400, () => audio.pause());
    else { audio.play().catch(() => {}); fadeAudio(0.9, 800); }
  }
  $("#mute").addEventListener("click", () => setMuted(!muted));
  $("#songfile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (usingPiano) { musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.2); setTimeout(() => piano.stop(), 800); }
    audio.src = URL.createObjectURL(file); songOk = true; muted = false; $("#mute").classList.remove("muted");
    $("#addsong").hidden = true;
    playMusic();
  });

  /* ==========================================================
     The timeline
     ========================================================== */
  const frame = $("#frame"), env = $("#envelope"), seal = $("#seal"), finale = $("#finale");
  const pages = { invite: $("#p-invite"), names: $("#p-names"), date: $("#p-date"), rsvp: $("#p-rsvp") };
  let run = 0; // increases on replay so an old timeline stops

  const sleep = (ms, id) => new Promise((res, rej) => setTimeout(() => (id === run ? res() : rej(new Error("cancelled"))), reduced ? Math.min(ms, 300) : ms));
  const showBlock = (el) => { el.classList.add("show"); };
  const pageOut = (p) => p.classList.add("out");

  function resetCard() {
    Object.values(pages).forEach((p) => { p.classList.remove("out"); $$(".show", p).forEach((e) => e.classList.remove("show")); });
    $(".amp").classList.remove("show-soft");
    $("#pampas").classList.remove("grow");
    $("#card").style.opacity = 1;
    finale.classList.remove("on");
    $("#crest").classList.remove("on");
    $(".mono").classList.remove("on");
    $("#actions").classList.remove("on");
    frame.classList.remove("dark");
    render();
  }

  async function timeline(id) {
    const P = pages;
    // envelope opens
    env.classList.add("open");
    sfx.paper(1.6, 0.18);
    await sleep(2600, id);
    env.classList.add("gone");
    await sleep(700, id);

    // 1. You're cordially invited
    $$("p", P.invite).forEach((p, i) => setTimeout(() => showBlock(p), i * 250));
    await sleep(2700, id);
    pageOut(P.invite);
    await sleep(700, id);

    // 2. Names
    $("#pampas").classList.add("grow");
    showBlock($$(".getting p", P.names)[0]); setTimeout(() => showBlock($$(".getting p", P.names)[1]), 200);
    await sleep(900, id);
    showBlock($(".name--1", P.names));
    await sleep(500, id);
    $(".amp").classList.add("show-soft");
    await sleep(300, id);
    showBlock($(".name--2", P.names));
    await sleep(3800, id);
    pageOut(P.names);
    await sleep(900, id);

    // 3. Date & venue, then Save the Date
    showBlock($(".date", P.date));
    $$(".venue p", P.date).forEach((p, i) => setTimeout(() => showBlock(p), 300 + i * 250));
    await sleep(1400, id);
    $$(".std p", P.date).forEach((p, i) => setTimeout(() => showBlock(p), i * 350));
    await sleep(3800, id);
    pageOut(P.date);
    await sleep(900, id);

    // 4. RSVP
    $$(".p-rsvp .script, .p-rsvp .rsvp, .p-rsvp .by, .p-rsvp .contact p, .p-rsvp .site", document).forEach((p, i) => setTimeout(() => showBlock(p), i * 280));
    await sleep(4200, id);

    // 5. Cross-fade to burgundy and the monogram
    frame.classList.add("dark");
    finale.classList.add("on");
    await sleep(1000, id);
    $("#card").style.opacity = 0;
    await sleep(1300, id);
    $("#crest").classList.add("on");
    await sleep(1600, id);
    $(".mono").classList.add("on");
    await sleep(2200, id);
    $("#actions").classList.add("on");
  }

  function start() {
    const id = ++run;
    timeline(id).catch(() => { /* replaced by a newer run */ });
  }

  let opened = false;
  seal.addEventListener("pointerdown", () => { audioInit(); ctx?.resume(); });
  seal.addEventListener("click", async () => {
    if (opened) return;
    opened = true;
    audioInit();
    playMusic();
    env.classList.add("opening");
    seal.classList.add("crack");
    sfx.crack();
    if (navigator.vibrate) navigator.vibrate([12, 30, 18]);
    await new Promise((r) => setTimeout(r, reduced ? 0 : 260));
    seal.classList.add("lift");
    await new Promise((r) => setTimeout(r, reduced ? 0 : 450));
    start();
  });

  $("#replay").addEventListener("click", () => {
    run++;
    resetCard();
    env.classList.remove("gone", "open");
    requestAnimationFrame(() => requestAnimationFrame(() => start()));
  });

  render();
})();
