"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { deviceTimeZone, localDay } from "@/lib/chart";
import { useData } from "@/lib/store";
import { startReading } from "@/lib/tarot/local";
import { spreadBySlug } from "@/lib/tarot/spreads";

const PLACEHOLDERS: Record<string, string> = {
  YES_NO: "Should I take the job offer in Pune?",
  LOVE: "What should I understand about my relationship?",
  CAREER: "Where is my career heading this year?",
  MONEY: "How can I feel more secure with money?",
  THREE_CARD: "What do I need to know right now?",
};

export default function NewReadingPage() {
  return (
    <Suspense>
      <NewReading />
    </Suspense>
  );
}

function NewReading() {
  const router = useRouter();
  const params = useSearchParams();
  const data = useData();
  const spread = spreadBySlug(params.get("spread") ?? "");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState(false);

  if (!spread) {
    return (
      <p className="pt-6 text-sm text-muted">
        Unknown spread. <Link href="/tarot/" className="underline">Back to tarot</Link>
      </p>
    );
  }

  // One card of the day per local day.
  const todayStart = localDay(new Date(), deviceTimeZone()).start.toISOString();
  const existingDaily = spread.key === "CARD_OF_DAY" ? data?.tarot.find((s) => s.spread === "CARD_OF_DAY" && s.createdAt >= todayStart) : undefined;

  function shuffle(e: React.FormEvent) {
    e.preventDefault();
    if (spread!.question === "required" && !question.trim()) return setError(true);
    if (existingDaily) return router.push(`/tarot/reading/?id=${existingDaily.id}`);
    const id = startReading(spread!.key, spread!.question === "none" ? null : question.trim().slice(0, 300) || null);
    router.push(`/tarot/reading/?id=${id}`);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 pt-6">
      <Link href="/tarot/" className="text-sm text-muted">
        ← Tarot
      </Link>
      <div>
        <p className="eyebrow">{spread.positions.length === 1 ? "One card" : `${spread.positions.length} cards`}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">{spread.title}</h1>
        <p className="mt-2 text-muted">{spread.blurb}</p>
      </div>
      <ol className="flex flex-wrap gap-2">
        {spread.positions.map((p, i) => (
          <li key={p.name} className="chip">
            {i + 1}. {p.name}
          </li>
        ))}
      </ol>
      <form onSubmit={shuffle} className="flex flex-col gap-4">
        {spread.question !== "none" && (
          <div>
            <label htmlFor="question" className="label">
              {spread.question === "required" ? "Your yes/no question" : "Your question (optional)"}
            </label>
            <textarea
              id="question"
              rows={3}
              maxLength={300}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="field resize-none"
              placeholder={PLACEHOLDERS[spread.key]}
            />
            {spread.key === "YES_NO" && <p className="hint">Ask something that can be answered yes or no.</p>}
            {error && <p className="mt-1.5 text-sm text-warn">Please type your question first.</p>}
          </div>
        )}
        <p className="text-sm text-muted">Take a breath and hold your question in mind. When you&apos;re ready, shuffle.</p>
        <button className="btn">{existingDaily ? "See today's card" : "Shuffle the deck"}</button>
      </form>
    </div>
  );
}
