# BPGT Task Force Reports — Progressive Web App

Daily apprehension reporting and monthly summary for the
**Brooke's Point Grand Terminal (BPGT) Task Force**, Municipality of Brooke's
Point, Province of Palawan.

Members encode their daily duty activity log on a phone; the Team Leader
verifies, the Supervisor approves, and the Terminal Administrator gets a
printable / automatic monthly summary PDF (26th of the previous month →
25th of the closing month) with the official signatories.

> This repository holds the **front end only** (a static PWA — no server, no
> build step). The Google Apps Script backend that stores the data in Google
> Sheets and builds the PDFs is deployed separately inside the office Gmail
> account and is **not** part of this repository.

## Install on a phone

Open the published address, then:

* **Android / Chrome** — ⋮ menu → **Install app**
* **iPhone / Safari** — Share → **Add to Home Screen**
* **Windows / Mac** — install icon in the address bar

The app then opens full-screen and keeps working **offline**; reports and photos
sync to Google Sheets when a connection returns.

## Features

* Role-based sign-in — Member · Team Leader · Supervisor · Terminal Administrator
* Daily duty activity log matched to the official reporting form
  (date, time, post, violation, plate number, driver, CT number, remarks)
* Page-2 tally — vehicles monitored, passengers assisted, arkabala checked,
  violations noted, incidents/SOS, citation tickets issued
* Photo documentation per apprehension
* Notices & directives with acknowledgements
* Duty schedule and leave requests with approval
* Monthly summary PDF — per team and combined Alpha + Zulu, with photo appendix
  and signature blocks
* Automatic e-mail + Drive delivery every 25th (server side)
* Dashboard statistics — violations per post, weekly activity

## Reporting period

A reporting month runs **26th of the preceding month → 25th of the closing
month**. Example: the *November 2026* summary covers 26 Oct 2026 – 25 Nov 2026.

## Configuration

Everything the office may need to tweak is in `js/config.js`:
organisation header lines, the Gmail address, post and violation lists,
the roster, the three standing signatories, and the reporting-period days.

The Google Sheets connection is the `API_URL` value in the same file (or set
per device in the app under **Settings → Google Sheets connection**).

See `HOSTING.md` for hosting notes.

## Signatories on the monthly summary

Alpha Team — Mark Anthony Gado, Angelo Tiang, Mike Vincent Macatubal, Marlon Aliones
Zulu Team — Raymund Montemor, Bernard Quitain, Angelito Guintangan, Juan Dela Cruz

Danny Bacalla *(Prepared by Team Leader)* · Joshiel D Belen *(Noted by BPGT Supervisor)* · Joey S Heredero *(Noted by Terminal Administrator)*

---

© Municipality of Brooke's Point — Brooke's Point Grand Terminal Task Force.
Internal administrative use.
