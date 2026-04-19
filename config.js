// =============================================================================
// config.js — Lawrence Township Website Configuration
//
// When deploying to a new township, this is the only file you need to update.
// Replace all values below with the new township's information.
//
// SECURITY NOTE: The Google API key below is restricted to specific domains
// in Google Cloud Console. Do not remove those domain restrictions.
// =============================================================================

const CONFIG = {

  // ── Township Identity ───────────────────────────────────────────────────────
  name:    "Lawrence Township",
  county:  "Tioga County",
  state:   "Pennsylvania",
  tagline: "Serving our community with transparency and care",

  // ── Contact ─────────────────────────────────────────────────────────────────
  address:  "1038 Buckwheat Hollow Rd",
  city:     "Lawrenceville, PA 16929",
  phone:    "(570) 827-2254",
  phoneTel: "5708272254",       // digits only, for tel: links
  fax:      "(570) 827-0210",
  email:    "twp@epix.net",

  // ── Office Hours ─────────────────────────────────────────────────────────────
  officeHours: [
    { day: "Monday",    hours: "9:00 AM – 5:00 PM" },
    { day: "Wednesday", hours: "9:00 AM – 5:00 PM" },
    { day: "Friday",    hours: "9:00 AM – 5:00 PM" },
  ],

  // ── Meeting Schedule ─────────────────────────────────────────────────────────
  // Regular meetings are the 1st Monday of each month.
  meetingTime:     "6:30 PM",
  meetingLocation: "Township Building, 1038 Buckwheat Hollow Rd, Lawrenceville, PA 16929",

  // Override specific dates that shift due to holidays.
  // Key: the calculated first-Monday date (YYYY-MM-DD)
  // Value: the actual meeting date (YYYY-MM-DD)
  meetingDateOverrides: {
    "2026-09-07": "2026-09-08",   // Labor Day — shifted to Tuesday Sept 8
  },

  // ── Homepage Display Settings ────────────────────────────────────────────────
  announcementsPreviewCount: 3,   // announcements shown on homepage
  upcomingMeetingsCount:     5,   // upcoming meetings shown in sidebar

  // ── Google API ───────────────────────────────────────────────────────────────
  // Replace with your API key. Restrict it to your Netlify domains in
  // Google Cloud Console → APIs & Services → Credentials.
  googleApiKey: "AIzaSyBX3uHhALYWHnCzjQ1LbDOj7E_D1vdIRMc",

  // Google Drive folder IDs.
  // Get these from the folder URL:
  //   drive.google.com/drive/folders/FOLDER_ID_IS_HERE
  driveFolders: {
    announcements:   "1tP9hheABEV2eg6o_B8NnXW_nC-I-5GgW",
    monthlyMeetings: "1-wSf9QvwOYv5cYQIkr7FGgdubhb5ias-",
    specialMeetings: "1lui4uJ7zUuV7P3GNTp3k0MfEE2AcGbvy",
    ordinances:      "1QIJS3N0TkKCqAlUXAYFr_p2Vlm5nyz5e",
  },

};
