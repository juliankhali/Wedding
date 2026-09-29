# Animated Wedding Card

A 9:16 wedding invitation website, based on the "Burgundy Envelope Reveal" reference. It fills the screen on phones and is centred on desktop.

**Sequence:** a burgundy envelope with raised floral flaps, sealed with a gold wax seal and a dove. Tap it: the seal cracks, the music starts and the four flaps open. Then guests scroll down through the pages at their own pace. The pages are on cream cotton paper with drifting window light, and each one snaps into place and writes itself in letter by letter as it arrives:
1. You're cordially invited
2. We're getting married + names, with embossed pampas grass growing in
3. Date and venue, then "Save the Date"
4. Kindly RSVP
5. The card fades to burgundy, and a baroque frame and monogram appear, with RSVP, Add to calendar and Directions buttons, plus "Back to top".

Languages: English, Sorani (کوردی), Kurmancî and Arabic (picker on the envelope, or `?lang=ckb`).

## Edit
Everything personal is in **`config.js`**: names, initials, date, time, venue, RSVP contact, phone, WhatsApp number, website and the wording in each language.

- **Music:** "Perfect" by Ed Sheeran is set up, but the song is copyrighted and not included. Save your mp3 as `assets/music/perfect.mp3`. Until then an original piano waltz plays, and an "Add Perfect" link lets you pick the mp3 while testing.
- **Personal link per guest:** `index.html?to=Hama` shows "For Hama" on the envelope.
- Have a native speaker check the Kurdish and Arabic wording.

The photo-realistic artwork in `assets/images/` (embossed envelope, paper, pampas, frame and dove seal) was generated with Canva AI. To change a picture, replace the file with the same name. If a file is missing, the card falls back to the artwork drawn in code in `art.js`.

## Files
`index.html` (structure) · `card.css` (look and animation) · `card.js` (timeline, sound, languages) · `art.js` (artwork) · `config.js` (content)

## Preview and publish
`node tools/build-preview.js` writes a single self-contained `preview/invitation.html`. Any static host works for the real site (GitHub Pages, Netlify, Vercel).
