"use client";

import type { PracticeRating } from "@/lib/repetition-engine";

type DifficultyRatingProps = {
  onRate: (rating: PracticeRating) => void;
};

const options: Array<{ rating: PracticeRating; emoji: string; label: string; description: string }> = [
  { rating: "easy", emoji: "🙂", label: "Easy", description: "Pronounced comfortably" },
  { rating: "tricky", emoji: "😐", label: "Tricky", description: "Minor hesitation" },
  { rating: "difficult", emoji: "☠️", label: "Difficult", description: "Needs more practice" },
];

export function DifficultyRating({ onRate }: DifficultyRatingProps) {
  return (
    <div className="mx-auto flex flex-col items-center gap-6 py-8">
      <p className="kicker">How did this feel?</p>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((option) => (
          <button
            key={option.rating}
            type="button"
            onClick={() => onRate(option.rating)}
            className="flex min-w-[120px] flex-col items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-6 py-5 text-center transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-strong)] active:translate-y-0"
          >
            <span className="text-3xl">{option.emoji}</span>
            <span className="text-sm font-bold text-[var(--ink)]">{option.label}</span>
            <span className="text-xs text-[var(--muted)]">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
