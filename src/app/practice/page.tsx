"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ControlsBar } from "@/components/ControlsBar";
import { PracticeCard } from "@/components/PracticeCard";
import { usePracticeStore } from "@/store/usePracticeStore";

export default function PracticePage() {
  const { items, index, settings, loading, error, next, previous, repeat, shuffle, toggleFavorite, isFavorite, finishSession } =
    usePracticeStore();
  const item = items[index];
  const complete = index >= items.length;
  const progress = items.length ? Math.min(index + 1, items.length) : 0;

  useEffect(() => {
    if (complete && items.length) finishSession();
  }, [complete, finishSession, items.length]);

  return (
    <AppShell>
      <div className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="flex items-center gap-6">
          <span className="font-mono text-sm tracking-[0.16em]">{complete ? items.length : progress}/{items.length}</span>
          <div className="h-1 flex-1 bg-stone-200">
            <div className="h-full bg-stone-950 transition-all" style={{ width: `${items.length ? (progress / items.length) * 100 : 0}%` }} />
          </div>
        </div>

        {error && <p className="mx-auto mt-8 max-w-xl border border-stone-200 px-4 py-3 text-center text-sm text-stone-600">{error}</p>}

        <div className="grid min-h-[calc(100vh-9rem)] place-items-center py-12">
          {loading ? (
            <div className="text-center">
              <p className="kicker">Generating</p>
              <h1 className="brand mt-6 text-5xl">Preparing Practice</h1>
            </div>
          ) : complete ? (
            <section className="text-center">
              <div className="mx-auto mb-10 h-10 w-20 border-b-8 border-r-8 border-[var(--green)] [transform:rotate(135deg)]" />
              <h1 className="brand text-6xl">Well Done</h1>
              <p className="mx-auto mt-8 max-w-xl text-xl leading-9 text-stone-600">
                Your practice session is complete. Consistency is the foundation of mastery.
              </p>
              <div className="mx-auto mt-16 max-w-xl border border-stone-300 px-10 py-9 text-left">
                <div className="flex items-center justify-between border-b border-stone-200 pb-8">
                  <span className="kicker">Items Practiced</span>
                  <span className="text-3xl">{items.length}</span>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="kicker">Mode</span>
                  <span className="text-xl capitalize">{settings.mode.replace("_", " ")}</span>
                </div>
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-5">
                <Link href="/" className="flex h-16 min-w-64 items-center justify-center gap-4 bg-[var(--green)] px-8 text-sm font-bold tracking-[0.18em] text-white">
                  Return Home <ArrowRight className="size-5" />
                </Link>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="h-16 min-w-64 border border-stone-950 px-8 text-sm font-bold tracking-[0.18em]"
                >
                  Practice Again
                </button>
              </div>
            </section>
          ) : item ? (
            <div className="w-full">
              <PracticeCard item={item} favorite={isFavorite(item.id)} onFavorite={() => toggleFavorite(item)} />
              <ControlsBar
                onPrevious={previous}
                onNext={next}
                onRepeat={repeat}
                onShuffle={shuffle}
                onFavorite={() => toggleFavorite(item)}
                previousDisabled={index === 0}
              />
            </div>
          ) : (
            <Link href="/" className="bg-[var(--green)] px-8 py-5 text-sm font-bold tracking-[0.2em] text-white">
              Start Session
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  );
}
