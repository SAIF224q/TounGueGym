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
    <article className="relative mx-auto grid min-h-[440px] w-full max-w-[560px] border border-stone-300 bg-[var(--paper)] px-8 py-10 shadow-[0_4px_0_0_#111] sm:min-h-[520px] sm:px-14">
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
        <h1 className="text-balance text-5xl font-black leading-none text-[var(--green)] sm:text-7xl">{item.text}</h1>
        <p className="mt-8 text-2xl font-semibold tracking-[0.08em] text-stone-700">{item.breakdown}</p>
        {item.ipa && <p className="mt-4 font-mono text-lg text-stone-500">{item.ipa}</p>}
      </div>
      {item.sentence && <p className="self-end border-t border-stone-200 pt-6 text-center text-base leading-7 text-stone-600">{item.sentence}</p>}
    </article>
  );
}
