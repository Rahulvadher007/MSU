"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HamburgerMenu } from "./HamburgerMenu";

const LEFT_LINKS = [
  { href: "/schemes", key: "nav.schemes" },
  { href: "/services", key: "nav.services" },
  { href: "/library", key: "nav.library" },
  { href: "/legal", key: "nav.legal" },
] as const;

const RIGHT_LINKS = [
  { href: "/faq", key: "nav.faq" },
] as const;

export function TopNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="fixed inset-x-0 top-4 z-30 flex justify-center px-4 md:px-6">
      {/* ── Floating pill navbar ── */}
      <header className="flex h-12 w-full max-w-[1200px] items-center justify-between rounded-full border border-[var(--hairline)] bg-white/80 px-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-md">
        {/* Left: Logo + primary links */}
        <div className="flex items-center gap-0.5">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-[var(--accent-tint-soft)]"
          >
            <img src="/bond.png" alt="JanSayah logo" className="h-6 w-6 rounded-full object-cover" />
            <span className="hidden text-[14px] font-semibold text-[var(--ink)] sm:inline">JanSayah</span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
            {LEFT_LINKS.map((l) => {
              const isActive = active(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-[150ms] ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--on-primary)]"
                      : "text-[var(--body)] hover:bg-[var(--accent-tint-soft)] hover:text-[var(--ink)]"
                  }`}
                >
                  {t(l.key)}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Secondary links + Language + CTA */}
        <div className="flex items-center gap-0.5">
          {RIGHT_LINKS.map((l) => {
            const isActive = active(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`hidden items-center rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-[150ms] md:flex ${
                  isActive
                    ? "bg-[var(--primary)] text-[var(--on-primary)]"
                    : "text-[var(--body)] hover:bg-[var(--accent-tint-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {t(l.key)}
              </Link>
            );
          })}

          <LanguageSwitcher />

          <Link
            href="/chat"
            className="hidden items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-1.5 text-[13px] font-semibold text-[var(--on-primary)] transition-colors duration-[150ms] hover:bg-[#1a1a1a] md:inline-flex"
          >
            {t("nav.chat")}
          </Link>

          <HamburgerMenu />
        </div>
      </header>
    </div>
  );
}
