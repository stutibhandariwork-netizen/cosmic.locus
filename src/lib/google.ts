"use client";

import type { JournalEntry } from "./store";

/**
 * One-way sync of the journal to a Google Doc in the visitor's own Drive.
 * Sign-in uses Google Identity Services in the browser (no server). The scope is drive.file,
 * so the site can only see the one document it creates. The access token is kept in memory only.
 */

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
export const googleConfigured = CLIENT_ID !== "";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const DOC_MIME = "application/vnd.google-apps.document";

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
}
interface TokenClient {
  requestAccessToken(overrides?: { prompt?: string }): void;
}
interface GoogleOAuth {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (r: TokenResponse) => void;
    error_callback?: (e: { type: string }) => void;
  }): TokenClient;
  revoke(token: string, done?: () => void): void;
}
declare global {
  interface Window {
    google?: { accounts: { oauth2: GoogleOAuth } };
  }
}

let token: { value: string; expires: number } | null = null;
let gisLoading: Promise<void> | null = null;

/** Loads Google's sign-in script. Call early: the sign-in popup must open straight from a tap. */
export function loadGoogle(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  gisLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      gisLoading = null;
      reject(new Error("Couldn't reach Google. Check your connection and try again."));
    };
    document.head.appendChild(s);
  });
  return gisLoading;
}

export const hasToken = () => !!token && token.expires > Date.now() + 60_000;

/** Opens Google's sign-in popup (must run inside a tap handler, after loadGoogle has finished). */
export function signIn(): Promise<string> {
  const oauth = window.google?.accounts?.oauth2;
  if (!oauth) return Promise.reject(new Error("Google sign-in is still loading. Try again in a moment."));
  return new Promise((resolve, reject) => {
    const client = oauth.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (r) => {
        if (r.error || !r.access_token) return reject(new Error("Google sign-in didn't finish."));
        token = { value: r.access_token, expires: Date.now() + (r.expires_in ?? 3600) * 1000 };
        resolve(r.access_token);
      },
      error_callback: (e) => reject(new Error(e.type === "popup_closed" ? "The Google window was closed before signing in." : "Google sign-in didn't finish.")),
    });
    client.requestAccessToken({ prompt: "" });
  });
}

export function signOut() {
  if (token && window.google?.accounts?.oauth2) window.google.accounts.oauth2.revoke(token.value);
  token = null;
}

export class SignInNeeded extends Error {}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The journal as simple HTML, which Drive converts into a Google Doc. Newest first. */
export function journalHtml(entries: JournalEntry[], now = new Date()): string {
  const day = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).replace(",", "");
  const body = entries
    .map((e) => {
      const parts = [`<h2>${esc(day(e.date))}</h2>`];
      if (e.link) parts.push(`<p><b>${esc(e.link.title)}</b><br>${esc(e.link.summary)}</p>`);
      if (e.prompt) parts.push(`<p><i>${esc(e.prompt)}</i></p>`);
      parts.push(...e.text.split(/\n{2,}/).map((para) => `<p>${esc(para).replace(/\n/g, "<br>")}</p>`));
      return parts.join("\n");
    })
    .join("\n<hr>\n");
  const updated = now.toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" });
  return `<html><head><meta charset="utf-8"></head><body>
<h1>Cosmic Locus journal</h1>
<p><i>Copied from Cosmic Locus on ${esc(updated)}. Changes made here aren't sent back to the app; the next sync replaces this document.</i></p>
${body || "<p>No notes yet.</p>"}
</body></html>`;
}

async function call(url: string, init: RequestInit): Promise<Response> {
  if (!hasToken()) throw new SignInNeeded("Sign in with Google to sync.");
  const res = await fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token!.value}` } });
  if (res.status === 401) {
    token = null;
    throw new SignInNeeded("Your Google sign-in has expired. Sign in again to sync.");
  }
  return res;
}

/** Writes the journal into the Doc (creating it the first time, or again if it was deleted). */
export async function syncToDoc(entries: JournalEntry[], docId: string | null): Promise<{ docId: string; url: string }> {
  const html = journalHtml(entries);
  if (docId) {
    const res = await call(`https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(docId)}?uploadType=media&fields=id,webViewLink,trashed`, {
      method: "PATCH",
      headers: { "Content-Type": "text/html; charset=UTF-8" },
      body: html,
    });
    if (res.ok) {
      const f = (await res.json()) as { id: string; webViewLink: string; trashed?: boolean };
      if (!f.trashed) return { docId: f.id, url: f.webViewLink };
    } else if (res.status !== 404) {
      throw new Error(`Google Drive said no (${res.status}). Try again in a little while.`);
    }
  }
  const boundary = `cl${Math.random().toString(36).slice(2)}`;
  const meta = JSON.stringify({ name: "Cosmic Locus journal", mimeType: DOC_MIME });
  const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${html}\r\n--${boundary}--`;
  const res = await call("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
    method: "POST",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  });
  if (!res.ok) throw new Error(`Google Drive said no (${res.status}). Try again in a little while.`);
  const f = (await res.json()) as { id: string; webViewLink: string };
  return { docId: f.id, url: f.webViewLink };
}
