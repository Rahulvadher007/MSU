"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { schemes as rawSchemes, services as rawServices, libraryDocs as rawLibraryDocs } from "@/lib/data";
import { IconChat, IconMic, IconDoc, IconGlobe, IconChevronRight } from "@/components/ui/Icons";

const FEATURES = [
  { color: "brand-pink" as const, icon: <IconGlobe className="w-6 h-6" />, title: "landing.f1title", text: "landing.f1text" },
  { color: "brand-teal" as const, icon: <IconDoc className="w-6 h-6" />, title: "landing.f2title", text: "landing.f2text" },
  { color: "brand-lavender" as const, icon: <IconMic className="w-6 h-6" />, title: "landing.f3title", text: "landing.f3text" },
];
const HOW = [
  { title: "landing.how1title", text: "landing.how1text" },
  { title: "landing.how2title", text: "landing.how2text" },
  { title: "landing.how3title", text: "landing.how3text" },
];

export default function HomePage() {
  const router = useRouter();
  const { t } = useI18n();

  const stats = [
    { n: rawSchemes.length, label: t("nav.schemes") },
    { n: rawServices.length, label: t("nav.services") },
    { n: rawLibraryDocs.length, label: t("nav.library") },
  ];

  return (
    <div className="page-container">
      {/* Hero — Runway-style 7-5 split */}
      <section className="flex flex-col gap-10 pb-12 md:pb-16 lg:flex-row lg:items-center lg:gap-12">
        <Reveal trigger="load" className="flex max-w-2xl flex-col items-start">
          <p className="eyebrow">{t("landing.badge")}</p>
          <h1 className="mt-6 text-[36px] font-medium leading-[1.0] tracking-[-0.04em] text-[var(--ink)] md:text-[72px]"
              style={{ fontFamily: "var(--font-display)" }}>
            {t("landing.tagline").split("—")[0].trim()}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--body)]">
            {t("landing.f1text")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/chat">
              <Button size="lg">{t("landing.ctaChat")} <IconChevronRight className="w-4 h-4" /></Button>
            </Link>
            <Link href="/schemes">
              <Button size="lg" variant="secondary">{t("landing.ctaSchemes")}</Button>
            </Link>
          </div>
          <p className="mt-5 text-[13px] font-medium text-[var(--muted)]">{t("landing.trustText")}</p>
        </Reveal>

        {/* Chat UI mockup — static visual */}
        <Reveal trigger="load" delay={0.1} className="lg:flex-1">
          <div className="rounded-[var(--radius-xl)] bg-[var(--surface-card)] p-6">
            <div className="rounded-[var(--radius-lg)] bg-[var(--canvas)] border border-[var(--hairline)] p-5">
              {/* Mock user message */}
              <div className="flex justify-end mb-4">
                <div className="max-w-[80%] rounded-[var(--radius-lg)] bg-[var(--cream)] px-4 py-3 text-[14px] text-[var(--ink)]">
                  What crop insurance schemes are available?
                </div>
              </div>
              {/* Mock assistant message */}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-[var(--radius-lg)] bg-[var(--primary)] px-4 py-3 text-[14px] text-[var(--on-primary)]">
                  <p>PMFBY provides crop insurance for farmers. Key benefits include...</p>
                  <div className="mt-2 flex gap-2">
                    <span className="inline-flex items-center rounded-full bg-[var(--on-primary)]/20 px-2 py-0.5 text-[11px] font-medium text-[var(--on-primary)]">
                      PMFBY Guidelines
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[var(--on-primary)]/20 px-2 py-0.5 text-[11px] font-medium text-[var(--on-primary)]">
                      State Agriculture Dept
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Stats — soft surface band */}
      <Reveal className="rounded-[var(--radius-xl)] bg-[var(--surface-soft)] px-4 py-10 md:px-6 md:py-12">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[30px] font-medium leading-tight tracking-tight text-[var(--ink)] md:text-[40px]"
                 style={{ fontFamily: "var(--font-display)" }}>
                {s.n}
              </p>
              <p className="mt-1 text-[14px] text-[var(--muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Saturated feature cards */}
      <section className="mt-24">
        <Reveal>
          <p className="eyebrow">Features</p>
          <h2 className="mt-3 text-[30px] font-medium tracking-tight text-[var(--ink)] md:text-[40px]"
              style={{ fontFamily: "var(--font-display)" }}>
            Everything you need
          </h2>
        </Reveal>
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`rounded-[var(--radius-xl)] p-8 ${
                f.color === "brand-pink" ? "bg-[var(--brand-pink)] text-[var(--brand-pink-text)]" :
                f.color === "brand-teal" ? "bg-[var(--brand-teal)] text-[var(--brand-teal-text)]" :
                "bg-[var(--brand-lavender)] text-[var(--brand-lavender-text)]"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                {f.icon}
              </div>
              <h3 className="mt-4 text-[18px] font-semibold">{t(f.title)}</h3>
              <p className="mt-2 text-[14px] leading-relaxed opacity-90">{t(f.text)}</p>
            </div>
          ))}
        </Stagger>
      </section>

      {/* How it works */}
      <section className="mt-24">
        <Reveal>
          <h2 className="text-[30px] font-medium tracking-tight text-[var(--ink)] md:text-[40px]"
              style={{ fontFamily: "var(--font-display)" }}>
            {t("landing.howTitle")}
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-8 md:grid-cols-3 md:gap-12">
          {HOW.map((h, i) => (
            <div key={h.title} className="relative">
              <span className="text-[56px] font-medium text-[var(--hairline)]" style={{ fontFamily: "var(--font-display)" }}
                    aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-medium text-[var(--ink)]">{t(h.title)}</h3>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[var(--body)]">{t(h.text)}</p>
            </div>
          ))}
        </Stagger>
      </section>

      {/* CTA band */}
      <Reveal className="mt-24 rounded-[var(--radius-xl)] bg-[var(--surface-soft)] px-4 py-16 text-center md:px-6 md:py-20">
        <p className="eyebrow">{t("landing.badge")}</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-[30px] font-medium leading-tight tracking-tight text-[var(--ink)] md:text-[40px]"
            style={{ fontFamily: "var(--font-display)" }}>
          {t("landing.ctaChat")}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/chat">
            <Button size="lg">{t("landing.ctaChat")}</Button>
          </Link>
          <Link href="/grievance">
            <Button size="lg" variant="secondary">{t("nav.grievance")}</Button>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
