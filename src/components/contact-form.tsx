"use client";

import { useRef, useState } from "react";
import { CONTACT } from "@/lib/content/onboarding";
import { isEmail, isPhone, normalisePhone } from "@/lib/signup";
import type { Contact } from "@/lib/store";

type Field = "email" | "phone" | "consent";

/** Email, optional phone and consent. Used in onboarding, on Today for existing users, and in Settings. */
export function ContactForm({
  initial,
  submitLabel = CONTACT.next,
  onSubmit,
  pinned = false,
  extra,
}: {
  initial?: Contact | null;
  submitLabel?: string;
  onSubmit: (c: Contact) => void;
  pinned?: boolean;
  /** Extra controls under the button (e.g. "Not now"). */
  extra?: React.ReactNode;
}) {
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [consent, setConsent] = useState(!!initial);
  const [error, setError] = useState<{ field: Field; message: string } | null>(null);
  const form = useRef<HTMLFormElement>(null);

  function fail(field: Field, message: string) {
    setError({ field, message });
    requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[data-field="${field}"]`)?.focus());
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = normalisePhone(phone);
    if (!isEmail(email)) return fail("email", CONTACT.errors.email);
    if (!isPhone(p)) return fail("phone", CONTACT.errors.phone);
    if (!consent) return fail("consent", CONTACT.errors.consent);
    setError(null);
    onSubmit({ email: email.trim().toLowerCase(), phone: p, consentAt: initial?.consentAt ?? new Date().toISOString() });
  }

  const err = (f: Field) =>
    error?.field === f && (
      <p id={`contact-error-${f}`} role="alert" className="mt-1.5 rounded-[12px] border-2 border-rust bg-warn-soft px-3 py-2 text-[15px] font-bold">
        {error.message}
      </p>
    );

  return (
    <form ref={form} onSubmit={submit} className={`flex flex-col gap-3.5 ${pinned ? "flex-1" : ""}`} noValidate>
      <div>
        <label htmlFor="contact-email" className="label">
          {CONTACT.email}
        </label>
        <input
          id="contact-email"
          data-field="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className="field"
          placeholder={CONTACT.emailHint}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error?.field === "email"}
          aria-describedby={error?.field === "email" ? "contact-error-email" : undefined}
        />
        {err("email")}
      </div>
      <div>
        <label htmlFor="contact-phone" className="label">
          {CONTACT.phone}
        </label>
        <input
          id="contact-phone"
          data-field="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="field"
          placeholder={CONTACT.phoneHint}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={error?.field === "phone"}
          aria-describedby={error?.field === "phone" ? "contact-error-phone" : undefined}
        />
        {err("phone")}
      </div>
      <div>
        <label htmlFor="contact-consent" className="flex min-h-11 items-start gap-2.5 text-[15px] leading-snug">
          <input
            id="contact-consent"
            data-field="consent"
            type="checkbox"
            className="mt-0.5 size-[22px] shrink-0 accent-[var(--indigo)]"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={error?.field === "consent"}
            aria-describedby={error?.field === "consent" ? "contact-error-consent" : undefined}
          />
          <span>{CONTACT.consent}</span>
        </label>
        {err("consent")}
      </div>
      <button className={`btn btn-wide ${pinned ? "mt-auto" : "mt-1"}`}>{submitLabel}</button>
      {extra}
    </form>
  );
}
