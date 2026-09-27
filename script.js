(() => {
  const W = window.WEDDING;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Sun of Kurdistan (21 rays) ---------- */
  const rays = Array.from({ length: 21 }, (_, i) =>
    `<path d="M0 -46 L5 -24 L-5 -24 Z" transform="rotate(${(360 / 21) * i})"/>`).join("");
  $("#sun g").innerHTML = `${rays}<circle r="21"/>`;
  $("#seal-rays").innerHTML = `${rays}<circle r="21"/>`;
  $("#seal-initials").textContent = `${W.bride[0]}&${W.groom[0]}`;
  const sun = (cls = "") => `<svg class="sun ${cls}" viewBox="0 0 100 100" aria-hidden="true"><use href="#sun" width="100" height="100"/></svg>`;
  const kilim = `<svg class="kilim-band" aria-hidden="true"><rect width="100%" height="20" fill="url(#kilim)"/></svg>`;

  /* ---------- Opener ---------- */
  const names = `${esc(W.bride)} <span class="amp">&amp;</span> ${esc(W.groom)}`;
  $("#op-welcome").textContent = W.welcomeSorani;
  $("#op-names").innerHTML = `${esc(W.bride)} &amp; ${esc(W.groom)}`;
  if (W.guestName) $("#op-to").textContent = `A letter for ${W.guestName}`;
  $("#op-date").textContent = W.dateLabel;
  document.title = `${W.bride} & ${W.groom} · Wedding`;

  /* ---------- Links ---------- */
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(W.venue.mapQuery)}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(W.venue.mapQuery)}&z=15&output=embed`;
  const pad = (n) => String(n).padStart(2, "0");
  const gcal = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const startDate = new Date(W.date);
  const calUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(`${W.bride} & ${W.groom} Wedding`)}` +
    `&dates=${gcal(startDate)}/${gcal(new Date(startDate.getTime() + 5 * 3600e3))}` +
    `&location=${encodeURIComponent(`${W.venue.name}, ${W.venue.address}`)}` +
    `&details=${encodeURIComponent(mapsUrl)}`;
  const rsvpText = `Hi! I'm happy to confirm my attendance at ${W.bride} & ${W.groom}'s wedding 💍`;
  const rsvpUrl = `https://wa.me/${W.rsvpWhatsApp}?text=${encodeURIComponent(rsvpText)}`;

  /* ---------- Stories ---------- */
  const stories = [
    {
      cls: "slide--cover", bg: W.cover, cta: ["RSVP", rsvpUrl],
      html: `
        <p class="kurdish">${esc(W.welcomeSorani)}</p>
        <p class="eyebrow">We're getting married</p>
        <h2 class="script">${names}</h2>
        <span class="date-pill">${esc(W.dateLabel)}</span>`,
    },
    {
      cls: "slide--plain", cta: ["RSVP", rsvpUrl],
      html: `
        <div class="ornament">
          ${sun()}
          <p class="eyebrow">${esc(W.families)}</p>
          <p class="eyebrow" style="letter-spacing:.2em">request the pleasure of your company</p>
          <div class="tricolor"></div>
          <p class="lead">${esc(W.message)}</p>
          <p class="kurdish" style="font-size:20px">${esc(W.welcomeKurmanji)}</p>
        </div>`,
    },
    ...W.gallery.map((p) => ({
      cls: "slide--photo", bg: p.src, cta: ["Save the Date", calUrl],
      html: `<p class="caption">${esc(p.caption)}</p><p class="muted gap">${esc(W.hashtag)}</p>`,
    })),
    {
      cls: "slide--plain", cta: ["Add to Calendar", calUrl],
      html: `
        ${sun("sun--spin")}
        <p class="eyebrow gap">The countdown begins</p>
        <h2 class="script" style="font-size:52px">${esc(W.dateLabel.split("·").pop().trim())}</h2>
        <p class="muted">${esc(W.dateLabel.split("·")[0].trim())} · ${esc(W.timeLabel)}</p>
        <div class="countdown" id="countdown">
          <div><b data-u="d">0</b><small>Days</small></div>
          <div><b data-u="h">0</b><small>Hours</small></div>
          <div><b data-u="m">0</b><small>Min</small></div>
          <div><b data-u="s">0</b><small>Sec</small></div>
        </div>
        ${kilim}`,
    },
    {
      cls: "slide--plain", cta: ["Get Directions", mapsUrl], duration: 10,
      html: `
        <p class="eyebrow">The celebration will be held at</p>
        <p class="venue gap">${esc(W.venue.name)}</p>
        <p class="muted">${esc(W.venue.address)}</p>
        <a class="map" href="${mapsUrl}" target="_blank" rel="noopener" aria-label="Open ${esc(W.venue.name)} in Google Maps">
          <span class="map__pin"><svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#1a0f12"/></svg></span>
          <span class="map__label">Open in Google Maps</span>
          ${W.mapEmbed !== false ? `<iframe loading="lazy" title="Venue map" referrerpolicy="no-referrer-when-downgrade" data-src="${embedUrl}"></iframe>` : ""}
        </a>
        <p class="muted">${esc(W.timeLabel)} · ${esc(W.dateLabel)}</p>`,
    },
    {
      cls: "slide--plain", cta: ["RSVP", rsvpUrl], duration: 9,
      html: `
        ${kilim}
        <p class="eyebrow gap">Program of the evening</p>
        <ol class="timeline">
          ${W.program.map((p) => `<li><time>${esc(p.time)}</time><div><strong>${esc(p.title)}</strong><span>${esc(p.note)}</span></div></li>`).join("")}
        </ol>`,
    },
    {
      cls: "slide--cover", bg: W.cover, cta: ["RSVP on WhatsApp", rsvpUrl], duration: 12,
      html: `
        <p class="kurdish">${esc(W.blessingSorani)}</p>
        <p class="eyebrow">Your presence is our greatest gift</p>
        <h2 class="script" style="font-size:60px">See you there</h2>
        <p class="muted">${esc(W.rsvpDeadline)}</p>
        <a class="btn btn--ghost gap" href="${rsvpUrl}" target="_blank" rel="noopener">Confirm Attendance</a>`,
    },
  ];

  const slidesEl = $("#slides");
  const progressEl = $("#progress");
  slidesEl.innerHTML = stories.map((s) => `
    <article class="slide ${s.cls}">
      <div class="slide__bg">${s.bg ? `<img src="${esc(s.bg)}" alt="" decoding="async">` : ""}</div>
      ${s.html}
    </article>`).join("");
  progressEl.innerHTML = stories.map(() => "<span><i></i></span>").join("");
  const slideEls = [...slidesEl.children];
  const bars = [...progressEl.children];

  $("#avatar").src = W.avatar;
  $("#handle").textContent = `${W.bride.toLowerCase()}.${W.groom.toLowerCase()}`;

  /* ---------- Player ---------- */
  const frame = $("#frame");
  let index = 0, elapsed = 0, last = 0, paused = false, raf = 0;
  const dur = (i) => (stories[i].duration || W.storyDuration) * 1000;

  function show(i) {
    index = Math.max(0, Math.min(stories.length - 1, i));
    elapsed = 0;
    slideEls.forEach((el, k) => {
      el.classList.toggle("is-active", k === index);
      // restart entrance animations
      if (k === index) { el.style.animation = "none"; void el.offsetWidth; el.style.animation = ""; }
    });
    bars.forEach((b, k) => {
      b.classList.toggle("done", k < index);
      b.firstChild.style.width = k < index ? "100%" : "0";
    });
    const iframe = slideEls[index].querySelector("iframe[data-src]");
    if (iframe && !iframe.src) iframe.src = iframe.dataset.src;
    const [label, href] = stories[index].cta;
    $("#cta-label").textContent = label;
    $("#cta").href = href;
  }

  function tick(t) {
    if (!paused) {
      elapsed += last ? t - last : 0;
      const p = Math.min(1, elapsed / dur(index));
      bars[index].firstChild.style.width = `${p * 100}%`;
      if (p >= 1) {
        if (index < stories.length - 1) show(index + 1);
        else setPaused(true);
      }
    }
    last = t;
    raf = requestAnimationFrame(tick);
  }

  function setPaused(v) {
    paused = v;
    frame.classList.toggle("is-paused", v);
    $("#pause-btn").setAttribute("aria-label", v ? "Play" : "Pause");
  }

  const next = () => (index < stories.length - 1 ? show(index + 1) : toast("That's everything — see you there! 💛"));
  const prev = () => show(index - 1);

  /* tap = navigate, hold = pause, swipe = navigate */
  let downAt = 0, downX = 0, downY = 0, holdTimer = 0, held = false;
  frame.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a, iframe, .map")) return;
    downAt = Date.now(); downX = e.clientX; downY = e.clientY; held = false;
    holdTimer = setTimeout(() => { held = true; setPaused(true); }, 220);
  });
  frame.addEventListener("pointerup", (e) => {
    if (!downAt) return;
    clearTimeout(holdTimer);
    const dx = e.clientX - downX, dy = e.clientY - downY;
    downAt = 0;
    if (held) { setPaused(false); return; }
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) return dx < 0 ? next() : prev();
    if (dy < -60) return void $("#cta").click();
    const r = frame.getBoundingClientRect();
    (e.clientX - r.left < r.width * 0.3 ? prev : next)();
  });
  frame.addEventListener("pointercancel", () => { clearTimeout(holdTimer); downAt = 0; if (held) setPaused(false); });
  frame.addEventListener("dblclick", (e) => { if (!e.target.closest("button, a")) like(true); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else if (e.key === " ") { e.preventDefault(); setPaused(!paused); }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) setPaused(true); });
  $("#pause-btn").addEventListener("click", () => setPaused(!paused));

  /* ---------- Music ----------
     Uses config.music (an mp3) when set; otherwise plays a built-in
     Kurdish-style melody (Hijaz maqam, santur plucks, drone and daf). */
  const musicBtn = $("#music-btn");
  const player = W.music ? fileMusic(W.music) : synthMusic();
  const setMuted = (m) => musicBtn.classList.toggle("is-muted", m);
  const playMusic = () => player.play().then(() => setMuted(false)).catch(() => setMuted(true));
  musicBtn.addEventListener("click", () => {
    if (player.playing()) { player.pause(); setMuted(true); } else playMusic();
  });

  function fileMusic(src) {
    const audio = $("#music");
    audio.src = src;
    audio.volume = 0;
    let fading = 0;
    const fadeTo = (target, ms) => {
      cancelAnimationFrame(fading);
      const from = audio.volume, t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / ms);
        audio.volume = from + (target - from) * k;
        if (k < 1) fading = requestAnimationFrame(step); else if (target === 0) audio.pause();
      };
      fading = requestAnimationFrame(step);
    };
    return {
      play: () => audio.play().then(() => fadeTo(0.8, 1800)),
      pause: () => fadeTo(0, 500),
      playing: () => !audio.paused && audio.volume > 0,
    };
  }

  function synthMusic() {
    const AC = window.AudioContext || window.webkitAudioContext;
    let ctx, master, echo, noise, timer = 0, next = 0, step = 0, on = false;
    const bpm = 92, sixteenth = 60 / bpm / 4;
    const root = 146.83; // D3
    const hijaz = [0, 1, 4, 5, 7, 8, 10, 12, 13, 16, 17, 19];
    const hz = (deg) => root * 2 ** (hijaz[deg] / 12);
    // [step, scale degree] over 4 bars of 16 steps
    const melody = [[0,4],[3,5],[4,4],[6,3],[8,2],[10,3],[12,1],[14,0],
      [16,2],[18,3],[20,4],[22,5],[24,6],[26,5],[28,4],
      [32,7],[34,8],[35,7],[36,6],[38,5],[40,6],[42,5],[44,4],[46,3],
      [48,4],[50,3],[52,2],[53,1],[54,2],[56,1],[58,0]];
    const dum = new Set([0, 10]), tek = new Set([4, 6, 12, 14]);

    function init() {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp).connect(ctx.destination);
      echo = ctx.createDelay(); echo.delayTime.value = sixteenth * 3;
      const fb = ctx.createGain(); fb.gain.value = 0.32;
      const wet = ctx.createGain(); wet.gain.value = 0.35;
      echo.connect(fb).connect(echo); echo.connect(wet).connect(master);
      noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      // drone: D + A, softly filtered
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520;
      const dg = ctx.createGain(); dg.gain.value = 0.05;
      lp.connect(dg).connect(master);
      [root / 2, root * 0.75].forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = i ? 4 : -4;
        o.connect(lp); o.start();
      });
    }
    function pluck(f, t, v = 0.22) {
      [[1, "triangle", v], [2.005, "sine", v * 0.35], [3, "sine", v * 0.08]].forEach(([m, type, g]) => {
        const o = ctx.createOscillator(), e = ctx.createGain();
        o.type = type; o.frequency.value = f * m;
        e.gain.setValueAtTime(0.0001, t);
        e.gain.exponentialRampToValueAtTime(g, t + 0.004);
        e.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
        o.connect(e); e.connect(master); e.connect(echo);
        o.start(t); o.stop(t + 1.5);
      });
    }
    function daf(t, low) {
      if (low) {
        const o = ctx.createOscillator(), e = ctx.createGain();
        o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.18);
        e.gain.setValueAtTime(0.55, t); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        o.connect(e).connect(master); o.start(t); o.stop(t + 0.45);
      }
      const n = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), e = ctx.createGain();
      n.buffer = noise; bp.type = "bandpass"; bp.frequency.value = low ? 900 : 3200; bp.Q.value = 0.8;
      e.gain.setValueAtTime(low ? 0.12 : 0.16, t); e.gain.exponentialRampToValueAtTime(0.0001, t + (low ? 0.12 : 0.07));
      n.connect(bp).connect(e).connect(master); n.start(t);
    }
    function schedule() {
      while (next < ctx.currentTime + 0.15) {
        const s16 = step % 16;
        melody.forEach(([st, deg]) => { if (st === step) { pluck(hz(deg), next); if (st % 8 === 0) pluck(hz(deg) / 2, next, 0.1); } });
        // santur-style tremolo on the long notes
        if (step === 30 || step === 62) for (let k = 1; k < 4; k++) pluck(hz(step === 30 ? 4 : 0), next + k * sixteenth / 2, 0.08);
        if (dum.has(s16)) daf(next, true);
        if (tek.has(s16)) daf(next, false);
        next += sixteenth;
        step = (step + 1) % 64;
      }
    }
    return {
      play: async () => {
        if (!AC) throw new Error("no audio");
        if (!ctx) init();
        await ctx.resume();
        if (!on) { on = true; next = ctx.currentTime + 0.05; timer = setInterval(schedule, 25); }
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0.7, ctx.currentTime, 0.6);
      },
      pause: () => {
        if (!ctx) return;
        on = false;
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
        setTimeout(() => { if (!on) { clearInterval(timer); ctx.suspend(); } }, 600);
      },
      playing: () => on,
    };
  }

  /* ---------- Social actions ---------- */
  function like(burst) {
    const btn = $("#like-btn");
    btn.classList.add("is-liked");
    btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
    const box = $("#hearts");
    const emojis = ["❤️", "💛", "💍", "🤍", "💚"];
    for (let i = 0; i < (burst ? 8 : 5); i++) {
      const h = document.createElement("span");
      h.textContent = emojis[i % emojis.length];
      h.style.right = `${24 + Math.random() * 40}px`;
      h.style.setProperty("--dx", `${-40 - Math.random() * 120}px`);
      h.style.setProperty("--r", `${Math.random() * 60 - 30}deg`);
      h.style.animationDelay = `${i * 70}ms`;
      box.appendChild(h);
      setTimeout(() => h.remove(), 2200 + i * 70);
    }
  }
  $("#like-btn").addEventListener("click", () => like(false));

  $("#cal-btn").href = calUrl;

  $("#share-btn").addEventListener("click", async () => {
    const data = { title: `${W.bride} & ${W.groom}`, text: "You're invited to our wedding 💍", url: location.href };
    try {
      if (navigator.share) return await navigator.share(data);
    } catch (e) { if (e.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(location.href); toast("Link copied ✨"); }
    catch { toast("Copy the link from your browser's address bar"); }
  });

  let toastTimer = 0;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- Countdown ---------- */
  const target = new Date(W.date).getTime();
  function countdown() {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    document.querySelectorAll("#countdown b").forEach((b) => {
      const n = String(v[b.dataset.u]).padStart(2, "0");
      if (b.textContent !== n) b.textContent = n;
    });
  }
  countdown();
  setInterval(countdown, 1000);

  /* ---------- Opening: break the seal ---------- */
  const dust = $("#dust");
  for (let i = 0; i < 22; i++) {
    const d = document.createElement("span");
    d.style.left = `${Math.random() * 100}%`;
    d.style.setProperty("--dx", `${Math.random() * 80 - 40}px`);
    d.style.animationDuration = `${9 + Math.random() * 10}s`;
    d.style.animationDelay = `${-Math.random() * 18}s`;
    d.style.opacity = 0.3 + Math.random() * 0.6;
    dust.appendChild(d);
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let opened = false;
  async function open() {
    if (opened) return;
    opened = true;
    const opener = $("#opener"), env = $("#envelope"), seal = $("#open-btn");
    playMusic();
    opener.classList.add("is-opening");
    if (navigator.vibrate) navigator.vibrate(18);
    seal.classList.add("is-cracking");
    await wait(reduced ? 0 : 320);
    seal.classList.add("is-broken");
    await wait(reduced ? 0 : 280);
    env.classList.add("is-open");
    await wait(reduced ? 0 : 520);
    env.classList.add("flap-behind");
    await wait(reduced ? 0 : 380);
    env.classList.add("letter-out");
    await wait(reduced ? 200 : 2600);
    $("#stories").hidden = false;
    show(0);
    raf = requestAnimationFrame(tick);
    opener.classList.add("is-leaving");
    await wait(1100);
    opener.remove();
  }
  $("#open-btn").addEventListener("click", open);

  // Preload images for silky transitions
  [W.cover, W.avatar, ...W.gallery.map((g) => g.src)].forEach((src) => { const i = new Image(); i.src = src; });
})();
