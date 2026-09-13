"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { LanguageSwitcher } from "./LanguageSwitcher";

const LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/schemes", key: "nav.schemes" },
  { href: "/services", key: "nav.services" },
  { href: "/library", key: "nav.library" },
  { href: "/legal", key: "nav.legal" },
  { href: "/faq", key: "nav.faq" },
  { href: "/grievance", key: "nav.grievance" },
] as const;

export function HamburgerMenu() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--ink)] lg:hidden"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-[var(--ink)]/40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-[var(--canvas)] shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--hairline)] px-6 py-4">
              <span className="display text-lg text-[var(--ink)]">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--ink)]"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <nav className="px-6 py-4" aria-label="Mobile navigation">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-[var(--hairline)] py-3 text-[16px] font-medium text-[var(--ink)] hover:text-[var(--muted)]"
                >
                  {t(l.key)}
                </Link>
              ))}
            </nav>
            <div className="px-6 py-4">
              <LanguageSwitcher />
            </div>
            <div className="px-6 py-4">
              <Link
                href="/chat"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--primary)] px-5 py-3 text-[14px] font-semibold text-[var(--on-primary)]"
              >
                {t("nav.chat")}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
