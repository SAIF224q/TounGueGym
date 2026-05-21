"use client";

import { PRACTICE_STAGES, stageLabels } from "@/lib/practice-flow";
import type { PracticeStage } from "@/lib/practice-flow";

type StageProgressProps = {
  currentStage: PracticeStage;
};

export function StageProgress({ currentStage }: StageProgressProps) {
  const currentIndex = PRACTICE_STAGES.indexOf(currentStage);

  return (
    <div
      className="mx-auto mb-6 flex max-w-md flex-col items-center gap-3"
      role="progressbar"
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={PRACTICE_STAGES.length}
      aria-label={`Step ${currentIndex + 1} of ${PRACTICE_STAGES.length}: ${stageLabels[currentStage]}`}
    >
      <div className="flex items-center gap-2">
        {PRACTICE_STAGES.map((stage, index) => (
          <div
            key={stage}
            className={`h-2.5 rounded-full transition-all ${index <= currentIndex ? "w-8 bg-[var(--accent)]" : "w-2.5 bg-[var(--line)]"}`}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        Step {currentIndex + 1} · {stageLabels[currentStage]}
      </p>
    </div>
  );
}
