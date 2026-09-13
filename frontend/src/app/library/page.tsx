"use client";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { getLibraryDocs, libraryDocs as rawLibraryDocs } from "@/lib/data";
import { useTranslatedFields } from "@/lib/useTranslatedFields";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { IconChevronRight, IconSearch } from "@/components/ui/Icons";
import { domainAccent, domainLabel } from "@/lib/data/deco";

const domains = ["all", "cropInsurance", "law", "financial", "grievance"] as const;
type Filter = (typeof domains)[number];

function PdfThumb({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 52 64" className="w-[52px] h-[64px] shrink-0" aria-hidden="true">
      <rect x="1" y="1" width="44" height="62" rx="2" fill="var(--cream-2)" stroke="var(--border-default)" strokeWidth="1" />
      <polygon points="34,1 45,1 45,12" fill="var(--canvas)" stroke="var(--border-default)" strokeWidth="1" />
      <polygon points="34,1 34,12 45,12" fill="var(--cream-2)" />
      <rect x="8" y="20" width="26" height="2" rx="1" fill={accent} opacity="0.25" />
      <rect x="8" y="26" width="30" height="2" rx="1" fill="var(--text-tertiary)" opacity="0.15" />
      <rect x="8" y="32" width="20" height="2" rx="1" fill="var(--text-tertiary)" opacity="0.15" />
      <rect x="8" y="38" width="28" height="2" rx="1" fill="var(--text-tertiary)" opacity="0.15" />
      <rect x="8" y="44" width="22" height="2" rx="1" fill="var(--text-tertiary)" opacity="0.15" />
      <rect x="6" y="53" width="14" height="6" rx="1" fill={accent} opacity="0.9" />
      <text x="13" y="58" textAnchor="middle" fill="white" fontSize="5" fontWeight="700" fontFamily="system-ui, sans-serif">PDF</text>
    </svg>
  );
}

export default function LibraryPage() {
  const { t, locale } = useI18n();
  const docs = useMemo(() => getLibraryDocs(locale), [locale]);
  const translated = useTranslatedFields({
    locale,
    items: docs,
    rawItems: rawLibraryDocs as never,
    textFields: ["title", "source"],
    listFields: [],
  });
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<Filter>("all");

  const filtered = translated.filter((d) => {
    const okDomain = domain === "all" || d.domain === domain;
    const q = query.trim().toLowerCase();
    const okQuery = !q || d.title.toLowerCase().includes(q) || d.source.toLowerCase().includes(q);
    return okDomain && okQuery;
  });

  const domainFilters: { key: Filter; icon: React.ReactNode }[] = [
    { key: "all", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg> },
    { key: "cropInsurance", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2L2 6v5l6 3 6-3V6z" /><path d="M8 2v11" /><path d="M2 6l6 3 6-3" /></svg> },
    { key: "law", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="4" r="2" /><path d="M4 7h8l-1 7H5z" /></svg> },
    { key: "financial", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="12" height="9" rx="1.5" /><path d="M5 4V3a3 3 0 0 1 6 0v1" /></svg> },
    { key: "grievance", icon: <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v8" /><circle cx="8" cy="12" r="1" fill="currentColor" /><path d="M2 14h12" /></svg> },
  ];

  return (
    <div className="rail-frame page-container">
      <Reveal trigger="load">
        <div className="flex items-start justify-between gap-8">
          <div className="min-w-0">
            <p className="eyebrow">OFFICIAL DOCUMENT LIBRARY</p>
            <h1 className="display mt-3 text-3xl tracking-tight text-[var(--ink)] md:text-4xl">{t("library.title")}</h1>
            <p className="mt-2 max-w-xl text-[var(--text-body)]">{t("library.subtitle")}</p>
          </div>
          <div className="hidden md:block w-40 h-40 shrink-0 opacity-[0.04] pointer-events-none select-none" aria-hidden="true">
            <svg viewBox="0 0 160 160" fill="none">
              <rect x="20" y="10" width="80" height="110" rx="4" stroke="currentColor" strokeWidth="2" />
              <rect x="60" y="40" width="80" height="110" rx="4" stroke="currentColor" strokeWidth="2" />
              <line x1="32" y1="30" x2="88" y2="30" stroke="currentColor" strokeWidth="1.5" />
              <line x1="32" y1="40" x2="88" y2="40" stroke="currentColor" strokeWidth="1.5" />
              <line x1="32" y1="50" x2="72" y2="50" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div className="relative mt-5">
          <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("library.searchPlaceholder")}
            className="w-full h-12 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--canvas)] pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] shadow-sm transition-shadow duration-200 ease-[var(--ease-out-cubic)] focus:outline-none focus:shadow-md"
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {domainFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={f.key === domain}
                onClick={() => setDomain(f.key)}
                className={`inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border px-4 text-sm font-medium transition-all duration-200 ease-[var(--ease-out-cubic)] ${
                  f.key === domain
                    ? "border-[var(--dark)] bg-[var(--dark)] text-[var(--on-dark-strong)] shadow-md"
                    : "border-[var(--border-default)] bg-[var(--canvas)] text-[var(--text-body)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }`}
              >
                {f.icon}
                {f.key === "all" ? t("common.all") : domainLabel(f.key)}
              </button>
            ))}
          </div>
          <p className="text-sm text-[var(--text-tertiary)] tabular-nums">
            Total Documents: <span className="font-semibold text-[var(--text-secondary)]">{filtered.length}</span>
          </p>
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <EmptyState title={t("library.empty")} />
      ) : (
        <Stagger as="ul" className="mt-6 space-y-3">
          {filtered.map((d) => {
            const accent = domainAccent(d.domain);
            return (
              <li key={d.id}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-stretch gap-0 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--canvas)] shadow-sm transition-all duration-200 ease-[var(--ease-out-cubic)] hover:shadow-md hover:border-[var(--ink)] overflow-hidden"
                >
                  <div className="w-1 shrink-0 rounded-l-[var(--radius-md)]" style={{ backgroundColor: accent }} />

                  <div className="flex items-center gap-4 p-4 min-w-0 flex-1">
                    <PdfThumb accent={accent} />

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                        {domainLabel(d.domain)}
                      </p>
                      <p className="mt-1 text-[15px] font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">
                        {d.title}
                      </p>
                      <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                        {d.source} · {t("library.page", { p: d.page })} · {d.publishedAt}
                      </p>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 ml-2">
                      <span className="text-xs font-medium text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        View
                      </span>
                      <IconChevronRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--ink)] transition-colors duration-200" />
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
