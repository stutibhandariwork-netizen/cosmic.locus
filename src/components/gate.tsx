"use client";

import Link from "next/link";
import { useChart } from "@/lib/chart";
import type { NatalChart } from "@/lib/engine";
import { useData, type Data, type Profile } from "@/lib/store";

/** Renders `children` once the browser has loaded the stored profile and calculated the chart. */
export function WithChart({ children }: { children: (args: { profile: Profile; chart: NatalChart; timeNote: string | null; data: Data }) => React.ReactNode }) {
  const data = useData();
  const result = useChart(data?.profile);
  if (!data) return <Loading />;
  if (!data.profile || !result) {
    return (
      <div className="card mt-6 flex flex-col items-start gap-3">
        <p className="font-semibold">Add your birth details first</p>
        <p className="text-sm text-muted">This page is calculated from your chart.</p>
        <Link href="/" className="btn">
          Start
        </Link>
      </div>
    );
  }
  return <>{children({ profile: data.profile, chart: result.chart, timeNote: result.timeNote, data })}</>;
}

export function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-3 pt-6" aria-label="Loading">
      <div className="h-4 w-32 rounded bg-surface-2" />
      <div className="h-8 w-2/3 rounded bg-surface-2" />
      <div className="h-32 rounded-2xl bg-surface-2" />
    </div>
  );
}
