/* =====================================================================
   Lace + Pearl invitation — config + behaviour
   EDIT ONLY THE CONFIG BLOCK: names, date, venue, language, texts, pictures, music.
   ===================================================================== */
const CONFIG = {
  names: ["Name", "Name"],            // placeholder couple — replace with real names
  initials: "N&N",                    // written on the seal
  eventDate: "2027-08-21T19:00:00",   // local time of the venue (ISO)
  defaultLang: "auto",                // "tr" | "en" | "auto" (follows the phone)
  venue: {
    name: "Venue Name",
    address: "Street Address, City",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Venue+Name+City"
  },
  program: [                          // time + label per language
    { time: "19:00", tr: "Karşılama", en: "Welcome" },
    { time: "19:30", tr: "Nikâh töreni", en: "Ceremony" },
    { time: "20:30", tr: "Akşam yemeği", en: "Dinner" },
    { time: "22:00", tr: "Dans ve eğlence", en: "Dancing" }
  ],
  rsvpDeadline: { tr: "1 Ağustos 2027", en: "1 August 2027" },
  music: { src: "" },                 // path to an mp3 (e.g. "music.mp3"); empty = soft built-in melody
  gallery: [],                        // list of image paths; empty = 6 placeholder frames
  galleryPlaceholders: 6,

  /* ---- All visible text, per language ---- */
  i18n: {
    en: {
      introKicker: "You are invited", introHint: "Tap the seal to open",
      heroInvite: "Together with their families", heroLine: "invite you to celebrate their wedding",
      countTitle: "Countdown", countLine: "Until we say “I do”",
      days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec", countDone: "Today is the day",
      detailsTitle: "The Details", when: "When", where: "Where", program: "Program", directions: "Get directions",
      rsvpTitle: "RSVP", rsvpLine: d => `Kindly reply by ${d}`,
      fName: "Full name", fGuests: "Number of guests", fAttending: "Will you attend?", yes: "Joyfully yes", no: "Regretfully no",
      send: "Send reply", errName: "Please enter your name", thanksYes: n => `Thank you, ${n} — we can't wait to celebrate with you.`, thanksNo: n => `Thank you, ${n} — you will be missed.`,
      galleryTitle: "Memory Wall", galleryLine: "A few moments we treasure",
      footThanks: "Thank you for being part of our story"
    },
    tr: {
      introKicker: "Davetlisiniz", introHint: "Açmak için mühre dokunun",
      heroInvite: "Ailelerimizle birlikte", heroLine: "evlilik törenimizde sizi aramızda görmekten mutluluk duyarız",
      countTitle: "Geri Sayım", countLine: "“Evet” dememize kalan süre",
      days: "Gün", hours: "Saat", minutes: "Dk", seconds: "Sn", countDone: "Büyük gün bugün",
      detailsTitle: "Detaylar", when: "Zaman", where: "Mekân", program: "Program", directions: "Yol tarifi al",
      rsvpTitle: "Katılım", rsvpLine: d => `Lütfen ${d} tarihine kadar yanıtlayın`,
      fName: "Ad soyad", fGuests: "Kişi sayısı", fAttending: "Katılacak mısınız?", yes: "Evet, katılıyorum", no: "Maalesef katılamıyorum",
      send: "Yanıtı gönder", errName: "Lütfen adınızı yazın", thanksYes: n => `Teşekkürler ${n}, sizinle kutlamak için sabırsızlanıyoruz.`, thanksNo: n => `Teşekkürler ${n}, yokluğunuzu hissedeceğiz.`,
      galleryTitle: "Anı Duvarı", galleryLine: "Kalbimize dokunan birkaç an",
      footThanks: "Hikâyemizin bir parçası olduğunuz için teşekkürler"
    }
  }
};

/* ===================================================================== */
const $ = s => document.querySelector(s);
const date = new Date(CONFIG.eventDate);
let lang = CONFIG.defaultLang === "auto" ? (navigator.language || "en").toLowerCase().startsWith("tr") ? "tr" : "en" : CONFIG.defaultLang;
const T = () => CONFIG.i18n[lang];

