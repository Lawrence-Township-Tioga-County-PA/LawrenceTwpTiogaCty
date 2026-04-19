# Deployment Guide — Township Website Template

This guide covers the full process of deploying this website template for a new township.
Completing all steps takes approximately one focused day.

---

## Overview

The stack is intentionally simple and low-cost:

| Service | Purpose | Cost |
|---|---|---|
| GitHub | Version control, branch-based deploys | Free |
| Netlify | Hosting, test + prod environments | Free |
| Google Drive | Content management (files, docs) | Free |
| Google Cloud | Drive API access | Free (within quota) |
| Google Workspace | Professional email on township domain | $6/user/month (optional) |
| Domain registrar | Domain registration | ~$15-20/year |

---

## Step 1 — Accounts Setup

### Google Account
1. Create a free Google account for the township at **accounts.google.com**
2. Use a role-based Gmail address, e.g. `[township]pa@gmail.com`
3. Store credentials somewhere the township can access — not just on your machine
4. Note the recovery email and MFA phone number used

### GitHub
1. Create a GitHub account for the township using the township Google email
2. Go to your personal GitHub → **Your organizations** → **New organization**
3. Name it something like `[township]-pa` (free tier)
4. Invite the township GitHub account as an **Owner** of the org
5. Fork or transfer this repo into the org

### Netlify
1. Sign into **netlify.com** using the township Google account → **Sign up with Google**
2. Connect to GitHub — authorize against the township GitHub account
3. Create two sites from the repo:
   - **Test site**: branch = `test`, publish directory = `.`
   - **Prod site**: branch = `main`, publish directory = `.`
4. Rename the Netlify subdomains to something clean under Site configuration → Domain management

---

## Step 2 — Google Drive Setup

### Folder Structure
Create the following folder structure inside a top-level folder named after the township:

```
[Township Name]/
├── Announcements/
├── Meetings/
│   ├── Monthly Meetings/
│   │   ├── [YEAR]/
│   │   │   ├── Agendas/
│   │   │   └── Minutes/
│   ├── Special Meetings/
│   │   ├── [YEAR]/
│   │   │   ├── Agendas/
│   │   │   └── Minutes/
└── Ordinances/
```

Create year subfolders for the current year and one prior year to start.

### Sharing Permissions
1. Right-click the top-level township folder
2. **Share** → **Change to anyone with the link** → **Viewer**
3. Confirm inheritance applies to all subfolders

### Get Folder IDs
For each of the four top-level content folders, open it in Drive and copy the ID from the URL:
```
drive.google.com/drive/folders/FOLDER_ID_IS_HERE
```

Collect IDs for:
- `Announcements`
- `Meetings/Monthly Meetings`
- `Meetings/Special Meetings`
- `Ordinances`

---

## Step 3 — Google Cloud API Setup

1. Go to **console.cloud.google.com** — sign in with the township Google account
2. Create a new project: e.g. `[Township] Website`
3. Go to **APIs & Services → Library** → search **Google Drive API** → Enable
4. Go to **APIs & Services → Credentials** → **Create Credentials** → **API Key**
5. Copy the key immediately

### Restrict the API Key (Required)
Click the key → edit:
- **API restrictions**: restrict to **Google Drive API** only
- **Website restrictions**: add both Netlify URLs:
  - `https://[township]-test.netlify.app/*`
  - `https://[township].netlify.app/*`
  - Add the custom domain once DNS is pointed: `https://[domain].com/*`

---

## Step 4 — Configure the Site

Open `config.js` and update **every value**:

