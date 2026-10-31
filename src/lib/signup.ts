import type { Contact, Prefs, Profile } from "./store";

/**
 * Sends sign-ups and visits to the owner's Google Sheet (see scripts/google-sheet-signups.gs).
 * Only the email, optional phone, first name, chart style and time zone go there; birth details
 * stay on the device. Switched off unless NEXT_PUBLIC_SIGNUP_URL is set at build time.
 */

const URL = process.env.NEXT_PUBLIC_SIGNUP_URL ?? "";
export const signupConfigured = URL !== "";

export const isEmail = (s: string) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(s.trim()) && s.length <= 200;

/** Keeps digits and a leading +; null if empty. Valid when 8 to 15 digits. */
export function normalisePhone(s: string): string | null {
  const t = s.trim();
  if (!t) return null;
  const digits = t.replace(/\D/g, "");
  return `${t.startsWith("+") ? "+" : ""}${digits}`;
}
export const isPhone = (s: string | null) => s === null || /^\+?\d{8,15}$/.test(s);

export type SignupEvent = "signup" | "visit" | "delete";

export function eventBody(event: SignupEvent, contact: Contact, profile?: Profile | null, prefs?: Prefs) {
  return {
    event,
    email: contact.email.trim().toLowerCase(),
    ...(event === "signup"
      ? {
          phone: contact.phone ?? "",
          name: profile?.name.split(" ")[0] ?? "",
          system: prefs?.system ?? "",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      : {}),
  };
}

/** Fire-and-forget: the sheet's reply can't be read cross-site, and the app never waits on it. */
export function sendEvent(event: SignupEvent, contact: Contact, profile?: Profile | null, prefs?: Prefs) {
  if (!signupConfigured) return;
  fetch(URL, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(eventBody(event, contact, profile, prefs)),
  }).catch(() => {
    // offline: this visit just isn't counted
  });
}
