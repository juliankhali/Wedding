(() => {
  const W = window.WEDDING;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Sun of Kurdistan (21 rays) ---------- */
  const rays = Array.from({ length: 21 }, (_, i) =>
    `<path d="M0 -46 L5 -24 L-5 -24 Z" transform="rotate(${(360 / 21) * i})"/>`).join("");
  $("#sun g").innerHTML = `${rays}<circle r="21"/>`;
  const sun = (cls = "") => `<svg class="sun ${cls}" viewBox="0 0 100 100" aria-hidden="true"><use href="#sun" width="100" height="100"/></svg>`;
  const kilim = `<svg class="kilim-band" aria-hidden="true"><rect width="100%" height="20" fill="url(#kilim)"/></svg>`;

  /* ---------- Opener ---------- */
  const names = `${esc(W.bride)} <span class="amp">&amp;</span> ${esc(W.groom)}`;
  $("#op-welcome").textContent = W.welcomeSorani;
  $("#op-names").innerHTML = `${esc(W.bride)} &amp; ${esc(W.groom)}`;
  $("#op-date").textContent = W.dateLabel;
  document.title = `${W.bride} & ${W.groom} · Wedding`;

  /* ---------- Links ---------- */
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(W.venue.mapQuery)}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(W.venue.mapQuery)}&z=15&output=embed`;
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
      cls: "slide--photo", bg: p.src, cta: ["Save the Date", "#calendar"],
      html: `<p class="caption">${esc(p.caption)}</p><p class="muted gap">${esc(W.hashtag)}</p>`,
    })),
    {
      cls: "slide--plain", cta: ["Add to Calendar", "#calendar"],
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
        <div class="map"><iframe loading="lazy" title="Venue map" referrerpolicy="no-referrer-when-downgrade" data-src="${embedUrl}"></iframe></div>
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

  /* ---------- Music ---------- */
  const audio = $("#music");
  const musicBtn = $("#music-btn");
  audio.src = W.music;
  audio.volume = 0;
  const fadeTo = (target, ms = 1500) => {
    const start = audio.volume, t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      audio.volume = start + (target - start) * k;
      if (k < 1) requestAnimationFrame(step); else if (target === 0) audio.pause();
    };
    requestAnimationFrame(step);
  };
  const playMusic = () => audio.play().then(() => { musicBtn.classList.remove("is-muted"); fadeTo(0.8); })
    .catch(() => musicBtn.classList.add("is-muted"));
  audio.addEventListener("error", () => { musicBtn.classList.add("is-muted"); });
  musicBtn.addEventListener("click", () => {
    if (audio.paused) playMusic(); else { musicBtn.classList.add("is-muted"); fadeTo(0, 500); }
  });

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

  function downloadIcs() {
    const start = new Date(W.date);
    const end = new Date(start.getTime() + 5 * 3600e3);
    const f = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//wedding//EN", "BEGIN:VEVENT",
      `UID:${f(start)}-wedding`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
      `SUMMARY:${W.bride} & ${W.groom} Wedding`, `LOCATION:${W.venue.name}\\, ${W.venue.address.replace(/,/g, "\\,")}`,
      `DESCRIPTION:${mapsUrl}`, "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "wedding.ics";
    a.click();
    toast("Saved to your calendar 📅");
  }
  $("#cal-btn").addEventListener("click", downloadIcs);
  $("#cta").addEventListener("click", (e) => {
    if ($("#cta").getAttribute("href") === "#calendar") { e.preventDefault(); downloadIcs(); }
  });

  $("#share-btn").addEventListener("click", async () => {
    const data = { title: `${W.bride} & ${W.groom}`, text: "You're invited to our wedding 💍", url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(location.href); toast("Link copied ✨"); }
    } catch { /* cancelled */ }
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

  /* ---------- Open ---------- */
  function open() {
    $("#stories").hidden = false;
    $("#opener").classList.add("is-leaving");
    setTimeout(() => $("#opener").remove(), 1000);
    show(0);
    raf = requestAnimationFrame(tick);
    playMusic();
  }
  $("#open-btn").addEventListener("click", open);

  // Preload images for silky transitions
  [W.cover, W.avatar, ...W.gallery.map((g) => g.src)].forEach((src) => { const i = new Image(); i.src = src; });
})();
