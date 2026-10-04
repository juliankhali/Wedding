/* =====================================================================
   Save the date card (Kurdish Sorani). EDIT ONLY THE CONFIG BLOCK.
   ===================================================================== */
const CONFIG = {
  names: ["سیڤان", "مەسوا"],
  initials: "S&M",                       // gold monogram on the steps
  invite: "بانگهێشتنامە",                 // gold title
  occasion: "ئاهەنگی هاوسەرگیری",
  date: "شەممە\n٢١ / ٨ / ٢٠٢٧",   // a line break splits the text in two lines
  place: "هۆڵی ڕۆتانا\nهەولێر",
  time: "کاتژمێر\n٧:٠٠ی ئێوارە",
  music: { url: "" }                    // your own licensed mp3 (e.g. "music.mp3"); empty = soft built-in melody
};

const $ = s => document.querySelector(s), NS = "http://www.w3.org/2000/svg";
$("#invite").textContent = CONFIG.invite; $("#occasion").textContent = CONFIG.occasion;
$("#n1").textContent = CONFIG.names[0]; $("#n2").textContent = CONFIG.names[1];
$("#iDate").textContent = CONFIG.date; $("#iPlace").textContent = CONFIG.place; $("#iTime").textContent = CONFIG.time;
$("#mono").innerHTML = "<span></span>"; $("#mono span").textContent = CONFIG.initials; document.title = `${CONFIG.names[0]} & ${CONFIG.names[1]}`;

/* ---------- art: chandeliers ---------- */
function chandelier() {
  let s = "", tiers = [[40, 70, 9], [30, 100, 7], [20, 128, 5]];
  s += `<path d="M0 0V50" stroke="url(#goldV)" stroke-width="2.2"/><circle cx="0" cy="8" r="3" fill="url(#gold)"/><circle cx="0" cy="22" r="2.4" fill="url(#gold)"/><circle cx="0" cy="36" r="2.4" fill="url(#gold)"/>`;
  s += `<path d="M-10 50Q0 44 10 50L7 58H-7Z" fill="url(#goldV)"/><path d="M0 58V136" stroke="url(#goldV)" stroke-width="3"/>`;
  tiers.forEach(([w, y, n], t) => {
    s += `<path d="M${-w} ${y}Q0 ${y + 16} ${w} ${y}" fill="none" stroke="url(#goldV)" stroke-width="3.2" stroke-linecap="round"/>`;
    s += `<path d="M${-w} ${y}Q${-w * .5} ${y - 12} 0 ${y - 14}Q${w * .5} ${y - 12} ${w} ${y}" fill="none" stroke="#D2A33F" stroke-width="1.4"/>`;
    [-w, w].forEach(x => s += `<ellipse cx="${x}" cy="${y - 7}" rx="2.6" ry="4.4" fill="#FFF3C4" class="tw" style="animation-delay:${-t * .7}s"/><rect x="${x - 1.4}" y="${y - 3}" width="2.8" height="6" fill="url(#gold)"/>`);
    for (let i = 0; i < n; i++) {
      const f = n === 1 ? .5 : i / (n - 1), x = -w + f * 2 * w, yy = y + 16 * 4 * f * (1 - f), len = 7 + (i % 3) * 3;
      s += `<path d="M${x.toFixed(1)} ${yy.toFixed(1)}v${len}" stroke="#D2A33F" stroke-width=".8"/><path transform="translate(${x.toFixed(1)} ${(yy + len).toFixed(1)})" d="M0 0C3 4 4 8 0 12C-4 8 -3 4 0 0Z" fill="url(#crystal)" stroke="#fff" stroke-width=".5" class="${i % 2 ? "tw" : ""}" style="animation-delay:${-i * .5}s"/>`;
    }
  });
  s += `<path transform="translate(0 134)" d="M0 0C6 8 7 18 0 28C-7 18 -6 8 0 0Z" fill="url(#crystal)" stroke="#fff" stroke-width=".6"/><circle cx="0" cy="136" r="3" fill="url(#gold)"/>`;
  return `<g class="sway" transform="scale(.74)">${s}</g>`;
}
$("#chandL").innerHTML = chandelier(); $("#chandR").innerHTML = chandelier();

