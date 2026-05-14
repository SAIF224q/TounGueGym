"use client";

import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--ink)]/20 px-4 backdrop-blur-sm">
      <div className="soft-card w-full max-w-md rounded-[2rem] p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[var(--ink)]">Quick Session</h2>
          <button type="button" onClick={onClose} title="Close" aria-label="Close" className="grid size-10 place-items-center rounded-full bg-[var(--surface-strong)]">
            <X className="size-6" />
          </button>
        </div>
        <label htmlFor="session-count" className="kicker mt-10 block">
          Items
        </label>
        <input
          id="session-count"
          type="range"
          min="5"
          max="30"
          step="1"
          value={count}
          onChange={(event) => onCountChange(Number(event.target.value))}
          className="mt-6 w-full accent-[var(--accent)]"
        />
        <div className="mt-5 text-5xl font-black text-[var(--accent-dark)]">{count}</div>
        <button type="button" onClick={onStart} className="soft-button mt-10 h-14 w-full rounded-2xl text-sm font-bold">
          Start Session
        </button>
      </div>
    </div>
  );
}
