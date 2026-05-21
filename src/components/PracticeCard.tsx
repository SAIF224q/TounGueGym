"use client";

import { Quote, Star } from "lucide-react";
import { normalizeChunks } from "@/lib/chunks";
import { stageKickers } from "@/lib/practice-flow";
import type { PracticeStage } from "@/lib/practice-flow";
import type { PracticeItem } from "@/lib/types";

type PracticeCardProps = {
  item: PracticeItem;
  stage: PracticeStage;
  favorite: boolean;
  onFavorite: () => void;
};

export function PracticeCard({ item, stage, favorite, onFavorite }: PracticeCardProps) {
  const itemLength = item.text.length;
  const titleSize = itemLength > 22 ? "clamp(2rem, 5vw, 3rem)" : itemLength > 14 ? "clamp(2.25rem, 5.6vw, 3.65rem)" : "clamp(3rem, 7vw, 5rem)";
  const chunks = normalizeChunks(item.text, item.chunks);
  const sentence = item.sentence?.trim();
  const showContext = Boolean(sentence && sentence.toLowerCase() !== item.text.toLowerCase());
  const blendTarget = item.mode === "word" ? "full word" : item.mode === "phrase" ? "full phrase" : "full line";

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
        {stage === "learn" && (
          <div className="py-3">
            <p className="kicker mb-6">{stageKickers.learn}</p>
            <h1
              className="mx-auto max-w-full text-balance break-words py-2 text-center font-black leading-[1.15] text-[var(--ink)]"
              style={{ fontSize: titleSize }}
            >
              {item.text}
            </h1>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {chunks.map((chunk, index) => (
                <span
                  key={index}
                  className="rounded-xl bg-[var(--surface-strong)] px-4 py-3 text-2xl font-black text-[var(--accent-dark)] sm:text-3xl"
                >
                  {chunk}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-2xl break-words text-2xl font-black leading-snug text-[var(--accent-dark)]">{item.breakdown}</p>
            {item.ipa && <p className="mt-3 font-mono text-sm leading-7 text-[var(--muted)]">{item.ipa}</p>}
            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[var(--muted)]">Say each chunk slowly, then blend them into the {blendTarget}.</p>
          </div>
        )}

        {stage === "practice" && (
          <div className="py-3">
            <p className="kicker mb-8">{stageKickers.practice}</p>
            <h1
              className="mx-auto max-w-full text-balance break-words py-2 text-center font-black leading-[1.15] text-[var(--ink)]"
              style={{ fontSize: titleSize }}
            >
              {item.text}
            </h1>
            <div className="mt-6 animate-pulse text-3xl font-black text-[var(--accent)]">Repeat 3×</div>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">Start slow, then pick up speed while staying clear.</p>
            {showContext && (
              <div className="mx-auto mt-10 max-w-2xl rounded-[1.6rem] bg-white/55 p-6 sm:p-8">
                <Quote className="mx-auto mb-4 size-6 text-[var(--accent)]" />
                <p className="text-lg leading-8 text-[var(--accent-dark)]">{sentence}</p>
              </div>
            )}
          </div>
        )}

        {stage === "rate" && (
          <div className="py-3">
            <p className="kicker mb-8">{stageKickers.rate}</p>
            <h1
              className="mx-auto max-w-full text-balance break-words py-2 text-center font-black leading-[1.15] text-[var(--ink)]"
              style={{ fontSize: titleSize }}
            >
              {item.text}
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">How did this feel to pronounce?</p>
          </div>
        )}
      </div>

      {stage === "practice" && (
        <div className="mt-4 rounded-[1.6rem] bg-[var(--surface-strong)] p-5 text-center">
          <p className="text-lg font-bold text-[var(--accent-dark)]">{item.breakdown}</p>
          {item.ipa && <p className="mt-2 font-mono text-xs text-[var(--muted)]">{item.ipa}</p>}
        </div>
      )}
    </article>
  );
}