/* ---------- art: flower garland around the round gazebo ---------- */
function peony(x, y, r, rot) {
  let p = ""; for (let i = 0; i < 7; i++) { const a = i * 360 / 7 + rot; p += `<ellipse transform="rotate(${a}) translate(0 ${-r * .55})" rx="${r * .42}" ry="${r * .5}" fill="url(#peonyB)" stroke="#3E5DB0" stroke-width=".4"/>`; }
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${p}<circle r="${r * .55}" fill="#7F9DE0"/><circle r="${r * .34}" fill="#A9BEF0"/><circle r="${r * .14}" fill="#E8EEFF"/></g>`;
}
function blossom(x, y, r, rot, c = "#fff") {
  let p = ""; for (let i = 0; i < 5; i++) p += `<circle transform="rotate(${i * 72 + rot}) translate(0 ${-r * .55})" r="${r * .46}" fill="${c}" stroke="#D9E6F2" stroke-width=".4"/>`;
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${p}<circle r="${r * .25}" fill="#F2D675"/></g>`;
}
(function garland() {
  const cx = 180, cy = 290, R = 106; let leaves = "", fl = "";
  for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, rot = i * 6 + 90 + (i % 2 ? 35 : -35);
    leaves += `<ellipse transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})" rx="3.6" ry="11" fill="${i % 3 ? "#5C9A4A" : "#79B35E"}"/>`; }
  for (let i = 0; i < 30; i++) { const a = (i * 12 + 4) * Math.PI / 180, j = (i % 2 ? 2.5 : -2.5), x = cx + Math.cos(a) * (R + j), y = cy + Math.sin(a) * (R + j), k = i % 5;
    fl += k === 0 || k === 3 ? peony(x, y, 11.5 - (k === 3 ? 2 : 0), i * 20) : k === 1 || k === 4 ? blossom(x, y, 8, i * 17) : blossom(x, y, 5.5, i * 9, "#F6B8C8"); }
  const peonies = [[180, 184, 14], [78, 262, 13], [282, 262, 13]].map(([x, y, r], i) => peony(x, y, r, i * 30)).join("");
  document.getElementById("garland").innerHTML = leaves + fl + peonies;
})();

/* ---------- falling white sparkles ---------- */
(function snow() {
  const cv = $("#snow"), cx = cv.getContext("2d"); let w, h, k, flakes = [];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size() { k = Math.min(devicePixelRatio || 1, 2); w = cv.clientWidth; h = cv.clientHeight; cv.width = w * k; cv.height = h * k; }
  size(); addEventListener("resize", size);
  for (let i = 0; i < 70; i++) flakes.push({ x: Math.random(), y: Math.random(), r: .8 + Math.random() * 2.4, s: .03 + Math.random() * .07, a: Math.random() * 6.28, t: Math.random() * 6.28 });
  (function frame(t0) {
    cx.setTransform(k, 0, 0, k, 0, 0); cx.clearRect(0, 0, w, h);
    flakes.forEach(f => { f.y += f.s / 60; f.a += .012; if (f.y > 1.02) { f.y = -.02; f.x = Math.random(); }
      const x = (f.x + Math.sin(f.a) * .015) * w, y = f.y * h, tw = .55 + .45 * Math.sin(f.t + f.a * 3);
      cx.beginPath(); cx.fillStyle = `rgba(255,255,255,${.5 + .4 * tw})`; cx.arc(x, y, f.r, 0, 6.283); cx.fill(); });
    if (!reduce && !document.hidden) requestAnimationFrame(frame); else if (!reduce) setTimeout(() => requestAnimationFrame(frame), 300);
  })();
})();

/* ---------- music: mp3 if provided, else a soft synthesized melody ---------- */
const music = (() => {
  let ctx, master, audio, on = false;
  const notes = [392, 494, 587, 523, 440, 523, 659, 587, 392, 494, 587, 784, 659, 587, 523, 494];
  const mark = m => $("#mute").classList.toggle("muted", m);
  function synth() {
    ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(.55, ctx.currentTime + 3); let i = 0;
    const play = () => { const f = notes[i++ % notes.length], t = ctx.currentTime;
      [f, f / 2].forEach((fr, q) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = fr;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(q ? .05 : .09, t + .04); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8);
        o.connect(g).connect(master); o.start(t); o.stop(t + 1.9); }); };
    play(); setInterval(play, 700);
  }
  return { toggle() {
    if (!on) { try { if (CONFIG.music.url) { audio = audio || Object.assign(new Audio(CONFIG.music.url), { loop: true, volume: .7 }); audio.play().catch(() => {}); } else if (!ctx) synth(); else ctx.resume(); } catch (e) {} on = true; mark(false); }
    else { on = false; if (audio) audio.pause(); if (ctx) ctx.suspend(); mark(true); } } };
})();
$("#mute").onclick = () => music.toggle();

/* ---------- play / replay ---------- */
const scene = $("#scene");
function play() { scene.classList.remove("play"); void scene.offsetWidth; scene.classList.add("play"); }
$("#replay").onclick = play;
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(play, 250));
