# Hosting the PWA (front end)

These are plain static files — no build step, no server code.

## Recommended: Netlify Drop (2 minutes, free HTTPS)

1. Open <https://app.netlify.com/drop>.
2. Drag the whole **`bpgt-pwa`** folder onto the page.
3. Netlify gives you an address such as `https://bpgt-tf.netlify.app`.
   Rename it under *Site settings → Change site name* → e.g. `bpgt-taskforce`.
4. Open the address on a phone → Chrome ⋮ → **Install app**.

## Alternatives

| Host | How |
|---|---|
| **GitHub Pages** | New repo → upload the folder contents → Settings → Pages → *Deploy from branch: main / root* |
| **Cloudflare Pages** | Create project → Direct upload → drop the folder |
| **Vercel** | New project → “Deploy from a folder” via the CLI, or drag-drop in the dashboard |

## Requirements (all free hosts meet them)

* **HTTPS** — required for the service worker (offline mode) and for installing.
* The app must be at the **root** of the served folder (`index.html` at the top),
  or at least served at the same path as `manifest.webmanifest` and `sw.js`.
* No database, no server runtime: all data goes straight from the phone to your
  Google Apps Script backend (see `../bpgt-apps-script/SETUP.md`).

## Trying it locally

```bash
cd bpgt-pwa
python3 -m http.server 8000
# open http://localhost:8000
```

`file://` also works for a quick look, but install prompts and the offline cache
only activate over `http(s)`.

## Updating the app later

Replace the changed files on the host and bump `VERSION` inside `sw.js`
(e.g. `bpgt-v1.0.1`) so installed phones pick up the new cache on next open.

## App configuration

Everything an office would want to tweak lives in **`js/config.js`**:

* organisation header lines and the Gmail address
* `POSTS`, `VIOLATIONS` quick-pick lists
* `BP.users` roster (cloud mode uses the **Users** sheet instead)
* `BP.officials` — the three standing signatories
* `BP.PERIOD` — the 26th → 25th reporting window
* `BP.AUTO_PDF_DAY` — the automatic PDF day (25)
