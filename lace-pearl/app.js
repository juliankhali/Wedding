/* =====================================================================
   Embossed lace + pearl invitation
   EDIT ONLY THE CONFIG BLOCK: names, date, time, venue, map link, music, language, texts.
   ===================================================================== */
const CONFIG = {
  names: ["Name", "Name"],            // placeholder couple
  initials: "N&N",                    // on the seal
  eventDate: "2027-08-21T19:00:00",   // local time of the venue (ISO)
  defaultLang: "auto",                // "tr" | "en" | "auto" (follows the phone)
  music: { url: "" },                 // e.g. "music.mp3"; empty = soft built-in melody
  events: [                           // shown in "The Details"; add or remove freely
    { key: "ceremony",  time: "19.00", venue: "Venue Name",  address: "Street Address, City",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Venue+Name+City" },
    { key: "reception", time: "20.30", venue: "Venue Name",  address: "Garden Terrace",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Venue+Name+City" }
  ],
  rsvpDeadline: { tr: "1 Ağustos 2027", en: "1 August 2027" },
  gallery: [],                        // image paths for the memory wall; empty = 4 placeholder frames
  galleryPlaceholders: 4,

  /* ---- All visible text, per language ---- */
  i18n: {
    en: {
      introKicker: "You are invited", introHint: "Tap the seal",
      heroInvite: "Together with their families", heroLine: "invite you to celebrate their wedding", time: "Time", open: "Open",
      storyTitle: "Our Story", storyScript: "It began with a smile",
      storyBody: "Between laughter, long walks and quiet mornings, we found our home in each other. Now we would love to begin the next chapter with the people who matter most.",
      countTitle: "Countdown", countLine: "Until we say “I do”", days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec", countDone: "Today is the day",
      detailsTitle: "The Details", ceremony: "Ceremony", reception: "Reception", directions: "Get Directions",
      rsvpTitle: "RSVP", rsvpLine: d => `Kindly reply by ${d}`,
      fName: "Full name", fGuests: "Number of guests", fAttending: "Will you attend?", yes: "Joyfully yes", no: "Regretfully no", send: "Send reply",
      thanksYes: n => `Thank you, ${n}. We can't wait to celebrate with you.`, thanksNo: n => `Thank you, ${n}. You will be missed.`,
      galleryTitle: "Memory Wall", galleryLine: "Moments we treasure",
      footThanks: "Thank you for being part of our story"
    },
    tr: {
      introKicker: "Davetlisiniz", introHint: "Mühre dokunun",
      heroInvite: "Ailelerimizle birlikte", heroLine: "evlilik törenimize sizi davet ederiz", time: "Saat", open: "Aç",
      storyTitle: "Hikâyemiz", storyScript: "Bir tebessümle başladı",
      storyBody: "Kahkahaların, uzun yürüyüşlerin ve sakin sabahların arasında yuvamızı birbirimizde bulduk. Şimdi yeni bölümü en sevdiklerimizle birlikte başlatmak istiyoruz.",
      countTitle: "Geri Sayım", countLine: "“Evet” dememize kalan süre", days: "Gün", hours: "Saat", minutes: "Dk", seconds: "Sn", countDone: "Büyük gün bugün",
      detailsTitle: "Detaylar", ceremony: "Nikâh", reception: "Resepsiyon", directions: "Yol Tarifi Al",
      rsvpTitle: "Katılım", rsvpLine: d => `Lütfen ${d} tarihine kadar yanıtlayın`,
      fName: "Ad soyad", fGuests: "Kişi sayısı", fAttending: "Katılacak mısınız?", yes: "Evet, katılıyorum", no: "Katılamıyorum", send: "Yanıtı Gönder",
      thanksYes: n => `Teşekkürler ${n}, sizinle kutlamak için sabırsızlanıyoruz.`, thanksNo: n => `Teşekkürler ${n}, yokluğunuzu hissedeceğiz.`,
      galleryTitle: "Anı Duvarı", galleryLine: "Kalbimize dokunan anlar",
      footThanks: "Hikâyemizin bir parçası olduğunuz için teşekkürler"
    }
  }
};

/* ===================================================================== */
const $ = s => document.querySelector(s);
const date = new Date(CONFIG.eventDate);
let lang = CONFIG.defaultLang === "auto" ? ((navigator.language || "en").toLowerCase().startsWith("tr") ? "tr" : "en") : CONFIG.defaultLang;
const T = () => CONFIG.i18n[lang];

/* ---------------------------------------------------------------------
   ORIGINAL LACE ARTWORK (SVG). Every raised piece sits inside a group that
   carries the #emboss filter; rotations live INSIDE the filtered group so the
   light always comes from the top-left, even on the mirrored bottom-right cluster.
   --------------------------------------------------------------------- */
const E = 'filter="url(#emboss)"', L1 = "rgba(120,90,70,.24)", L2 = "rgba(120,90,70,.14)";

const petalPath = p => `M${-p} 0C${-p} ${-p*1.35} ${p} ${-p*1.35} ${p} 0C${p} ${p*.85} ${-p} ${p*.85} ${-p} 0Z`;
function petalRing(n, rr, pr, off) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = (i * 360 / n + off).toFixed(1);
    s += `<g transform="rotate(${a}) translate(0 ${-rr})"><path d="${petalPath(pr)}" fill="url(#petal)" stroke="${L1}" stroke-width=".7"/>` +
         `<path d="M${-pr*.55} ${-pr*.15}C${-pr*.2} ${-pr*.85} ${pr*.35} ${-pr*.85} ${pr*.62} ${-pr*.1}" fill="none" stroke="${L2}" stroke-width=".6"/>` +
         `<path d="M${-pr*.4} ${pr*.2}C${-pr*.1} ${-pr*.35} ${pr*.3} ${-pr*.4} ${pr*.5} ${pr*.15}" fill="none" stroke="${L2}" stroke-width=".5"/></g>`;
  }
  return s;
}
/* Rose: three embossed petal rings (outer to inner) + a spiral heart */
function rose(x, y, r, rot) {
  const k = r / 46;
  return `<g transform="translate(${x} ${y})">` +
    `<g ${E}>${petalRing(8, r*.66, r*.40, rot)}</g>` +
    `<g ${E}>${petalRing(7, r*.45, r*.31, rot + 20)}</g>` +
    `<g ${E}>${petalRing(5, r*.24, r*.24, rot + 8)}<circle r="${r*.13}" fill="url(#petal)" stroke="${L1}" stroke-width=".6"/>` +
    `<path transform="scale(${k})" d="M0 0C3-5 10-4 9 3C8 10-4 11-8 3C-12-6 0-14 9-10" fill="none" stroke="${L1}" stroke-width="1"/></g></g>`;
}
function leaf(x, y, l, a) {
  return `<g transform="translate(${x} ${y})"><g ${E}><g transform="rotate(${a})">` +
    `<path d="M0 0C${l*.25} ${-l*.27} ${l*.72} ${-l*.25} ${l} 0C${l*.72} ${l*.25} ${l*.25} ${l*.27} 0 0Z" fill="url(#petal)" stroke="${L1}" stroke-width=".7"/>` +
    `<path d="M${l*.04} 0H${l*.93}M${l*.28} 0L${l*.5} ${-l*.12}M${l*.28} 0L${l*.5} ${l*.12}M${l*.5} 0L${l*.72} ${-l*.1}M${l*.5} 0L${l*.72} ${l*.1}" fill="none" stroke="${L2}" stroke-width=".7"/>` +
    `</g></g></g>`;
}
function bud(x, y, s, a) {
  return `<g transform="translate(${x} ${y})"><g ${E}><g transform="rotate(${a})">` +
    `<path d="M0 0C${s*.55} ${-s*.3} ${s*.55} ${-s*1.15} 0 ${-s*1.6}C${-s*.55} ${-s*1.15} ${-s*.55} ${-s*.3} 0 0Z" fill="url(#petal)" stroke="${L1}" stroke-width=".7"/>` +
    `<path d="M0 ${-s*.1}C${s} ${-s*.2} ${s} ${-s*.95} ${s*.3} ${-s*1.1}M0 ${-s*.1}C${-s} ${-s*.2} ${-s} ${-s*.95} ${-s*.3} ${-s*1.1}" fill="none" stroke="${L1}" stroke-width=".8"/></g></g></g>`;
}
/* Lace scallops along a cubic Bezier — each scallop is a raised disc with an eyelet */
function scallops(P, r, gap) {
  const pt = t => { const u = 1 - t; return [0, 1].map(i => u*u*u*P[0][i] + 3*u*u*t*P[1][i] + 3*u*t*t*P[2][i] + t*t*t*P[3][i]); };
  let len = 0, prev = pt(0), n = 80; for (let i = 1; i <= n; i++) { const q = pt(i / n); len += Math.hypot(q[0]-prev[0], q[1]-prev[1]); prev = q; }
  const c = Math.round(len / gap); let s = "";
  for (let i = 0; i <= c; i++) { const [x, y] = pt(i / c);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="url(#petal)" stroke="${L1}" stroke-width=".6"/>` +
         `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r*.48}" fill="none" stroke="${L2}" stroke-width=".8"/>` +
         `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r*.16}" fill="${L2}"/>`; }
  return `<g ${E}>${s}</g>`;
}
function doily(x, y, R, n, r) {
  let s = ""; for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n;
    s += `<circle cx="${(x + Math.sin(a)*R).toFixed(1)}" cy="${(y - Math.cos(a)*R).toFixed(1)}" r="${r}" fill="url(#petal)" stroke="${L1}" stroke-width=".6"/>` +
         `<circle cx="${(x + Math.sin(a)*R).toFixed(1)}" cy="${(y - Math.cos(a)*R).toFixed(1)}" r="${r*.4}" fill="none" stroke="${L2}" stroke-width=".7"/>`; }
  return `<g ${E}>${s}</g>`;
}
const pearls = list => `<g filter="url(#pshadow)">${list.map(([x, y, r]) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#pearl)"/><circle cx="${x - r*.3}" cy="${y - r*.34}" r="${r*.26}" fill="#fff" opacity=".95"/>`).join("")}</g>`;

/* One corner cluster. flip=true mirrors positions (and rotates shapes 180°) for the bottom-right corner. */
function cluster(flip) {
  const W = 260, M = (x, y) => flip ? [W - x, W - y] : [x, y], A = a => flip ? a + 180 : a;
  const MP = p => M(p[0], p[1]);
  const chain = [[-14, 214], [30, 150], [140, 64], [214, -14]].map(MP);
  const leaves = [[96,52,64,-35],[52,100,62,105],[122,100,56,35],[24,76,46,-110],[150,60,48,-5],[60,160,46,70],[130,24,40,-60],[40,200,40,95],[176,100,38,40]]
    .map(([x, y, l, a]) => leaf(...M(x, y), l, A(a))).join("");
  const buds = [[120,76,14,70],[66,126,12,170],[178,30,12,20],[24,120,11,200],[104,176,11,120]].map(([x, y, s, a]) => bud(...M(x, y), s, A(a))).join("");
  const roses = [[80,80,46,8],[164,34,26,20],[34,160,28,40],[118,134,19,10],[206,72,16,0],[84,206,16,25]].map(([x, y, r, a]) => rose(...M(x, y), r, A(a))).join("");
  const loose = [[130,60,4.2],[142,72,3],[52,58,3.4],[110,150,4],[152,112,3.4],[176,64,3.2],[20,40,3.2],[40,32,2.6],[62,184,3.6],[22,104,3],[100,186,2.8],[196,30,3],[230,60,2.8],[70,232,2.8],[8,196,3],[150,150,2.6]]
    .map(([x, y, r]) => [...M(x, y), r]);
  return scallops(chain, 7.2, 10.5) + doily(...M(80, 80), 55, 17, 8.6) + leaves + buds + roses + pearls(loose);
}
function buildLace() {
  $("#lace-tl").innerHTML = cluster(false);
  $("#lace-br").innerHTML = cluster(true);
  /* closing ornament */
  const row = []; for (let i = 0; i < 6; i++) { row.push([20 + i * 9, 25, 2], [200 - i * 9, 25, 2]); }
  $("#orn").innerHTML =
    `<path d="M18 25H84M136 25H202" stroke="rgba(194,165,126,.7)" stroke-width=".7"/>` + pearls(row) +
    leaf(96, 27, 30, 170) + leaf(124, 27, 30, 10) + leaf(98, 22, 24, -165) + leaf(122, 22, 24, -15) + rose(110, 24, 15, 10);
  /* small bloom for the memory-wall frames */
  $("#bloom").innerHTML = leaf(35, 36, 24, 195) + leaf(35, 36, 24, -15) + bud(35, 34, 7, -50) + bud(35, 34, 7, 50) + rose(35, 28, 13, 6) + pearls([[12, 40, 2.6], [58, 40, 2.6], [35, 5, 2.2]]);
}

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

/* ---------- Text / language ---------- */
function applyLang() {
  const t = T(), loc = lang === "tr" ? "tr-TR" : "en-GB", up = s => s.toLocaleUpperCase(loc);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t[el.dataset.i18n]);
  $("#cMonth").textContent = up(date.toLocaleDateString(loc, { month: "long" }));
  $("#cYear").textContent = date.getFullYear();
  $("#bDayLbl").textContent = up(date.toLocaleDateString(loc, { weekday: "long" }));
  $("#bDate").textContent = up(date.toLocaleDateString(loc, { day: "numeric", month: "short" }).replace(".", ""));
  $("#bTime").textContent = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");
  $("#events").innerHTML = CONFIG.events.map((e, i) => `${i ? '<svg class="orn" viewBox="0 0 220 50" aria-hidden="true"><use href="#orn"/></svg>' : ""}
    <div class="event reveal in"><span class="tag"><span>${t[e.key] || e.key}</span></span><p class="time">${e.time}</p>
    <p class="venue">${e.venue}</p><p class="addr">${e.address}</p>
    <a class="pill" href="${e.mapsUrl}" target="_blank" rel="noopener"><span>${t.directions}</span></a></div>`).join("");
  $("#rsvpLine").textContent = t.rsvpLine(CONFIG.rsvpDeadline[lang]);
  $("#footDate").textContent = date.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
  $("#langBtn").textContent = lang === "tr" ? "EN" : "TR";
  tick(); requestAnimationFrame(allPearls);
}
function fillStatic() {
  const [a, b] = CONFIG.names;
  ["name1", "fName1"].forEach(i => $("#" + i).textContent = a);
  ["name2", "fName2"].forEach(i => $("#" + i).textContent = b);
  document.querySelectorAll(".ini").forEach(n => n.textContent = CONFIG.initials);
  document.title = `${a} & ${b}`;
}

/* ---------- Countdown ---------- */
function tick() {
  const s = Math.max(0, Math.floor((date - Date.now()) / 1000)), p = n => String(n).padStart(2, "0");
  $("#cd-d").textContent = p(Math.floor(s / 86400)); $("#cd-h").textContent = p(Math.floor(s % 86400 / 3600));
  $("#cd-m").textContent = p(Math.floor(s % 3600 / 60)); $("#cd-s").textContent = p(s % 60);
  if (!s) $("#countdown .script").textContent = T().countDone;
}

/* ---------- Memory wall ---------- */
function buildWall() {
  const items = CONFIG.gallery.length ? CONFIG.gallery : Array.from({ length: CONFIG.galleryPlaceholders }, () => null);
  $("#wall").innerHTML = items.map(src => `<div class="frame"><svg class="bloom-mini" viewBox="0 0 70 60" aria-hidden="true"><use href="#bloom"/></svg>
    <div class="ph">${src ? `<img src="${src}" alt="" loading="lazy">` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M3 17l5-4 4 3 3-2 6 4"/></svg>`}</div></div>`).join("");
}

