# Sivan & Mathwa — Kurdish (Sorani, RTL) wedding invitation
Plain HTML/CSS/JS, no build. Edit the `CONFIG` object at the top of `app.js` (names, date, venue, map, music, all Kurdish texts).
Run: `python3 -m http.server` in this folder, open http://localhost:8000.

- Pages (Next / Previous button, swipe, arrow keys): home with the names, date + time + countdown, venue with map, welcome + thanks.
- `venue.mapEmbedUrl` shows a live Google map; set it to `""` for the drawn map picture.
- Font: Amiri (SIL Open Font License), subset to Arabic/Kurdish + basic Latin, in `fonts/` and loaded with `@font-face`, so it works offline.
- All artwork (lace, roses, pearls, frame, map picture) is original SVG/CSS.
