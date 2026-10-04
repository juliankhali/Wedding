"""Converts the baked PNGs to WebP (much smaller)."""
from PIL import Image
import os
d = os.path.join(os.path.dirname(__file__), "..", "img")
for n in ("door-l", "door-r", "corner-tl", "corner-br", "orn"):
    p = os.path.join(d, n + ".png")
    im = Image.open(p)
    im = im.convert("RGB") if n.startswith("door") else im.convert("RGBA")
    im.save(os.path.join(d, n + ".webp"), quality=88, method=6, alpha_quality=95)
    os.remove(p)
