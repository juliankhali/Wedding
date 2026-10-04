/* ORIGINAL lace artwork generators (used only by tools/bake.js to render the images in /img) */
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


/* Assets that are baked to images (see tools/bake.js) */
function ornSVG() {
  const row = []; for (let i = 0; i < 6; i++) { row.push([20 + i * 9, 25, 2], [200 - i * 9, 25, 2]); }
  return `<path d="M18 25H84M136 25H202" stroke="rgba(201,174,133,.7)" stroke-width=".7"/>` + pearls(row) +
    leaf(96, 27, 30, 170) + leaf(124, 27, 30, 10) + leaf(98, 22, 24, -165) + leaf(122, 22, 24, -15) + rose(110, 24, 15, 10);
}
function sprigSVG() {
  let sp = `<path d="M20 60C19 46 21 32 20 6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
  [[19,50,-1],[21,44,1],[19.5,37,-1],[20.5,30,1],[20,23,-1],[20.4,16,1]].forEach(([x, y, s], i) => sp += `<path transform="translate(${x} ${y}) rotate(${s * (55 - i * 4)})" d="M0 0C5-6 12-5 15 0C12 5 5 6 0 0Z" fill="#fff"/>`);
  sp += `<path d="M20 6C16 2 18-2 20-4C22-2 24 2 20 6Z" fill="#fff"/>`;
  return `<g ${E}>${sp}</g>`;
}
window.ART = { tl: () => cluster(false), br: () => cluster(true), doorL: () => doorLace("L", 11), doorR: () => doorLace("R", 29), orn: ornSVG, sprig: sprigSVG };
