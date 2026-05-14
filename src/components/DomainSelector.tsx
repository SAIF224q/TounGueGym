"use client";

import { domains } from "@/lib/constants";

type DomainSelectorProps = {
  value: string;
  customValue: string;
  onChange: (value: string) => void;
  onCustomChange: (value: string) => void;
};

export function DomainSelector({ value, customValue, onChange, onCustomChange }: DomainSelectorProps) {
  const selectedCustom = value === customValue && customValue.trim().length > 0;

  return (
    <section className="space-y-3">
      <p className="kicker">Domain</p>
      <div className="flex flex-wrap gap-2">
        {domains.map((domain) => (
          <button
            key={domain}
            type="button"
            onClick={() => onChange(domain)}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${
              value === domain
                ? "border-[var(--accent-dark)] bg-[var(--accent-dark)] text-[var(--surface)]"
                : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)]"
            }`}
          >
            {domain}
          </button>
        ))}
      </div>
      <div>
        <label className="sr-only" htmlFor="custom-domain">
          Custom domain
        </label>
        <input
          id="custom-domain"
          value={customValue}
          onChange={(event) => {
            onCustomChange(event.target.value);
            if (event.target.value.trim()) onChange(event.target.value);
          }}
          placeholder="Custom domain"
          className={`h-12 w-full rounded-2xl border bg-[var(--surface)] px-4 text-sm font-medium outline-none transition placeholder:text-[var(--muted)]/70 ${
            selectedCustom ? "border-[var(--accent-dark)]" : "border-[var(--line)] focus:border-[var(--accent)]"
          }`}
        />
      </div>
    </section>
  );
}
