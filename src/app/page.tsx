"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
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
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff8eb_0,#efe6d8_42%,#e6dac9_100%)]">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <div className="brand text-2xl">TounGueGym</div>
        <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--muted)]">
          Pronunciation gym
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl items-start gap-10 px-5 pb-20 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:pt-20">
        <div className="relative pt-6 text-center lg:text-left">
          {["T", "S", "R", "L"].map((letter, index) => (
            <span
              key={letter}
              className="absolute hidden size-12 rotate-[-12deg] place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-xl font-black text-[var(--accent-dark)] shadow-[0_18px_36px_rgb(79_57_35/0.14)] lg:grid"
              style={{
                left: `${index % 2 ? 78 : 4}%`,
                top: `${index * 22 + 8}%`,
                transform: `rotate(${index % 2 ? 16 : -14}deg)`,
              }}
            >
              {letter}
            </span>
          ))}
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--muted)] lg:mx-0">
            <Sparkles className="size-4 text-[var(--accent)]" />
            AI-made drills for clear speech
          </div>
          <h1 className="brand mx-auto max-w-2xl text-[clamp(3rem,8vw,6.4rem)] leading-[0.96] lg:mx-0">
            Practice words that trip your tongue.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[var(--muted)] lg:mx-0">
            Pick a focus, get fresh articulation drills, and move one item at a time without hunting for what to practice next.
          </p>
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3 lg:mx-0">
            {["One-at-a-time", "Favorites", "Quick sets"].map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 py-4 text-center text-sm font-bold text-[var(--accent-dark)]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="soft-card rounded-[2.4rem] p-5 sm:p-8">
          <div className="mb-8">
            <p className="kicker">Session setup</p>
            <h2 className="mt-3 text-3xl font-black text-[var(--ink)]">Build today&apos;s practice</h2>
          </div>
        <div className="space-y-6">
          <SegmentedSelector label="Mode" options={modes} value={mode} onChange={setMode} />
          <DomainSelector value={domain} customValue={customDomain} onChange={setDomain} onCustomChange={setCustomDomain} />
          <SegmentedSelector label="Difficulty" options={difficulties} value={difficulty} onChange={setDifficulty} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={practiceHref()}
            onClick={() => beginSession()}
            className="soft-button flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl text-sm font-bold transition hover:-translate-y-0.5"
          >
            Start Session <ArrowRight className="size-6" />
          </Link>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-14 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-6 text-sm font-bold text-[var(--accent-dark)]"
          >
            Quick Setup
          </button>
        </div>
        </div>
      </section>
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
    </main>
  );
}
