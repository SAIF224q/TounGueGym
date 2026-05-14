"use client";

import { Quote, Star } from "lucide-react";
import type { PracticeItem } from "@/lib/types";

type PracticeCardProps = {
  item: PracticeItem;
  favorite: boolean;
  onFavorite: () => void;
};

export function PracticeCard({ item, favorite, onFavorite }: PracticeCardProps) {
  const itemLength = item.text.length;
  const titleSize = itemLength > 22 ? "clamp(2rem, 5vw, 3rem)" : itemLength > 14 ? "clamp(2.25rem, 5.6vw, 3.65rem)" : "clamp(3rem, 7vw, 5rem)";

  return (
    <article className="soft-card mx-auto w-full max-w-4xl rounded-[2.4rem] p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            {item.mode.replace("_", " ")}
          </span>
          <span className="rounded-full bg-[#e1eadb] px-3 py-1.5 text-xs font-bold text-[var(--sage)]">{item.difficulty}</span>
        </div>
        <button
          type="button"
          onClick={onFavorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
          className="grid size-11 place-items-center rounded-full bg-[var(--surface-strong)] text-[var(--accent)] transition hover:scale-105"
        >
          <Star className="size-5" fill={favorite ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      <div className="px-2 py-12 text-center sm:px-8 sm:py-16">
        <h1
          className="mx-auto max-w-full text-balance break-words py-3 text-center font-black leading-[1.15] text-[var(--ink)] [overflow-wrap:anywhere]"
          style={{ fontSize: titleSize }}
        >
          {item.text}
        </h1>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[1.6rem] bg-[var(--surface-strong)] p-5">
          <p className="kicker">Breakdown</p>
          <p className="mt-3 break-words text-2xl font-black leading-snug text-[var(--accent-dark)] [overflow-wrap:anywhere]">{item.breakdown}</p>
          {item.ipa && <p className="mt-3 break-words font-mono text-sm leading-7 text-[var(--muted)] [overflow-wrap:anywhere]">{item.ipa}</p>}
        </div>
        {item.sentence && (
          <div className="rounded-[1.6rem] bg-white/55 p-5">
            <Quote className="size-5 text-[var(--accent)]" />
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">{item.sentence}</p>
          </div>
        )}
      </div>
    </article>
  );
}
