"use client";

import { ArrowLeft, Repeat2, Shuffle, Star, ChevronRight } from "lucide-react";
import type { PracticeStage } from "@/lib/practice-flow";
import { stageButtonLabels } from "@/lib/practice-flow";

type ControlsBarProps = {
  stage: PracticeStage;
  onPrevious: () => void;
  onNext: () => void;
  onRepeat: () => void;
  onShuffle: () => void;
  onFavorite: () => void;
  favorite?: boolean;
  previousDisabled?: boolean;
};

export function ControlsBar({
  stage,
  onPrevious,
  onNext,
  onRepeat,
  onShuffle,
  onFavorite,
  favorite = false,
  previousDisabled,
}: ControlsBarProps) {
  
  const iconButton = `grid size-12 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--accent-dark)] hover:border-[var(--accent)] disabled:translate-y-0 disabled:opacity-30 disabled:pointer-events-none shadow-sm active:scale-95`;

  if (stage === "rate") {
    // During rating stage, we don't need all auxiliary buttons as the user should focus on rating difficulty.
    return (
      <div className="mx-auto mt-8 flex w-fit items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-strong)]/80 backdrop-blur-md p-2 shadow-[0_16px_40px_var(--glow)]">
        <button
          className="soft-button flex h-14 min-w-[200px] items-center justify-center gap-2 rounded-full px-8 shadow-md"
          type="button"
          onClick={onNext}
          title={stageButtonLabels[stage]}
          aria-label={stageButtonLabels[stage]}
        >
          <span className="text-sm font-black uppercase tracking-[0.06em]">{stageButtonLabels[stage]}</span>
          <ChevronRight className="size-4" strokeWidth={3} />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 flex w-fit items-center justify-center gap-2.5 rounded-full border border-[var(--line)] bg-[var(--surface-strong)]/80 backdrop-blur-md p-2.5 shadow-[0_16px_40px_var(--glow)]">
      <button 
        className={iconButton} 
        type="button" 
        onClick={onPrevious} 
        disabled={previousDisabled} 
        title="Previous Stage" 
        aria-label="Previous Stage"
      >
        <ArrowLeft className="size-5" strokeWidth={2.5} />
      </button>
      
      <button 
        className={iconButton} 
        type="button" 
        onClick={onRepeat} 
        title="Repeat Item" 
        aria-label="Repeat Item"
      >
        <Repeat2 className="size-5" strokeWidth={2.5} />
      </button>
      
      <button 
        className={iconButton} 
        type="button" 
        onClick={onShuffle} 
        title="Shuffle Set" 
        aria-label="Shuffle Set"
      >
        <Shuffle className="size-5" strokeWidth={2.5} />
      </button>
      
      <button 
        className={`${iconButton} ${favorite ? "text-[var(--accent)] border-[var(--accent)] bg-[color-mix(in srgb,var(--accent),transparent_92%)]" : ""}`} 
        type="button" 
        onClick={onFavorite} 
        title={favorite ? "Unfavorite Item" : "Favorite Item"} 
        aria-label={favorite ? "Unfavorite Item" : "Favorite Item"}
      >
        <Star className="size-5" fill={favorite ? "currentColor" : "none"} strokeWidth={2.5} />
      </button>
      
      <button
        className="soft-button flex h-14 min-w-[200px] items-center justify-center gap-2 rounded-full px-8 shadow-md"
        type="button"
        onClick={onNext}
        title={stageButtonLabels[stage]}
        aria-label={stageButtonLabels[stage]}
      >
        <span className="text-sm font-black uppercase tracking-[0.06em]">{stageButtonLabels[stage]}</span>
        <ChevronRight className="size-4" strokeWidth={3} />
      </button>
    </div>
  );
}
