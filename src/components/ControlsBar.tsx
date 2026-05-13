"use client";

import { ArrowLeft, ArrowRight, Repeat2, Shuffle, Star } from "lucide-react";

type ControlsBarProps = {
  onPrevious: () => void;
  onNext: () => void;
  onRepeat: () => void;
  onShuffle: () => void;
  onFavorite: () => void;
  previousDisabled?: boolean;
};

export function ControlsBar({ onPrevious, onNext, onRepeat, onShuffle, onFavorite, previousDisabled }: ControlsBarProps) {
  const iconButton = "grid size-14 place-items-center border border-transparent text-stone-600 transition hover:border-stone-300 hover:text-stone-950 disabled:opacity-30";

  return (
    <div className="mt-12 flex items-center justify-center gap-5">
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
      <button className="grid size-20 place-items-center rounded-full border border-stone-950 bg-[var(--green)] text-white shadow-sm transition hover:scale-[1.02]" type="button" onClick={onNext} title="Next" aria-label="Next">
        <ArrowRight className="size-8" />
      </button>
    </div>
  );
}
