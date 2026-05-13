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
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/20 px-4">
      <div className="w-full max-w-md border border-stone-950 bg-[var(--paper)] p-8 shadow-[6px_6px_0_0_#00331c]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[var(--green)]">Quick Session</h2>
          <button type="button" onClick={onClose} title="Close" aria-label="Close">
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
          className="mt-6 w-full accent-[var(--green)]"
        />
        <div className="mt-5 text-5xl font-black text-[var(--green)]">{count}</div>
        <button type="button" onClick={onStart} className="mt-10 h-16 w-full bg-[var(--green)] text-sm font-bold tracking-[0.24em] text-white">
          Start Session
        </button>
      </div>
    </div>
  );
}
