# Digital Wedding Invitation — Kurdish Sorani (RTL)

A mobile-first, single-page wedding invitation in Kurdish Sorani. Plain HTML/CSS/JS, no framework and no build step.

**What guests see, in order:** an ivory embossed envelope sealed with a wax seal (tap it: golden light bursts out, the flaps open, music starts) → painted cover with the names → Quran verse → **scratch-off date cards** → live countdown → calendar with "save the date" → welcome letter sliding out of an envelope → program timeline with drifting clouds → location map → dress code with colour swatches → WhatsApp confirmation → closing photo. A round button keeps the music on/off.

## Edit
Everything personal is in the `CONFIG` object at the top of **`script.js`**: names, seal initials, date and time, verse, letter text, program, venue and map links, dress code and colours, WhatsApp number and message, closing text, music and picture paths.

## Pictures (`/assets`)
| File | What | If missing |
|---|---|---|
| `envelope.jpg` | Top view of the ivory embossed envelope (portrait 9:16, X-shaped folds meeting in the centre) | drawn in code |
| `seal.png` | Gold/cream wax seal, transparent background | drawn in code with your initials |
| `cover.jpg` | Painted arch + lake (portrait 9:16) — included | drawn stand-in |
| `couple.jpg` | Bride & groom illustration — included | drawn stand-in |
| `photo.jpg` | Real couple photo for the closing | the cover picture |
| `perfect.mp3` | Optional: your own copy of the song. When present it is used instead of YouTube | the song streams from YouTube's embedded player (`CONFIG.song.youtube`); if that is unavailable, a soft piano waltz plays |

The included `cover.jpg` and `couple.jpg` were generated with Canva AI. Replace any file with the same name to change it.

## Music
"Perfect" by Ed Sheeran plays from the envelope tap through YouTube's own embedded player (the video id is `CONFIG.song.youtube`). No copy of the song is stored in this project. It needs internet and works on the deployed `https://` site; it does **not** play from a local `file://` copy or inside the Claude preview (embeds are blocked there), where the piano waltz plays instead. Use of the song is subject to its rights holders' terms.

## Run locally
Open `index.html`, or serve the folder: `python3 -m http.server`.

## Deploy on Cloudflare (free `*.pages.dev` / `*.workers.dev` link)
**Pages (easiest):** Cloudflare dashboard → Workers & Pages → Create → Pages → connect this GitHub repo (or *Upload assets* and drop the project folder). Build command: *none*. Build output directory: `/` (the repo root).

**Workers:** `npx wrangler deploy` (uses `wrangler.jsonc`; `.assetsignore` keeps the notes and tools out of the upload).

## Single-file version
`node tools/build-preview.js` writes `preview/wedding-invitation.html` with all code, pictures and (if `assets/perfect.mp3` exists) the song inside one file, and `preview/invitation.html` (without the song) for the Artifact preview. Both `assets/perfect.mp3` and `preview/wedding-invitation.html` are git-ignored on purpose: keep your own copy of the recording on your computer and do not publish it.

## Older design
The first version (burgundy envelope, four languages) is kept in `archive/burgundy-card/`.
