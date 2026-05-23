"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCheck, Award, Zap, BookOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ControlsBar } from "@/components/ControlsBar";
import { DifficultyRating } from "@/components/DifficultyRating";
import { PracticeCard } from "@/components/PracticeCard";
import { StageProgress } from "@/components/StageProgress";
import { usePracticeStore } from "@/store/usePracticeStore";
import { PRACTICE_STAGES } from "@/lib/practice-flow";
import type { PracticeStage } from "@/lib/practice-flow";
import type { PracticeRating } from "@/lib/repetition-engine";

export default function PracticePage() {
  return (
    <Suspense fallback={null}>
      <PracticeContent />
    </Suspense>
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const {
    items,
    index,
    stageIndex,
    settings,
    loading,
    error,
    startSession,
    advanceStage,
    previousStage,
    repeat,
    shuffle,
    toggleFavorite,
    isFavorite,
    finishSession,
    rateItem,
  } = usePracticeStore();

  const complete = index >= items.length;
  const item = items[index];
  const stage: PracticeStage = PRACTICE_STAGES[stageIndex] ?? PRACTICE_STAGES[0];
  const progress = items.length ? index + 1 : 0;

  // Custom Confetti Trigger
  const triggerConfetti = () => {
    if (typeof window === "undefined") return;

    const colors = ["#00f2fe", "#4facfe", "#ec4899", "#d946ef", "#10b981", "#f59e0b"];
    const count = 75;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "confetti-particle";
      
      const size = Math.random() * 7 + 6;
      p.style.width = `${size}px`;
      p.style.height = `${size * (Math.random() > 0.5 ? 1.6 : 1)}px`;
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `-20px`;
      
      const duration = Math.random() * 2.0 + 1.8; // 1.8s to 3.8s
      p.style.animationDuration = `${duration}s`;
      
      // Dynamic inline rotation/transform drift
      const rotation = Math.random() * 360;
      p.style.transform = `rotate(${rotation}deg)`;
      
      document.body.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000);
    }
  };

  useEffect(() => {
    if (complete && items.length) {
      finishSession();
      // Double trigger confetti explosions for maximum WOW factor!
      triggerConfetti();
      const timer = setTimeout(triggerConfetti, 400);
      return () => clearTimeout(timer);
    }
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

  const handleRate = (rating: PracticeRating) => {
    if (item) {
      rateItem(item.id, rating);
    }
    advanceStage();
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 relative z-10">
        
        {/* Practice Progress Bar Header */}
        <div className="soft-card rounded-3xl p-5 relative overflow-hidden transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="kicker">Active Training Block</p>
              <p className="mt-1.5 text-sm sm:text-base font-black text-[var(--ink)]">
                <span className="text-[var(--accent)]">{settings.domain}</span> · {settings.difficulty} · <span className="capitalize">{settings.mode.replace("_", " ")}</span>
              </p>
            </div>
            
            <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-4 py-1.5 font-mono text-xs sm:text-sm font-black text-[var(--accent-dark)]">
              {complete ? items.length : progress} / {items.length} drills
            </span>
          </div>

          {/* Sleek rounded completion progress track */}
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--surface-strong)] border border-[var(--line)]/30">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] transition-all duration-500 ease-out" 
              style={{ width: `${items.length ? (progress / items.length) * 100 : 0}%` }} 
            />
          </div>
        </div>

        {error && (
          <p className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)]/40 px-4 py-3.5 text-center text-xs font-bold text-[var(--muted)] animate-pulse">
            ⚠️ {error}
          </p>
        )}

        {/* Practice Loop Display */}
        <div className="grid min-h-[calc(100vh-14rem)] place-items-center py-6 sm:py-8">
          {loading ? (
            <div className="text-center animate-pulse">
              <div className="size-16 rounded-2xl border border-[var(--accent)] bg-[var(--surface-strong)] flex items-center justify-center text-[var(--accent)] mx-auto mb-6 shadow-md">
                <BookOpen className="size-8 animate-spin" />
              </div>
              <p className="kicker">Assembling specs</p>
              <h1 className="brand mt-4 text-3xl sm:text-4xl">Preparing exercises...</h1>
            </div>
          ) : complete ? (
            
            /* WOW Session Success recap card */
            <section className="soft-card w-full max-w-xl rounded-[2.5rem] p-8 text-center sm:p-11 relative overflow-hidden transition-all duration-300">
              
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)]" />
              
              {/* Scaling check logo with glow ring */}
              <div className="mx-auto mb-8 size-20 rounded-full bg-[color-mix(in srgb,var(--sage),transparent_90%)] border-2 border-[var(--sage)] flex items-center justify-center text-[var(--sage)] shadow-[0_0_20px_var(--glow)] animate-bounce">
                <CheckCheck className="size-10" strokeWidth={3.5} />
              </div>
              
              <h1 className="brand text-4xl sm:text-5xl leading-none">Vocal Workout Done!</h1>
              
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--muted)]">
                Outstanding practice. Your speech muscle memory is adapting. Consistency leads directly to eloquence.
              </p>
              
              {/* Score breakdown glassmorphic box */}
              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)]/40 p-5 sm:p-6 text-left">
                <div className="flex items-center justify-between border-b border-[var(--line)]/50 pb-4">
                  <div className="flex items-center gap-2">
                    <Award className="size-4.5 text-[var(--accent)]" />
                    <span className="kicker">Items Practiced</span>
                  </div>
                  <span className="text-2xl font-black text-[var(--ink)] title-display">{items.length}</span>
                </div>
                
                <div className="mt-4 flex items-center justify-between border-b border-[var(--line)]/50 pb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4.5 text-[var(--accent)]" />
                    <span className="kicker">Training Mode</span>
                  </div>
                  <span className="text-sm font-black text-[var(--accent-dark)] capitalize">{settings.mode.replace("_", " ")}</span>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4.5 text-[var(--accent)]" />
                    <span className="kicker">Streak Reward</span>
                  </div>
                  <span className="text-xs font-black text-[var(--sage)] uppercase tracking-wide">+1 active training day</span>
                </div>
              </div>
              
              {/* Navigation Action controls */}
              <div className="mt-8.5 flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/" 
                  className="soft-button flex h-13 min-w-[200px] items-center justify-center gap-2 rounded-2xl text-xs font-bold shadow-md"
                >
                  <span>Return Setup</span>
                  <ArrowRight className="size-4" strokeWidth={2.5} />
                </Link>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="h-13 min-w-[200px] rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] hover:bg-[var(--surface)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-6 text-xs font-bold text-[var(--accent-dark)] transition-all active:scale-98 shadow-sm"
                >
                  Repeat Set
                </button>
              </div>
            </section>
          ) : item ? (
            
            /* Main active practice block flow */
            <div className="w-full">
              <StageProgress currentStage={stage} />
              
              <PracticeCard 
                item={item} 
                stage={stage} 
                favorite={isFavorite(item.id)} 
                onFavorite={() => toggleFavorite(item)} 
              />
              
              {stage === "rate" && <DifficultyRating onRate={handleRate} />}
              
              <ControlsBar
                stage={stage}
                onPrevious={previousStage}
                onNext={stage === "rate" ? () => {} : advanceStage}
                onRepeat={repeat}
                onShuffle={shuffle}
                onFavorite={() => toggleFavorite(item)}
                favorite={isFavorite(item.id)}
                previousDisabled={index === 0 && stageIndex === 0}
              />
            </div>
          ) : (
            <Link href="/" className="soft-button rounded-2xl px-8 py-5 text-sm font-bold shadow-md">
              Launch Session
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  );
}
