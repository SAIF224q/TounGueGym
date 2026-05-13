"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, UserCircle } from "lucide-react";
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

  async function beginSession(nextCount = count) {
    const cleanDomain = domain.trim() || "Everyday";
    await startSession({ mode, domain: cleanDomain, difficulty, count: nextCount });
    router.push("/practice");
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <header className="mx-auto flex h-24 max-w-5xl items-center justify-between border-b border-stone-200 px-6">
        <div className="brand text-4xl">TounGueGym</div>
        <UserCircle className="size-7 text-stone-500" strokeWidth={1.8} />
      </header>
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col px-6 py-20 text-center">
        <div className="mb-24">
          <h1 className="brand text-6xl sm:text-7xl">TounGueGym</h1>
          <p className="mt-8 text-xl text-stone-600">Practice the rhythm of speech.</p>
        </div>

        <div className="space-y-14">
          <SegmentedSelector label="Mode" options={modes} value={mode} onChange={setMode} />
          <DomainSelector value={domain} customValue={customDomain} onChange={setDomain} onCustomChange={setCustomDomain} />
          <SegmentedSelector label="Difficulty" options={difficulties} value={difficulty} onChange={setDifficulty} />
        </div>

        <div className="mt-20 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => beginSession()}
            className="flex h-20 w-full max-w-sm items-center justify-center gap-5 bg-[var(--green)] text-sm font-bold tracking-[0.28em] text-white transition hover:scale-[1.01]"
          >
            Start Session <ArrowRight className="size-6" />
          </button>
          <button type="button" onClick={() => setModalOpen(true)} className="h-12 text-sm font-semibold tracking-[0.2em] text-stone-600">
            Quick Setup
          </button>
        </div>
      </section>
      <SessionSetupModal
        open={modalOpen}
        count={count}
        onCountChange={setCount}
        onClose={() => setModalOpen(false)}
        onStart={() => {
          setModalOpen(false);
          void beginSession(count);
        }}
      />
    </main>
  );
}
