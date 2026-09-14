"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

const COLUMNS = [
  {
    title: "footer.schemes",
    links: [
      { href: "/schemes", key: "nav.schemes" },
      { href: "/services", key: "nav.services" },
      { href: "/library", key: "nav.library" },
    ],
  },
  {
    title: "footer.legal",
    links: [
      { href: "/legal", key: "nav.legal" },
      { href: "/faq", key: "nav.faq" },
      { href: "/grievance", key: "nav.grievance" },
    ],
  },
];

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-[var(--surface-soft)] border-t border-[var(--hairline)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="group inline-flex items-center gap-2">
              <img src="/goverment.png" alt="JanSayah logo" className="h-8 w-8 rounded-full object-cover" />
              <span className="display text-xl text-[var(--ink)]">JanSayah</span>
            </Link>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
              {t("footer.description")}
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[var(--muted)]">
                {t(col.title)}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[var(--body)] hover:text-[var(--ink)] transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[var(--muted)]">
              {t("footer.contact")}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/chat"
                  className="text-[14px] text-[var(--body)] hover:text-[var(--ink)] transition-colors"
                >
                  {t("nav.chat")}
                </Link>
              </li>
              <li className="text-[14px] text-[var(--body)]">
                {t("footer.contactEmail")}
              </li>
              <li className="text-[14px] text-[var(--body)]">
                {t("footer.contactPhone")}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--hairline)] pt-6 text-center text-[13px] text-[var(--muted-soft)]">
          &copy; 2026 JanSayah. Built for Indian cooperatives.
        </div>
      </div>
    </footer>
  );
}
