/* =====================================================================
   Embossed lace + pearl invitation
   EDIT ONLY THE CONFIG BLOCK: names, date, time, venue, map link, program, music, language, texts.
   ===================================================================== */
const CONFIG = {
  names: ["Name", "Name"],            // placeholder couple
  eventDate: "2027-08-21T19:00:00",   // local time of the venue (ISO)
  defaultLang: "auto",                // "tr" | "en" | "auto" (follows the phone)
  music: { url: "" },                 // e.g. "music.mp3"; empty = soft built-in melody
  venue: {
    name: "Venue Name",
    address: "Street Address, City",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Venue+Name+City"
  },
  program: [                          // vertical timeline: time + text per language
    { time: "19.00", tr: "Karşılama ve hoş geldiniz", en: "Welcome & arrivals" },
    { time: "19.30", tr: "Nikâh töreni",              en: "Ceremony" },
    { time: "20.30", tr: "Akşam yemeği",              en: "Dinner" },
    { time: "22.00", tr: "Pasta ve ilk dans",         en: "Cake & first dance" },
    { time: "23.30", tr: "Gecenin sonu",              en: "Farewell" }
  ],
  rsvpDeadline: { tr: "1 Ağustos 2027", en: "1 August 2027" },
  gallery: [],                        // image paths for the memory wall; empty = 4 placeholder frames
  galleryPlaceholders: 4,

  /* ---- All visible text, per language ---- */
  i18n: {
    en: {
      openInvite: "Open invitation", heroKicker: "We are getting married", scrollDown: "Scroll down",
      whenTitle: "Save the Date", time: "Time",
      countTitle: "Countdown", countLine: "Until we say “I do”", days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec", countDone: "Today is the day",
      venueTitle: "Venue", directions: "Directions", programTitle: "The Day",
      galleryTitle: "Memory Wall", galleryLine: "Moments we treasure", upload: "Upload your photos",
      rsvpTitle: "RSVP", rsvpLine: d => `Kindly reply by ${d}`,
      fName: "Full name", fGuests: "Number of guests", fAttending: "Will you attend?", yes: "Joyfully yes", no: "Regretfully no", send: "Send reply",
      thanksYes: n => `Thank you, ${n}. We can't wait to celebrate with you.`, thanksNo: n => `Thank you, ${n}. You will be missed.`,
      footThanks: "Thank you for being part of our story"
    },
    tr: {
      openInvite: "Daveti aç", heroKicker: "Evleniyoruz", scrollDown: "Aşağı kaydır",
      whenTitle: "Tarihi Not Edin", time: "Saat",
      countTitle: "Geri Sayım", countLine: "“Evet” dememize kalan süre", days: "Gün", hours: "Saat", minutes: "Dk", seconds: "Sn", countDone: "Büyük gün bugün",
      venueTitle: "Mekân", directions: "Yol Tarifi", programTitle: "Günün Akışı",
      galleryTitle: "Anı Duvarı", galleryLine: "Kalbimize dokunan anlar", upload: "Fotoğraflarını yükle",
      rsvpTitle: "Katılım", rsvpLine: d => `Lütfen ${d} tarihine kadar yanıtlayın`,
      fName: "Ad soyad", fGuests: "Kişi sayısı", fAttending: "Katılacak mısınız?", yes: "Evet, katılıyorum", no: "Katılamıyorum", send: "Yanıtı Gönder",
      thanksYes: n => `Teşekkürler ${n}, sizinle kutlamak için sabırsızlanıyoruz.`, thanksNo: n => `Teşekkürler ${n}, yokluğunuzu hissedeceğiz.`,
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
   ORIGINAL LACE ARTWORK (SVG). Rotations live INSIDE filtered groups so the
   light always comes from the top-left, also on the mirrored bottom-right cluster.
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

/* ---------- Door lace: big roses + leaves + pearls, denser at outer edges and top/bottom, lighter at the seam ---------- */
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const leafShape = l => `<path d="M0 0C${l*.25} ${-l*.27} ${l*.72} ${-l*.25} ${l} 0C${l*.72} ${l*.25} ${l*.25} ${l*.27} 0 0Z" fill="url(#petal)" stroke="${L1}" stroke-width=".7"/>` +
  `<path d="M${l*.04} 0H${l*.93}M${l*.28} 0L${l*.5} ${-l*.12}M${l*.28} 0L${l*.5} ${l*.12}M${l*.5} 0L${l*.72} ${-l*.1}M${l*.5} 0L${l*.72} ${l*.1}" fill="none" stroke="${L2}" stroke-width=".7"/>`;
const leafBatch = list => `<g ${E}>` + list.map(l => `<g transform="translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.a.toFixed(0)})">${leafShape(l.l)}</g>`).join("") + `</g>`;
const miniRose = (x, y, r, rot) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g ${E}>${petalRing(7, r*.64, r*.38, rot)}${petalRing(5, r*.36, r*.3, rot + 25)}<circle r="${r*.16}" fill="url(#petal)" stroke="${L1}" stroke-width=".6"/></g></g>`;

function doorLace(side, seed) {
  const W = 195, H = 844, R = rng(seed);
  const dSeam = x => side === "L" ? W - x : x;
  const dens = (x, y) => Math.min(1, .16 + .84 * Math.pow(dSeam(x) / W, 1.15) + Math.max(0, .6 * (1 - Math.min(y, H - y) / 190)));
  const roses = [];
  const place = (count, rmin, rmax, minSeam) => { let n = 0;
    for (let t = 0; t < 1400 && n < count; t++) {
      const x = R() * (W + 30) - 15, y = R() * (H + 30) - 15, r = rmin + R() * (rmax - rmin);
      if (R() > dens(x, y) || dSeam(x) < minSeam + r * .3) continue;
      if (roses.some(o => Math.hypot(o.x - x, o.y - y) < (o.r + r) * .74)) continue;
      roses.push({ x, y, r, rot: R() * 360, big: rmax > 30 }); n++; } };
  place(11, 36, 54, 14); place(16, 17, 27, 6);
  const leaves = [];
  roses.forEach(o => { const k = o.big ? 4 : 2; for (let i = 0; i < k; i++) { const a = R() * 360, rad = o.r * (.72 + R() * .25);
    leaves.push({ x: o.x + Math.cos(a * Math.PI / 180) * rad, y: o.y + Math.sin(a * Math.PI / 180) * rad, a: a + (R() - .5) * 30, l: o.r * (.95 + R() * .5) }); } });
  for (let t = 0; t < 400 && leaves.length < roses.length * 3 + 36; t++) { const x = R() * W, y = R() * H; if (R() > dens(x, y) * .85 + .1) continue;
    leaves.push({ x, y, a: R() * 360, l: 22 + R() * 26 }); }
  const pearlsL = []; roses.forEach(o => { const k = o.big ? 4 : 1; for (let i = 0; i < k; i++) { const a = R() * 6.28, rad = o.r * (1.05 + R() * .55); pearlsL.push([+(o.x + Math.cos(a) * rad).toFixed(1), +(o.y + Math.sin(a) * rad).toFixed(1), +(2.2 + R() * 2.2).toFixed(1)]); } });
  for (let t = 0; t < 200; t++) { const x = R() * W, y = R() * H; if (R() < dens(x, y) * .18) pearlsL.push([+x.toFixed(1), +y.toFixed(1), +(1.8 + R() * 1.8).toFixed(1)]); }
  const big = roses.filter(o => o.big).map(o => rose(o.x, o.y, o.r, o.rot)).join("");
  const small = roses.filter(o => !o.big).map(o => miniRose(o.x, o.y, o.r, o.rot)).join("");
  return leafBatch(leaves) + big + small + pearls(pearlsL);
}

function buildLace() {
  $("#lace-tl").innerHTML = cluster(false);
  $("#lace-br").innerHTML = cluster(true);
  $("#artL").innerHTML = doorLace("L", 11);
  $("#artR").innerHTML = doorLace("R", 29);
  const row = []; for (let i = 0; i < 6; i++) { row.push([20 + i * 9, 25, 2], [200 - i * 9, 25, 2]); }
  $("#orn").innerHTML = `<path d="M18 25H84M136 25H202" stroke="rgba(201,174,133,.7)" stroke-width=".7"/>` + pearls(row) +
    leaf(96, 27, 30, 170) + leaf(124, 27, 30, 10) + leaf(98, 22, 24, -165) + leaf(122, 22, 24, -15) + rose(110, 24, 15, 10);
  /* clasp sprig: one stem, tiny leaves, white relief */
  let sp = `<path d="M20 60C19 46 21 32 20 6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
  [[19,50,-1],[21,44,1],[19.5,37,-1],[20.5,30,1],[20,23,-1],[20.4,16,1]].forEach(([x, y, s], i) => sp += `<path transform="translate(${x} ${y}) rotate(${s * (55 - i * 4)})" d="M0 0C5-6 12-5 15 0C12 5 5 6 0 0Z" fill="#fff"/>`);
  sp += `<path d="M20 6C16 2 18-2 20-4C22-2 24 2 20 6Z" fill="#fff"/>`;
  $("#sprig").innerHTML = `<g ${E}>${sp}</g>`;
}

/* ---------- Hero frame: raised double line, arch with ogee (inward-notched) shoulders ---------- */
function framePath(w, h, i, n) {
  const x0 = i, x1 = w - i, yb = h - i, rb = 16, r = (x1 - x0) / 2 - n, yk = i + r + 10, ys = yk + 48;
  return `M${x0 + rb} ${yb}L${x1 - rb} ${yb}Q${x1} ${yb} ${x1} ${yb - rb}L${x1} ${ys}` +
    `C${x1} ${ys - 22} ${x1 - n} ${ys - 14} ${x1 - n} ${yk}A${r} ${r} 0 0 0 ${x0 + n} ${yk}` +
    `C${x0 + n} ${ys - 14} ${x0} ${ys - 22} ${x0} ${ys}L${x0} ${yb - rb}Q${x0} ${yb} ${x0 + rb} ${yb}Z`;
}
function drawFrame() {
  const st = $("#stage"), w = st.clientWidth, h = st.clientHeight, svg = $("#frameSvg"); if (!w) return;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.innerHTML = `<path d="${framePath(w, h, 8, 26)}" fill="url(#face)" opacity=".7"/>` +
    `<path d="${framePath(w, h, 10, 26)}" fill="none" stroke="#F4ECE4" stroke-width="9" stroke-linejoin="round" ${E}/>` +
    `<path d="${framePath(w, h, 24, 24)}" fill="none" stroke="#F4ECE4" stroke-width="3" stroke-linejoin="round" ${E}/>` +
    `<path d="${framePath(w, h, 19, 25)}" fill="none" stroke="rgba(201,174,133,.7)" stroke-width=".7" stroke-linejoin="round"/>`;
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
  const longDate = up(date.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" })), hm = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");
  $("#heroDate").textContent = longDate; $("#introDate").textContent = longDate + " · " + hm;
  $("#bDayLbl").textContent = up(date.toLocaleDateString(loc, { weekday: "long" }));
  $("#bDate").textContent = up(date.toLocaleDateString(loc, { day: "numeric", month: "short" }).replace(".", ""));
  $("#bTime").textContent = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");
  $("#vName").textContent = CONFIG.venue.name; $("#vAddress").textContent = CONFIG.venue.address; $("#directions").href = CONFIG.venue.mapsUrl;
  $("#timeline").innerHTML = CONFIG.program.map(p => `<li class="reveal"><span class="tl-time">${p.time}</span><p class="tl-text">${p[lang]}</p></li>`).join("");
  document.querySelectorAll("#timeline .reveal").forEach(el => el.dataset.late = 1);
  $("#rsvpLine").textContent = t.rsvpLine(CONFIG.rsvpDeadline[lang]);
  $("#footDate").textContent = date.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
  $("#langBtn").textContent = lang === "tr" ? "EN" : "TR";
  tick(); requestAnimationFrame(() => { allPearls(); drawFrame(); });
  if (document.body.classList.contains("open")) setupReveal();
}
function fillStatic() {
  const [a, b] = CONFIG.names;
  ["name1", "fName1"].forEach(i => $("#" + i).textContent = a);
  ["name2", "fName2"].forEach(i => $("#" + i).textContent = b);
  document.title = `${a} & ${b}`;
}

/* ---------- Countdown ---------- */
function tick() {
  const s = Math.max(0, Math.floor((date - Date.now()) / 1000)), p = n => String(n).padStart(2, "0");
  $("#cd-d").textContent = p(Math.floor(s / 86400)); $("#cd-h").textContent = p(Math.floor(s % 86400 / 3600));
  $("#cd-m").textContent = p(Math.floor(s % 3600 / 60)); $("#cd-s").textContent = p(s % 60);
  if (!s) $("#countdown .accent").textContent = T().countDone;
}

/* ---------- Memory wall (lace-cornered frames) + local upload ---------- */
const frameHTML = src => `<div class="mframe"><svg class="lc a" viewBox="0 0 260 260" aria-hidden="true"><use href="#lace-tl"/></svg><svg class="lc b" viewBox="0 0 260 260" aria-hidden="true"><use href="#lace-br"/></svg>
  <div class="ph">${src ? `<img src="${src}" alt="" loading="lazy">` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M3 17l5-4 4 3 3-2 6 4"/></svg>`}</div></div>`;
function buildWall() {
  const items = CONFIG.gallery.length ? CONFIG.gallery : Array.from({ length: CONFIG.galleryPlaceholders }, () => null);
  $("#wall").innerHTML = items.map(frameHTML).join("");
  $("#upload").addEventListener("change", e => {            // photos stay in this browser for now
    const wall = $("#wall"); if (!CONFIG.gallery.length && !wall.dataset.filled) { wall.innerHTML = ""; wall.dataset.filled = 1; }
    [...e.target.files].forEach(f => { wall.insertAdjacentHTML("beforeend", frameHTML(URL.createObjectURL(f))); });
    wall.querySelectorAll(".mframe:not(.in)").forEach(el => el.classList.add("in"));
  });
}

/* ---------- Scroll reveal (fade + rise, staggered) ---------- */
function setupReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return;
    e.target.style.transitionDelay = Math.min([...e.target.parentElement.children].indexOf(e.target), 4) * .1 + "s";
    e.target.classList.add("in"); io.unobserve(e.target); }), { threshold: .12, rootMargin: "0px 0px -5% 0px" });
  document.querySelectorAll(".reveal:not(.in),.mframe:not(.in)").forEach(el => io.observe(el));
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
let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { allPearls(); drawFrame(); }, 120); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { allPearls(); drawFrame(); });
$("#langBtn").onclick = () => { lang = lang === "tr" ? "en" : "tr"; applyLang(); };
$("#muteBtn").onclick = () => music.toggle();
let opened = false;
function openInvitation() {
  if (opened) return; opened = true;
  $("#seal").classList.add("go"); music.start();                                   // clasp glows and fades, music fades in
  setTimeout(() => { document.body.classList.add("open"); setupReveal(); }, 650);  // panels slide apart
  setTimeout(() => { document.body.classList.remove("locked"); window.scrollTo(0, 0); }, 2300);
}
$("#seal").onclick = openInvitation; $("#openInvite").onclick = openInvitation;
$("#scrollBtn").onclick = e => { e.preventDefault(); $("#when").scrollIntoView({ behavior: "smooth" }); };
