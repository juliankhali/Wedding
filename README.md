# Wedding Invitation Website

A luxury Kurdish wedding invitation website in English, Sorani (کوردی), Kurmancî and Arabic.

**The opening:** an ivory envelope lies on emerald velvet in candlelight, closed with a crimson wax seal stamped with the Kurdish sun. Tap the seal: it cracks with a sound and breaks into pieces. The paper flap bends open to show a gold kilim-pattern lining, and the card slides out, then grows into the website. The music fades in. A second tap skips straight to the site.

**The website:** the invitation card with gold-foil names → photo band with a quote → story and arched photo gallery → live countdown → details and programme → venue map → RSVP reply card (sent via WhatsApp). A spinning gold record keeps the music playing while guests scroll.

## Customize
Edit **`config.js`**: names (per language), families, date, venue, programme, photos, WhatsApp number.

- **Music** → "Perfect" by Ed Sheeran is set up, but the song is copyrighted and not included. Save your mp3 as `assets/music/perfect.mp3`. Until then an original piano waltz plays, and the player has an "Add song" button for testing.
- **Photos** → replace the placeholder art in `assets/photos/` (made by `tools/make-placeholders.js`).
- **Personal link per guest** → `index.html?to=Hama` shows "A letter for Hama" on the envelope. `?lang=ckb` opens in Sorani.
- Have a native speaker check the Sorani, Kurmanji and Arabic text in `i18n.js` and `config.js`.

## Run locally
Open `index.html`, or serve the folder: `python3 -m http.server`.

## Single-file preview
`node tools/build-preview.js` writes `preview/invitation.html` with everything inlined.

## Publish
Any static host works: GitHub Pages, Netlify or Vercel.
