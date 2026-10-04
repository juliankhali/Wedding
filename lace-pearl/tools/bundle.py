"""Builds ONE self-contained html file (all pictures + fonts inlined) -> preview/wedding-invitation.html
Usage: python3 tools/bundle.py [out_file] [--no-live-map]"""
import re, base64, os, sys
root = os.path.join(os.path.dirname(__file__), "..")
rd = lambda p: open(os.path.join(root, p)).read()
b64 = lambda p: base64.b64encode(open(os.path.join(root, p), "rb").read()).decode()
h = rd("index.html"); body = re.search(r"<body[^>]*>(.*)</body>", h, re.S).group(1).replace('<script src="app.js"></script>', "")
css, js = rd("style.css"), rd("app.js")
css = re.sub(r"url\((fonts/[^)]+\.woff2)\)", lambda m: f"url(data:font/woff2;base64,{b64(m.group(1))})", css)
body = re.sub(r'src="(img/[^"]+)"', lambda m: f'src="data:image/webp;base64,{b64(m.group(1))}"', body)
if "--no-live-map" in sys.argv: js = re.sub(r'mapEmbedUrl: "[^"]*"', 'mapEmbedUrl: ""', js)
body = re.sub(r'<link rel="preload"[^>]*>\n?', "", body)
out = [a for a in sys.argv[1:] if not a.startswith("--")]
out = out[0] if out else os.path.join(root, "preview", "wedding-invitation.html")
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, "w").write(f'<title>Sivan and Mathwa Wedding</title>\n<style>{css}</style>\n{body}\n<script>document.documentElement.setAttribute("dir","rtl");document.documentElement.setAttribute("lang","ckb");document.body.classList.add("locked");\n{js}</script>\n')
print("wrote", out, os.path.getsize(out) >> 10, "KB")
