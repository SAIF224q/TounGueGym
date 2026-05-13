"use client";

import { Star } from "lucide-react";
import type { PracticeItem } from "@/lib/types";

type PracticeCardProps = {
  item: PracticeItem;
  favorite: boolean;
  onFavorite: () => void;
};

export function PracticeCard({ item, favorite, onFavorite }: PracticeCardProps) {
  return (
    <article className="relative mx-auto grid min-h-[440px] w-full max-w-[640px] border border-stone-300 bg-[var(--paper)] px-7 py-10 shadow-[0_4px_0_0_#111] sm:min-h-[520px] sm:px-12">
      <button
        type="button"
        onClick={onFavorite}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        title={favorite ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-8 top-8 text-[var(--green)]"
      >
        <Star className="size-7" fill={favorite ? "currentColor" : "none"} strokeWidth={1.7} />
      </button>
      <div className="self-center text-center">
        <p className="kicker mb-8">{item.mode.replace("_", " ")}</p>
        <h1 className="mx-auto max-w-full overflow-hidden text-balance break-words text-center text-[clamp(2.75rem,6vw,4.75rem)] font-black leading-none text-[var(--green)]">
          {item.text}
        </h1>
        <p className="mx-auto mt-8 max-w-full overflow-hidden break-words text-xl font-semibold tracking-[0.08em] text-stone-700 sm:text-2xl">
          {item.breakdown}
        </p>
        {item.ipa && <p className="mx-auto mt-4 max-w-full overflow-hidden break-words font-mono text-base text-stone-500 sm:text-lg">{item.ipa}</p>}
      </div>
      {item.sentence && <p className="self-end border-t border-stone-200 pt-6 text-center text-base leading-7 text-stone-600">{item.sentence}</p>}
    </article>
  );
}
