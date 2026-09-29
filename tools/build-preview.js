// Bundles the invitation into single self-contained HTML files:
//   preview/wedding-invitation.html  a complete page you can open from a phone/computer or upload anywhere
//   preview/invitation.html          page content only, for the Artifact preview (embedded map replaced by a link)
// Every local stylesheet/script is inlined, and files referenced as "assets/..." in the code
// become data URIs when they exist (missing ones, like music.mp3, are left as they are).
// Usage: node tools/build-preview.js
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const mime = { ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".mp3": "audio/mpeg" };
const dataUri = (f) => `data:${mime[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(path.join(root, f)).toString("base64")}`;
// skipAudio: leave audio files as plain paths (used for the hosted Artifact preview)
const inlineAssets = (js, skipAudio = false) => js.replace(/"(assets\/[^"]+)"/g, (m, f) => (fs.existsSync(path.join(root, f)) && !(skipAudio && /\.(mp3|m4a|wav|ogg)$/i.test(f)) ? JSON.stringify(dataUri(f)) : m));

const html = read("index.html");
const head = html.match(/<head>([\s\S]*)<\/head>/)[1];
const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];

// Replacement callbacks keep "$" sequences in the code from being treated as patterns.
const inlineHead = head.replace(/<link rel="stylesheet" href="([^"]+)" \/>/g, (_, f) => `<style>\n${read(f)}\n</style>`);
const inlineBody = (extra = "", skipAudio = false) => body.replace(/<script src="([^"]+)"><\/script>/g, (_, f) => `${f === "art.js" ? extra : ""}<script>\n${inlineAssets(read(f), skipAudio)}\n</script>`);

fs.mkdirSync(path.join(root, "preview"), { recursive: true });

const standalone = `<!doctype html>\n<html lang="ckb" dir="rtl">\n<head>${inlineHead}</head>\n<body class="locked">${inlineBody()}</body>\n</html>\n`;
fs.writeFileSync(path.join(root, "preview/wedding-invitation.html"), standalone);

const artifactHead = inlineHead
  .replace(/<meta charset[^>]*>\s*/, "").replace(/<meta name="viewport"[^>]*>\s*/, "")
  .replace(/<title>[\s\S]*?<\/title>/, "<title>Shilan &amp; Aram Invitation</title>");
const artifact = artifactHead + inlineBody("<script>window.NO_EMBED = true;</script>\n", true);
fs.writeFileSync(path.join(root, "preview/invitation.html"), artifact.trim() + "\n");

console.log("Wrote preview/wedding-invitation.html and preview/invitation.html,", (standalone.length / 1024).toFixed(0), "KB");