```javascript
const CONFIG = {
  name:    "[Township Name]",
  county:  "[County Name]",
  state:   "Pennsylvania",
  tagline: "Serving our community with transparency and care",

  address:  "[Address]",
  city:     "[City], PA [ZIP]",
  phone:    "([area]) [xxx]-[xxxx]",
  phoneTel: "[digits only]",
  fax:      "([area]) [xxx]-[xxxx]",
  email:    "[email]",

  officeHours: [
    { day: "[Day]", hours: "[Time] – [Time]" },
    // add or remove rows as needed
  ],

  meetingTime:     "6:30 PM",   // adjust if different
  meetingLocation: "[Full address]",

  meetingDateOverrides: {
    // Add any dates that shift due to holidays
    // "YYYY-MM-DD": "YYYY-MM-DD"
  },

  googleApiKey: "[YOUR API KEY]",

  driveFolders: {
    announcements:   "[FOLDER ID]",
    monthlyMeetings: "[FOLDER ID]",
    specialMeetings: "[FOLDER ID]",
    ordinances:      "[FOLDER ID]",
  },
};
```

Update `contact.html` with the new township's officials, police, and department contacts.

---

## Step 5 — Branch Strategy

The repo uses three branch levels:

```
main          →  production site (live domain)
test          →  test environment (Netlify preview URL)
feature/*     →  active development
```

**Rules:**
- Branch protections are enabled on both `main` and `test`
- Nothing goes directly to `main` or `test` — always via PR
- Workflow: create feature branch → develop → PR to `test` → verify → PR to `main`

### First Deploy Workflow
1. Create branch: `feature/initial-setup`
2. Update `config.js` and `contact.html`
3. Commit and push → Netlify auto-deploys to test environment
4. Verify in a private browser window (no Google session)
5. PR `feature/initial-setup` → `test`
6. Once verified, PR `test` → `main`

---

## Step 6 — DNS Cutover

Once the site is fully verified on the test URL:

### If transferring domain to Netlify:
1. In Netlify prod site → **Domain management** → **Add custom domain**
2. Follow Netlify's domain transfer instructions
3. Transfer takes 5-7 days

### If keeping domain at current registrar:
1. In Netlify prod site → **Domain management** → **Add custom domain** → enter domain
2. Netlify provides DNS records to add
3. At the registrar, update:
   - **A record**: point `@` to Netlify's load balancer IP
   - **CNAME**: point `www` to your Netlify subdomain
4. Propagation takes 24-48 hours
5. Netlify provisions SSL automatically once DNS resolves

### After DNS Resolves:
- Add the live domain to the API key's **Website restrictions** in Google Cloud Console
- Verify the site loads correctly on the custom domain
- Verify Drive content still loads (API key restriction now includes new domain)

---

## Step 7 — Handoff

Before handing off to the township:

- [ ] Confirm township has Google account credentials stored safely
- [ ] Confirm township has GitHub account credentials stored safely
- [ ] Confirm township has Netlify account credentials stored safely
- [ ] Confirm township has domain registrar credentials stored safely
- [ ] Walk the secretary through the Drive workflow end to end
- [ ] Leave a printed copy of `secretary-guide.md` and `naming-conventions.md`
- [ ] Add your contact info somewhere accessible in case issues arise

---

## Optional — Google Workspace Email

If the township wants a professional email address on their domain (e.g. `office@[domain].com`):

1. Go to **workspace.google.com** → Start free trial → sign in with township Google account
2. Verify domain ownership (Netlify/registrar makes this straightforward)
3. Add user: `office@[domain].com` or `secretary@[domain].com`
4. Set up Gmail to send/receive on the new address
5. Update `config.js` `email` field and redeploy
6. Cost: $6/user/month — requires supervisor approval as a budget line item

---

## Ongoing Maintenance

The secretary handles all content through Google Drive — no code changes required for:
- Adding/removing announcements
- Uploading meeting agendas and minutes
- Adding ordinances

Code changes are needed for:
- Updating official names in `contact.html`
- Adding meeting date overrides in `config.js` (holiday shifts)
- Creating new year subfolders in Drive (secretary can do this)
- Any design or structural changes

At the start of each year, remind the secretary to:
1. Create new year subfolders in Drive under Monthly and Special Meetings
2. Verify upcoming meeting dates and add any holiday overrides to `config.js`

---

*Template maintained by [your name/contact]. Last updated: April 2026.*
