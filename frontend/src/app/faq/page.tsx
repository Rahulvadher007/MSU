"use client";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { getFaqItems, faqItems as rawFaqItems } from "@/lib/data";
import { useTranslatedFields } from "@/lib/useTranslatedFields";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import Link from "next/link";
import { IconChevronRight, IconGrid, IconShieldLeaf, IconUsers, IconRupee, IconAlertTriangle, IconScale } from "@/components/ui/Icons";

const CATEGORY_ALL = "all";
const categories = ["all", "crop-insurance", "pacs", "financial", "grievance", "legal"] as const;
type Filter = (typeof categories)[number];

const categoryIcons: Record<Filter, React.ComponentType<{ className?: string }>> = {
  all: IconGrid,
  "crop-insurance": IconShieldLeaf,
  pacs: IconUsers,
  financial: IconRupee,
  grievance: IconAlertTriangle,
  legal: IconScale,
};

export default function FaqPage() {
  const { t, locale } = useI18n();
  const items = useMemo(() => getFaqItems(locale), [locale]);
  const translated = useTranslatedFields({
    locale,
    items,
    rawItems: rawFaqItems as never,
    textFields: ["question", "answer"],
    listFields: [],
  });
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Filter>(CATEGORY_ALL);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const filtered = translated.filter((f) => {
    const okCat = cat === CATEGORY_ALL || f.category === cat;
    const q = query.trim().toLowerCase();
    const okQuery = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    return okCat && okQuery;
  });

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="rail-frame page-container">
      <Reveal trigger="load">
        <p className="eyebrow">{t("nav.faq")}</p>
        <h1 className="display mt-3 text-3xl tracking-tight text-[var(--ink)] md:text-4xl">{t("faq.title")}</h1>
        <p className="mt-2 text-[var(--text-body)]">{t("faq.subtitle")}</p>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("faq.searchPlaceholder")} className="mt-4 max-w-sm" />
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
                {c === "all" ? t("common.all") : t(`faqCategory.${c}`)}
              </button>
            );
          })}
        </div>
      </Reveal>
      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyState title={t("faq.empty")} /></div>
      ) : (
        <Stagger as="ul" className="mt-6 space-y-3">
          {filtered.map((f) => {
            const isOpen = open.has(f.id);
            return (
              <li key={f.id} className={`rounded-[var(--radius-md)] border transition-colors duration-[200ms] ${isOpen ? "border-[var(--border-hover)] bg-[var(--cream)]" : "border-[var(--border-soft)] bg-[var(--canvas)]"}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(f.id)}
                  className="flex w-full items-center justify-between gap-3 px-[var(--space-4)] py-[var(--space-4)] text-left font-answer"
                >
                  <span className="font-medium text-[var(--ink)]">{f.question}</span>
                  <IconChevronRight className={`h-5 w-5 shrink-0 text-[var(--text-faint)] transition-transform duration-[200ms] ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-[var(--space-4)] pb-[var(--space-4)]">
                    <p className="font-answer text-[var(--text-base)] leading-relaxed text-[var(--text-body)]">{f.answer}</p>
                    <Link
                      href={`/chat?q=${encodeURIComponent(f.question)}`}
                      className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-cta)] border border-[var(--accent-primary)]/30 bg-[var(--cream)] px-4 text-sm font-semibold text-[var(--ink)] transition-colors duration-[200ms] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-tint-soft)]"
                    >
                      {t("faq.askInChat")}
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
