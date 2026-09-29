/* Drawn artwork used when a picture file is missing from /assets:
   the ivory embossed envelope, the wax seal, and simple stand-ins for the
   cover, the couple illustration and the photo. Everything is SVG. */
window.ART = (() => {
  const W = 540, H = 960;
  const f = (n) => Math.round(n * 10) / 10;
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const bez = (p, t) => {
    const u = 1 - t;
    return [u ** 3 * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t ** 3 * p[3][0],
      u ** 3 * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t ** 3 * p[3][1]];
  };

  /* ---------- embossed shapes: each one is drawn as soft shadow + highlight + paper face,
     in painting order, so petals and leaves overlap each other like real relief ---------- */
  const DEPTH = 1.5;
  function raised(d, { sw = 0.8, stroke = "rgba(150,130,100,.5)", depth = DEPTH } = {}) {
    return `<path d="${d}" transform="translate(${f(depth * 1.9)} ${f(depth * 2.5)})" fill="rgba(96,76,44,.09)"/>` +
      `<path d="${d}" transform="translate(${f(depth * 1.0)} ${f(depth * 1.3)})" fill="rgba(96,76,44,.16)"/>` +
      `<path d="${d}" transform="translate(${f(-depth * 0.6)} ${f(-depth * 0.7)})" fill="#fff" fill-opacity=".95"/>` +
      `<path d="${d}" fill="url(#face)" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  }
  const groove = (d, sw = 0.7) =>
    `<path d="${d}" transform="translate(.6 .7)" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="rgba(140,120,90,.42)" stroke-width="${sw}" stroke-linecap="round"/>`;
  const stem = (d, w) =>
    `<path d="${d}" transform="translate(1.6 2.1)" fill="none" stroke="rgba(96,76,44,.18)" stroke-width="${f(w + 0.8)}" stroke-linecap="round"/>` +
    `<path d="${d}" transform="translate(-.5 -.6)" fill="none" stroke="#fff" stroke-width="${f(w + 0.6)}" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="url(#face)" stroke-width="${w}" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="rgba(150,130,100,.35)" stroke-width=".5" stroke-linecap="round"/>`;

  /* ---------- flowers, leaves, sprigs ---------- */
  function petal(cx, cy, r, a, w) {
    const P = (ang, k) => `${f(cx + Math.cos(ang) * r * k)} ${f(cy + Math.sin(ang) * r * k)}`;
    return `M${f(cx)} ${f(cy)} C${P(a - w * 1.05, 0.4)} ${P(a - w, 0.99)} ${P(a, 1)} C${P(a + w, 0.99)} ${P(a + w * 1.05, 0.4)} ${f(cx)} ${f(cy)}Z`;
  }
  // A layered rose/anemone: outer petals are painted first, inner ones on top.
  function flower(cx, cy, r, rot, R, layers) {
    layers = layers || [[8, 1, 0.5, 0], [7, 0.76, 0.54, 0.4], [6, 0.53, 0.6, 0.2], [5, 0.3, 0.68, 0.5]];
    let out = "";
    layers.forEach(([n, k, w, off]) => {
      for (let i = 0; i < n; i++) {
        const a = rot + off + (i / n) * Math.PI * 2 + (R() - 0.5) * 0.1, rr = r * k * (0.94 + R() * 0.12);
        out += raised(petal(cx, cy, rr, a, w), { depth: DEPTH * (0.55 + k * 0.5) });
        out += groove(`M${f(cx + Math.cos(a) * rr * 0.45)} ${f(cy + Math.sin(a) * rr * 0.45)} L${f(cx + Math.cos(a) * rr * 0.84)} ${f(cy + Math.sin(a) * rr * 0.84)}`, 0.6);
      }
    });
    out += raised(`M${f(cx - r * 0.13)} ${f(cy)} a${f(r * 0.13)} ${f(r * 0.13)} 0 1 0 ${f(r * 0.26)} 0 a${f(r * 0.13)} ${f(r * 0.13)} 0 1 0 ${f(-r * 0.26)} 0Z`, { depth: 0.8 });
    for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283; out += `<circle cx="${f(cx + Math.cos(a) * r * 0.08)}" cy="${f(cy + Math.sin(a) * r * 0.08)}" r="${f(r * 0.022 + 0.4)}" fill="rgba(140,120,90,.45)"/>`; }
    return out;
  }
  function leaf(x, y, len, wid, a) {
    const tx = x + Math.cos(a) * len, ty = y + Math.sin(a) * len, nx = -Math.sin(a) * wid, ny = Math.cos(a) * wid;
    const mx = x + Math.cos(a) * len * 0.45, my = y + Math.sin(a) * len * 0.45;
    let out = raised(`M${f(x)} ${f(y)} Q${f(mx + nx)} ${f(my + ny)} ${f(tx)} ${f(ty)} Q${f(mx - nx)} ${f(my - ny)} ${f(x)} ${f(y)}Z`, { depth: 1.2 });
    let veins = `M${f(x)} ${f(y)} L${f(tx)} ${f(ty)}`;
    for (let k = 1; k < 5; k++) {
      const t = k / 5, px = x + (tx - x) * t, py = y + (ty - y) * t, sz = wid * 0.62 * Math.sin(Math.PI * Math.min(0.96, t + 0.08)) + 0.6;
      veins += ` M${f(px)} ${f(py)} l${f(nx / wid * sz + Math.cos(a) * sz * 0.9)} ${f(ny / wid * sz + Math.sin(a) * sz * 0.9)} M${f(px)} ${f(py)} l${f(-nx / wid * sz + Math.cos(a) * sz * 0.9)} ${f(-ny / wid * sz + Math.sin(a) * sz * 0.9)}`;
    }
    return out + groove(veins, 0.55);
  }
  const bud = (x, y, a, s) => {
    const d = `M${f(x)} ${f(y - 6.6 * s)} C${f(x + 5.2 * s)} ${f(y - 3 * s)} ${f(x + 4.6 * s)} ${f(y + 4 * s)} ${f(x)} ${f(y + 6.6 * s)} C${f(x - 4.6 * s)} ${f(y + 4 * s)} ${f(x - 5.2 * s)} ${f(y - 3 * s)} ${f(x)} ${f(y - 6.6 * s)}Z`;
    return `<g transform="rotate(${f(a * 57.3 + 90)} ${f(x)} ${f(y)})">${raised(d, { depth: 1 })}${groove(`M${f(x)} ${f(y - 5 * s)} L${f(x)} ${f(y + 5 * s)}`, 0.5)}</g>`;
  };

  // A flowering vine along a cubic curve (returns svg in painting order).
  function vine(pts, R, { leaves = 10, flowers = [], buds = 3, sc = 1 } = {}) {
    const d = `M${pts[0]} C${pts[1]} ${pts[2]} ${pts[3]}`;
    let out = stem(d, f(2.3 * sc));
    for (let i = 0; i < leaves; i++) {
      const t = 0.06 + (i / leaves) * 0.9, [x, y] = bez(pts, t), [x2, y2] = bez(pts, Math.min(1, t + 0.01));
      const dir = Math.atan2(y2 - y, x2 - x), sd = i % 2 ? 1 : -1, a = dir + sd * (0.7 + R() * 0.45), L = (26 + R() * 16) * sc;
      out += leaf(x, y, L, L * 0.32, a);
    }
    for (let i = 0; i < buds; i++) {
      const t = 0.15 + R() * 0.75, [x, y] = bez(pts, t), a = (R() - 0.5) * 2.4 - Math.PI / 2, L = (15 + R() * 8) * sc;
      const bx = x + Math.cos(a) * L, by = y + Math.sin(a) * L;
      out += stem(`M${f(x)} ${f(y)} L${f(bx)} ${f(by)}`, f(1.3 * sc)) + bud(bx, by, a, sc);
    }
    flowers.forEach(([t, r]) => { const [x, y] = bez(pts, t); out += flower(x, y, r * sc, R() * 6, R, [[7, 1, 0.52, 0], [6, 0.7, 0.58, 0.3], [4, 0.4, 0.66, 0.1]]); });
    return out;
  }

  // The bouquet on the top / bottom flap. dir = 1 (top flap) or -1 (bottom flap).
  function bouquet(cx, cy, dir, R) {
    const T = (x, y) => [cx + x, cy + y * dir], A = (a) => (dir === 1 ? a : -a);
    let out = "";
    // fan of leaves growing from a point under the big flower
    const base = T(0, 72);
    for (let i = 0; i < 22; i++) {
      const t = i / 21, a = A(-Math.PI * (0.94 - t * 0.88) - 0.02 + (R() - 0.5) * 0.08), L = 92 + Math.sin(t * Math.PI) * 70 + R() * 18;
      out += leaf(base[0], base[1], L * (1 - Math.abs(Math.cos(a)) * 0.2), 27 + R() * 8, a);
    }
    // two curling sprigs with small flowers and buds
    [-1, 1].forEach((sd) => {
      out += vine([T(sd * 8, 64), T(sd * 74, 70), T(sd * 122, 34), T(sd * 140, -20)], R, { leaves: 6, flowers: [[1, 17]], buds: 2, sc: 0.95 });
      out += vine([T(sd * 6, 76), T(sd * 44, 104), T(sd * 96, 100), T(sd * 130, 78)], R, { leaves: 5, flowers: [], buds: 2, sc: 0.8 });
    });
    // side flowers, then the large flower on top
    [[-80, 10, 31], [80, 10, 31], [-44, -36, 25], [44, -36, 25], [0, 40, 24]].forEach(([x, y, r]) => { const p = T(x, y); out += flower(p[0], p[1], r, R() * 6, R, [[7, 1, 0.52, 0], [6, 0.7, 0.58, 0.3], [4, 0.4, 0.66, 0.1]]); });
    const c = T(0, -6);
    out += flower(c[0], c[1], 64, R() * 6, R);
    return out;
  }

  /* ---------- the closed envelope (540 x 960) ---------- */
  function envelopeSVG() {
    const paper = "#f1eadf", R = rng(9);
    let art = "";
    art += bouquet(270, 206, 1, R);
    art += bouquet(270, 754, -1, R);
    // side vines: the right one is a mirror of the left, drawn separately so the light stays top-left
    [false, true].forEach((mx) => {
      const X = (x) => (mx ? W - x : x);
      art += vine([[X(46), 300], [X(100), 400], [X(4), 540], [X(58), 652]], R, { leaves: 12, flowers: [[0.1, 21], [0.44, 27], [0.78, 22], [1, 19]], buds: 4, sc: 1.05 });
      art += vine([[X(40), 648], [X(92), 590], [X(112), 522], [X(96), 470]], R, { leaves: 6, flowers: [], buds: 2, sc: 0.8 });
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="face" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H}"><stop offset="0" stop-color="#fdfaf3"/><stop offset=".55" stop-color="#f6f0e4"/><stop offset="1" stop-color="#ece3d2"/></linearGradient>
        <filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .42  0 0 0 0 .36  0 0 0 0 .26  0 0 0 .12 0"/></filter>
        <filter id="s"><feGaussianBlur stdDeviation="3"/></filter>
        <linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf8"/><stop offset="1" stop-color="#f1e9dc"/></linearGradient>
        <linearGradient id="bot" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e8dece"/><stop offset="1" stop-color="#f3ecdf"/></linearGradient>
        <linearGradient id="lft" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ebe1d1"/><stop offset="1" stop-color="#f2ebdf"/></linearGradient>
        <linearGradient id="rgt" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#f7f1e7"/><stop offset="1" stop-color="#eee5d6"/></linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="${paper}"/>
      <path d="M0 0H${W}L270 480Z" fill="url(#top)"/><path d="M0 ${H}H${W}L270 480Z" fill="url(#bot)"/>
      <path d="M0 0L270 480L0 ${H}Z" fill="url(#lft)"/><path d="M${W} 0L${W} ${H}L270 480Z" fill="url(#rgt)"/>
      ${art}
      <g fill="none" stroke-linecap="round">
        <path d="M0 0L270 480M${W} 0L270 480M0 ${H}L270 480M${W} ${H}L270 480" stroke="#8d7f66" stroke-opacity=".3" stroke-width="2.2" filter="url(#s)"/>
        <path d="M0 0L270 480M${W} 0L270 480M0 ${H}L270 480M${W} ${H}L270 480" stroke="#ffffff" stroke-opacity=".9" stroke-width="1" transform="translate(-1.2 -1.2)"/>
      </g>
      <rect width="${W}" height="${H}" filter="url(#n)"/>
    </svg>`;
  }

  /* ---------- the wax seal with the initials ---------- */
  function blob(cx, cy, r, n = 64) {
    const bump = (th, at, w, h) => { let d = Math.abs(th - at); d = Math.min(d, 6.283 - d); return h * Math.exp(-((d / w) ** 2)); };
    const pts = Array.from({ length: n }, (_, i) => {
      const th = (i / n) * 6.283, k = 1 + 0.03 * Math.sin(3 * th + 0.7) + 0.02 * Math.sin(5 * th + 2.1) + 0.012 * Math.sin(11 * th) + bump(th, 2.2, 0.16, 0.06) + bump(th, 5.4, 0.12, 0.045);
      return [cx + Math.cos(th) * r * k, cy + Math.sin(th) * r * k];
    });
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + "Z";
  }
  function sealSVG(text) {
    const dots = Array.from({ length: 40 }, (_, i) => { const a = (i / 40) * 6.283; return `<circle cx="${f(80 + Math.cos(a) * 47)}" cy="${f(80 + Math.sin(a) * 47)}" r="1.15"/>`; }).join("");
    return `<svg viewBox="0 0 160 160" aria-hidden="true">
      <path d="${blob(80, 80, 68)}" fill="url(#waxg)" filter="url(#wax)"/>
      <circle cx="80" cy="80" r="53" fill="#fbf5e6" filter="url(#waxpress)"/>
      <circle cx="80" cy="80" r="50" fill="none" stroke="url(#gold)" stroke-width="2.6"/>
      <circle cx="80" cy="80" r="43.5" fill="none" stroke="url(#gold)" stroke-width="1"/>
      <g fill="url(#gold)">${dots}</g>
      <text x="80" y="95" text-anchor="middle" font-family="'Great Vibes', cursive" font-size="${text.length > 3 ? 40 : 48}" fill="url(#gold)" stroke="#a87a25" stroke-width=".35" direction="ltr">${text}</text>
    </svg>`;
  }

  /* ---------- simple stand-ins for pictures ---------- */
  function coverSVG() {
    const R = rng(11);
    let blooms = "";
    const cl = ["#f7c6d0", "#f9dfe4", "#ffffff", "#f2a9bb", "#cfe6b8", "#a9cf95"];
    for (let i = 0; i < 260; i++) {
      const t = R(), side = R() < 0.5 ? 0 : 1;
      let x, y;
      if (R() < 0.6) { // along the arch
        const a = Math.PI * (0.05 + t * 0.9); x = 270 + Math.cos(a) * (190 + R() * 60) * (side ? 1 : -1) * 0.95; y = 250 - Math.sin(a) * 110 + R() * 60 + (1 - Math.sin(a)) * 240;
      } else { x = side ? 452 + R() * 88 : R() * 88; y = 330 + R() * 520; }
      blooms += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(6 + R() * 16)}" fill="${cl[Math.floor(R() * cl.length)]}" opacity="${f(0.7 + R() * 0.3)}"/>`;
    }
    const balusters = Array.from({ length: 12 }, (_, i) => `<rect x="${58 + i * 37}" y="812" width="16" height="70" rx="7" fill="#efe3d6"/>`).join("");
    const houses = Array.from({ length: 26 }, (_, i) => { const x = 60 + i * 16 + R() * 6; return `<rect x="${f(x)}" y="${f(548 - R() * 12)}" width="${f(9 + R() * 6)}" height="${f(12 + R() * 8)}" fill="${["#e9a685", "#f5dcc6", "#dd8f6e", "#fbe9d6"][Math.floor(R() * 4)]}"/>`; }).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd7f3"/><stop offset=".55" stop-color="#e9eefa"/><stop offset="1" stop-color="#fbeee6"/></linearGradient>
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc3e6"/><stop offset="1" stop-color="#cfe3f3"/></linearGradient>
        <linearGradient id="stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6cbbf"/><stop offset=".5" stop-color="#f7e8de"/><stop offset="1" stop-color="#e2c5b8"/></linearGradient>
        <filter id="bl"><feGaussianBlur stdDeviation="4"/></filter><filter id="bl2"><feGaussianBlur stdDeviation="1.2"/></filter>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#sky)"/>
      <ellipse cx="270" cy="360" rx="220" ry="150" fill="#fff" opacity=".55" filter="url(#bl)"/>
      <path d="M0 520 L90 470 L170 505 L260 445 L360 500 L450 462 L540 510 V580 H0Z" fill="#b9c9df" filter="url(#bl2)"/>
      <path d="M0 545 L120 505 L230 540 L330 500 L430 535 L540 515 V600 H0Z" fill="#9fb6d2" filter="url(#bl2)"/>
      <rect x="0" y="552" width="${W}" height="240" fill="url(#lake)"/>
      <g filter="url(#bl2)">${houses}</g>
      <path d="M0 800 H${W} V960 H0Z" fill="#f3e6da"/>
      <rect x="40" y="800" width="460" height="14" rx="4" fill="#efe3d6"/>${balusters}<rect x="40" y="880" width="460" height="16" rx="4" fill="#e7d8ca"/>
      <path d="M0 0H${W}V960H0Z M96 880 V340 C96 90 444 90 444 340 V880Z" fill-rule="evenodd" fill="url(#stone)"/>
      <path d="M96 880 V340 C96 90 444 90 444 340 V880" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>
      <g filter="url(#bl2)">${blooms}</g>
    </svg>`;
  }
  function coupleSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
      <ellipse cx="150" cy="380" rx="105" ry="10" fill="#000" opacity=".1"/>
      <g><rect x="80" y="112" width="62" height="150" rx="14" fill="#1f2b4d"/><path d="M104 112 L111 150 L118 112Z" fill="#fff"/><rect x="88" y="256" width="20" height="112" rx="6" fill="#1a2340"/><rect x="114" y="256" width="20" height="112" rx="6" fill="#1a2340"/>
        <circle cx="111" cy="86" r="22" fill="#f1cfb5"/><path d="M89 80 Q111 52 133 80 Q124 66 111 66 Q98 66 89 80Z" fill="#2a2119"/><path d="M104 120 l7 6 7 -6 -3 8 h-8z" fill="#111"/></g>
      <g><path d="M186 110 Q190 190 228 372 H150 Q170 220 168 118Z" fill="#fff" stroke="#eceff8"/><path d="M168 118 Q172 84 186 84 Q200 84 204 118Z" fill="#fff" stroke="#eceff8"/><circle cx="186" cy="80" r="19" fill="#f1cfb5"/><path d="M166 78 Q186 52 206 78 Q206 118 200 132 Q196 96 186 88 Q176 96 172 132 Q164 108 166 78Z" fill="#8a4b2a"/><path d="M170 60 Q150 200 154 330 Q176 200 194 62Z" fill="#fff" opacity=".7"/></g>
      <g><circle cx="204" cy="232" r="13" fill="#d8344a"/><circle cx="216" cy="224" r="10" fill="#f28fa0"/><circle cx="196" cy="222" r="9" fill="#e05a72"/><path d="M204 244 l-4 22" stroke="#4d8a4a" stroke-width="3"/></g>
    </svg>`;
  }
  const uri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return { envelopeSVG, sealSVG, coverSVG, coupleSVG, uri, W, H };
})();
