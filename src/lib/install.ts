"use client";

import { sendEvent } from "./signup";
import { snapshot, update } from "./store";

/** The browser's install prompt (Chrome and Android), saved for when the visitor taps our button. */
interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: InstallPrompt | null = null;
const listeners = new Set<() => void>();

/**
 * Call once on load: counts this visit (once per browser session), logs it to the sign-up sheet
 * for people who gave their email, and listens for the install prompt.
 */
export function startInstallWatch() {
  try {
    if (!sessionStorage.getItem("cl-visit")) {
      sessionStorage.setItem("cl-visit", "1");
      update((d) => ({ ...d, visits: d.visits + 1 }));
      const { contact } = snapshot();
      if (contact) sendEvent("visit", contact);
    }
  } catch {
    // no session storage: don't count
  }
  const onPrompt = (e: Event) => {
    e.preventDefault();
    deferred = e as InstallPrompt;
    listeners.forEach((l) => l());
  };
  window.addEventListener("beforeinstallprompt", onPrompt);
  return () => window.removeEventListener("beforeinstallprompt", onPrompt);
}

export const onInstallAvailable = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const canPromptInstall = () => deferred !== null;

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  await deferred.prompt();
  const { outcome } = await deferred.userChoice;
  deferred = null;
  return outcome === "accepted";
}

/** Already opened from the home screen. */
export const isInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
