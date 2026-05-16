"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ControlsBar } from "@/components/ControlsBar";
import { PracticeCard } from "@/components/PracticeCard";
import { StageProgress } from "@/components/StageProgress";
import { usePracticeStore } from "@/store/usePracticeStore";
import { PRACTICE_STAGES } from "@/lib/practice-flow";
import type { PracticeStage } from "@/lib/practice-flow";

export default function PracticePage() {
  return (
    <Suspense fallback={null}>
      <PracticeContent />
    </Suspense>
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const { items, index, stageIndex, settings, loading, error, startSession, advanceStage, previousStage, repeat, shuffle, toggleFavorite, isFavorite, finishSession } =
    usePracticeStore();

  const complete = index >= items.length;
  const item = items[index];
  const stage: PracticeStage = PRACTICE_STAGES[stageIndex] ?? PRACTICE_STAGES[0];
  const progress = items.length ? index + 1 : 0;

  useEffect(() => {
    if (complete && items.length) finishSession();
  }, [complete, finishSession, items.length]);

  useEffect(() => {
    const mode = searchParams.get("mode");
    const domain = searchParams.get("domain");
    const difficulty = searchParams.get("difficulty");
    const count = Number(searchParams.get("count") ?? 12);

    if (
      (mode === "word" || mode === "phrase" || mode === "tongue_twister") &&
      (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") &&
      domain
    ) {
      void startSession({
        mode,
        domain,
        difficulty,
        count: Number.isFinite(count) ? Math.min(Math.max(count, 5), 30) : 12,
      });
    }
  }, [searchParams, startSession]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
        <div className="soft-card rounded-[1.7rem] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="kicker">Today&apos;s set</p>
              <p className="mt-1 font-bold text-[var(--ink)]">
                {settings.domain} · {settings.difficulty} · {settings.mode.replace("_", " ")}
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-strong)] px-4 py-2 font-mono text-sm font-bold text-[var(--accent-dark)]">
              {complete ? items.length : progress}/{items.length}
            </span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--surface-strong)]">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${items.length ? (progress / items.length) * 100 : 0}%` }} />
          </div>
        </div>

        {error && (
          <p className="mx-auto mt-5 max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-center text-sm text-[var(--muted)]">
            {error}
          </p>
        )}

        <div className="grid min-h-[calc(100vh-13rem)] place-items-center py-8 sm:py-10">
          {loading ? (
            <div className="text-center">
              <p className="kicker">Generating</p>
              <h1 className="brand mt-6 text-5xl">Preparing practice</h1>
            </div>
          ) : complete ? (
            <section className="soft-card w-full max-w-2xl rounded-[2.4rem] p-8 text-center sm:p-12">
              <CheckCheck className="mx-auto mb-10 size-16 text-[var(--green)]" strokeWidth={4} />
              <h1 className="brand text-6xl">Well Done</h1>
              <p className="mx-auto mt-8 max-w-xl text-xl leading-9 text-[var(--muted)]">
                Your practice session is complete. Consistency is the foundation of mastery.
              </p>
              <div className="mx-auto mt-12 max-w-xl rounded-[1.7rem] bg-[var(--surface-strong)] px-8 py-7 text-left">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-6">
                  <span className="kicker">Items Practiced</span>
                  <span className="text-3xl">{items.length}</span>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="kicker">Mode</span>
                  <span className="text-xl capitalize">{settings.mode.replace("_", " ")}</span>
                </div>
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-5">
                <Link href="/" className="soft-button flex h-14 min-w-56 items-center justify-center gap-3 rounded-2xl px-8 text-sm font-bold">
                  Return Home <ArrowRight className="size-5" />
                </Link>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="h-14 min-w-56 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-8 text-sm font-bold text-[var(--accent-dark)]"
                >
                  Practice Again
                </button>
              </div>
            </section>
          ) : item ? (
            <div className="w-full">
              <StageProgress currentStage={stage} />
              <PracticeCard item={item} stage={stage} favorite={isFavorite(item.id)} onFavorite={() => toggleFavorite(item)} />
              <ControlsBar
                stage={stage}
                onPrevious={previousStage}
                onNext={advanceStage}
                onRepeat={repeat}
                onShuffle={shuffle}
                onFavorite={() => toggleFavorite(item)}
                previousDisabled={index === 0 && stageIndex === 0}
              />
            </div>
          ) : (
            <Link href="/" className="soft-button rounded-2xl px-8 py-5 text-sm font-bold">
              Start Session
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  );
}
