/* =========================================================================
   BPGT TASK FORCE — REPORTING PWA
   config.js — single place for org details, posts, roster and connections
   ========================================================================= */

const BP = {
  APP_NAME: 'BPGT TF Reports',
  APP_VERSION: '1.1.0',

  /* ---------------------------------------------------------------------
     1. ORGANISATION HEADER  (used on screen + on the printable report)
     --------------------------------------------------------------------- */
  org: {
    republic: 'Republic of the Philippines',
    province: 'Province of Palawan',
    municipality: "MUNICIPALITY OF BROOKE'S POINT",
    office: 'OFFICE OF THE MUNICIPAL MAYOR',
    unit: "BROOKE'S POINT GRAND TERMINAL (BPGT) TASK FORCE",
    formTitle: 'DAILY REPORTING FORM',
    reportTitle: 'MONTHLY SUMMARY REPORT',
    googleAccount: 'bpgrandterminal@gmail.com'
  },

  /* ---------------------------------------------------------------------
     2. CONNECTION TO GOOGLE SHEETS (Apps Script Web App)
        Paste the /exec URL you get after deploying Code.gs  (see SETUP.md)
        Leave empty ("") to run in LOCAL / DEMO mode — data stays on the phone.
     --------------------------------------------------------------------- */
  API_URL: '',

  /* Token that Apps Script asks for on write actions (see SETUP.md)      */
  SYNC_INTERVAL_MS: 60 * 1000,

  /* ---------------------------------------------------------------------
     3. REPORTING PERIOD RULE
        A "reporting month" runs 26th of previous month → 25th of this month.
     --------------------------------------------------------------------- */
  PERIOD: { startDay: 26, endDay: 25 },

  /* Day of month the automatic PDF fires (Apps Script trigger)           */
  AUTO_PDF_DAY: 25,

  /* ---------------------------------------------------------------------
     4. TEAMS, POSTS, VIOLATIONS
     --------------------------------------------------------------------- */
  TEAMS: ['Alpha', 'Zulu'],

  POSTS: [
    'PTT', 'BERNAS', 'MANGGA', 'ROTUNDA', 'ATE DONG',
    'ST PETER', 'SPPH', 'EC', 'BULIGAY', 'BR', 'OTHERS'
  ],

  /* Quick-pick list for the VIOLATION field (free text is allowed)       */
  VIOLATIONS: [
    'Illegal parking',
    'Obstruction',
    'Reckless driving',
    'Overloading',
    'Trip-cutting / Colorum',
    'No / expired franchise',
    'No helmet (tricycle)',
    'Uncouth behavior',
    'Smoking in terminal',
    'Vending in prohibited area'
  ],

  /* ---------------------------------------------------------------------
     5. SIGNATORIES (bottom of the monthly summary)
        Members of the team + the three standing officials.
     --------------------------------------------------------------------- */
  officials: [
    { name: 'DANNY BACALLA',   role: 'Prepared by Team Leader' },
    { name: 'JOSHIEL D BELEN', role: 'Noted by BPGT Supervisor' },
    { name: 'JOEY S HEREDERO', role: 'Noted by Terminal Administrator' }
  ],

  /* ---------------------------------------------------------------------
     6. ROSTER + DEFAULT ACCOUNTS
        role:  member | leader | supervisor | admin
        Every account starts with PIN 1234 — change it on first login.
        (In CLOUD mode the roster lives in the Users sheet; this list is
         only used to seed the sheet / to run the offline demo.)
     --------------------------------------------------------------------- */
  DEFAULT_PIN: '1234',

  users: [
    { id: 'u-gado',        username: 'gado',        name: 'Mark Anthony Gado',     role: 'member',     team: 'Alpha', position: 'Para-traffic Enforcer' },
    { id: 'u-tiang',       username: 'tiang',       name: 'Angelo Tiang',          role: 'member',     team: 'Alpha', position: 'Para-traffic Enforcer' },
    { id: 'u-macatubal',   username: 'macatubal',   name: 'Mike Vincent Macatubal',role: 'member',     team: 'Alpha', position: 'Para-traffic Enforcer' },
    { id: 'u-aliones',     username: 'aliones',     name: 'Marlon Aliones',        role: 'member',     team: 'Alpha', position: 'Para-traffic Enforcer' },

    { id: 'u-montemor',    username: 'montemor',    name: 'Raymund Montemor',      role: 'member',     team: 'Zulu',  position: 'Para-traffic Enforcer' },
    { id: 'u-quitain',     username: 'quitain',     name: 'Bernard Quitain',       role: 'member',     team: 'Zulu',  position: 'Para-traffic Enforcer' },
    { id: 'u-guintangan',  username: 'guintangan',  name: 'Angelito Guintangan',   role: 'member',     team: 'Zulu',  position: 'Para-traffic Enforcer' },
    { id: 'u-delacruz',    username: 'delacruz',    name: 'Juan Dela Cruz',        role: 'member',     team: 'Zulu',  position: 'Para-traffic Enforcer' },

    { id: 'u-bacalla',     username: 'bacalla',     name: 'Danny Bacalla',         role: 'leader',     team: 'BOTH',  position: 'Team Leader' },
    { id: 'u-belen',       username: 'belen',       name: 'Joshiel D Belen',       role: 'supervisor', team: 'BOTH',  position: 'BPGT Supervisor' },
    { id: 'u-heredero',    username: 'heredero',    name: 'Joey S Heredero',       role: 'admin',      team: 'BOTH',  position: 'Terminal Administrator' }
  ],

  ROLES: {
    member:     { label: 'Task Force Member',    short: 'Member' },
    leader:     { label: 'Team Leader',          short: 'Leader' },
    supervisor: { label: 'BPGT Supervisor',      short: 'Supervisor' },
    admin:      { label: 'Terminal Administrator', short: 'Admin' }
  },

  STATUS: {
    draft:     { label: 'Draft',           cls: 'st-draft' },
    submitted: { label: 'Submitted',       cls: 'st-submitted' },
    reviewed:  { label: 'Verified',        cls: 'st-reviewed' },
    approved:  { label: 'Approved',        cls: 'st-approved' },
    returned:  { label: 'Returned',        cls: 'st-returned' }
  }
};

