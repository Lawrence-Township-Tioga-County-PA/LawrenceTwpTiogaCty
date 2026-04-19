// =============================================================================
// drive.js — Google Drive API utilities + Meeting Schedule calculator
// Depends on: config.js (must be loaded first)
// =============================================================================


// ── Drive API ─────────────────────────────────────────────────────────────────

const Drive = {

  _base: "https://www.googleapis.com/drive/v3",

  // List the immediate children of a folder (files and subfolders).
  async listFolder(folderId) {
    const params = new URLSearchParams({
      q:        `'${folderId}' in parents and trashed = false`,
      fields:   "files(id,name,mimeType,webViewLink)",
      pageSize: "1000",
      key:      CONFIG.googleApiKey,
    });
    const res = await fetch(`${this._base}/files?${params}`);
    if (!res.ok) throw new Error(`Drive API error ${res.status}`);
    const data = await res.json();
    return data.files || [];
  },

  // Return all non-folder files beneath folderId, recursively.
  async getFilesRecursively(folderId) {
    const files = [];
    await this._traverse(folderId, files);
    return files;
  },

  async _traverse(folderId, files) {
    const items = await this.listFolder(folderId);
    for (const item of items) {
      if (item.mimeType === "application/vnd.google-apps.folder") {
        await this._traverse(item.id, files);
      } else {
        files.push(item);
      }
    }
  },

  // Return meeting files split into { agendas: [], minutes: [] }.
  // Categorization is determined by whether the file lives inside a
  // folder named "Agendas" or "Minutes" anywhere in the tree.
  async getMeetingFiles(folderId) {
    const result = { agendas: [], minutes: [] };
    await this._traverseMeetings(folderId, result, null);
    return result;
  },

  async _traverseMeetings(folderId, result, currentType) {
    const items = await this.listFolder(folderId);
    for (const item of items) {
      if (item.mimeType === "application/vnd.google-apps.folder") {
        const n = item.name.toLowerCase();
        const type = n === "agendas" ? "agendas"
                   : n === "minutes" ? "minutes"
                   : currentType;
        await this._traverseMeetings(item.id, result, type);
      } else if (currentType) {
        result[currentType].push(item);
      }
    }
  },

  // Export a Google Doc as plain text.
  async getDocText(fileId) {
    const params = new URLSearchParams({
      mimeType: "text/plain",
      key:      CONFIG.googleApiKey,
    });
    const res = await fetch(`${this._base}/files/${fileId}/export?${params}`);
    if (!res.ok) throw new Error(`Export error ${res.status}`);
    return await res.text();
  },

  // Export a Google Doc as cleaned HTML, preserving semantic formatting
  // (bold, italic, lists, etc.) while stripping Google's inline styles.
  async getDocHtml(fileId) {
    const params = new URLSearchParams({
      mimeType: "text/html",
      key:      CONFIG.googleApiKey,
    });
    const res = await fetch(`${this._base}/files/${fileId}/export?${params}`);
    if (!res.ok) throw new Error(`Export error ${res.status}`);
    const raw = await res.text();

    // Parse the full HTML document and extract the body
    const parser = new DOMParser();
    const doc    = parser.parseFromString(raw, "text/html");
    const body   = doc.body;

    // Strip Google's inline styles, classes, and IDs — keep semantic tags
    body.querySelectorAll("[style]").forEach(el => el.removeAttribute("style"));
    body.querySelectorAll("[class]").forEach(el => el.removeAttribute("class"));
    body.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

    // Remove empty spans Google uses as style wrappers
    body.querySelectorAll("span").forEach(el => {
      if (!el.innerHTML.trim()) el.remove();
    });

    // Remove trailing horizontal rules Google sometimes adds
    body.querySelectorAll("hr").forEach(el => el.remove());

    return body.innerHTML.trim();
  },

  // ── Filename Parsing ──────────────────────────────────────────────────────
  // Convention: YYYY-MM-DD_Title-Words-Here
  // Use -- in the filename where you want a literal hyphen to appear.
  // Example: 2026-04-25_Spring-Clean-Up-Day_8am--2pm
  //          → "Spring Clean Up Day 8am-2pm"

  parseFilename(name) {
    const noExt = name.replace(/\.[^/.]+$/, "");
    const sep   = noExt.indexOf("_");
    if (sep === -1) return null;

    const dateStr  = noExt.substring(0, sep);
    const titleRaw = noExt.substring(sep + 1);

    const parts = dateStr.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    const [year, month, day] = parts;

    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return null;

    // -- becomes a literal hyphen; single - becomes a space
    const title = titleRaw
      .replace(/--/g, "\x00")
      .replace(/-/g, " ")
      .replace(/\x00/g, "-");

    const pad = n => String(n).padStart(2, "0");
    const key = `${year}-${pad(month)}-${pad(day)}`;

    return {
      date,
      dateKey: key,
      title,
      year,
      displayDate: date.toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      }),
      shortDate: date.toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
    };
  },

  // Sort an array of Drive file objects by date (newest first by default).
  sortByDate(files, ascending = false) {
    return [...files].sort((a, b) => {
      const ai = this.parseFilename(a.name);
      const bi = this.parseFilename(b.name);
      if (!ai || !bi) return 0;
      return ascending ? ai.date - bi.date : bi.date - ai.date;
    });
  },

  // Build a map of dateKey → { info, agenda, minutes } from two file arrays.
  buildMeetingRecords(agendas, minutes) {
    const records = {};

    for (const file of agendas) {
      const info = this.parseFilename(file.name);
      if (!info) continue;
      if (!records[info.dateKey]) records[info.dateKey] = { info, agenda: null, minutes: null };
      records[info.dateKey].agenda = file;
    }

    for (const file of minutes) {
      const info = this.parseFilename(file.name);
      if (!info) continue;
      if (!records[info.dateKey]) records[info.dateKey] = { info, agenda: null, minutes: null };
      records[info.dateKey].minutes = file;
    }

    // Return sorted newest first
    return Object.values(records).sort((a, b) => b.info.date - a.info.date);
  },

};


