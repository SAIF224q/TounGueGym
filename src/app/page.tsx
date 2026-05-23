"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Star, Zap, Activity } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DomainSelector } from "@/components/DomainSelector";
import { SegmentedSelector } from "@/components/SegmentedSelector";
import { SessionSetupModal } from "@/components/SessionSetupModal";
import { difficulties, modes } from "@/lib/constants";
import type { Difficulty, PracticeMode } from "@/lib/types";
import { usePracticeStore } from "@/store/usePracticeStore";

export default function Home() {
  const router = useRouter();
  const savedSettings = usePracticeStore((state) => state.settings);
  const startSession = usePracticeStore((state) => state.startSession);
  const [mode, setMode] = useState<PracticeMode>(savedSettings.mode);
  const [domain, setDomain] = useState(savedSettings.domain);
  const [customDomain, setCustomDomain] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>(savedSettings.difficulty);
  const [count, setCount] = useState(savedSettings.count);
  const [modalOpen, setModalOpen] = useState(false);

  function beginSession(nextCount = count) {
    const cleanDomain = domain.trim() || "Everyday";
    void startSession({ mode, domain: cleanDomain, difficulty, count: nextCount });
  }

  function practiceHref(nextCount = count) {
    const params = new URLSearchParams({
      mode,
      domain: domain.trim() || "Everyday",
      difficulty,
      count: String(nextCount),
    });

    return `/practice?${params.toString()}`;
  }

  return (
    <AppShell>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-8 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:py-20 relative z-10">
        
        {/* Left Column: Hero Text & Visuals */}
        <div className="relative pt-2 text-center lg:text-left">
          
          {/* Glass floating letter icons (decorative) */}
          {["T", "S", "R", "L"].map((letter, index) => (
            <span
              key={letter}
              className="absolute hidden size-13 rotate-[-12deg] place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)]/40 backdrop-blur-md text-xl font-extrabold text-[var(--accent)] shadow-md transition-all duration-500 hover:scale-110 hover:border-[var(--accent)] lg:grid z-20"
              style={{
                left: `${index % 2 ? 80 : 2}%`,
                top: `${index * 20 + 4}%`,
                transform: `rotate(${index % 2 ? 15 : -15}deg)`,
              }}
            >
              {letter}
            </span>
          ))}

          {/* AI pill badge */}
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4.5 py-2 text-xs font-bold text-[var(--muted)] lg:mx-0 shadow-sm">
            <Sparkles className="size-4 text-[var(--accent)] animate-pulse" />
            AI-made drills for clear speech
          </div>

          <h1 className="title-display mx-auto max-w-2xl text-[clamp(2.5rem,6.5vw,5rem)] font-black leading-[0.98] text-[var(--ink)] lg:mx-0">
            Practice words that <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] bg-clip-text text-transparent">trip your tongue.</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-[var(--muted)] lg:mx-0">
            Select a theme focus, receive custom articulation drills instantly, and build real speech dexterity without the cognitive overload.
          </p>

          {/* Highlight feature badges */}
          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 lg:mx-0">
            {[
              { text: "Dynamic Flow", icon: Zap },
              { text: "Favorites", icon: Star },
              { text: "Speech Streak", icon: Activity }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.text} 
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)]/30 backdrop-blur-sm p-4 text-center transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--surface)] group shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
                >
                  <Icon className="size-5 mx-auto mb-2 text-[var(--accent)] transition-transform duration-300 group-hover:scale-110" />
                  <div className="text-xs font-bold text-[var(--ink)]">{item.text}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Setup Card */}
        <div className="soft-card rounded-[2.4rem] p-6 sm:p-9 relative overflow-hidden transition-all duration-300">
          {/* Subtle colored card glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] opacity-70" />
          
          <div className="mb-6">
            <p className="kicker">Articulation lab</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[var(--ink)] leading-tight">
              Build your custom set
            </h2>
          </div>

          <div className="space-y-5.5">
            <SegmentedSelector label="Mode" options={modes} value={mode} onChange={setMode} />
            <DomainSelector value={domain} customValue={customDomain} onChange={setDomain} onCustomChange={setCustomDomain} />
            <SegmentedSelector label="Difficulty" options={difficulties} value={difficulty} onChange={setDifficulty} />
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={practiceHref()}
              onClick={() => beginSession()}
              className="soft-button flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-bold shadow-md"
            >
              <span>Launch Session</span>
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="h-14 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] hover:bg-[var(--surface)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-dark)] transition-all duration-200 active:scale-98 shadow-sm"
            >
              Length Setup
            </button>
          </div>
        </div>

      </section>

      {/* Quick Setup Length Modal */}
      <SessionSetupModal
        open={modalOpen}
        count={count}
        onCountChange={setCount}
        onClose={() => setModalOpen(false)}
        onStart={() => {
          setModalOpen(false);
          router.push(practiceHref(count));
        }}
      />
    </AppShell>
  );
}
