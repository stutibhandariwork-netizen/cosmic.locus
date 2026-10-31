/**
 * Cosmic Locus sign-ups: a Google Apps Script web app that writes to the Google Sheet it's attached to.
 *
 * Setup (once): in the Sheet, Extensions → Apps Script, paste this file, then Deploy → New deployment →
 * Web app, "Execute as: Me", "Who has access: Anyone". Copy the web app URL into the site's build
 * (NEXT_PUBLIC_SIGNUP_URL).
 *
 * The site sends JSON (as text/plain, so browsers don't need a CORS preflight):
 *   { event: "signup" | "visit" | "delete", email, phone?, name?, system?, timeZone? }
 *
 * Sheets it keeps:
 *   "Sign-ups": one row per person (email, phone, first name, signed up, last visit, visits).
 *   "Visits":   one row per visit (when, email, event).
 * "delete" removes the person from both sheets.
 */

const SIGNUPS = "Sign-ups";
const VISITS = "Visits";
const SIGNUP_HEADERS = ["Signed up", "Email", "Phone", "First name", "Chart style", "Time zone", "Last visit", "Visits"];
const VISIT_HEADERS = ["When", "Email", "Event"];

function doPost(e) {
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply("bad json");
  }
  const email = String(d.email || "").trim().toLowerCase().slice(0, 200);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return reply("bad email");
  const event = ["signup", "visit", "delete"].indexOf(d.event) >= 0 ? d.event : "visit";

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const people = sheet(book, SIGNUPS, SIGNUP_HEADERS);
    const visits = sheet(book, VISITS, VISIT_HEADERS);
    const now = new Date();
    const rows = people.getDataRange().getValues();
    let row = -1;
    for (let i = 1; i < rows.length; i++) if (String(rows[i][1]).toLowerCase() === email) row = i + 1;

    if (event === "delete") {
      if (row > 0) people.deleteRow(row);
      const log = visits.getDataRange().getValues();
      for (let i = log.length - 1; i >= 1; i--) if (String(log[i][1]).toLowerCase() === email) visits.deleteRow(i + 1);
      return reply("deleted");
    }

    if (row < 0) {
      people.appendRow([now, email, clean(d.phone), clean(d.name), clean(d.system), clean(d.timeZone), now, 1]);
    } else {
      if (event === "signup") people.getRange(row, 3, 1, 4).setValues([[clean(d.phone), clean(d.name), clean(d.system), clean(d.timeZone)]]);
      const count = Number(people.getRange(row, 8).getValue()) || 0;
      people.getRange(row, 7, 1, 2).setValues([[now, count + 1]]);
    }
    visits.appendRow([now, email, event]);
    return reply("ok");
  } finally {
    lock.releaseLock();
  }
}

function sheet(book, name, headers) {
  let s = book.getSheetByName(name);
  if (!s) {
    s = book.insertSheet(name);
    s.appendRow(headers);
    s.setFrozenRows(1);
  }
  return s;
}

/** Plain short text; a leading = + - or @ is escaped so nothing runs as a formula. */
function clean(v) {
  const s = String(v == null ? "" : v).slice(0, 100);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(text) {
  return ContentService.createTextOutput(text);
}
