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
| `music.mp3` | Background song | a soft piano waltz plays, with a link to load your own file |

The included `cover.jpg` and `couple.jpg` were generated with Canva AI. Replace any file with the same name to change it.

## Run locally
Open `index.html`, or serve the folder: `python3 -m http.server`.

## Deploy on Cloudflare (free `*.pages.dev` / `*.workers.dev` link)
**Pages (easiest):** Cloudflare dashboard → Workers & Pages → Create → Pages → connect this GitHub repo (or *Upload assets* and drop the project folder). Build command: *none*. Build output directory: `/` (the repo root).

**Workers:** `npx wrangler deploy` (uses `wrangler.jsonc`; `.assetsignore` keeps the notes and tools out of the upload).

## Single-file version
`node tools/build-preview.js` writes `preview/wedding-invitation.html` with all code and pictures inside one file, and `preview/invitation.html` for the Artifact preview.

## Older design
The first version (burgundy envelope, four languages) is kept in `archive/burgundy-card/`.
