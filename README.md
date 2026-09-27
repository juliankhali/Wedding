# Wedding Invitation Website

A Kurdish wedding invitation website. It opens as a burgundy envelope sealed with red wax. Guests tap the seal, it cracks, the flap opens and the letter slides out. The page then fades into a scrolling wedding website while the couple's song fades in.

Sections: hero with names and date → invitation → live countdown → photo gallery → details and program → map and directions → RSVP form (sent via WhatsApp) → footer. A floating music player stays at the bottom.

Kurdish touches: the 21-ray Kurdish sun (also stamped in the wax seal), kilim diamond patterns, flag colours, and Sorani and Kurmanji greetings.

## Customize
Edit **`config.js`** only: names, date, venue, program, dress code, WhatsApp number, photos and song.

- **Photos** → put them in `assets/photos/` and update `cover` and `gallery`.
- **Music** → "Perfect" by Ed Sheeran is set up, but the song is copyrighted and not included. Save your mp3 as `assets/music/perfect.mp3`. If the file is missing, the player shows an "Add song" button so you can pick the mp3 while testing.
- `guestName` → personalizes the envelope ("A letter for …").

## Run locally
Open `index.html`, or serve the folder: `python3 -m http.server`.

## Single-file preview
`node tools/build-preview.js` writes `preview/invitation.html` with everything inlined.

## Publish
Any static host works: GitHub Pages, Netlify or Vercel.
