"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import {
  schemes as rawSchemes,
  services as rawServices,
  libraryDocs as rawLibraryDocs,
} from "@/lib/data";
import {
  IconGlobe,
  IconDoc,
  IconMic,
  IconShield,
  IconChevronRight,
  IconSparkles,
  IconChat,
} from "@/components/ui/Icons";

const BENTO_CARDS = [
  {
    color: "brand-pink" as const,
    textClass: "text-[var(--brand-pink-text)]",
    bgClass: "bg-[var(--brand-pink)]",
    icon: <IconGlobe className="w-7 h-7" />,
    title: "landing.f1title",
    text: "landing.f1text",
    span: "col-span-2 row-span-2",
  },
  {
    color: "brand-teal" as const,
    textClass: "text-[var(--brand-teal-text)]",
    bgClass: "bg-[var(--brand-teal)]",
    icon: <IconDoc className="w-7 h-7" />,
    title: "landing.f2title",
    text: "landing.f2text",
    span: "col-span-1 row-span-1",
  },
  {
    color: "brand-lavender" as const,
    textClass: "text-[var(--brand-lavender-text)]",
    bgClass: "bg-[var(--brand-lavender)]",
    icon: <IconMic className="w-7 h-7" />,
    title: "landing.f3title",
    text: "landing.f3text",
    span: "col-span-1 row-span-1",
  },
  {
    color: "brand-peach" as const,
    textClass: "text-[var(--brand-peach-text)]",
    bgClass: "bg-[var(--brand-peach)]",
    icon: <IconShield className="w-7 h-7" />,
    title: "landing.trust3",
    text: "landing.f3text",
    span: "col-span-1 row-span-1",
  },
  {
    color: "brand-ochre" as const,
    textClass: "text-[var(--brand-ochre-text)]",
    bgClass: "bg-[var(--brand-ochre)]",
    icon: <IconSparkles className="w-7 h-7" />,
    title: "landing.trust4",
    text: "landing.f2text",
    span: "col-span-1 row-span-2",
  },
  {
    color: "brand-mint" as const,
    textClass: "text-[var(--brand-mint-text)]",
    bgClass: "bg-[var(--brand-mint)]",
    icon: <IconChat className="w-7 h-7" />,
    title: "landing.how2title",
    text: "landing.how2text",
    span: "col-span-2 row-span-1",
  },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "landing.how1title",
    text: "landing.how1text",
  },
  {
    num: "02",
    title: "landing.how2title",
    text: "landing.how2text",
  },
  {
    num: "03",
    title: "landing.how3title",
    text: "landing.how3text",
  },
];

