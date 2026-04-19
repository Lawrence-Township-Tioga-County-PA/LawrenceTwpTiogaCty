# Lawrence Township Website — Secretary Guide

This guide explains how to update the township website by managing files in Google Drive.
**You do not need to edit any code or log into the website to make updates.**
All content changes are made by adding, editing, or removing files in the shared Google Drive folder.

---

## How It Works

The website reads directly from Google Drive. When you add a file to the right folder,
it appears on the website automatically — usually within a minute or two.
When you remove or rename a file, it disappears from the website just as quickly.

---

## Google Drive Folder Structure

All website content lives inside the **Lawrence Township** folder on Google Drive:

```
Lawrence Township/
├── Announcements/
├── Meetings/
│   ├── Monthly Meetings/
│   │   ├── 2026/
│   │   │   ├── Agendas/
│   │   │   └── Minutes/
│   │   └── 2025/
│   │       ├── Agendas/
│   │       └── Minutes/
│   └── Special Meetings/
│       ├── 2026/
│       │   ├── Agendas/
│       │   └── Minutes/
│       └── 2025/
│           ├── Agendas/
│           └── Minutes/
└── Ordinances/
```

At the start of each new year, create a new year folder (e.g. `2027`) inside both
**Monthly Meetings** and **Special Meetings**, each with an **Agendas** and **Minutes** subfolder.

---

## File Naming Rules

Every file must follow this naming convention so the website can read the date and title correctly.

### Format
```
YYYY-MM-DD_Title-Words-Here
```

- **Date first** — year, month, day, all separated by hyphens
- **Zero-pad single-digit months and days** — use `01` not `1`, `09` not `9`
- **Underscore** between the date and the title
- **Hyphens** between words in the title
- **Double hyphen** `--` where you want an actual hyphen to appear in the title

### Examples

| Filename | Displays As |
|---|---|
| `2026-04-07_Board-Meeting-Minutes` | April 7, 2026 — Board Meeting Minutes |
| `2026-04-07_April-Board-Meeting-Agenda` | April 7, 2026 — April Board Meeting Agenda |
| `2026-03-17_Special-Meeting--Budget-Review` | March 17, 2026 — Special Meeting - Budget Review |
| `2026-04-25_Spring-Clean-Up-Day_8am--2pm` | April 25, 2026 — Spring Clean Up Day 8am-2pm |

### Common Mistakes to Avoid

- ❌ `2026-4-7_Minutes` — month and day must be zero-padded → ✅ `2026-04-07_Minutes`
- ❌ `April 7 2026 Minutes` — spaces are not allowed → ✅ `2026-04-07_Minutes`
- ❌ `minutes_2026-04-07` — date must come first → ✅ `2026-04-07_Minutes`

---

## Adding an Announcement

Announcements appear on the homepage and the Announcements page.
The most recent three are shown on the homepage automatically.

**To add an announcement:**

1. Open the **Announcements** folder in Google Drive
2. Create a new **Google Doc** (not a Word document or PDF — a Google Doc renders best)
3. Name the file following the naming convention: `2026-04-25_Spring-Clean-Up-Day`
4. Write the announcement content in the document body
5. You can use **bold**, *italic*, bullet lists, and numbered lists — all formatting carries through to the website

The announcement will appear on the website within a minute or two.

**To remove an announcement**, move it out of the Announcements folder or delete it.

> **Note:** Announcements can also be PDFs if needed. PDF announcements will show a
> "View PDF" link on the website rather than displaying the text inline.

---

## Adding Meeting Agendas and Minutes

**To add an agenda:**

1. Open **Meetings → Monthly Meetings → [Year] → Agendas**
2. Upload the agenda PDF
3. Name it: `2026-05-05_May-Board-Meeting-Agenda`

**To add minutes:**

1. Open **Meetings → Monthly Meetings → [Year] → Minutes**
2. Upload the approved minutes PDF
3. Name it: `2026-04-07_April-Board-Meeting-Minutes`

The website matches agendas and minutes to the correct date in the meeting schedule table automatically.

**For special or additional meetings**, use the **Special Meetings** folder instead,
following the same structure. The description from the filename will appear in the
Special Meetings table on the website.

---

## Adding Ordinances

1. Open the **Ordinances** folder in Google Drive
2. Upload the ordinance PDF
3. Name it descriptively — ordinances are sorted alphabetically, so consistent naming helps:
   `Zoning-Ordinance`, `Subdivision-and-Land-Development-Ordinance`, `Floodplain-Ordinance`

Ordinances do not need a date prefix.

---

## What the Website Updates Automatically

You never need to update the following — the website handles them automatically:

- **Upcoming meeting dates** on the homepage and meetings page are calculated from the
  regular schedule (1st Monday of each month). No action needed.
- **Meeting years** — when you create a 2027 folder and start adding files, they appear automatically.
- **Announcement count** — the homepage always shows the 3 most recent announcements.

---

## If Something Doesn't Look Right

1. **Check the filename** — the most common cause of display issues is a date without zero-padding
   (e.g. `2026-4-7` instead of `2026-04-07`) or a missing underscore between the date and title
2. **Check the folder** — make sure the file is in the correct folder
3. **Wait a moment** — the website may take a minute or two to reflect changes
4. **Contact the website administrator** if the issue persists

---

*Last updated: April 2026*