/* ---------- Scroll reveal (fade + rise, staggered) ---------- */
function setupReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return;
    e.target.style.transitionDelay = Math.min([...e.target.parentElement.children].indexOf(e.target), 4) * .1 + "s";
    e.target.classList.add("in"); io.unobserve(e.target); }), { threshold: .12, rootMargin: "0px 0px -5% 0px" });
  document.querySelectorAll(".reveal:not(.in),.frame").forEach(el => io.observe(el));
}

/* ---------- Music: mp3 if provided, else a soft synthesized melody; fades in ---------- */
const music = (() => {
  let ctx, master, audio, timer, on = false, fade;
  const notes = [392, 494, 587, 523, 440, 523, 659, 587, 392, 494, 587, 784, 659, 587, 523, 494];
  const setMuted = m => $("#muteBtn").classList.toggle("muted", m);
  function synth() {
    ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(.55, ctx.currentTime + 3.5);   // fade in
    let i = 0;
    const play = () => { const f = notes[i++ % notes.length], t = ctx.currentTime;
      [f, f / 2].forEach((fr, k) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = fr;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(k ? .05 : .09, t + .04); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8);
        o.connect(g).connect(master); o.start(t); o.stop(t + 1.9); }); };
    play(); timer = setInterval(play, 700);
  }
  return {
    start() { try {
      if (CONFIG.music.url) { audio = audio || Object.assign(new Audio(CONFIG.music.url), { loop: true, volume: 0 }); audio.play().catch(() => {});
        clearInterval(fade); fade = setInterval(() => { audio.volume = Math.min(.7, audio.volume + .035); if (audio.volume >= .7) clearInterval(fade); }, 120); }
      else if (!ctx) synth(); else ctx.resume();
      on = true; setMuted(false); } catch (e) {} },
    toggle() { on = !on; if (audio) on ? audio.play() : audio.pause(); if (ctx) on ? ctx.resume() : ctx.suspend(); setMuted(!on); }
  };
})();

/* ---------- RSVP (saved in localStorage + console for now) ---------- */
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
buildLace(); fillStatic(); buildWall(); setupRsvp(); applyLang();
setInterval(tick, 1000);
let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(allPearls, 120); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(allPearls);
$("#langBtn").onclick = () => { lang = lang === "tr" ? "en" : "tr"; applyLang(); };
$("#muteBtn").onclick = () => music.toggle();
$("#seal").onclick = () => {
  $("#seal").classList.add("cracked"); music.start();           // seal cracks, music fades in
  setTimeout(() => { document.body.classList.add("open"); setupReveal(); }, 380);   // doors swing open
  setTimeout(() => { document.body.classList.remove("locked"); window.scrollTo(0, 0); }, 1800);
};
$("#openBtn").onclick = e => { e.preventDefault(); $("#story").scrollIntoView({ behavior: "smooth" }); };
