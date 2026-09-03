# BTCC Startline — web app (PWA)

Installable web app for BTCC marshals: race-start countdowns, support-race timing,
and an incident-photo report tool.

## Live site

**https://stalwart-pasca-9864aa.netlify.app/** — hosted on Netlify, auto-deploys
from this repo (`btcc-startline`, branch `main`) on every push. Share this link.

(An older copy at `jmendelsohn2.github.io/btcc-startline/` has no send function —
don't use that one.)

## Install on a phone

- **iPhone:** open the link in **Safari** → Share → *Add to Home Screen*.
- **Android:** open in Chrome → *Install*.

The countdown and timing tools then work fully offline (service worker cache).

## Photo report → email

`photo.html` posts the report + compressed photos to the Netlify function
`netlify/functions/send.js`, which emails it (photos attached) from
`btccstartline@gmail.com` to whichever Ops Clerk is selected.

Server config lives in **Netlify → Environment variables**:
`GMAIL_USER` = btccstartline@gmail.com, `GMAIL_APP_PASSWORD` = a Gmail app password.
Never put those in the repo.

If reports land in a clerk's Spam: in that Gmail, Settings → Filters →
create a filter from `btccstartline@gmail.com` → "Never send it to Spam".

## Keeping in sync with the iOS app

`countdown.html`, `adverse.html`, `support.html` are the **same files** as the iOS
app (in `../BTCC countdown/`). After editing one there, run:

    ./sync.sh

then `git commit && git push`. It copies them in, re-adds the web shell, and bumps
the offline-cache version. `index.html`, `photo.html`, `nav.*`, `sw.js` and the
function are web-only — edit them here.
