"use client";

import { SIGN_GLYPH } from "@/lib/content/glyphs";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MoonPhaseIcon, Sparkle, Star8, SunFace } from "@/components/art";
import { Loading } from "@/components/gate";
import { ProfileForm } from "@/components/profile-form";
import { AreaTile, ReadingCard, StarProgress } from "@/components/ui";
import { chartFor, deviceTimeZone, localDay, useChart } from "@/lib/chart";
import { fmtTime } from "@/lib/format";
import { bigThree, moonNow, moonSignChange } from "@/lib/sky";
import { update, useData, type Prefs, type Profile } from "@/lib/store";
import { greetingFor, todayReading } from "@/lib/today";

export default function Home() {
  const data = useData();
  const chart = useChart(data?.profile);
  if (!data) return <Loading />;
  if (!data.profile || !chart) return <Onboarding />;
  return <Today profile={data.profile} chart={chart.chart} prefs={data.prefs} />;
}

function Today({ profile, chart, prefs }: { profile: Profile; chart: ReturnType<typeof chartFor>["chart"]; prefs: Prefs }) {
  const tz = deviceTimeZone();
  const now = useMemo(() => new Date(), []);
  const day = useMemo(() => localDay(now, tz), [now, tz]);
  const reading = useMemo(() => todayReading(profile, chart, prefs.system, day), [profile, chart, prefs.system, day]);
  const moon = useMemo(() => moonNow(now, prefs.system), [now, prefs.system]);
  const change = useMemo(() => moonSignChange(now, new Date(day.start.getTime() + 86_400_000), prefs.system), [now, day, prefs.system]);
  const calm = prefs.comfort;
  const heroH = calm ? 220 : 262;
  const dateLabel = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: tz }).format(now).replace(" ", " · ");
  const firstName = profile.name.split(" ")[0];

  return (
    <div className="-mx-4 -mt-6 flex flex-col">
      <div className="relative flex shrink-0 flex-col bg-peach px-5 pt-4" style={{ height: heroH }}>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-[13px] font-bold tracking-[0.14em] uppercase">{dateLabel}</p>
            <h1 className="font-display text-[22px] leading-tight font-semibold">
              {greetingFor(day.hour)}, {firstName}
            </h1>
          </div>
          <Link href="/settings/" aria-label="Settings" className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-cocoa bg-cream hover:bg-butter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
              <circle cx="16" cy="7" r="2" />
              <circle cx="8" cy="17" r="2" />
            </svg>
          </Link>
        </div>
        <div className="relative flex flex-1 items-end justify-center">
          {!calm && (
            <>
              <Star8 size={26} fill="var(--cream)" className="twinkle absolute" style={{ left: 34, bottom: 70 }} />
              <Star8 size={20} className="twinkle twinkle-2 absolute" style={{ right: 40, bottom: 110 }} />
              <Sparkle size={14} className="twinkle twinkle-3 absolute" style={{ right: 70, bottom: 34 }} />
              <Sparkle size={12} className="twinkle twinkle-2 absolute" style={{ left: 80, bottom: 140 }} />
            </>
          )}
          <div
            className="flex w-[170px] items-center justify-center overflow-hidden rounded-t-[85px] border-2 border-b-0 border-cocoa bg-butter"
            style={{ height: heroH - 92 }}
          >
            <SunFace size={150} face="var(--cream)" className="sun-wake" label={`Today's sun is smiling`} />
          </div>
        </div>
      </div>
      <div className="pattern-scallop-edge shrink-0" aria-hidden />

      <div className="flex flex-col gap-3.5 px-4 pt-1.5">
        <ReadingCard
          eyebrow={`Read from your ${reading.base.body} in ${reading.base.signName} ${SIGN_GLYPH[reading.base.sign]}`}
          headline={reading.headline}
          action={
            <Link href="/day/" className="btn">
              Read deeper
            </Link>
          }
        >
          <p>{reading.body}</p>
        </ReadingCard>

        <div className="grid grid-cols-3 gap-2.5">
          <AreaTile href="/day/#love" area="love" title="Love" line={reading.love.line} />
          <AreaTile href="/day/#work" area="work" title="Work" line={reading.work.line} />
          <AreaTile href="/day/#self-care" area="selfcare" title="Self-care" line={reading.selfcare.line} />
        </div>

        <div className="flex items-center gap-3 rounded-[18px] border-2 border-outline bg-surface px-3.5 py-2.5">
          <MoonPhaseIcon elongation={moon.elongation} />
          <div className="flex flex-col text-[15px] leading-snug">
            <p>
              <b>{moon.phase}</b> · Moon in {moon.signName}
              {prefs.system === "vedic" && ` · ${moon.nakshatra}`}
            </p>
            {change && (
              <p className="text-muted">
                Moves into {change.signName} at {fmtTime(change.at.toISOString(), tz)}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function Onboarding() {
  const [details, setDetails] = useState<Profile | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const draft = step === 2 ? details : null;
  const [system, setSystem] = useState<Prefs["system"]>("vedic");
  const preview = useMemo(() => {
    if (!draft) return null;
    const { chart } = chartFor(draft);
    return { vedic: bigThree(chart, "vedic"), western: bigThree(chart, "western") };
  }, [draft]);

  return (
    <div className="-mx-4 -mt-6 -mb-8 flex min-h-dvh flex-col bg-periwinkle">
      <div className="relative h-[196px] shrink-0 overflow-hidden">
        <Star8 size={22} fill="var(--cream)" className="twinkle absolute" style={{ left: 36, top: 40 }} />
        <Sparkle size={16} fill="var(--cream)" className="twinkle twinkle-2 absolute" style={{ right: 44, top: 64 }} />
        <Sparkle size={12} fill="var(--butter)" className="twinkle twinkle-3 absolute" style={{ right: 90, top: 28 }} />
        <div className="sun-wake absolute left-1/2 -ml-[100px]" style={{ bottom: -110 }}>
          <SunFace size={200} mood="rising" face="var(--peach)" rays="var(--butter)" label="A smiling sun rising" />
        </div>
      </div>

      <div className="relative -mt-0.5 flex flex-1 flex-col gap-3.5 rounded-t-[32px] border-t-2 border-cocoa bg-cream px-5 pt-6 pb-6">
        <StarProgress step={draft ? 2 : 1} of={2} />
        {!draft ? (
          <>
            <div className="flex flex-col gap-1">
              <h1 className="title">Hello, starlight.</h1>
              <p>Let&apos;s find your place in the sky.</p>
            </div>
            <ProfileForm
              initial={details}
              submitLabel="Next"
              onSubmit={(p) => {
                setDetails(p);
                setStep(2);
              }}
              pinned
            />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <h1 className="title">Which sky is yours?</h1>
              <p>Two ways of reading the same stars. You can switch any time.</p>
            </div>
            <fieldset className="flex flex-col gap-3">
              <legend className="sr-only">Chart style</legend>
              {(
                [
                  ["vedic", "Vedic", "Measured against the stars (sidereal, Lahiri), as Indian astrologers read it. Your day is read from your Moon sign."],
                  ["western", "Western", "The tropical zodiac most magazines use. Your day is read from your Sun sign."],
                ] as const
              ).map(([id, title, text]) => {
                const signs = preview![id];
                return (
                  <label
                    key={id}
                    className={`flex cursor-pointer gap-3 rounded-3xl border-2 border-cocoa p-4 ${system === id ? "bg-butter" : "bg-white"}`}
                  >
                    <input type="radio" name="system" value={id} checked={system === id} onChange={() => setSystem(id)} className="mt-1 size-[22px] shrink-0 accent-[var(--rust)]" />
                    <span className="flex flex-col gap-1">
                      <span className="font-display text-[22px] leading-tight font-semibold">{title}</span>
                      <span className="text-[15px] leading-snug">{text}</span>
                      <span className="text-[15px] font-bold">
                        Sun {signs.sun.signName} · Moon {signs.moon.signName}
                        {signs.rising ? ` · Rising ${signs.rising.signName}` : ""}
                      </span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <button
                className="btn btn-wide"
                onClick={() => update((d) => ({ ...d, profile: draft, prefs: { ...d.prefs, system } }))}
              >
                Show me my sky
              </button>
              <button className="btn-ghost w-full border-0 bg-transparent" onClick={() => setStep(1)}>
                Back to my details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