/* ---------- Original SVG lace cluster (drawn once into <symbol>) ---------- */
function buildLace() {
  const C = "#FAF4EC", S = "#C9B59E";                   // lace fill / hairline
  const petal = (r, a) => `<path transform="rotate(${a})" d="M0 0C${r*.42} ${-r*.3} ${r*.4} ${-r*.8} 0 ${-r}C${-r*.4} ${-r*.8} ${-r*.42} ${-r*.3} 0 0Z"/>`;
  const vein = (r, a) => `<path transform="rotate(${a})" d="M0 ${-r*.12}V${-r*.82}" fill="none"/>`;
  const flower = (x, y, r, n, rot = 0) => {
    let p = "", v = "", inner = "";
    for (let i = 0; i < n; i++) { const a = rot + i * 360 / n; p += petal(r, a); v += vein(r, a); inner += petal(r * .55, a + 180 / n); }
    const dots = Array.from({ length: n * 2 }, (_, i) => { const a = (i * 180 / n + rot) * Math.PI / 180; return `<circle cx="${Math.sin(a) * r * .22}" cy="${-Math.cos(a) * r * .22}" r="${r * .035}" fill="${S}" stroke="none"/>`; }).join("");
    return `<g transform="translate(${x} ${y})" fill="${C}" stroke="${S}" stroke-width=".7">${p}<g fill="none">${v}</g><g fill="#fff" fill-opacity=".7">${inner}</g>
      <circle r="${r*.2}" fill="${C}"/><circle r="${r*.12}" fill="none"/>${dots}</g>`;
  };
  const leaf = (x, y, l, a) => `<g transform="translate(${x} ${y}) rotate(${a})" fill="${C}" stroke="${S}" stroke-width=".7">
      <path d="M0 0C${l*.28} ${-l*.22} ${l*.7} ${-l*.2} ${l} 0C${l*.7} ${l*.2} ${l*.28} ${l*.22} 0 0Z"/>
      <path d="M${l*.06} 0H${l*.9}M${l*.3} 0L${l*.5} ${-l*.1}M${l*.3} 0L${l*.5} ${l*.1}M${l*.55} 0L${l*.72} ${-l*.08}M${l*.55} 0L${l*.72} ${l*.08}" fill="none"/></g>`;
  const eyelet = (x, y, r) => `<g transform="translate(${x} ${y})" fill="${C}" stroke="${S}" stroke-width=".6"><circle r="${r}"/><circle r="${r*.45}" fill="none"/></g>`;
  const pearl = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#pearl)" stroke="#B9A592" stroke-width=".3" style="filter:drop-shadow(0 1.5px 1.2px rgba(107,90,78,.45))"/>`;

  // doily scallops behind the big flower
  let scallop = ""; for (let i = 0; i < 18; i++) { const a = i * 20 * Math.PI / 180; scallop += `<circle cx="${62 + Math.sin(a)*62}" cy="${62 - Math.cos(a)*62}" r="9"/>`; }

  const lace = `
    <g filter="url(#emboss)">
      <path d="M-5 160C40 150 70 120 100 100S150 70 190 66" fill="none" stroke="${S}" stroke-width="1.4"/>
      <path d="M-5 100C20 110 55 130 80 160S100 190 112 205" fill="none" stroke="${S}" stroke-width="1.4"/>
      <g fill="${C}" stroke="${S}" stroke-width=".6" opacity=".95">${scallop}</g>
      ${leaf(80, 80, 70, 20)}${leaf(80, 80, 62, 70)}${leaf(60, 100, 56, 125)}${leaf(100, 70, 50, -25)}${leaf(40, 60, 46, -75)}
      ${flower(66, 66, 62, 8, 12)}
      ${flower(138, 44, 30, 6, 0)}${flower(36, 140, 32, 6, 20)}
      ${flower(165, 98, 20, 5, 10)}${flower(96, 168, 21, 5, 36)}
      ${eyelet(112, 118, 7)}${eyelet(188, 62, 6)}${eyelet(62, 190, 6)}${eyelet(150, 150, 5)}${eyelet(18, 96, 5)}${eyelet(100, 14, 5)}
    </g>
    ${pearl(112, 118, 4.4)}${pearl(124, 126, 3)}${pearl(190, 70, 3.6)}${pearl(150, 150, 3.2)}${pearl(60, 192, 3.8)}${pearl(52, 202, 2.6)}${pearl(18, 96, 3)}${pearl(102, 20, 3.2)}${pearl(178, 124, 2.4)}${pearl(130, 190, 2.4)}
    <circle cx="66" cy="66" r="5.5" fill="url(#pearl)" style="filter:drop-shadow(0 1.5px 1.5px rgba(107,90,78,.5))"/>`;
  $("#lace-cluster").innerHTML = lace;
}

/* ---------- Text / language ---------- */
function applyLang() {
  const t = T(), loc = lang === "tr" ? "tr-TR" : "en-GB";
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t[el.dataset.i18n]);
  const up = s => s.toLocaleUpperCase(loc);
  $("#badgeDate").textContent = up(date.toLocaleDateString(loc, { month: "long" })) + " · " + date.getFullYear();
  $("#badgeTime").textContent = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  $("#heroDay").textContent = up(date.toLocaleDateString(loc, { weekday: "long" })) + " · " + date.getDate();
  $("#dWhen").textContent = date.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " — " + $("#badgeTime").textContent;
  $("#dProgram").innerHTML = CONFIG.program.map(p => `<li><b>${p.time}</b><span>${p[lang]}</span></li>`).join("");
  $("#rsvpLine").textContent = t.rsvpLine(CONFIG.rsvpDeadline[lang]);
  $("#footThanks").textContent = t.footThanks;
  $("#footDate").textContent = date.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
  $("#langBtn").textContent = lang === "tr" ? "EN" : "TR";
  $("#fName").placeholder = "";
  tick();
}
function fillStatic() {
  const [a, b] = CONFIG.names;
  ["name1", "fName1"].forEach(i => $("#" + i).textContent = a);
  ["name2", "fName2"].forEach(i => $("#" + i).textContent = b);
  $("#sealInitials").textContent = CONFIG.initials;
  $("#dVenue").textContent = CONFIG.venue.name; $("#dAddress").textContent = CONFIG.venue.address;
  $("#directions").href = CONFIG.venue.mapsUrl;
  document.title = `${a} & ${b} — Wedding`;
}

