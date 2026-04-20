# Lawrence Township Website
### Tioga County, Pennsylvania

Official website for Lawrence Township, Tioga County, PA. Built as a static site with Google Drive as the content management backend — no database, no CMS login, no code changes required for day-to-day content updates.

**Live site:** https://lawrencetownshiptiogacountypa.com  
**Test environment:** https://lawrencetownshiptiogacountypa-test.netlify.app

---

## How It Works

Content is managed entirely through Google Drive. When the secretary uploads a file to the correct folder, it appears on the website automatically. No one needs to touch code to post an announcement, upload meeting minutes, or add an ordinance.

| Drive Folder | Website Location |
|---|---|
| `Announcements/` | Homepage + Announcements page |
| `Meetings/Monthly Meetings/` | Meetings page — regular schedule table |
| `Meetings/Special Meetings/` | Meetings page — special meetings table |
| `Ordinances/` | Ordinances page |

Meeting dates are calculated automatically from the regular schedule (1st Monday of each month). No one needs to update the calendar.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Hosting | Netlify (free tier) |
| Version control | GitHub |
| Frontend | HTML, CSS, vanilla JavaScript |
| Content | Google Drive + Google Docs |
| API | Google Drive API v3 |
| Fonts | Google Fonts (Cormorant Garamond, Source Sans 3) |

No build step, no frameworks, no dependencies to install. Every file is plain HTML/CSS/JS that runs directly in the browser.

---

## Repository Structure

```
/
├── index.html          # Homepage
├── news.html           # Announcements page
├── meetings.html       # Meeting schedule and records
├── ordinances.html     # Ordinances page
├── contact.html        # Officials and department contacts
├── style.css           # Shared stylesheet
├── config.js           # All township-specific configuration
├── drive.js            # Google Drive API utilities and schedule calculator
└── docs/
    ├── secretary-guide.md        # Non-technical content management guide
    ├── naming-conventions.md     # File naming reference card
    └── deployment-guide.md       # Full setup guide for new deployments
```

---

## Branch Strategy

```
main        →  production (live domain)
test        →  test environment (Netlify preview)
feature/*   →  active development
```

Branch protections are enabled on both `main` and `test`. All changes go through a pull request — nothing is pushed directly to either branch.

**Workflow:** create feature branch off `test` → develop → PR to `test` → verify on preview URL → PR to `main` → production updates automatically.

---

## Configuration

All township-specific values live in `config.js` — township name, address, contact info, office hours, meeting schedule, Google API key, and Drive folder IDs. To deploy this template for a new township, `config.js` and `contact.html` are the only files that need to be updated.

See [`docs/deployment-guide.md`](docs/deployment-guide.md) for full setup instructions.

---

## Content Management

The secretary manages all content through Google Drive. No code access is required.

See [`docs/secretary-guide.md`](docs/secretary-guide.md) for the content management guide.  
See [`docs/naming-conventions.md`](docs/naming-conventions.md) for the file naming reference card.

---

## Local Development

No build tools required. Open any HTML file directly in a browser, or run a simple local server:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Note: Google Drive API calls will fail locally if the API key has website restrictions applied. Either temporarily remove the restrictions during development or test against the Netlify test environment.

---

## Maintenance

**Annual tasks (start of each year):**
- Create new year subfolders in Drive under Monthly and Special Meetings
- Review `meetingDateOverrides` in `config.js` for holiday shifts in the new year

**When officials change:**
- Update names and roles in `contact.html`
- Commit to a feature branch and PR through the normal workflow

---

*Codebase built and maintained by Matt Strevig (msdesigns1212)*
