# BPGT Task Force — Daily Reporting System (`v1.1.0 · Est. 2026`)

Official daily apprehension reporting, monitoring, and consolidated monthly summary Progressive Web App (PWA) for the **Brooke's Point Grand Terminal (BPGT) Task Force**, Municipality of Brooke's Point, Province of Palawan.

- **Live Web App:** [https://bpgterminal.github.io/BPGT-Task-Force/](https://bpgterminal.github.io/BPGT-Task-Force/)

---

## Overview

Task Force members encode their daily duty activity log on their phones (online or offline along highway corridors); the **Team Leader** verifies daily submissions, the **BPGT Supervisor** and **Terminal Administrator** review and approve, and the system generates A4 printable and automated **Monthly Summary PDFs** (covering the **26th of the preceding month to the 25th of the closing month**) complete with photo documentation and official signature blocks.

> **Architecture:** This repository hosts the **static Progressive Web App front end** (HTML, CSS, JavaScript, and PWA manifest/service worker — no build step required). Data storage in Google Sheets, photo archiving in Google Drive, and scheduled PDF delivery run through the office's Google Apps Script backend under `bpgrandterminal@gmail.com`.

---

## Install on a Phone (Home Screen App)

Open **[https://bpgterminal.github.io/BPGT-Task-Force/](https://bpgterminal.github.io/BPGT-Task-Force/)** in your phone's browser:

- **Android (Chrome):** Tap the **⋮** menu → **Install app** (or **Add to Home screen**).
- **iPhone / iPad (Safari):** Tap **Share** → **Add to Home Screen**.
- **Windows / Mac (Chrome or Edge):** Click the **Install** icon in the address bar.

Once installed, the app uses the **BPGT Task Force Shield** icon on your home screen, opens full-screen, and works **offline** in no-signal areas. Any entries or photos saved offline automatically sync to Google Sheets and Google Drive as soon as a connection returns.

---

## Key Features

- **Role-Based Sign-In (Username + PIN):**
  - **Para-traffic Enforcer (Member):** Encodes daily apprehension/activity entries, attaches photos, views notices, and files leave requests.
  - **Team Leader:** Monitors daily attendance and submissions, verifies member reports, and manages duty post assignments.
  - **BPGT Supervisor:** Reviews and approves verified reports and monitors team performance.
  - **Terminal Administrator:** Full oversight, account & PIN management, notices/directives, and on-demand or scheduled Monthly Summary PDF delivery.
- **Blank-Pad Daily Encoding:**
  - Opens with a clean, blank entry pad every time (`+ Add row` for multiple apprehensions at once).
  - Each submission appends to that member's daily report for the day and resets the typing pad for the next apprehension.
  - Built-in quick-pick dropdown of **33 Terminal Ordinance violations** plus custom free-text entry.
- **Offline Camera & Gallery Photo Documentation:**
  - Attach up to 4 compressed photos per entry (**Take photo** with camera or **From gallery** for photos captured earlier in zero-signal highway corridors).
- **Standing Team Duty Schedule & Leave Workflow:**
  - Built-in weekly rotation (**Alpha Team: Monday – Thursday**, **Zulu Team: Friday – Monday**) integrated into Dashboard, Daily Monitoring, and Duty & Leave screens.
- **Printable & Automated Monthly Summary PDF:**
  - Separate or combined **Alpha Team** and **Zulu Team** A4 reports mirroring the official BPGT Task Force reporting form, saved to Google Drive (`BPGT Monthly Reports`) and e-mailed to `bpgrandterminal@gmail.com` every **25th of the month**.

---

## Team Roster, Duty Schedule & Signatories

### Standing Team Duty Schedule
| Team | Scheduled Duty Days | Assigned Para-traffic Enforcers |
| :--- | :--- | :--- |
| **Alpha Team** | **Monday – Thursday** | **Raymund Montemor** · **Angelo Tiang** · **Mike Vincent Macatubal** · **Marlon Aliones** |
| **Zulu Team** | **Friday – Monday** | **Mark Anthony Gado** · **Bernard Quitain** · **Angelito Guintangan** · **Juan Dela Cruz** |

### Official Signatories
- **Prepared by (Team Leader):** **DANNY BACALLA** — *Team Leader (Alpha & Zulu)*
- **Noted by (BPGT Supervisor):** **JOSHIEL D BELEN** — *BPGT Supervisor*
- **Noted by (Terminal Administrator):** **JOEY S HEREDERO** — *Terminal Administrator*

---

## Reporting Period

Each monthly reporting cycle runs from the **26th of the preceding month** through the **25th of the closing month** (for example, the *November 2026* summary covers **26 Oct 2026 – 25 Nov 2026**).

---

## Configuration & Updating

- **`config.js`** holds the organisation header, post list, roster, standing signatories, and the live Google Apps Script `API_URL`. Keep your live `config.js` intact when uploading app updates.
- To update the app on GitHub Pages, upload the updated flat-root files (`index.html`, `manifest.webmanifest`, `api.js`, `app.js`, `app.css`, `report.js`, `sw.js`, and icon `.png` files) to the repository root and click **Commit changes**.

---

© Brooke's Point Grand Terminal 2026 · v1.1.0 (Est. 2026)