/* Tally fields used on page 2 of the form ------------------------------- */
BP.TALLY_FIELDS = [
  { key: 'vehicles',   label: 'Vehicles Monitored',     short: 'Vehicles' },
  { key: 'passengers', label: 'Passengers Assisted',    short: 'Passengers' },
  { key: 'arkabala',   label: 'Arkabala Checked',       short: 'Arkabala' },
  { key: 'violations', label: 'Violations Noted',       short: 'Violations' },
  { key: 'incidents',  label: 'Incidents/SOS',          short: 'Incidents' },
  { key: 'tickets',    label: 'Citation Tickets Issued',short: 'Tickets' }
];

/* Which screens each role can open -------------------------------------- */
BP.NAV = {
  member:     ['dashboard', 'encode', 'notices', 'duty', 'reports', 'monthly'],
  leader:     ['dashboard', 'monitoring', 'notices', 'duty', 'reports', 'monthly'],
  supervisor: ['dashboard', 'monitoring', 'notices', 'duty', 'reports', 'monthly'],
  admin:      ['dashboard', 'monitoring', 'notices', 'duty', 'reports', 'monthly', 'users', 'settings']
};

/* ---------------------------------------------------------------------- */
/* 7. DUTY SCHEDULE & LEAVE                                               */
/* ---------------------------------------------------------------------- */
BP.SHIFTS = [
  { key: 'AM',    label: 'AM shift',    time: '6:00 AM – 2:00 PM' },
  { key: 'PM',    label: 'PM shift',    time: '2:00 PM – 10:00 PM' },
  { key: 'NIGHT', label: 'Night shift', time: '10:00 PM – 6:00 AM' },
  { key: 'WHOLE', label: 'Whole day',   time: '6:00 AM – 10:00 PM' }
];

BP.LEAVE_TYPES = [
  'Vacation leave', 'Sick leave', 'Emergency leave',
  'Personal pass', 'Unauthorized absence', 'Detail / Special assignment'
];

BP.LEAVE_STATUS = {
  pending:  { label: 'Pending',  cls: 'st-submitted' },
  approved: { label: 'Approved', cls: 'st-approved' },
  declined: { label: 'Declined', cls: 'st-returned' }
};

/* ---------------------------------------------------------------------- */
/* 8. ANNOUNCEMENTS / DIRECTIVES                                          */
/* ---------------------------------------------------------------------- */
BP.NOTICE_AUDIENCE = {
  ALL:     'Everyone',
  Alpha:   'Alpha Team',
  Zulu:    'Zulu Team',
  OFFICIALS: 'Officials only (TL, Supervisor, Administrator)'
};

BP.NOTICE_PRIORITY = {
  normal: { label: 'Routine', cls: 'badge' },
  urgent: { label: 'Urgent directive', cls: 'badge danger' }
};
