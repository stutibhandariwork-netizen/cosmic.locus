"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoArch } from "@/components/art";
import { Loading } from "@/components/gate";
import { ProfileForm } from "@/components/profile-form";
import { PageHeader, Segmented } from "@/components/ui";
import { clearAll, setPrefs, useData } from "@/lib/store";

export default function SettingsPage() {
  const data = useData();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState("");
  if (!data) return <Loading />;

  function download() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...data }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `cosmic-locus-${new Date().toISOString().slice(0, 10)}.json` });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-8">
      <Link href="/" className="link self-start py-2.5">
        ← Today
      </Link>
      <PageHeader title="Settings" sub="Everything here stays in this browser." />

      <section className="flex flex-col gap-3">
        <h2 className="h2 px-1">How you see things</h2>
        <div className="card gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-bold">Chart style</p>
            <Segmented
              label="Chart style"
              value={data.prefs.system}
              onChange={(system) => setPrefs({ system })}
              options={[
                { id: "vedic", label: "Vedic" },
                { id: "western", label: "Western" },
              ]}
            />
            <p className="text-[15px] text-muted">
              {data.prefs.system === "vedic"
                ? "Sidereal zodiac with Lahiri ayanamsa. Your daily reading is counted from your Moon sign."
                : "Tropical zodiac. Your daily reading is counted from your Sun sign."}
            </p>
          </div>
          <label className="flex min-h-11 items-start gap-3 border-t border-line pt-4">
            <input type="checkbox" className="mt-0.5 size-[22px] shrink-0 accent-[var(--rust)]" checked={data.prefs.comfort} onChange={(e) => setPrefs({ comfort: e.target.checked })} />
            <span className="flex flex-col">
              <span className="font-bold">Comfort reading</span>
              <span className="text-[15px] text-muted">A calmer Today screen with a smaller sun and no sparkles.</span>
            </span>
          </label>
        </div>
      </section>

      {data.profile && (
        <section className="flex flex-col gap-3">
          <h2 className="h2 px-1">Your birth details</h2>
          {editing ? (
            <div className="card">
              <ProfileForm initial={data.profile} submitLabel="Save and recalculate" onSaved={() => setEditing(false)} />
              <button className="btn-ghost w-full border-0 bg-transparent" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="card flex-row items-start justify-between gap-4">
              <div>
                <p className="font-bold">{data.profile.name}</p>
                <p className="text-[15px]">
                  {data.profile.birthDate} · {data.profile.birthTime ?? "time not known"}
                </p>
                <p className="text-[15px]">{data.profile.place.label}</p>
              </div>
              <button className="btn-ghost shrink-0" onClick={() => setEditing(true)}>
                Edit
              </button>
            </div>
          )}
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="h2 px-1">Your data</h2>
        <div className="card">
          <p>
            {data.tarot.length} tarot spread{data.tarot.length === 1 ? "" : "s"} and {data.journal.length} journal note{data.journal.length === 1 ? "" : "s"} are saved
            on this device. Nothing is sent to a server.
          </p>
          <button className="btn-ghost self-start" onClick={download}>
            Download my data
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="h2 px-1">Start over</h2>
        <form
          className="card"
          onSubmit={(e) => {
            e.preventDefault();
            if (confirm.trim() !== "DELETE") return;
            clearAll();
            router.push("/");
          }}
        >
          <p>This removes your birth details, tarot spreads and journal from this browser. It can&apos;t be undone.</p>
          <label htmlFor="confirm" className="label mt-1 mb-0">
            Type DELETE to confirm
          </label>
          <input id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" className="field" />
          <button disabled={confirm.trim() !== "DELETE"} className="btn mt-1 self-start bg-rust text-cream">
            Delete everything
          </button>
        </form>
      </section>

      <section className="flex flex-col items-center gap-2 pt-4 text-center">
        <LogoArch size={64} />
        <p className="mt-1 font-display text-[15px] font-semibold tracking-[0.24em]">COSMIC LOCUS</p>
        <p className="font-display italic">Your sky, sunny side up.</p>
        <p className="text-[15px] text-muted">
          Charts are calculated on your device with astronomy-engine: Lahiri ayanamsa, whole-sign houses, mean nodes and Vimshottari dasha for Vedic mode, the
          tropical zodiac for Western.
        </p>
      </section>
    </div>
  );
}
