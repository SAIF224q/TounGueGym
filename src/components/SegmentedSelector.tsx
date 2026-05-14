"use client";

type Option<T extends string> = {
  value: T;
  label: string;
};

type SegmentedSelectorProps<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedSelector<T extends string>({ label, options, value, onChange }: SegmentedSelectorProps<T>) {
  return (
    <section className="space-y-3">
      <p className="kicker">{label}</p>
      <div className="flex flex-wrap gap-2 rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-strong)] p-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-h-11 flex-1 rounded-2xl px-5 text-sm font-semibold transition ${
              value === option.value ? "bg-[var(--accent-dark)] text-[var(--surface)] shadow-sm" : "text-[var(--muted)] hover:bg-[var(--surface)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
