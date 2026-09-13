"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HamburgerMenu } from "./HamburgerMenu";

const LINKS = [
  { href: "/schemes", key: "nav.schemes" },
  { href: "/services", key: "nav.services" },
  { href: "/library", key: "nav.library" },
  { href: "/legal", key: "nav.legal" },
  { href: "/faq", key: "nav.faq" },
] as const;

export function TopNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const active = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--hairline)] bg-[var(--canvas)]">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="group flex shrink-0 flex-col leading-none">
          <span className="display text-xl text-[var(--ink)]">सहकारिता</span>
          <span
            className="mt-0.5 h-[2px] w-[22px] bg-[var(--brand-coral)] transition-all duration-[250ms] ease-[var(--ease-out-cubic)] group-hover:w-9"
            aria-hidden="true"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((l) => {
            const isActive = active(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-16 items-center border-b-2 px-3 text-[14px] font-medium transition-colors duration-[200ms] ${
                  isActive
                    ? "border-[var(--ink)] text-[var(--ink)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {t(l.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/chat"
            className="hidden items-center rounded-[var(--radius-pill)] bg-[var(--primary)] px-5 py-2 text-[14px] font-semibold text-[var(--on-primary)] transition-colors duration-[200ms] hover:bg-[#1a1a1a] md:inline-flex"
          >
            {t("nav.chat")}
          </Link>
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}
