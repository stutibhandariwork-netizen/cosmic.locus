"use client";

import { useRef, useState } from "react";
import { checkBackup, type BackupCheck } from "@/lib/backup";
import { replaceAll } from "@/lib/store";

/** Choose a backup file, see what's in it, then confirm before it replaces this device's data. */
export function RestoreBackup() {
  const input = useRef<HTMLInputElement>(null);
  const [check, setCheck] = useState<BackupCheck | null>(null);
  const [done, setDone] = useState(false);

  async function choose(file: File | undefined) {
    setDone(false);
    if (!file) return;
    if (file.size > 20_000_000) return setCheck({ ok: false, error: "That file is too large to be a Cosmic Locus backup." });
    setCheck(checkBackup(await file.text()));
  }

  const reset = () => {
    setCheck(null);
    if (input.current) input.current.value = "";
  };

  return (
    <div className="flex flex-col gap-3 border-t border-line pt-3">
      <p className="font-bold">Restore from a backup</p>
      <p className="text-[15px] text-muted">Pick a file you downloaded here before. You&apos;ll see what&apos;s in it before anything changes.</p>
      <label className="btn-ghost cursor-pointer self-start focus-within:outline-3 focus-within:outline-indigo">
        Choose a backup file
        <input ref={input} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => choose(e.target.files?.[0])} />
      </label>
      {check && !check.ok && (
        <p role="alert" className="rounded-[12px] border-2 border-rust bg-warn-soft px-3 py-2 text-[15px] font-bold">
          {check.error}
        </p>
      )}
      {check?.ok && (
        <div className="flex flex-col gap-2 rounded-[18px] bg-indigo-soft p-4" role="region" aria-label="Backup contents">
          <p className="font-bold">This backup has:</p>
          <ul className="list-disc pl-5 text-[15px]">
            <li>{check.summary.name ? `Birth details for ${check.summary.name} (${check.summary.birthDate})` : "No birth details"}</li>
            <li>
              {check.summary.tarot} tarot spread{check.summary.tarot === 1 ? "" : "s"}
            </li>
            <li>
              {check.summary.journal} journal note{check.summary.journal === 1 ? "" : "s"}
            </li>
            {check.summary.exportedAt && <li>Saved on {new Date(check.summary.exportedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</li>}
          </ul>
          <p className="text-[15px]">Restoring replaces everything on this device with this backup.</p>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              className="btn"
              onClick={() => {
                replaceAll(check.data);
                reset();
                setDone(true);
              }}
            >
              Restore this backup
            </button>
            <button type="button" className="btn-ghost" onClick={reset}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {done && (
        <p role="status" className="font-bold">
          Restored. Your sky, cards and notes are back.
        </p>
      )}
    </div>
  );
}
