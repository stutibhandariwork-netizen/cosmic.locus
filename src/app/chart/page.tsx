"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/gate";

/** The chart moved to Your Locus; keeps old links working. */
export default function ChartMoved() {
  const router = useRouter();
  useEffect(() => router.replace("/locus/"), [router]);
  return <Loading />;
}
