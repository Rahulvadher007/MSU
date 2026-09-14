import { IconCheck } from "./Icons";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex items-start gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center gap-1.5">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                active
                  ? "bg-[var(--accent-primary)] text-[var(--accent-contrast)] shadow-[var(--shadow-sm)]"
                  : done
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                    : "border border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-faint)]"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <IconCheck className="w-4 h-4" /> : i + 1}
            </span>
            <span className={`max-w-[6rem] text-center text-xs ${active ? "font-semibold text-[var(--ink)]" : "text-[var(--text-tertiary)]"}`}>
              {label}
            </span>
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute left-[calc(50%+1.2rem)] top-3.5 right-[calc(-50%+1.2rem)] h-px ${done ? "bg-[var(--accent-primary)]" : "bg-[var(--border-soft)]"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
