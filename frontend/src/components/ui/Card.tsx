import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  interactive = false,
  fill = "canvas",
  accent,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  fill?: "canvas" | "cream";
  accent?: string;
}) {
  const base = fill === "cream"
    ? "bg-[var(--cream)] border border-[var(--cream)]"
    : "bg-[var(--surface-elevated)] border border-[var(--border-soft)]";
  return (
    <div
      className={`rounded-[var(--radius-md)] p-6 ${base} ${
        interactive
          ? "transition-all duration-[200ms] ease-[var(--ease-out-cubic)] hover:border-[var(--border-hover)] hover:bg-[var(--cream)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
          : ""
      } ${className}`}
      style={accent ? { borderTopColor: accent, borderTopWidth: "2px" } : undefined}
    >
      {children}
    </div>
  );
}
