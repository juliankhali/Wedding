// Bundles the site into one self-contained HTML file (preview/invitation.html):
// CSS, JS, config and images are inlined so it can be shared or published as-is.
// Usage: node tools/build-preview.js
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

const html = read("index.html");
const head = html.match(/<head>([\s\S]*)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*)<\/body>/)[1];

const dataUri = (file) => {
  const buf = fs.readFileSync(path.join(root, file));
  const mime = { ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".mp3": "audio/mpeg" }[path.extname(file).toLowerCase()];
  return `data:${mime};base64,${buf.toString("base64")}`;
};

// Inline every asset referenced from config.js
let config = read("config.js").replace(/"(assets\/[^"]+)"/g, (m, f) =>
  fs.existsSync(path.join(root, f)) ? JSON.stringify(dataUri(f)) : m);
// Embedded maps can't load inside sandboxed previews
config += "\nwindow.WEDDING.mapEmbed = false;\n";

const out = head
  .replace(/<meta charset[^>]*>\s*/, "")
  .replace(/<meta name="viewport"[^>]*>\s*/, "")
  .replace(/<meta property="og:image"[^>]*>\s*/, "")
  .replace('<link rel="stylesheet" href="style.css" />', `<style>\n${read("style.css")}\n</style>`)
  + body
    .replace('<script src="config.js"></script>', `<script>\n${config}\n</script>`)
    .replace('<script src="script.js"></script>', `<script>\n${read("script.js")}\n</script>`);

fs.mkdirSync(path.join(root, "preview"), { recursive: true });
fs.writeFileSync(path.join(root, "preview/invitation.html"), out.trim() + "\n");
console.log("Wrote preview/invitation.html", (out.length / 1024).toFixed(0) + " KB");
