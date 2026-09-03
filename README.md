# BTCC Startline — web app (PWA)

Everything in this `web/` folder is the shareable version of the app. It runs in any
modern phone browser, installs to the home screen, and works fully offline once opened.

## Deploy it (pick one)

**Fastest — Netlify Drop (a link in 2 minutes, no account needed to start)**
1. Go to https://app.netlify.com/drop
2. Drag this whole `web` folder onto the page.
3. You get a URL like `https://cheerful-otter-123.netlify.app`. Share that.
4. To update later: run `./sync.sh` (see below), then drag the folder on again
   (or sign in / link a site so drops replace the same URL).

**Longer term — GitHub Pages (free, versioned)**
1. Put the contents of `web/` in a repo (or a `/docs` folder of one).
2. Repo → Settings → Pages → deploy from that branch/folder.
3. URL: `https://<you>.github.io/<repo>/`. Update by pushing.

Any host works as long as it serves over **HTTPS** — required for offline mode,
the camera, and the share sheet. Netlify / GitHub Pages / Cloudflare Pages all do
HTTPS automatically.

## Install on a phone

- **iPhone:** open the URL in **Safari** → Share → *Add to Home Screen*.
- **Android:** open in Chrome → it offers *Install* (or menu → *Add to Home screen*).

After that first open it's cached — the countdown and timing tools then work with
no signal at all.

## Keeping it in sync with the iOS app

The three timing tools (`countdown.html`, `adverse.html`, `support.html`) are the
**same files** as the iOS app, which live in `../BTCC countdown/`. After editing any
of them there, run:

    ./sync.sh

That copies them in, re-adds the web shell, and bumps the offline-cache version so
installed phones pick up the change on next open. `index.html`, `photo.html`,
`nav.*` and `sw.js` are web-only — edit them here directly.
