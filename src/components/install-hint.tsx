"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/sky-art";
import { signupConfigured } from "@/lib/signup";
import { canPromptInstall, isInstalled, isIOS, onInstallAvailable, promptInstall } from "@/lib/install";
import { update, type Data } from "@/lib/store";

const dismiss = () => update((d) => ({ ...d, installHintDismissed: true }));

/** From the second visit: a gentle, dismissible suggestion to add Cosmic Locus to the home screen. */
export function InstallHint({ data }: { data: Data }) {
  const [env, setEnv] = useState<{ installed: boolean; ios: boolean; prompt: boolean } | null>(null);

  useEffect(() => {
    const read = () => setEnv({ installed: isInstalled(), ios: isIOS(), prompt: canPromptInstall() });
    read();
    return onInstallAvailable(read);
  }, []);

  // One ask at a time: wait until the "Stay in touch" card has been answered.
  const askingForEmail = signupConfigured && !!data.profile && !data.contact && !data.contactDismissed;
  if (!env || env.installed || data.visits < 2 || data.installHintDismissed || askingForEmail) return null;

  return (
    <section className="card flex-row gap-3 bg-indigo-soft" aria-labelledby="install-title">
      <LogoMark size={40} className="shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h2 id="install-title" className="font-display text-xl leading-tight font-semibold text-indigo">
          Keep your sky safe
        </h2>
        <p className="text-[15px]">
          Add Cosmic Locus to your home screen. Some browsers clear a website&apos;s saved readings after a week or so without a visit; an app on your home screen
          keeps them.
        </p>
        {env.prompt ? (
          <button
            type="button"
            className="btn mt-1 self-start"
            onClick={async () => {
              if (await promptInstall()) dismiss();
            }}
          >
            Add to home screen
          </button>
        ) : env.ios ? (
          <p className="text-[15px] font-bold">Tap the Share button, then Add to Home Screen.</p>
        ) : (
          <p className="text-[15px] font-bold">Open your browser&apos;s menu and choose Install app or Add to Home screen.</p>
        )}
        <button type="button" className="min-h-11 self-start text-[15px] font-bold text-label underline" onClick={dismiss}>
          Not now
        </button>
      </div>
    </section>
  );
}
