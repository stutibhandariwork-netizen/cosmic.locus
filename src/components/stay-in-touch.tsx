"use client";

import { ContactForm } from "@/components/contact-form";
import { CONTACT } from "@/lib/content/onboarding";
import { sendEvent, signupConfigured } from "@/lib/signup";
import { update, type Data } from "@/lib/store";

/** For people who signed up before emails were asked for: once, on Today, until they add one or say not now. */
export function StayInTouch({ data }: { data: Data }) {
  if (!signupConfigured || !data.profile || data.contact || data.contactDismissed) return null;
  return (
    <section className="card bg-indigo-soft" aria-labelledby="stay-title">
      <h2 id="stay-title" className="font-display text-xl leading-tight font-semibold text-indigo">
        {CONTACT.existingTitle}
      </h2>
      <p className="text-[15px]">{CONTACT.existingSub}</p>
      <ContactForm
        submitLabel="Save"
        onSubmit={(c) => {
          update((d) => ({ ...d, contact: c }));
          sendEvent("signup", c, data.profile, data.prefs);
        }}
        extra={
          <button type="button" className="min-h-11 self-start text-[15px] font-bold text-label underline" onClick={() => update((d) => ({ ...d, contactDismissed: true }))}>
            {CONTACT.later}
          </button>
        }
      />
    </section>
  );
}
