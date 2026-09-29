/* Procedural artwork for the card, drawn as SVG so it is original and sharp:
   embossed floral envelope flaps, embossed pampas grass, a baroque monogram
   frame and a gold wax seal with a dove. Everything uses a 540×960 canvas. */
window.ART = (() => {
  const W = 540, H = 960;
  const f = (n) => n.toFixed(1);
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  /* ---------- shared filters ---------- */
  // Raised relief: a light edge up-left, a shadow down-right, the face on top.
  const emboss = (id, face, light, dark, depth = 1.2, soft = 0.7) => `
    <filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feOffset in="SourceAlpha" dx="${-depth}" dy="${-depth}" result="o1"/>
      <feGaussianBlur in="o1" stdDeviation="${soft}" result="b1"/>
      <feFlood flood-color="${light}"/><feComposite in2="b1" operator="in" result="hi"/>
      <feOffset in="SourceAlpha" dx="${depth * 1.3}" dy="${depth * 1.5}" result="o2"/>
      <feGaussianBlur in="o2" stdDeviation="${soft * 1.4}" result="b2"/>
      <feFlood flood-color="${dark}"/><feComposite in2="b2" operator="in" result="sh"/>
      <feFlood flood-color="${face}"/><feComposite in2="SourceAlpha" operator="in" result="fa"/>
      <feMerge><feMergeNode in="sh"/><feMergeNode in="hi"/><feMergeNode in="fa"/></feMerge>
    </filter>`;
  // Engraved lines: the reverse (shadow up-left, light down-right).
  const engrave = (id, face, light, dark) => emboss(id, face, dark, light, 0.7, 0.4);
  const grain = (id, a = 0.14, freq = 0.9) => `
    <filter id="${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" stitchTiles="stitch" seed="3"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${a} 0"/>
    </filter>`;

  /* ---------- botanical shapes ---------- */
  function petal(cx, cy, r, a, w = 0.42) {
    const tip = [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    const c1 = [cx + Math.cos(a - w) * r * 0.95, cy + Math.sin(a - w) * r * 0.95];
    const c2 = [cx + Math.cos(a + w) * r * 0.95, cy + Math.sin(a + w) * r * 0.95];
    const k1 = [cx + Math.cos(a - w * 1.1) * r * 0.35, cy + Math.sin(a - w * 1.1) * r * 0.35];
    const k2 = [cx + Math.cos(a + w * 1.1) * r * 0.35, cy + Math.sin(a + w * 1.1) * r * 0.35];
    return `M${f(cx)} ${f(cy)} C${f(k1[0])} ${f(k1[1])} ${f(c1[0])} ${f(c1[1])} ${f(tip[0])} ${f(tip[1])} C${f(c2[0])} ${f(c2[1])} ${f(k2[0])} ${f(k2[1])} ${f(cx)} ${f(cy)}Z`;
  }
  function flower(cx, cy, r, rot, n, R) {
    let raised = "", lines = "";
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2;
      raised += `<path d="${petal(cx, cy, r, a)}"/>`;
      // petal veins
      for (const off of [-0.18, 0, 0.18]) {
        const a2 = a + off;
        lines += `<path d="M${f(cx + Math.cos(a2) * r * 0.3)} ${f(cy + Math.sin(a2) * r * 0.3)} Q${f(cx + Math.cos(a + off * 0.5) * r * 0.6)} ${f(cy + Math.sin(a + off * 0.5) * r * 0.6)} ${f(cx + Math.cos(a2) * r * 0.82)} ${f(cy + Math.sin(a2) * r * 0.82)}"/>`;
      }
    }
    raised += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.2)}"/>`;
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + R(); lines += `<circle cx="${f(cx + Math.cos(a) * r * 0.12)}" cy="${f(cy + Math.sin(a) * r * 0.12)}" r="1"/>`; }
    return { raised, lines };
  }
  function leaf(x, y, len, wid, a) {
    const tx = x + Math.cos(a) * len, ty = y + Math.sin(a) * len;
    const nx = -Math.sin(a) * wid, ny = Math.cos(a) * wid;
    const mx = x + Math.cos(a) * len * 0.45, my = y + Math.sin(a) * len * 0.45;
    const raised = `<path d="M${f(x)} ${f(y)} Q${f(mx + nx)} ${f(my + ny)} ${f(tx)} ${f(ty)} Q${f(mx - nx)} ${f(my - ny)} ${f(x)} ${f(y)}Z"/>`;
    let lines = `<path d="M${f(x)} ${f(y)} L${f(tx)} ${f(ty)}"/>`;
    for (let k = 1; k < 5; k++) {
      const t = k / 5, px = x + (tx - x) * t, py = y + (ty - y) * t, s = wid * 0.55 * Math.sin(Math.PI * t) + 1;
      lines += `<path d="M${f(px)} ${f(py)} l${f(nx / wid * s + Math.cos(a) * s)} ${f(ny / wid * s + Math.sin(a) * s)} M${f(px)} ${f(py)} l${f(-nx / wid * s + Math.cos(a) * s)} ${f(-ny / wid * s + Math.sin(a) * s)}"/>`;
    }
    return { raised, lines };
  }
  function bezierPt(p, t) {
    const u = 1 - t;
    return [u ** 3 * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t ** 3 * p[3][0],
      u ** 3 * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t ** 3 * p[3][1]];
  }
  // a flowering vine along a cubic curve
  function sprig(pts, R, { flowers = [], leaves = 12, buds = 3, scale: sc = 1 } = {}) {
    const scale = sc * 1.45;
    let stems = `<path d="M${pts[0]} C${pts[1]} ${pts[2]} ${pts[3]}" fill="none" stroke-width="${2.6 * scale}"/>`;
    let raised = "", lines = "";
    for (let i = 0; i < leaves; i++) {
      const t = 0.08 + (i / leaves) * 0.85;
      const [x, y] = bezierPt(pts, t), [x2, y2] = bezierPt(pts, t + 0.01);
      const dir = Math.atan2(y2 - y, x2 - x), side = i % 2 ? 1 : -1;
      const a = dir + side * (0.7 + R() * 0.5);
      const L = (22 + R() * 16) * scale;
      // little stalk + leaf
      const sx = x + Math.cos(a) * 6 * scale, sy = y + Math.sin(a) * 6 * scale;
      stems += `<path d="M${f(x)} ${f(y)} L${f(sx)} ${f(sy)}" fill="none" stroke-width="${1.4 * scale}"/>`;
      const l = leaf(sx, sy, L, L * 0.28, a);
      raised += l.raised; lines += l.lines;
    }
    for (let i = 0; i < buds; i++) {
      const t = 0.2 + R() * 0.7;
      const [x, y] = bezierPt(pts, t);
      const a = -Math.PI / 2 + (R() - 0.5) * 1.6, L = (14 + R() * 10) * scale;
      const bx = x + Math.cos(a) * L, by = y + Math.sin(a) * L;
      stems += `<path d="M${f(x)} ${f(y)} Q${f(x + Math.cos(a + 0.4) * L * 0.5)} ${f(y + Math.sin(a + 0.4) * L * 0.5)} ${f(bx)} ${f(by)}" fill="none" stroke-width="${1.2 * scale}"/>`;
      raised += `<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${f(3.6 * scale)}" ry="${f(5.4 * scale)}" transform="rotate(${f(a * 57.3 + 90)} ${f(bx)} ${f(by)})"/>`;
    }
    flowers.forEach(([t, r, n]) => {
      const [x, y] = bezierPt(pts, t);
      const fl = flower(x, y, r * sc * 1.25, R() * 6, n || 6, R);
      raised += fl.raised; lines += fl.lines;
    });
    return { stems, raised, lines };
  }
  function florals(list, seed) {
    const R = rng(seed);
    const parts = list.map((s) => sprig(s.pts, R, s));
    return {
      stems: parts.map((p) => p.stems).join(""),
      raised: parts.map((p) => p.raised).join(""),
      lines: parts.map((p) => p.lines).join(""),
    };
  }

  /* ---------- envelope flaps ---------- */
  const flapShapes = {
    top: "M-10 -10 H550 L286 438 Q270 462 254 438 Z",
    bottom: "M-10 970 H550 L292 530 Q270 500 248 530 Z",
    left: "M-10 -10 L250 452 Q270 482 250 512 L-10 970 Z",
    right: "M550 -10 L290 452 Q270 482 290 512 L550 970 Z",
  };
  const flapFlorals = {
    top: [
      { pts: [[300, 40], [340, 120], [420, 110], [470, 200]], flowers: [[0.55, 34, 6], [0.98, 20, 5]], leaves: 10 },
      { pts: [[60, 20], [120, 90], [140, 150], [210, 210]], flowers: [[1, 18, 5]], leaves: 8, scale: 0.8 },
    ],
    bottom: [
      { pts: [[120, 960], [170, 880], [230, 850], [330, 800]], flowers: [[0.35, 36, 6], [0.9, 22, 5]], leaves: 10 },
      { pts: [[400, 960], [420, 900], [470, 880], [520, 820]], flowers: [[0.7, 20, 5]], leaves: 7, scale: 0.8 },
    ],
    left: [
      { pts: [[30, 960], [80, 760], [10, 520], [90, 250]], flowers: [[0.18, 44, 6], [0.95, 40, 6]], leaves: 18, buds: 5 },
      { pts: [[90, 320], [150, 360], [170, 420], [230, 470]], flowers: [], leaves: 7, scale: 0.8 },
      { pts: [[40, 180], [60, 120], [40, 80], [80, 20]], flowers: [[0.9, 18, 5]], leaves: 6, scale: 0.8 },
    ],
    right: [
      { pts: [[520, 960], [470, 780], [540, 560], [470, 300]], flowers: [[0.2, 30, 6], [0.55, 38, 6], [0.95, 40, 6]], leaves: 18, buds: 5 },
      { pts: [[460, 700], [420, 690], [380, 640], [330, 620]], flowers: [[1, 22, 5]], leaves: 6, scale: 0.8 },
      { pts: [[500, 200], [480, 150], [510, 90], [480, 30]], flowers: [], leaves: 7, scale: 0.8 },
    ],
  };
  function flap(which) {
    const shade = { top: "#6f1f2c", bottom: "#65182a", left: "#72202e", right: "#6c1d2b" }[which];
    const fl = florals(flapFlorals[which], { top: 11, bottom: 23, left: 37, right: 53 }[which]);
    const id = `fl-${which}`;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        ${emboss(`${id}-e`, shade, "#9a4050", "#2e0710", 1.3, 0.8)}
        ${engrave(`${id}-g`, shade, "#9a4050", "#2e0710")}
        ${grain(`${id}-n`, 0.22, 0.95)}
        <clipPath id="${id}-c"><path d="${flapShapes[which]}"/></clipPath>
        <pattern id="${id}-p" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0 V3" stroke="#000" stroke-opacity=".06" stroke-width="1"/></pattern>
      </defs>
      <g clip-path="url(#${id}-c)">
        <path d="${flapShapes[which]}" fill="${shade}"/>
        <rect width="${W}" height="${H}" fill="url(#${id}-p)"/>
        <rect width="${W}" height="${H}" filter="url(#${id}-n)"/>
        <g filter="url(#${id}-e)" fill="#000" stroke="#000" stroke-linecap="round">${fl.stems}<g stroke="none">${fl.raised}</g></g>
        <g filter="url(#${id}-g)" fill="none" stroke="#000" stroke-width=".9" stroke-linecap="round">${fl.lines}</g>
      </g>
      <path d="${flapShapes[which]}" fill="none" stroke="#a24a58" stroke-opacity=".45" stroke-width="1.2"/>
    </svg>`;
  }

  /* ---------- pampas grass (cream on cream) ---------- */
  function pampas(seed = 5) {
    const R = rng(seed);
    let stems = "", plumes = "";
    const count = 7;
    for (let s = 0; s < count; s++) {
      const x0 = 10 + s * 22 + R() * 14, y0 = 975;
      const h = 380 + R() * 280, lean = 30 + s * 26 + R() * 30;
      const pts = [[x0, y0], [x0 + lean * 0.2, y0 - h * 0.4], [x0 + lean * 0.6, y0 - h * 0.75], [x0 + lean, y0 - h]];
      stems += `<path d="M${pts[0]} C${pts[1]} ${pts[2]} ${pts[3]}" fill="none" stroke-width="${2.2 + R()}"/>`;
      const plumeFrom = 0.55 + R() * 0.12;
      const n = 46 + Math.floor(R() * 20);
      for (let i = 0; i < n; i++) {
        const t = plumeFrom + (i / n) * (1 - plumeFrom);
        const [x, y] = bezierPt(pts, t), [x2, y2] = bezierPt(pts, Math.min(1, t + 0.01));
        const dir = Math.atan2(y2 - y, x2 - x);
        const side = i % 2 ? 1 : -1;
        const taper = Math.sin(Math.PI * Math.min(1, (t - plumeFrom) / (1 - plumeFrom)) * 0.9 + 0.2);
        const a = dir + side * (0.35 + R() * 0.3);
        const L = (16 + R() * 18) * taper + 6;
        const tx = x + Math.cos(a) * L, ty = y + Math.sin(a) * L;
        const cx = x + Math.cos(a + side * 0.25) * L * 0.6, cy = y + Math.sin(a + side * 0.25) * L * 0.6;
        plumes += `<path d="M${f(x)} ${f(y)} Q${f(cx)} ${f(cy)} ${f(tx)} ${f(ty)}" stroke-width="${f(2.2 + R() * 1.8)}"/>`;
      }
    }
    // a few long grass blades
    for (let b = 0; b < 4; b++) {
      const x0 = 30 + b * 40, h = 220 + R() * 160, lean = 60 + R() * 80;
      plumes += `<path d="M${f(x0)} 975 Q${f(x0 + lean * 0.3)} ${f(975 - h * 0.6)} ${f(x0 + lean)} ${f(975 - h)} Q${f(x0 + lean * 0.4)} ${f(975 - h * 0.55)} ${f(x0 + 7)} 975Z" fill="#000" stroke="none"/>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMax slice" aria-hidden="true">
      <defs>${emboss("pampas-e", "#e3d9ca", "#fffaf1", "#a89a86", 1.4, 1)}</defs>
      <g filter="url(#pampas-e)" fill="none" stroke="#000" stroke-linecap="round">${stems}${plumes}</g>
    </svg>`;
  }

  /* ---------- baroque monogram frame ---------- */
  function spiral(cx, cy, r0, turns, dir = 1, start = 0) {
    const pts = [];
    const steps = 40 * turns;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, th = start + dir * t * turns * Math.PI * 2, r = r0 * (1 - t * 0.85);
      pts.push([cx + Math.cos(th) * r, cy + Math.sin(th) * r]);
    }
    return `M${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L")}`;
  }
  function acanthus(p0, p1, p2, p3, lobes, side, size) {
    // a scalloped leaf along a curve: outer edge bumps out, inner edge follows the curve
    const n = lobes * 8, outer = [], inner = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, [x, y] = bezierPt([p0, p1, p2, p3], t), [x2, y2] = bezierPt([p0, p1, p2, p3], Math.min(1, t + 0.01));
      const a = Math.atan2(y2 - y, x2 - x) + (side * Math.PI) / 2;
      const w = size * Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.abs(Math.sin(t * lobes * Math.PI)));
      outer.push([x + Math.cos(a) * w, y + Math.sin(a) * w]);
      inner.push([x, y]);
    }
    const pts = outer.concat(inner.reverse());
    return `M${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L")}Z`;
  }
  function frameHalf() {
    // right half of the frame, centred on (270, 480); mirrored for the left half
    let fill = "", stroke = "";
    // outer scroll from the top crest down the shoulder
    stroke += `<path d="M285 318 C330 300 380 300 395 340 C405 370 380 392 360 380 C345 370 352 350 368 352"/>`;
    stroke += `<path d="${spiral(362, 364, 14, 1.4, -1, 0.5)}"/>`;
    fill += `<path d="${acanthus([282, 328], [320, 312], [360, 318], [380, 350], 4, -1, 12)}"/>`;
    // right side: long C-scrolls
    stroke += `<path d="M392 380 C418 420 418 470 404 500 C396 520 404 540 420 548"/>`;
    stroke += `<path d="${spiral(418, 556, 12, 1.3, 1, -1.2)}"/>`;
    stroke += `<path d="M404 500 C430 520 432 560 416 590 C404 612 406 640 420 660"/>`;
    fill += `<path d="${acanthus([396, 395], [420, 430], [420, 470], [404, 505], 3, 1, 9)}"/>`;
    fill += `<path d="${acanthus([410, 560], [430, 580], [428, 620], [412, 648], 3, 1, 8)}"/>`;
    // lower shoulder scroll into the bottom crest
    stroke += `<path d="M420 660 C404 690 370 700 340 690 C320 684 318 662 334 658 C346 656 350 670 340 674"/>`;
    stroke += `<path d="${spiral(336, 666, 11, 1.3, 1, 2)}"/>`;
    fill += `<path d="${acanthus([408, 676], [380, 700], [330, 712], [290, 700], 4, 1, 11)}"/>`;
    // beads along the inner oval
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + ((i + 1) / 10) * Math.PI;
      fill += `<circle cx="${f(270 + Math.cos(a) * 112)}" cy="${f(480 + Math.sin(a) * 158)}" r="2.2"/>`;
    }
    return { fill, stroke };
  }
  function crest(y, flip) {
    const s = flip ? -1 : 1;
    const g = (d) => `<path d="${d}"/>`;
    return `<g transform="translate(270 ${y}) scale(1 ${s})">
      ${g("M0 -46 C10 -30 12 -14 0 0 C-12 -14 -10 -30 0 -46Z")}
      ${g("M0 -8 C18 -22 38 -18 40 -2 C41 10 30 14 24 6 C20 0 26 -6 30 -2")}
      ${g("M0 -8 C-18 -22 -38 -18 -40 -2 C-41 10 -30 14 -24 6 C-20 0 -26 -6 -30 -2")}
      ${g("M-14 6 H14 L10 14 H-10Z")}
      <circle cx="0" cy="-52" r="4"/><circle cx="0" cy="22" r="3"/>
      ${g("M-6 -30 L0 -22 L6 -30")}
    </g>`;
  }
  function baroqueFrame(color = "#E8D6D3") {
    const half = frameHalf();
    const part = `<g fill="${color}" stroke="none">${half.fill}</g><g fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round">${half.stroke}</g>`;
    return `<svg viewBox="100 236 340 510" aria-hidden="true">
      <defs><filter id="frame-sh"><feDropShadow dx="1" dy="2" stdDeviation="1.4" flood-color="#1d0409" flood-opacity=".7"/></filter></defs>
      <g filter="url(#frame-sh)">
        <ellipse cx="270" cy="480" rx="122" ry="168" fill="none" stroke="${color}" stroke-width="3"/>
        <ellipse cx="270" cy="480" rx="114" ry="160" fill="none" stroke="${color}" stroke-width="1"/>
        ${part}
        <g transform="translate(540 0) scale(-1 1)">${part}</g>
        <g fill="${color}" stroke="none">${crest(300, false)}${crest(662, true)}</g>
      </g>
    </svg>`;
  }

  /* ---------- gold wax seal with a dove ---------- */
  function blob(cx, cy, r, n = 64) {
    const bump = (th, at, w, h) => { let d = Math.abs(th - at); d = Math.min(d, Math.PI * 2 - d); return h * Math.exp(-((d / w) ** 2)); };
    const pts = Array.from({ length: n }, (_, i) => {
      const th = (i / n) * Math.PI * 2;
      const k = 1 + 0.028 * Math.sin(3 * th + 0.7) + 0.02 * Math.sin(5 * th + 2.1) + 0.012 * Math.sin(11 * th + 0.4) + bump(th, 2.2, 0.18, 0.06) + bump(th, 5.3, 0.12, 0.05);
      return [cx + Math.cos(th) * r * k, cy + Math.sin(th) * r * k];
    });
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return `${d}Z`;
  }
  const DOVE = "M-30 4 L-24 1 C-22 -5 -15 -8 -10 -5 C-7 -3 -5 0 -3 2 C4 -10 14 -26 32 -34 C27 -20 22 -8 14 2 C24 -6 34 -10 42 -10 C36 0 26 8 16 12 C24 14 32 20 36 28 C27 28 19 26 12 20 C4 24 -6 24 -14 20 C-20 16 -24 10 -26 7 Z";
  function seal() {
    const dots = Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; return `<circle cx="${f(80 + Math.cos(a) * 44)}" cy="${f(80 + Math.sin(a) * 44)}" r="1.4"/>`; }).join("");
    return `<svg viewBox="0 0 160 160" aria-hidden="true">
      <defs>
        <radialGradient id="gold-wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stop-color="#f6dc93"/><stop offset=".45" stop-color="#cf9f45"/><stop offset=".8" stop-color="#9a6a20"/><stop offset="1" stop-color="#6e4610"/>
        </radialGradient>
        <filter id="seal-dome" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/>
          <feSpecularLighting in="b" surfaceScale="6" specularConstant="1.2" specularExponent="24" lighting-color="#fff6dc" result="s"><fePointLight x="40" y="20" z="120"/></feSpecularLighting>
          <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>
          <feDiffuseLighting in="b" surfaceScale="5" diffuseConstant="1" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="45"/></feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.15" result="l"/>
          <feComposite in="l" in2="SourceAlpha" operator="in" result="l2"/>
          <feComposite in="l2" in2="s2" operator="arithmetic" k2="1" k3=".7"/>
        </filter>
        <filter id="seal-press" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="b"/>
          <feDiffuseLighting in="b" surfaceScale="-3" diffuseConstant="1" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="50"/></feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.1" result="l"/>
          <feComposite in="l" in2="SourceAlpha" operator="in"/>
        </filter>
        ${emboss("seal-relief", "#d9ae58", "#fff3cf", "#6e4610", 1, 0.6)}
        ${emboss("dove-relief", "#f8f1e2", "#ffffff", "#8a6a3a", 0.9, 0.5)}
      </defs>
      <path d="${blob(80, 80, 66)}" fill="url(#gold-wax)" filter="url(#seal-dome)"/>
      <circle cx="80" cy="80" r="50" fill="#b98934" filter="url(#seal-press)"/>
      <g filter="url(#seal-relief)" fill="#000">${dots}<circle cx="80" cy="80" r="48" fill="none" stroke="#000" stroke-width="1.6"/></g>
      <g transform="translate(82 82) scale(1.05)" filter="url(#dove-relief)" fill="#000">
        <path d="${DOVE}"/>
        <path d="M-30 4 C-36 8 -40 14 -38 20" fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round"/>
        <ellipse cx="-38" cy="18" rx="2.6" ry="1.4" transform="rotate(-40 -38 18)"/><ellipse cx="-35" cy="12" rx="2.6" ry="1.4" transform="rotate(30 -35 12)"/>
      </g>
      <circle cx="-18" cy="-2" r="1.3" fill="#6e4610" transform="translate(82 82) scale(1.05)"/>
      <g class="seal-crack" fill="none" stroke="#5a3608" stroke-linecap="round" stroke-linejoin="round">
        <path pathLength="1" d="M84 14 L78 44 L90 70 L74 98 L86 124 L80 148" stroke-width="2"/>
        <path pathLength="1" d="M90 70 L116 82 L142 86" stroke-width="1.6"/>
      </g>
    </svg>`;
  }

  return { flap, pampas, baroqueFrame, seal };
})();