// ── Meeting Schedule Calculator ───────────────────────────────────────────────

const Schedule = {

  // Return the first Monday of the given month (0-indexed).
  _firstMonday(year, month) {
    const d   = new Date(year, month, 1);
    const dow = d.getDay();                 // 0=Sun, 1=Mon, …
    d.setDate(1 + (1 - dow + 7) % 7);
    return d;
  },

  // Format a Date as YYYY-MM-DD for override lookups.
  _toKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  },

  // Apply a date override from CONFIG if one exists for this date.
  _applyOverride(date) {
    const key = this._toKey(date);
    if (CONFIG.meetingDateOverrides[key]) {
      const [y, m, d] = CONFIG.meetingDateOverrides[key].split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return date;
  },

  // Get the next `count` upcoming meeting dates (on or after today).
  getUpcoming(count = 5) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const meetings = [];
    let year  = today.getFullYear();
    let month = today.getMonth();

    while (meetings.length < count) {
      if (month > 11) { month = 0; year++; }
      const meeting = this._applyOverride(this._firstMonday(year, month));
      if (meeting >= today) meetings.push(meeting);
      month++;
    }
    return meetings;
  },

  // Get all 12 meeting dates for a given year.
  getForYear(year) {
    return Array.from({ length: 12 }, (_, m) =>
      this._applyOverride(this._firstMonday(year, m))
    );
  },

  // Human-readable label for a meeting date.
  formatDate(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
  },

  formatShort(date) {
    return date.toLocaleDateString("en-US", {
      month: "short", day: "numeric",
    });
  },

  toKey(date) {
    return this._toKey(date);
  },

};


// ── Shared UI Helpers ─────────────────────────────────────────────────────────

const UI = {

  // Replace an element's content with a loading spinner message.
  showLoading(el, message = "Loading…") {
    el.innerHTML = `<p class="drive-loading">${message}</p>`;
  },

  // Replace an element's content with an error message.
  showError(el, message = "Could not load content. Please try again later.") {
    el.innerHTML = `<p class="drive-error">${message}</p>`;
  },

  // Render a document link button, or a placeholder span.
  docLink(file, label = "View") {
    if (!file) return `<span class="pending">—</span>`;
    return `<a href="${file.webViewLink}" target="_blank" rel="noopener" class="pdf-link">${label}</a>`;
  },

  // Populate all elements with data-config="KEY" from CONFIG.
  renderConfig() {
    document.querySelectorAll("[data-config]").forEach(el => {
      const key = el.dataset.config;
      if (CONFIG[key] !== undefined) el.textContent = CONFIG[key];
    });
  },

  // Render the footer contact line (shared across all pages).
  renderFooter() {
    const el = document.getElementById("footer-contact");
    if (!el) return;
    el.innerHTML =
      `<strong>${CONFIG.name}</strong> &bull; ${CONFIG.address}, ${CONFIG.city}<br>` +
      `Phone: <a href="tel:${CONFIG.phoneTel}">${CONFIG.phone}</a> &bull; ` +
      `Fax: ${CONFIG.fax} &bull; <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>`;
  },

};
