"use client";

import { useEffect, useState } from "react";
import { Quote, Star, Volume2 } from "lucide-react";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChunk, setActiveChunk] = useState<number | null>(null);

  const itemLength = item.text.length;
  const titleSize = itemLength > 22 
    ? "clamp(2rem, 5vw, 3rem)" 
    : itemLength > 14 
      ? "clamp(2.25rem, 5.6vw, 3.65rem)" 
      : "clamp(2.75rem, 6.5vw, 4.5rem)";

  const chunks = normalizeChunks(item.text, item.chunks);
  const sentence = item.sentence?.trim();
  const showContext = Boolean(sentence && sentence.toLowerCase() !== item.text.toLowerCase());
  const blendTarget = item.mode === "word" ? "full word" : item.mode === "phrase" ? "full phrase" : "full line";

  useEffect(() => {
    // Stop speaking when item or stage changes
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setActiveChunk(null);
    }
  }, [item.id, stage]);

  const speak = (textToSpeak: string, rate: number = 0.85, chunkIndex: number | null = null) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    if (chunkIndex !== null) {
      setActiveChunk(chunkIndex);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setActiveChunk(null);
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;

    utterance.onend = () => {
      setIsPlaying(false);
      setActiveChunk(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveChunk(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <article className="soft-card mx-auto w-full max-w-4xl rounded-[2.4rem] p-6 sm:p-10 relative overflow-hidden transition-all duration-300">
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] opacity-80" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)] px-3.5 py-1.5 text-2xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
            {item.mode.replace("_", " ")}
          </span>
          <span className="rounded-full bg-[color-mix(in srgb,var(--sage),transparent_88%)] border border-[var(--line)] px-3.5 py-1.5 text-2xs font-extrabold uppercase tracking-[0.06em] text-[var(--sage)]">
            {item.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Audio read aloud button */}
          <button
            onClick={() => speak(item.text, 0.85)}
            title="Listen Aloud"
            type="button"
            aria-label="Listen Aloud"
            className={`grid size-11 place-items-center rounded-full transition-all duration-300 border ${
              isPlaying
                ? "bg-[var(--accent-dark)] border-[var(--accent)] text-[#fff] scale-105"
                : "bg-[var(--surface-strong)] border-[var(--line)] text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--surface)] hover:text-[var(--accent-dark)] hover:-translate-y-0.5"
            }`}
          >
            <div className={`flex items-center justify-center ${isPlaying ? "audio-playing" : ""}`}>
              {isPlaying ? (
                <div className="audio-wave">
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                </div>
              ) : (
                <Volume2 className="size-5" />
              )}
            </div>
          </button>
          
          {/* Favorite button */}
          <button
            type="button"
            onClick={onFavorite}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
            className={`grid size-11 place-items-center rounded-full transition-all duration-300 border ${
              favorite 
                ? "bg-[var(--surface-strong)] border-[var(--accent)] text-[var(--accent)] scale-105" 
                : "bg-[var(--surface-strong)] border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)] hover:bg-[var(--surface)] hover:text-[var(--accent)] hover:-translate-y-0.5"
            }`}
          >
            <Star className="size-5" fill={favorite ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Main card body with slide-fade entry animation based on active stage */}
      <div key={stage} className="stage-enter px-2 py-10 text-center sm:px-6 sm:py-14">
        
        {stage === "learn" && (
          <div className="py-2">
            <p className="kicker mb-5">{stageKickers.learn}</p>
            <h1
              className="mx-auto max-w-full text-balance break-words py-2 text-center font-black leading-[1.12] text-[var(--ink)] tracking-tight title-display"
              style={{ fontSize: titleSize }}
            >
              {item.text}
            </h1>
            
            {/* Syllable practice chunks */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
              {chunks.map((chunk, index) => {
                const active = activeChunk === index;
                return (
                  <button
                    key={index}
                    onClick={() => speak(chunk, 0.7, index)}
                    type="button"
                    title={`Click to pronounce "${chunk}"`}
                    className={`chunk-badge rounded-2xl px-5 py-3.5 text-xl sm:text-2xl font-black shadow-sm ${
                      active
                        ? "bg-[var(--accent-dark)] border-[var(--accent)] text-[#fff] scale-105 ring-2 ring-[var(--accent)]/50"
                        : "bg-[var(--surface-strong)] text-[var(--accent-dark)]"
                    }`}
                  >
                    {chunk}
                  </button>
                );
              })}
            </div>
            
            <p className="mx-auto mt-8 max-w-2xl break-words text-2xl font-extrabold leading-snug text-[var(--accent-dark)]">
              {item.breakdown}
            </p>
            
            {item.ipa && (
              <p className="mt-3 font-mono text-sm tracking-wide text-[var(--muted)]/90 bg-[var(--surface-strong)]/40 w-fit mx-auto px-3.5 py-1 rounded-lg border border-[var(--line)]/50">
                [{item.ipa}]
              </p>
            )}
            
            <p className="mx-auto mt-7 max-w-md text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
              Say each chunk slowly by clicking them, then blend them into the <span className="font-semibold text-[var(--accent-dark)]">{blendTarget}</span>.
            </p>
          </div>
        )}

        {stage === "practice" && (
          <div className="py-2">
            <p className="kicker mb-6">{stageKickers.practice}</p>
            <h1
              className="mx-auto max-w-full text-balance break-words py-2 text-center font-black leading-[1.12] text-[var(--ink)] tracking-tight title-display"
              style={{ fontSize: titleSize }}
            >
              {item.text}
            </h1>
            <div className="mt-6 flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-[var(--accent)] animate-pulse">
              Repeat 3×
            </div>
            <p className="mx-auto mt-3 max-w-sm text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
              Start slow, then build up speed while keeping articulation clean.
            </p>
            
            {showContext && (
              <div className="mx-auto mt-8 max-w-2xl rounded-[1.8rem] border border-[var(--line)] bg-[var(--surface-strong)]/40 p-5 sm:p-7 relative text-left">
                <Quote className="absolute -top-3.5 left-6 size-7 text-[var(--accent)]/30" />
                <p className="text-base sm:text-lg leading-relaxed text-[var(--accent-dark)] italic px-2">
                  &ldquo;{sentence}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {stage === "rate" && (
          <div className="py-2">
            <p className="kicker mb-6">{stageKickers.rate}</p>
            <h1
              className="mx-auto max-w-full text-balance break-words py-2 text-center font-black leading-[1.12] text-[var(--ink)] tracking-tight title-display"
              style={{ fontSize: titleSize }}
            >
              {item.text}
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
              Reflect honestly. How natural did this feel to pronounce?
            </p>
          </div>
        )}
      </div>

      {stage === "practice" && (
        <div className="mt-3 rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-base sm:text-lg font-black text-[var(--accent-dark)]">
            {item.breakdown}
          </p>
          {item.ipa && (
            <p className="mt-1 font-mono text-2xs text-[var(--muted)]">
              [{item.ipa}]
            </p>
          )}
        </div>
      )}
    </article>
  );
}
