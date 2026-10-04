/* Renders the filtered SVG lace artwork once into /img so the live page shows plain images
   (no per-frame SVG lighting filters = smooth scrolling and animations).
   Run:  node tools/bake.js   (needs playwright; then  python3 tools/webp.py  for the doors) */
const fs = require("fs"), path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const root = path.join(__dirname, "..");
const defs = fs.readFileSync(path.join(root, "index.html"), "utf8").match(/<svg width="0"[\s\S]*?<\/svg>/)[0];
const art = fs.readFileSync(path.join(__dirname, "lace-art.js"), "utf8");
const jobs = [
  { name: "corner-tl.png", vb: "-30 -30 320 320", w: 256, h: 256, dpr: 3, fn: "tl" },
  { name: "corner-br.png", vb: "-30 -30 320 320", w: 256, h: 256, dpr: 3, fn: "br" },
  { name: "orn.png",       vb: "-14 -14 248 78",  w: 248, h: 78,  dpr: 3, fn: "orn" },
  { name: "door-l.png",    vb: "0 0 195 844",     w: 195, h: 844, dpr: 2, fn: "doorL", bg: "#EFE7DC" },
  { name: "door-r.png",    vb: "0 0 195 844",     w: 195, h: 844, dpr: 2, fn: "doorR", bg: "#EFE7DC" }
];
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  fs.mkdirSync(path.join(root, "img"), { recursive: true });
  for (const j of jobs) {
    const ctx = await browser.newContext({ deviceScaleFactor: j.dpr, viewport: { width: j.w, height: j.h } });
    const page = await ctx.newPage();
    await page.setContent(`<!doctype html><body style="margin:0;background:transparent">${defs}<svg id="o" width="${j.w}" height="${j.h}" viewBox="${j.vb}" style="display:block;overflow:hidden"></svg></body>`);
    await page.addScriptTag({ content: art });
    await page.evaluate(([fn, bg, vb]) => {
      const [x, y, w, h] = vb.split(" ");
      document.getElementById("o").innerHTML = (bg ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>` : "") + window.ART[fn]();
    }, [j.fn, j.bg || "", j.vb]);
    await page.waitForTimeout(300);
    await page.locator("#o").screenshot({ path: path.join(root, "img", j.name), omitBackground: !j.bg });
    await ctx.close();
    console.log("baked", j.name, fs.statSync(path.join(root, "img", j.name)).size >> 10, "KB");
  }
  await browser.close();
})();
