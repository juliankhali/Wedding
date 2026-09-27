(() => {
  const W = window.WEDDING;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const setText = (sel, text) => { const el = $(sel); if (el) el.textContent = text; };

  /* ---------- Sun of Kurdistan (21 rays) + wax seal ---------- */
  const rays = Array.from({ length: 21 }, (_, i) =>
    `<path d="M0 -46 L5 -24 L-5 -24 Z" transform="rotate(${(360 / 21) * i})"/>`).join("");
  $("#sun g").innerHTML = `${rays}<circle r="21"/>`;
  $("#seal-rays").innerHTML = `${rays}<circle r="21"/>`;
  $("#seal-initials").textContent = `${W.bride[0]}&${W.groom[0]}`;

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

  /* ---------- Fill content from config ---------- */
  const couple = `${W.bride} & ${W.groom}`;
  document.title = `${couple} · Wedding`;
  setText("#op-welcome", W.welcomeSorani);
  $("#op-names").innerHTML = `${esc(W.bride)} &amp; ${esc(W.groom)}`;
  setText("#op-date", W.dateLabel);
  if (W.guestName) setText("#op-to", `A letter for ${W.guestName}`);

  $("#nav-logo").textContent = `${W.bride[0]} & ${W.groom[0]}`;
  $("#hero-img").src = W.cover;
  setText("#hero-welcome", W.welcomeSorani);
  $("#hero-names").innerHTML = `${esc(W.bride)}<span class="amp">&amp;</span>${esc(W.groom)}`;
  setText("#hero-date", `${W.dateLabel} · ${W.timeLabel}`);

  setText("#families", W.families);
  setText("#inv-names", couple);
  setText("#message", W.message);
  setText("#kurmanji", W.welcomeKurmanji);

  setText("#cd-date", W.dateLabel);
  $("#cal-btn").href = calUrl;

  $("#gallery-grid").innerHTML = W.gallery.map((p, i) => `
    <figure class="reveal" style="--d:${i * 0.12}s">
      <img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy" decoding="async" />
      <figcaption>${esc(p.caption)}</figcaption>
    </figure>`).join("");
  setText("#hashtag", W.hashtag);

  setText("#d-date", W.dateLabel.split("·").pop().trim());
  setText("#d-time", `${W.dateLabel.split("·")[0].trim()} at ${W.timeLabel}`);
  setText("#d-venue", W.venue.name);
  setText("#d-address", W.venue.address);
  setText("#d-dress", W.dressCode || "Formal");
  $("#timeline").innerHTML = W.program.map((p, i) =>
    `<li class="reveal" style="--d:${i * 0.1}s"><time>${esc(p.time)}</time><div><strong>${esc(p.title)}</strong><span>${esc(p.note)}</span></div></li>`).join("");

  setText("#l-venue", W.venue.name);
  setText("#l-address", W.venue.address);
  $("#directions").href = mapsUrl;
  $("#map").innerHTML = W.mapEmbed !== false
    ? `<iframe loading="lazy" title="Map to ${esc(W.venue.name)}" referrerpolicy="no-referrer-when-downgrade" src="${embedUrl}"></iframe>`
    : `<a href="${mapsUrl}" target="_blank" rel="noopener" aria-label="Open ${esc(W.venue.name)} in Google Maps" style="position:absolute;inset:0"><span class="map__pin"><svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#f6ecd8"/></svg></span></a>`;

  setText("#rsvp-blessing", W.blessingSorani);
  setText("#rsvp-deadline", W.rsvpDeadline);
  $("#f-names").textContent = couple;
  setText("#f-date", `${W.dateLabel} · ${W.venue.name}`);
  setText("#f-blessing", W.blessingSorani);

  /* ---------- RSVP → WhatsApp ---------- */
  const form = $("#rsvp-form");
  function rsvpLink() {
    const name = $("#rsvp-name").value.trim() || "A guest";
    const yes = $("#attend-yes").checked;
    const guests = $("#rsvp-guests").value;
    const msg = $("#rsvp-msg").value.trim();
    const text = yes
      ? `Hello! ${name} joyfully accepts the invitation to ${couple}'s wedding 💍\nGuests: ${guests}`
      : `Hello! ${name} regretfully can't attend ${couple}'s wedding, but sends love and congratulations 💛`;
    return `https://wa.me/${W.rsvpWhatsApp}?text=${encodeURIComponent(msg ? `${text}\n\n"${msg}"` : text)}`;
  }
  const syncRsvp = () => { $("#rsvp-send").href = rsvpLink(); };
  form.addEventListener("input", syncRsvp);
  form.addEventListener("change", syncRsvp);
  form.addEventListener("submit", (e) => e.preventDefault());
  $("#rsvp-send").addEventListener("click", (e) => {
    if (!$("#rsvp-name").value.trim()) {
      e.preventDefault();
      $("#rsvp-name").focus();
      toast("Please write your name first");
    }
  });
  syncRsvp();

  /* ---------- Countdown ---------- */
  function countdown() {
    const s = Math.max(0, Math.floor((startDate.getTime() - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    document.querySelectorAll("#countdown b").forEach((b) => {
      const n = pad(v[b.dataset.u]);
      if (b.textContent !== n) b.textContent = n;
    });
  }
  countdown();
  setInterval(countdown, 1000);

  /* ---------- Music ---------- */
  const audio = $("#music");
  const player = $("#player");
  const musicBtn = $("#music-btn");
  setText("#song-title", W.song?.title || "Our song");
  setText("#song-artist", W.song?.artist || "");
  let fading = 0;
  function fadeTo(target, ms) {
    cancelAnimationFrame(fading);
    const from = audio.volume, t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      audio.volume = from + (target - from) * k;
      if (k < 1) fading = requestAnimationFrame(step);
      else if (target === 0) audio.pause();
    };
    fading = requestAnimationFrame(step);
  }
  const setPlaying = (on) => {
    player.classList.toggle("is-playing", on);
    musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  };
  function missingSong() {
    $("#song-add").hidden = false;
    setText("#song-artist", "Tap “Add song” to choose the mp3");
  }
  function playMusic() {
    if (!audio.getAttribute("src")) return missingSong();
    audio.volume = 0;
    return audio.play().then(() => { setPlaying(true); fadeTo(0.85, 2000); }).catch(() => setPlaying(false));
  }
  if (W.song?.src) audio.src = W.song.src;
  audio.addEventListener("error", () => { audio.removeAttribute("src"); setPlaying(false); missingSong(); });
  musicBtn.addEventListener("click", () => {
    if (!audio.paused && audio.volume > 0) { fadeTo(0, 500); setPlaying(false); }
    else playMusic();
  });
  $("#song-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    audio.src = URL.createObjectURL(file);
    $("#song-add").hidden = true;
    setText("#song-artist", W.song?.artist || "");
    playMusic();
  });

  /* ---------- Scroll effects ---------- */
  const nav = $("#nav");
  const heroImg = $("#hero-img");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle("is-solid", y > 60);
      if (y < window.innerHeight) heroImg.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
      ticking = false;
    });
  }, { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  const watchReveals = () => document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => io.observe(el));

  let toastTimer = 0;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

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
  document.body.classList.add("is-locked");
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
    const site = $("#site");
    site.hidden = false;
    site.classList.add("is-entering");
    window.scrollTo(0, 0);
    document.body.classList.remove("is-locked");
    watchReveals();
    opener.classList.add("is-leaving");
    await wait(1100);
    opener.remove();
  }
  $("#open-btn").addEventListener("click", open);

  // Preload images so the site appears instantly after the envelope
  [W.cover, ...W.gallery.map((g) => g.src)].forEach((src) => { const i = new Image(); i.src = src; });
})();
