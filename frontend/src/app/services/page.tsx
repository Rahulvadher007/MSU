"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { getServices, services as rawServices } from "@/lib/data";
import { useTranslatedFields } from "@/lib/useTranslatedFields";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { deco, domainAccent } from "@/lib/data/deco";
import { IconChevronRight, IconGrid, IconRupee, IconWarehouse, IconShield, IconLeaf, IconGift, IconUsers } from "@/components/ui/Icons";

const CATEGORY_ALL = "all";
const categories = ["all", "credit", "storage", "insurance", "agro-inputs", "subsidy", "membership"] as const;
type Filter = (typeof categories)[number];

const categoryIcons: Record<Filter, React.ComponentType<{ className?: string }>> = {
  all: IconGrid,
  credit: IconRupee,
  storage: IconWarehouse,
  insurance: IconShield,
  "agro-inputs": IconLeaf,
  subsidy: IconGift,
  membership: IconUsers,
};

export default function ServicesPage() {
  const { t, locale } = useI18n();
  const all = useMemo(() => getServices(locale), [locale]);
  const translated = useTranslatedFields({
    locale,
    items: all,
    rawItems: rawServices as never,
    textFields: ["name", "summary"],
    listFields: [],
  });
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Filter>(CATEGORY_ALL);

  const filtered = translated.filter((s) => {
    const okCat = cat === CATEGORY_ALL || s.category === cat;
    const q = query.trim().toLowerCase();
    const okQuery = !q || s.name.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q);
    return okCat && okQuery;
  });

  return (
    <div className="rail-frame page-container">
      <Reveal trigger="load">
        <p className="eyebrow">{t("nav.services")}</p>
        <h1 className="display mt-3 text-3xl tracking-tight text-[var(--ink)] md:text-4xl">{t("services.title")}</h1>
        <p className="mt-2 text-[var(--text-body)]">{t("services.subtitle")}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("services.searchPlaceholder")} className="max-w-sm" />
          <p className="text-sm text-[var(--text-faint)]">{t("services.count", { n: filtered.length })}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => {
            const IconComponent = categoryIcons[c];
            return (
              <button
                key={c}
                type="button"
                aria-pressed={c === cat}
                onClick={() => setCat(c)}
                className={`group inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border px-4 text-sm font-medium transition-all duration-200 ease-[var(--ease-out-cubic)] active:scale-[0.97] ${
                  c === cat
                    ? "border-[var(--dark)] bg-[var(--dark)] text-[var(--on-dark-strong)] shadow-md"
                    : "border-[var(--border-default)] bg-[var(--canvas)] text-[var(--text-body)] hover:border-[var(--ink)] hover:bg-[var(--surface-overlay)] hover:text-[var(--ink)] hover:-translate-y-px hover:shadow-sm"
                }`}
              >
                <IconComponent className={`h-4 w-4 transition-colors duration-200 ${
                  c === cat ? "text-[var(--on-dark-strong)]" : "text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)]"
                }`} />
                {c === "all" ? t("common.all") : t(`serviceCategory.${c}`)}
              </button>
            );
          })}
        </div>
      </Reveal>
      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyState title={t("services.empty")} /></div>
      ) : (
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="block group">
              <Card interactive accent={domainAccent(s.category)}>
                {/* Category eyebrow */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">
                  {t(`serviceCategory.${s.category}`)}
                </p>
                {/* Title */}
                <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--ink)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {s.name}
                </h2>
                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                  {s.summary}
                </p>
                {/* CTA */}
                <div className="mt-4 pt-3 border-t border-[var(--border-soft)]">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-body)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {t("services.askThisService")}
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
