"use client";

import { ArrowLeft, Repeat2, Shuffle, Star } from "lucide-react";
import type { PracticeStage } from "@/lib/practice-flow";
import { stageButtonLabels } from "@/lib/practice-flow";

type ControlsBarProps = {
  stage: PracticeStage;
  onPrevious: () => void;
  onNext: () => void;
  onRepeat: () => void;
  onShuffle: () => void;
  onFavorite: () => void;
  previousDisabled?: boolean;
};

export function ControlsBar({ stage, onPrevious, onNext, onRepeat, onShuffle, onFavorite, previousDisabled }: ControlsBarProps) {
  const iconButton =
    "grid size-12 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition hover:-translate-y-0.5 hover:text-[var(--ink)] disabled:translate-y-0 disabled:opacity-35";

  return (
    <div className="mx-auto mt-6 flex w-fit items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] p-2 shadow-[0_16px_40px_rgb(79_57_35/0.1)]">
      <button className={iconButton} type="button" onClick={onPrevious} disabled={previousDisabled} title="Previous" aria-label="Previous">
        <ArrowLeft className="size-6" />
      </button>
      <button className={iconButton} type="button" onClick={onRepeat} title="Repeat" aria-label="Repeat">
        <Repeat2 className="size-6" />
      </button>
      <button className={iconButton} type="button" onClick={onShuffle} title="Shuffle" aria-label="Shuffle">
        <Shuffle className="size-6" />
      </button>
      <button className={iconButton} type="button" onClick={onFavorite} title="Favorite" aria-label="Favorite">
        <Star className="size-6" />
      </button>
      <button
        className="grid h-14 min-w-44 place-items-center rounded-full bg-[var(--accent)] px-8 text-white shadow-[0_10px_24px_rgb(198_95_37/0.25)] transition hover:-translate-y-0.5"
        type="button"
        onClick={onNext}
        title={stageButtonLabels[stage]}
        aria-label={stageButtonLabels[stage]}
      >
        <span className="text-sm font-bold">{stageButtonLabels[stage]}</span>
      </button>
    </div>
  );
}
