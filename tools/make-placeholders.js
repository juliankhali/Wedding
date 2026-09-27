// Generates the placeholder artwork in assets/photos (candlelight bokeh + gold rings).
// Replace these with real photos; this script is only for the demo images.
const fs = require("fs");
let seed = 7;
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

function bokeh(n, w, h, colors, rMin, rMax, yBias = 0.5) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const r = rMin + rnd() * (rMax - rMin);
    const x = rnd() * w, y = h * (yBias + (rnd() - 0.5) * 0.9);
    const c = colors[Math.floor(rnd() * colors.length)];
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${c}" fill-opacity="${(0.25 + rnd() * 0.5).toFixed(2)}"/>`;
  }
  return s;
}

function rings(cx, cy, s) {
  const ring = (x, y, id) => `
    <ellipse cx="${x}" cy="${y}" rx="${118 * s}" ry="${104 * s}" fill="none" stroke="url(#gold)" stroke-width="${24 * s}"/>
    <ellipse cx="${x}" cy="${y}" rx="${118 * s}" ry="${104 * s}" fill="none" stroke="#fff8dc" stroke-opacity=".55" stroke-width="${3 * s}" transform="translate(${-4 * s} ${-7 * s})"/>
    <ellipse cx="${x}" cy="${y}" rx="${106 * s}" ry="${92 * s}" fill="none" stroke="#5a3d12" stroke-opacity=".5" stroke-width="${2 * s}"/>`;
  const a = cx - 70 * s, b = cx + 70 * s;
  return `
  <ellipse cx="${cx}" cy="${cy + 130 * s}" rx="${260 * s}" ry="${26 * s}" fill="#000" fill-opacity=".45" filter="url(#soft)"/>
  ${ring(a, cy, "a")}
  ${ring(b, cy + 10 * s, "b")}
  <g clip-path="url(#over)">${ring(a, cy, "a2")}</g>
  <g transform="translate(${a} ${cy - 104 * s})">
    <path d="M${-26 * s} 0 L${-14 * s} ${-22 * s} L${14 * s} ${-22 * s} L${26 * s} 0 L0 ${26 * s} Z" fill="url(#diamond)" stroke="#fff" stroke-opacity=".7" stroke-width="${1.2 * s}"/>
    <path d="M${-26 * s} 0 H${26 * s} M${-14 * s} ${-22 * s} L${-8 * s} 0 L0 ${26 * s} L${8 * s} 0 L${14 * s} ${-22 * s}" stroke="#fff" stroke-opacity=".5" stroke-width="${1 * s}" fill="none"/>
    <path d="M${30 * s} ${-40 * s} l${4 * s} ${14 * s} l${14 * s} ${4 * s} l${-14 * s} ${4 * s} l${-4 * s} ${14 * s} l${-4 * s} ${-14 * s} l${-14 * s} ${-4 * s} l${14 * s} ${-4 * s} Z" fill="#fff" opacity=".95"/>
  </g>`;
}

const defs = (w, h, cx, cy, s) => `
  <defs>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${Math.round(w / 90)}"/></filter>
    <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${Math.round(w / 260)}"/></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .9  0 0 0 0 .7  0 0 0 .06 0"/></filter>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7a5a1e"/><stop offset=".25" stop-color="#e9c878"/><stop offset=".45" stop-color="#fff1c2"/>
      <stop offset=".6" stop-color="#c79a45"/><stop offset=".8" stop-color="#8a6420"/><stop offset="1" stop-color="#e2bf6e"/>
    </linearGradient>
    <linearGradient id="diamond" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#cfe6ff"/><stop offset="1" stop-color="#8fb6d9"/></linearGradient>
    <clipPath id="over"><rect x="${cx}" y="${cy - 200 * s}" width="${60 * s}" height="${200 * s}"/></clipPath>
    <radialGradient id="glow" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="#f6c872" stop-opacity=".55"/><stop offset=".5" stop-color="#b8752a" stop-opacity=".15"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>`;

function scene(file, w, h, bg1, bg2, colors, withRings, count = 40) {
  const cx = w / 2, cy = h * 0.56, s = Math.min(w, h) / 700;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  ${defs(w, h, cx, cy, s)}
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <g filter="url(#blur)">${bokeh(count, w, h, colors, w / 30, w / 11, 0.45)}</g>
  <g filter="url(#blur2)">${bokeh(Math.round(count * 0.8), w, h, colors, w / 80, w / 40, 0.4)}</g>
  ${withRings ? rings(cx, cy, s) : ""}
  <rect width="${w}" height="${h}" filter="url(#grain)"/>
</svg>`;
  fs.writeFileSync(`assets/photos/${file}.svg`, svg);
}

scene("cover", 1600, 1000, "#06231a", "#0b1712", ["#f3cf7a", "#ffe3a3", "#d99a3e", "#fff4d6"], true, 46);
scene("1", 800, 1066, "#1a0d08", "#3a2012", ["#ffcf73", "#ffb347", "#ffe6b0"], false, 34);
scene("2", 800, 1066, "#0a2a20", "#10231b", ["#f3cf7a", "#fff1c9", "#e7b75f"], false, 36);
scene("3", 800, 1066, "#2a0c10", "#12060a", ["#ffd28a", "#ff9f7a", "#ffe9c4"], true, 30);
fs.rmSync("assets/photos/avatar.svg", { force: true });
console.log("placeholders written");
