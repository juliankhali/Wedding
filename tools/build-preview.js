// Bundles the card into one self-contained HTML file (preview/invitation.html):
// every local stylesheet and script is inlined, and local assets referenced
// from config.js become data URIs (missing ones are left as they are).
// Usage: node tools/build-preview.js
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

const html = read("index.html");
const head = html.match(/<head>([\s\S]*)<\/head>/)[1];
const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];

const mime = { ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".mp3": "audio/mpeg" };
const dataUri = (f) => `data:${mime[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(path.join(root, f)).toString("base64")}`;
const inlineAssets = (js) => js.replace(/"(assets\/[^"]+)"/g, (m, f) => (fs.existsSync(path.join(root, f)) ? JSON.stringify(dataUri(f)) : m));

// Replacement callbacks keep "$" sequences in the code from being treated as patterns.
const inlineHead = head.replace(/<link rel="stylesheet" href="([^"]+)" \/>/g, (_, f) => `<style>\n${read(f)}\n</style>`);
const inlineBody = body.replace(/<script src="([^"]+)"><\/script>/g, (_, f) => `<script>\n${f === "config.js" ? inlineAssets(read(f)) : read(f)}\n</script>`);

// Page content only (the artifact host adds its own document skeleton)
const out = inlineHead.replace(/<meta charset[^>]*>\s*/, "").replace(/<meta name="viewport"[^>]*>\s*/, "") + inlineBody;
// A complete document that opens straight from a phone or computer
const standalone = `<!doctype html>\n<html lang="en" dir="ltr">\n<head>${inlineHead}</head>\n<body>${inlineBody}</body>\n</html>\n`;

fs.mkdirSync(path.join(root, "preview"), { recursive: true });
fs.writeFileSync(path.join(root, "preview/invitation.html"), out.trim() + "\n");
fs.writeFileSync(path.join(root, "preview/wedding-invitation.html"), standalone);
console.log("Wrote preview/invitation.html and preview/wedding-invitation.html", (standalone.length / 1024).toFixed(0) + " KB");
