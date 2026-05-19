"use client";

import { Quote, Star } from "lucide-react";
import type { PracticeItem } from "@/lib/types";
import type { PracticeStage } from "@/lib/practice-flow";

type PracticeCardProps = {
  item: PracticeItem;
  stage: PracticeStage;
  favorite: boolean;
  onFavorite: () => void;
};

function getChunks(breakdown: string): string[] {
  return breakdown.split(/[-·•]/).filter(Boolean).map((chunk) => chunk.trim());
}

export function PracticeCard({ item, stage, favorite, onFavorite }: PracticeCardProps) {
  const itemLength = item.text.length;
  const titleSize = itemLength > 22 ? "clamp(2rem, 5vw, 3rem)" : itemLength > 14 ? "clamp(2.25rem, 5.6vw, 3.65rem)" : "clamp(3rem, 7vw, 5rem)";
  const chunks = getChunks(item.breakdown);

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
        {stage === "observe" && (
          <h1
            className="mx-auto max-w-full text-balance break-words py-3 text-center font-black leading-[1.15] text-[var(--ink)] [overflow-wrap:anywhere]"
            style={{ fontSize: titleSize }}
          >
            {item.text}
          </h1>
        )}

        {stage === "chunk" && (
          <div className="py-3">
            <p className="kicker mb-6">Break it down</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {chunks.map((chunk, index) => (
                <span
                  key={index}
                  className="rounded-xl bg-[var(--surface-strong)] px-4 py-3 text-2xl font-black text-[var(--accent-dark)] sm:text-3xl"
                >
                  {chunk}
                </span>
              ))}
            </div>
          </div>
        )}

        {stage === "pronounce" && (
          <div className="py-3">
            <h1
              className="mx-auto max-w-full text-balance break-words py-3 text-center font-black leading-[1.15] text-[var(--ink)] [overflow-wrap:anywhere]"
              style={{ fontSize: titleSize }}
            >
              {item.text}
            </h1>
            <p className="mt-6 break-words text-2xl font-black leading-snug text-[var(--accent-dark)] [overflow-wrap:anywhere]">{item.breakdown}</p>
            {item.ipa && <p className="mt-3 break-words font-mono text-sm leading-7 text-[var(--muted)] [overflow-wrap:anywhere]">{item.ipa}</p>}
          </div>
        )}

        {stage === "context" && (
          <div className="py-3">
            <p className="kicker mb-6">In context</p>
            <div className="rounded-[1.6rem] bg-white/55 p-6 sm:p-8">
              <Quote className="mx-auto mb-4 size-6 text-[var(--accent)]" />
              <p className="text-xl leading-8 text-[var(--accent-dark)]">{item.sentence || item.text}</p>
            </div>
          </div>
        )}

        {stage === "repeat" && (
          <div className="py-3">
            <p className="kicker mb-8">Overlearn</p>
            <div className="mx-auto flex flex-col items-center gap-6">
              <h1
                className="text-balance break-words text-center font-black leading-[1.15] text-[var(--ink)] [overflow-wrap:anywhere]"
                style={{ fontSize: titleSize }}
              >
                {item.text}
              </h1>
              <div className="animate-pulse text-3xl font-black text-[var(--accent)]">Repeat 3×</div>
              <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">Say it slowly, then increase pace without losing clarity.</p>
            </div>
          </div>
        )}

        {stage === "rate" && (
          <div className="py-3">
            <p className="kicker mb-8">Quick reflection</p>
            <div className="mx-auto flex flex-col items-center gap-4">
              <h1
                className="text-balance break-words text-center font-black leading-[1.15] text-[var(--ink)] [overflow-wrap:anywhere]"
                style={{ fontSize: titleSize }}
              >
                {item.text}
              </h1>
              <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">Select how this word felt to pronounce.</p>
            </div>
          </div>
        )}
      </div>

      {(stage === "pronounce" || stage === "repeat") && (
        <div className="mt-4 rounded-[1.6rem] bg-[var(--surface-strong)] p-5 text-center">
          <p className="text-lg font-bold text-[var(--accent-dark)]">{item.breakdown}</p>
          {item.ipa && <p className="mt-2 font-mono text-xs text-[var(--muted)]">{item.ipa}</p>}
        </div>
      )}
    </article>
  );
}
