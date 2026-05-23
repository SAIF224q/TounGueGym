"use client";

import { X, Sliders } from "lucide-react";

type SessionSetupModalProps = {
  open: boolean;
  count: number;
  onCountChange: (count: number) => void;
  onClose: () => void;
  onStart: () => void;
};

export function SessionSetupModal({ open, count, onCountChange, onClose, onStart }: SessionSetupModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 backdrop-blur-md animate-fade-in">
      <div className="soft-card w-full max-w-md rounded-[2.2rem] p-7 sm:p-9 relative overflow-hidden shadow-2xl transition-all duration-300">
        
        {/* Top colored accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] opacity-80" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="size-5 text-[var(--accent)]" />
            <h2 className="text-xl sm:text-2xl font-black text-[var(--ink)] title-display">Session Size</h2>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            title="Close Setup" 
            aria-label="Close Setup" 
            className="grid size-9 place-items-center rounded-full bg-[var(--surface-strong)] text-[var(--muted)] border border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all active:scale-90"
          >
            <X className="size-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-8 text-center bg-[var(--surface-strong)] rounded-2xl p-6 border border-[var(--line)]/50">
          <label htmlFor="session-count" className="kicker block text-center mb-1">
            Drill Units
          </label>
          <div className="text-5xl font-black text-[var(--accent-dark)] title-display tracking-tight my-2">
            {count}
          </div>
          
          <input
            id="session-count"
            type="range"
            min="5"
            max="30"
            step="1"
            value={count}
            onChange={(event) => onCountChange(Number(event.target.value))}
            className="mt-4 w-full h-2 rounded-lg bg-[var(--line)] appearance-none cursor-pointer accent-[var(--accent)]"
          />
          <div className="flex justify-between text-2xs font-bold text-[var(--muted)] px-1 mt-2">
            <span>5 items</span>
            <span>30 items</span>
          </div>
        </div>

        <button 
          type="button" 
          onClick={onStart} 
          className="soft-button mt-8 h-14 w-full rounded-2xl text-sm font-bold shadow-md"
        >
          Confirm & Start
        </button>
      </div>
    </div>
  );
}
