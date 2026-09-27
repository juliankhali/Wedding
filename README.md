# Wedding Invitation — Stories Edition

A mobile-first digital wedding card. It opens as a burgundy envelope sealed with red wax. Guests tap the seal, it cracks, the flap opens and the letter slides out. The invitation then plays like Instagram Stories: music, photos, a countdown, a map and RSVP, with Kurdish touches (the 21-ray sun, kilim patterns, flag colours, Sorani and Kurmanji greetings).

## Customize
Edit **`config.js`** only: names, date, venue, program, WhatsApp number, captions.

- Photos → put them in `assets/photos/` and update `cover`, `avatar` and `gallery` in `config.js` (portrait 9:16 photos look best).
- Music → leave `music: ""` to use the built-in Kurdish-style melody (Hijaz maqam with santur and daf), or set it to your own mp3, e.g. `assets/music/song.mp3`.
- `guestName` → personalizes the envelope ("A letter for …").

## Controls
Tap right/left to move between stories · hold to pause · swipe up for the CTA · double-tap to like · ←/→/space on a keyboard.

## Run locally
Open `index.html`, or serve the folder: `python3 -m http.server`.

## Single-file preview
`node tools/build-preview.js` writes `preview/invitation.html` with everything inlined.

## Publish
Any static host works: GitHub Pages, Netlify or Vercel. Share the link on WhatsApp or Instagram.
