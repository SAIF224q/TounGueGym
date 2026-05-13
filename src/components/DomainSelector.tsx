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
    <section className="space-y-6 border-t border-stone-200 pt-14">
      <p className="kicker text-center">Domain</p>
      <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
        {domains.map((domain) => (
          <button
            key={domain}
            type="button"
            onClick={() => onChange(domain)}
            className={`min-h-14 border border-stone-200 px-7 text-sm transition ${
              value === domain ? "border-stone-950 bg-stone-100 text-stone-950" : "text-stone-600 hover:border-stone-500"
            }`}
          >
            {domain}
          </button>
        ))}
      </div>
      <div className="mx-auto max-w-sm">
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
          className={`h-12 w-full border bg-transparent px-4 text-center text-sm outline-none transition ${
            selectedCustom ? "border-stone-950" : "border-stone-200 focus:border-stone-500"
          }`}
        />
      </div>
    </section>
  );
}
