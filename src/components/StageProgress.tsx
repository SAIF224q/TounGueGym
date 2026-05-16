"use client";

import { PRACTICE_STAGES } from "@/lib/practice-flow";
import type { PracticeStage } from "@/lib/practice-flow";

type StageProgressProps = {
  currentStage: PracticeStage;
};

export function StageProgress({ currentStage }: StageProgressProps) {
  const currentIndex = PRACTICE_STAGES.indexOf(currentStage);

  return (
    <div className="mx-auto flex items-center gap-2" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={PRACTICE_STAGES.length}>
      {PRACTICE_STAGES.map((stage, index) => (
        <div
          key={stage}
          className={`h-2 w-2 rounded-full transition-all ${index <= currentIndex ? "bg-[var(--accent)]" : "bg-[var(--line)]"}`}
          aria-label={`${stage}${index === currentIndex ? " (current)" : ""}`}
        />
      ))}
    </div>
  );
}
