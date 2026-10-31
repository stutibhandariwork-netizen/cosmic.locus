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
      <div className="card mt-6 items-start">
        <p className="eyebrow">First things first</p>
        <h1 className="headline">Let&apos;s find your sky.</h1>
        <p>This page is worked out from your birth chart. Add your birth details and it will be ready in a moment.</p>
        <Link href="/" className="btn mt-1">
          Add my details
        </Link>
      </div>
    );
  }
  return <>{children({ profile: data.profile, chart: result.chart, timeNote: result.timeNote, data })}</>;
}

export function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-3 pt-6" role="status" aria-label="Loading">
      <div className="h-4 w-32 rounded-full bg-surface-2" />
      <div className="h-8 w-2/3 rounded-full bg-surface-2" />
      <div className="h-40 rounded-3xl bg-surface-2" />
    </div>
  );
}
