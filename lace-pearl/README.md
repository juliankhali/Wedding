# Sivan & Mathwa — Kurdish (Sorani, RTL) wedding invitation
Plain HTML/CSS/JS, no build. Edit the `CONFIG` object at the top of `app.js` (names, date, venue, map, music, all Kurdish texts).
Run: `python3 -m http.server` in this folder, open http://localhost:8000.

- Pages (Next / Previous button, swipe, arrow keys): home with the names, date + time + countdown, venue with map, welcome + thanks.
- `venue.mapEmbedUrl` shows a live Google map; set it to `""` for the drawn map picture.
- Font: Amiri (SIL Open Font License), subset to Arabic/Kurdish + basic Latin, in `fonts/` and loaded with `@font-face`, so it works offline.
- All artwork (lace, roses, pearls, frame, map picture) is original SVG/CSS.

## Speed
The lace (corners, door lace, ornament) is pre-rendered to images in `img/` by `node tools/bake.js` (then `python3 tools/webp.py`), so the page never runs SVG lighting filters while you use it. The page frame is drawn once into a bitmap at load. Edit `tools/lace-art.js` and re-bake if you want different lace.
`python3 tools/bundle.py out.html` writes one self-contained file with everything inlined.
The clasp signature is `CONFIG.initials` (Great Vibes font, SIL OFL, in `fonts/`).

## Deploy on Netlify
- **Git:** Netlify → Add new site → Import an existing project → GitHub → this repo and branch. `netlify.toml` (repo root) already sets the build command and publish folder `dist`. Nothing else to fill in.
- **Drag and drop:** open https://app.netlify.com/drop and drop `lace-pearl/netlify-drop.zip` (or the `dist` folder after `sh lace-pearl/tools/netlify-build.sh`).
- Change the site name under Site configuration → Change site name. The page is set to `noindex` so search engines skip it.
- Rebuild the zip after edits: `sh lace-pearl/tools/netlify-build.sh && (cd dist && zip -r ../lace-pearl/netlify-drop.zip .)`

## Deploy on GitHub Pages
`sh lace-pearl/tools/pages-build.sh` copies the site into `docs/` (already committed). On GitHub: Settings → Pages → Build and deployment → Source: *Deploy from a branch* → pick the branch → folder `/docs` → Save. The link is `https://<user>.github.io/Wedding/`. Run the script again and push after every edit.

## Save the date card (`/save-the-date/`)
A second, animated 9:16 card: gold crystal chandeliers drop in, the flower gazebo blooms, the couple walks in from both sides, then the title, names, date, place and time appear one after another, with falling white sparkles. Edit the `CONFIG` block at the top of `save-the-date/app.js` (names, text, date, place, time, music). All artwork is original SVG/CSS. The song is not included: put your own licensed mp3 next to the page and set `music.url`.
Live link after deploy: `<your-site>/save-the-date/`
