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
    <section className="space-y-6 border-t border-stone-200 pt-14">
      <p className="kicker text-center">{label}</p>
      <div className="flex flex-wrap justify-center gap-0">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-h-14 min-w-40 border border-stone-200 px-8 text-sm transition ${
              value === option.value ? "border-stone-950 bg-stone-100 text-stone-950" : "text-stone-600 hover:border-stone-500"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
