"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { getLegalDocs, legalDocs as rawLegalDocs } from "@/lib/data";
import { useTranslatedFields } from "@/lib/useTranslatedFields";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { deco, domainAccent } from "@/lib/data/deco";
import { IconChevronRight, IconGrid, IconScale, IconDoc, IconShield } from "@/components/ui/Icons";

const CATEGORY_ALL = "all";
const categories = ["all", "act", "bye-laws", "provisions"] as const;
type Filter = (typeof categories)[number];

const categoryIcons: Record<Filter, React.ComponentType<{ className?: string }>> = {
  all: IconGrid,
  act: IconScale,
  "bye-laws": IconDoc,
  provisions: IconShield,
};

export default function LegalPage() {
  const { t, locale } = useI18n();
  const all = useMemo(() => getLegalDocs(locale), [locale]);
  const translated = useTranslatedFields({
    locale,
    items: all,
    rawItems: rawLegalDocs as never,
    textFields: ["badge", "overview"],
    listFields: [],
  });
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Filter>(CATEGORY_ALL);

  const filtered = translated.filter((d) => {
    const okCat = cat === CATEGORY_ALL || d.category === cat;
    const q = query.trim().toLowerCase();
    const okQuery = !q || d.badge.toLowerCase().includes(q) || d.overview.toLowerCase().includes(q);
    return okCat && okQuery;
  });

  return (
    <div className="rail-frame page-container">
      <Reveal trigger="load">
        <p className="eyebrow">{t("nav.legal")}</p>
        <h1 className="display mt-3 text-3xl tracking-tight text-[var(--ink)] md:text-4xl">{t("legal.title")}</h1>
        <p className="mt-2 text-[var(--text-body)]">{t("legal.subtitle")}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("legal.searchPlaceholder")} className="max-w-sm" />
          <p className="text-sm text-[var(--text-faint)]">{t("legal.count", { n: filtered.length })}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => {
            const isActive = c === cat;
            const IconComponent = categoryIcons[c];
            return (
              <button
                key={c}
                type="button"
                aria-pressed={isActive}
                onClick={() => setCat(c)}
                className={`group inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border px-4 text-sm font-medium transition-all duration-200 ease-[var(--ease-out-cubic)] active:scale-[0.97] ${
                  isActive
                    ? "border-[var(--dark)] bg-[var(--dark)] text-[var(--on-dark-strong)] shadow-md"
                    : "border-[var(--border-default)] bg-[var(--canvas)] text-[var(--text-body)] hover:border-[var(--ink)] hover:bg-[var(--surface-overlay)] hover:text-[var(--ink)] hover:-translate-y-px hover:shadow-sm"
                }`}
              >
                <IconComponent className={`h-4 w-4 transition-colors duration-200 ${
                  isActive ? "text-[var(--on-dark-strong)]" : "text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)]"
                }`} />
                {c === "all" ? t("common.all") : t(`legalCategory.${c}`)}
              </button>
            );
          })}
        </div>
      </Reveal>
      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyState title={t("legal.empty")} /></div>
      ) : (
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Link key={d.slug} href={`/legal/${d.slug}`} className="block group">
              <Card interactive accent={domainAccent(d.category)}>
                {/* Category eyebrow */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">
                  {t(`legalCategory.${d.category}`)}
                </p>
                {/* Title */}
                <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--ink)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {d.badge}
                </h2>
                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                  {d.overview}
                </p>
                {/* CTA */}
                <div className="mt-4 pt-3 border-t border-[var(--border-soft)]">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-body)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {t("legal.askThisLaw")}
                    <IconChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </Stagger>
      )}
    </div>
  );
}
