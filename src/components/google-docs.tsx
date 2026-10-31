"use client";

import { useEffect, useState } from "react";
import { googleConfigured, hasToken, loadGoogle, signIn, signOut, SignInNeeded, syncToDoc } from "@/lib/google";
import { snapshot, update, type Data } from "@/lib/store";

/** Copies the latest journal to the Doc, quietly, if the visitor already signed in during this visit. */
export async function autoSyncJournal() {
  const d = snapshot();
  if (!googleConfigured || !d.google || !hasToken()) return;
  try {
    const r = await syncToDoc(d.journal, d.google.docId);
    update((x) => ({ ...x, google: { ...r, syncedAt: new Date().toISOString() } }));
  } catch {
    // the card shows "Sync now" when the doc is behind
  }
}

const ago = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

/** Connect, sync and disconnect the journal's Google Doc. Hidden until a Google client ID is configured. */
export function GoogleDocsCard({ data }: { data: Data }) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!googleConfigured) return;
    loadGoogle()
      .then(() => setReady(true))
      .catch((e: Error) => setError(e.message));
  }, []);

  if (!googleConfigured) return null;
  const link = data.google;
  const behind = !!link && data.journal.some((e) => e.createdAt > link.syncedAt);

  async function sync() {
    setBusy(true);
    setError(null);
    try {
      if (!hasToken()) await signIn();
      const r = await syncToDoc(data.journal, link?.docId ?? null);
      update((d) => ({ ...d, google: { ...r, syncedAt: new Date().toISOString() } }));
    } catch (e) {
      setError(e instanceof SignInNeeded || e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    signOut();
    update((d) => ({ ...d, google: null }));
  }

  return (
    <section className="card">
      <p className="eyebrow">Google Docs</p>
      {!link ? (
        <>
          <h2 className="h2">Keep your journal in Google Docs</h2>
          <p className="text-[15px]">
            Sign in with Google and your notes are copied into a document in your own Drive. Cosmic Locus can only see that one document, and it updates
            when you sync.
          </p>
          <button type="button" className="btn mt-1 self-start" disabled={!ready || busy} onClick={sync}>
            {busy ? "Connecting…" : "Connect Google Docs"}
          </button>
        </>
      ) : (
        <>
          <h2 className="h2">{behind ? "You have new notes to copy" : "Your journal is in Google Docs"}</h2>
          <p className="text-[15px]" role="status">
            Last copied {ago(link.syncedAt)}.{behind && " Tap Sync now to bring the doc up to date."} Edits made in the doc aren&apos;t copied back here.
          </p>
          <div className="mt-1 flex flex-wrap gap-2.5">
            <a href={link.url} target="_blank" rel="noopener" className="btn">
              Open the doc
            </a>
            <button type="button" className="btn-ghost" disabled={!ready || busy} onClick={sync}>
              {busy ? "Syncing…" : "Sync now"}
            </button>
          </div>
          <button type="button" className="min-h-11 self-start text-[15px] font-bold text-label underline" onClick={disconnect}>
            Disconnect (the doc stays in your Drive)
          </button>
        </>
      )}
      {error && (
        <p className="text-[15px]" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