export default function HomePage() {
  const { t } = useI18n();

  const stats = [
    { n: rawSchemes.length, label: t("nav.schemes") },
    { n: rawServices.length, label: t("nav.services") },
    { n: rawLibraryDocs.length, label: t("nav.library") },
    { n: 6, label: t("landing.trust1") },
  ];

  return (
    <div className="page-container">
      {/* ── Section 1: Full-Bleed Hero ── */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center py-16 text-center md:py-24">
        <Reveal trigger="load" className="flex flex-col items-center">
          <p className="eyebrow">{t("landing.badge")}</p>

          <h1
            className="mt-6 max-w-4xl text-[40px] font-medium leading-[0.95] tracking-[-0.05em] text-[var(--ink)] md:text-[80px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("landing.tagline").split("—").map((part, i, arr) => (
              <span key={i}>
                {part.trim()}
                {i < arr.length - 1 && (
                  <span className="block text-[var(--muted)]">—</span>
                )}
              </span>
            ))}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--body)] md:text-xl">
            {t("landing.f1text")}
          </p>

          <div className="mt-10">
            <Link href="/chat">
              <Button size="lg" className="h-14 px-8 text-[18px]">
                {t("landing.ctaChat")}{" "}
                <IconChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[t("landing.trust1"), t("landing.trust2"), t("landing.trust3"), t("landing.trust4")].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--hairline)] bg-[var(--canvas)] px-4 py-1.5 text-[13px] font-medium text-[var(--muted)]"
                >
                  {badge}
                </span>
              )
            )}
          </div>
        </Reveal>
      </section>

      {/* ── Section 2: Bento Grid ── */}
      <section className="mt-8">
        <Reveal>
          <p className="eyebrow">{t("landing.trustTitle")}</p>
          <h2
            className="mt-3 text-[30px] font-medium tracking-tight text-[var(--ink)] md:text-[40px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("landing.bentoTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-[var(--body)]">
            {t("landing.bentoSubtitle")}
          </p>
        </Reveal>

        <Stagger
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[180px]"
          stagger={0.06}
        >
          {BENTO_CARDS.map((card) => (
            <div
              key={card.title}
              className={`rounded-[var(--radius-xl)] p-8 ${card.bgClass} ${card.textClass} ${card.span} flex flex-col justify-between`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                {card.icon}
              </div>
              <div className="mt-auto">
                <h3 className="text-[18px] font-semibold leading-tight md:text-[20px]">
                  {t(card.title)}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed opacity-90">
                  {t(card.text)}
                </p>
              </div>
            </div>
          ))}
        </Stagger>
      </section>

      {/* ── Section 3: Stats — Horizontal Ribbon ── */}
      <Reveal className="mt-24 rounded-[var(--radius-xl)] bg-[var(--surface-soft)]">
        <div className="flex items-center justify-center gap-12 px-6 py-12 md:gap-20 md:px-12 md:py-14">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-12 md:gap-20">
              <div className="text-center">
                <p
                  className="text-[40px] font-medium leading-tight tracking-tight text-[var(--ink)] md:text-[56px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.n}
                </p>
                <p className="mt-1 text-[13px] font-medium text-[var(--muted)]">
                  {s.label}
                </p>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden h-12 w-px bg-[var(--hairline)] md:block" />
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Section 4: How It Works — Numbered Steps with Line ── */}
      <section className="mt-24">
        <Reveal>
          <p className="eyebrow">{t("landing.trustTitle")}</p>
          <h2
            className="mt-3 text-[30px] font-medium tracking-tight text-[var(--ink)] md:text-[40px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("landing.howTitle")}
          </h2>
        </Reveal>

        <Stagger className="mt-12 flex flex-col gap-10 md:flex-row md:items-start md:gap-0">
          {HOW_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative flex-1 md:px-6"
            >
              {/* Connecting line (desktop only, not on last step) */}
              {i < HOW_STEPS.length - 1 && (
                <div className="absolute left-[calc(50%+40px)] top-[36px] hidden h-px w-[calc(100%-40px)] bg-[var(--hairline)] md:block" />
              )}

              <span
                className="block text-[72px] font-medium leading-none text-[var(--hairline)]"
                style={{ fontFamily: "var(--font-display)" }}
                aria-hidden="true"
              >
                {step.num}
              </span>
              <h3 className="mt-4 text-[18px] font-medium text-[var(--ink)]">
                {t(step.title)}
              </h3>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[var(--body)]">
                {t(step.text)}
              </p>
            </div>
          ))}
        </Stagger>
      </section>

      {/* ── Section 5: CTA Band ── */}
      <Reveal className="mt-24 rounded-[var(--radius-xl)] bg-[var(--surface-soft)] px-6 py-20 text-center md:px-12 md:py-24">
        <p className="eyebrow">{t("landing.badge")}</p>
        <h2
          className="mx-auto mt-4 max-w-2xl text-[30px] font-medium leading-tight tracking-tight text-[var(--ink)] md:text-[40px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("landing.ctaChat")}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[var(--body)]">
          {t("landing.bentoSubtitle")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/chat">
            <Button size="lg" className="h-14 px-8 text-[18px]">
              {t("landing.ctaChat")}
            </Button>
          </Link>
          <Link href="/grievance">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-[18px]">
              {t("nav.grievance")}
            </Button>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
