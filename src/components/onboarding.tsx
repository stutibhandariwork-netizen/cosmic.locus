"use client";

import { useEffect, useMemo, useState } from "react";
import { DawnSky } from "@/components/sky-art";
import { ZodiacWheel } from "@/components/astrology/wheel";
import { ProfileForm } from "@/components/profile-form";
import { CardFace } from "@/components/tarot/card-back";
import { StarProgress } from "@/components/ui";
import { chartFor } from "@/lib/chart";
import { Glyph } from "@/components/glyph";
import { DETAILS, INTRO, REVEAL, SYSTEM } from "@/lib/content/onboarding";
import { preloadPlaces } from "@/lib/places";
import { bigThree } from "@/lib/sky";
import { update, type Prefs, type Profile } from "@/lib/store";
import { DECK } from "@/lib/tarot/deck";

type Step = "intro" | "details" | "system" | "reveal";

/** A sample wheel for the intro: Sun in Capricorn, Moon in Cancer, rising Taurus. */
const SAMPLE_THREE: ReturnType<typeof bigThree> = {
  sun: { longitude: 276, sign: 9, signName: "Capricorn", degree: 6 },
  moon: { longitude: 98, sign: 3, signName: "Cancer", degree: 8 },
  rising: { longitude: 31, sign: 1, signName: "Taurus", degree: 1 },
};

export function Onboarding() {
  const [step, setStep] = useState<Step>("intro");
  const [details, setDetails] = useState<Profile | null>(null);
  const [system, setSystem] = useState<Prefs["system"]>("vedic");
  const charts = useMemo(() => {
    if (!details) return null;
    const { chart } = chartFor(details);
    return { vedic: bigThree(chart, "vedic"), western: bigThree(chart, "western") };
  }, [details]);

  // The place list is the biggest download; start it while the visitor reads the intro.
  useEffect(() => {
    preloadPlaces();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (step === "reveal" && details && charts) {
    return (
      <Reveal
        name={details.name.split(" ")[0]}
        three={charts[system]}
        onDone={() => update((d) => ({ ...d, profile: details, prefs: { ...d.prefs, system } }))}
      />
    );
  }

  return (
    <div className="-mx-4 -mt-6 -mb-8 flex min-h-dvh flex-col bg-gradient-to-b from-indigo-deep via-indigo to-[#f3b892]">
      <div className={`relative shrink-0 overflow-hidden ${step === "intro" ? "h-[150px]" : "h-[196px]"}`}>
        <DawnSky height={step === "intro" ? 150 : 196} />
      </div>

      <div className="relative -mt-0.5 flex flex-1 flex-col gap-3.5 rounded-t-[32px] bg-cream px-5 pt-6 pb-6 shadow-[0_-12px_30px_-10px_rgba(29,26,74,0.45)]">
        {step === "intro" && (
          <>
            <h1 className="title">{INTRO.promise}</h1>
            <p>{INTRO.sub}</p>
            <div className="grid grid-cols-[88px_1fr] items-center gap-3" aria-hidden>
              <CardFace card={DECK[17]} className="w-[88px] -rotate-3 shadow-glow" />
              <div className="rounded-full bg-indigo-deep p-1.5 shadow-glow">
                <ZodiacWheel three={SAMPLE_THREE} className="max-w-[170px]" />
              </div>
            </div>
            <div className="card gap-1.5 p-4" aria-label="A sample daily reading">
              <p className="eyebrow">
                {INTRO.sampleEyebrow} <Glyph sign={3} />
              </p>
              <p className="font-display text-[22px] leading-tight font-semibold">{INTRO.sampleHeadline}</p>
              <p className="text-[15px]">{INTRO.sampleBody}</p>
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <button className="btn btn-wide" onClick={() => setStep("details")}>
                {INTRO.cta}
              </button>
              <p className="text-center text-[13px] text-muted">{INTRO.privacy}</p>
            </div>
          </>
        )}

        {step === "details" && (
          <>
            <StarProgress step={1} of={2} />
            <div className="flex flex-col gap-1">
              <h1 className="title">{DETAILS.title}</h1>
              <p>{DETAILS.sub}</p>
            </div>
            <ProfileForm
              initial={details}
              submitLabel={DETAILS.next}
              onSubmit={(p) => {
                setDetails(p);
                setStep("system");
              }}
              pinned
            />
          </>
        )}

        {step === "system" && charts && (
          <>
            <StarProgress step={2} of={2} />
            <div className="flex flex-col gap-1">
              <h1 className="title">{SYSTEM.title}</h1>
              <p>{SYSTEM.sub}</p>
            </div>
            <fieldset className="flex flex-col gap-3">
              <legend className="sr-only">Chart style</legend>
              {(["vedic", "western"] as const).map((id) => {
                const signs = charts[id];
                return (
                  <label key={id} className={`flex cursor-pointer gap-3 rounded-3xl border p-4 shadow-glow ${system === id ? "border-indigo bg-indigo-soft" : "border-outline bg-white"}`}>
                    <input type="radio" name="system" value={id} checked={system === id} onChange={() => setSystem(id)} className="mt-1 size-[22px] shrink-0 accent-[var(--rust)]" />
                    <span className="flex flex-col gap-1">
                      <span className="font-display text-[22px] leading-tight font-semibold">{SYSTEM[id].title}</span>
                      <span className="text-[15px] leading-snug">{SYSTEM[id].text}</span>
                      <span className="text-[15px] font-bold">
                        Sun {signs.sun.signName} <Glyph sign={signs.sun.sign} /> · Moon {signs.moon.signName} <Glyph sign={signs.moon.sign} />
                        {signs.rising && (
                          <>
                            {" "}
                            · Rising {signs.rising.signName} <Glyph sign={signs.rising.sign} />
                          </>
                        )}
                      </span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
            {charts.vedic.sun.sign !== charts.western.sun.sign && <p className="rounded-[14px] bg-surface-2 px-4 py-3 text-[15px]">{SYSTEM.reassure}</p>}
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <button className="btn btn-wide" onClick={() => setStep("reveal")}>
                {SYSTEM.cta}
              </button>
              <button className="btn-ghost w-full border-0 bg-transparent" onClick={() => setStep("details")}>
                {SYSTEM.back}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Full-screen moment after onboarding: the birth chart wheel draws itself. */
function Reveal({ name, three, onDone }: { name: string; three: ReturnType<typeof bigThree>; onDone: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 overflow-y-auto bg-gradient-to-b from-indigo to-indigo-deep px-6 py-10 text-cream" role="dialog" aria-modal="true" aria-labelledby="reveal-title">
      <ZodiacWheel three={three} draw />
      <div className="flex max-w-sm flex-col items-center gap-2 text-center">
        <h1 id="reveal-title" className="font-display text-[28px] leading-tight font-semibold">
          {REVEAL.line(name)}
        </h1>
        <p className="text-[15px] text-gold-soft">
          Sun in {three.sun.signName} <Glyph sign={three.sun.sign} /> · Moon in {three.moon.signName} <Glyph sign={three.moon.sign} />
          {three.rising && (
            <>
              {" "}
              · {three.rising.signName} <Glyph sign={three.rising.sign} /> rising
            </>
          )}
        </p>
        <p className="text-[13px] text-gold-soft">{REVEAL.sub}</p>
      </div>
      <button className="btn btn-wide max-w-sm bg-gold text-indigo-deep" onClick={onDone} autoFocus>
        {REVEAL.cta}
      </button>
    </div>
  );
}
