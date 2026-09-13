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
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                active
                  ? "bg-[var(--primary)] text-[var(--on-primary)]"
                  : done
                    ? "bg-[var(--success)] text-white"
                    : "border border-[var(--hairline)] bg-[var(--canvas)] text-[var(--muted)]"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <IconCheck className="w-4 h-4" /> : i + 1}
            </span>
            <span className={`max-w-[6rem] text-center text-xs ${active ? "font-medium text-[var(--ink)]" : "text-[var(--text-tertiary)]"}`}>
              {label}
            </span>
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute left-[calc(50%+1.2rem)] top-3.5 right-[calc(-50%+1.2rem)] h-px ${done ? "bg-[var(--success)]" : "bg-[var(--hairline)]"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