/* ---------- Countdown ---------- */
function tick() {
  let s = Math.max(0, Math.floor((date - Date.now()) / 1000));
  const p = n => String(n).padStart(2, "0");
  $("#cd-d").textContent = p(Math.floor(s / 86400)); $("#cd-h").textContent = p(Math.floor(s % 86400 / 3600));
  $("#cd-m").textContent = p(Math.floor(s % 3600 / 60)); $("#cd-s").textContent = p(s % 60);
  if (!s) $("#countdown .accent").textContent = T().countDone;
}

/* ---------- Gallery ---------- */
function buildWall() {
  const items = CONFIG.gallery.length ? CONFIG.gallery : Array.from({ length: CONFIG.galleryPlaceholders }, () => null);
  $("#wall").innerHTML = items.map(src => `<div class="tile"><div class="ph">${src ? `<img src="${src}" alt="" loading="lazy">` :
    `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M3 17l5-4 4 3 3-2 6 4"/></svg>`}</div></div>`).join("");
}

/* ---------- Scroll reveal (staggered) ---------- */
function setupReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { const sib = [...e.target.parentElement.children].indexOf(e.target);
      e.target.style.transitionDelay = Math.min(sib, 5) * 0.12 + "s"; e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal,.tile").forEach(el => io.observe(el));
}

/* ---------- Music: mp3 if provided, else a soft synthesized melody ---------- */
const music = (() => {
  let ctx, master, audio, timer, on = false;
  const notes = [392, 494, 587, 523, 440, 523, 659, 587, 392, 494, 587, 784, 659, 587, 523, 494]; // gentle waltz-like line (original)
  function synth() {
    ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = .5; master.connect(ctx.destination);
    let i = 0;
    const play = () => { const f = notes[i++ % notes.length], t = ctx.currentTime;
      [f, f / 2].forEach((fr, k) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = fr;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(k ? .05 : .09, t + .04); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8);
        o.connect(g).connect(master); o.start(t); o.stop(t + 1.9); }); };
    play(); timer = setInterval(play, 700);
  }
  return {
    start() { try {
      if (CONFIG.music.src) { audio = audio || Object.assign(new Audio(CONFIG.music.src), { loop: true, volume: .6 }); audio.play().catch(() => {}); }
      else if (!ctx) synth(); else ctx.resume(); on = true; } catch (e) {} setMuted(false); },
    toggle() { on = !on; if (audio) on ? audio.play() : audio.pause();
      if (ctx) on ? ctx.resume() : ctx.suspend(); setMuted(!on); }
  };
  function setMuted(m) { $("#muteBtn").classList.toggle("muted", m); }
})();

/* ---------- RSVP ---------- */
function setupRsvp() {
  let guests = 1; const out = $("#gOut");
  $("#gMinus").onclick = () => out.textContent = guests = Math.max(1, guests - 1);
  $("#gPlus").onclick = () => out.textContent = guests = Math.min(10, guests + 1);
  $("#rsvpForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#fName").value.trim(); $("#fName").classList.toggle("err", !name);
    if (!name) { $("#fName").focus(); return; }
    const entry = { name, guests, attending: $("input[name=attending]:checked").value, at: new Date().toISOString() };
    console.log("RSVP", entry);                       // TODO: send to your backend / Google Sheet
    try { const all = JSON.parse(localStorage.getItem("rsvp") || "[]"); all.push(entry); localStorage.setItem("rsvp", JSON.stringify(all)); } catch (_) {}
    const th = $("#rsvpThanks"); th.hidden = false; th.textContent = entry.attending === "yes" ? T().thanksYes(name) : T().thanksNo(name);
  });
}

/* ---------- Init ---------- */
buildLace(); fillStatic(); buildWall(); setupRsvp(); applyLang(); setupReveal();
setInterval(tick, 1000);
$("#langBtn").onclick = () => { lang = lang === "tr" ? "en" : "tr"; applyLang(); };
$("#muteBtn").onclick = () => music.toggle();
$("#seal").onclick = () => {
  document.body.classList.add("open"); music.start();
  setTimeout(() => { document.body.classList.remove("locked"); window.scrollTo(0, 0); }, 1800);
};
addEventListener("scroll", () => document.body.classList.toggle("scrolled", scrollY > innerHeight * .55), { passive: true });
