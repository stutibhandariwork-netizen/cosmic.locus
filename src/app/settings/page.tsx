"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loading } from "@/components/gate";
import { ProfileForm } from "@/components/profile-form";
import { clearAll, useData } from "@/lib/store";

export default function SettingsPage() {
  const data = useData();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState("");
  if (!data) return <Loading />;

  function download() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...data }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `grahify-data-${new Date().toISOString().slice(0, 10)}.json` });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-10 pt-4">
      <header>
        <p className="eyebrow">This device</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">You &amp; your data</h1>
        <p className="mt-2 text-sm text-muted">
          This try-it version has no accounts and no server. Your details, tarot readings and journal are stored only in
          this browser.
        </p>
      </header>

      {data.profile && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-semibold">Birth details</h2>
          {editing ? (
            <div className="card">
              <ProfileForm initial={data.profile} submitLabel="Save and recalculate" onSaved={() => setEditing(false)} />
            </div>
          ) : (
            <div className="card flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold">{data.profile.name}</p>
                <p className="text-muted">
                  {data.profile.birthDate} · {data.profile.birthTime ?? "time unknown"}
                </p>
                <p className="text-muted">{data.profile.place.label}</p>
              </div>
              <button className="btn-ghost shrink-0" onClick={() => setEditing(true)}>
                Edit
              </button>
            </div>
          )}
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold">Your data</h2>
        <div className="card flex flex-col gap-3 text-sm">
          <p>
            {data.tarot.length} tarot reading{data.tarot.length === 1 ? "" : "s"} and {data.journal.length} journal entr
            {data.journal.length === 1 ? "y" : "ies"} saved on this device.
          </p>
          <button className="btn-ghost self-start" onClick={download}>
            Download my data (JSON)
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-warn">Delete everything</h2>
        <form
          className="card flex flex-col gap-3 border-warn/40 text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (confirm.trim() !== "DELETE") return;
            clearAll();
            router.push("/");
          }}
        >
          <p>Removes your birth details, tarot readings and journal from this browser. It can&apos;t be undone.</p>
          <label htmlFor="confirm" className="label">
            Type DELETE to confirm
          </label>
          <input id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" className="field" />
          <button
            disabled={confirm.trim() !== "DELETE"}
            className="inline-flex min-h-11 items-center justify-center self-start rounded-full bg-warn px-6 text-sm font-semibold text-white disabled:opacity-50"
          >
            Delete everything
          </button>
        </form>
      </section>

      <section className="card flex flex-col gap-2 text-sm">
        <p className="font-semibold">About this version</p>
        <p className="text-muted">
          Calculations: sidereal zodiac with Lahiri ayanamsa, whole-sign houses, mean nodes, Vimshottari dasha, computed
          with astronomy-engine. The full Grahify app adds accounts, written readings in English, Hindi and Odia, deep
          dives, Ask a Question, and WhatsApp updates.
        </p>
      </section>
    </div>
  );
}
