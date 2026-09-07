import type { ReactNode } from "react";

export function Chips<T extends string>({
  options,
  value,
  onChange,
  render = (x) => x,
  disabled = false,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  render?: (v: T) => ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filters">
      {options.map((o) => {
        const selected = o === value;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => onChange(o)}
            className={`inline-flex h-10 items-center rounded-[var(--radius-cta)] border px-4 text-sm font-medium transition-all duration-[200ms] ease-[var(--ease-out-cubic)] ${
              selected
                ? "border-[var(--dark)] bg-[var(--dark)] text-[var(--on-dark-strong)] shadow-[var(--shadow-sm)]"
                : "border-[var(--border-default)] bg-[var(--cream)] text-[var(--text-body)] hover:border-[var(--border-hover)] hover:text-[var(--ink)]"
            }`}
          >
            {render(o)}
          </button>
        );
      })}
    </div>
  );
}
