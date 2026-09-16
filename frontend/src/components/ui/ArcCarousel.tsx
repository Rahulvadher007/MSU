"use client";

import { useState, useEffect, useCallback } from "react";

interface ArcCarouselItem {
  num: string;
  title: string;
  text: string;
}

export function ArcCarousel({ items }: { items: ArcCarouselItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

  const getCardStyle = (i: number) => {
    const diff = (i - activeIndex + items.length) % items.length;

    let translateX: number;
    let rotateY: number;
    let scale: number;
    let opacity: number;
    let zIndex: number;

    if (diff === 0) {
      translateX = 0;
      rotateY = 0;
      scale = 1;
      opacity = 1;
      zIndex = 5;
    } else if (diff === 1) {
      translateX = isMobile ? 120 : 200;
      rotateY = -8;
      scale = 0.92;
      opacity = 0.8;
      zIndex = 4;
    } else if (diff === 2) {
      translateX = isMobile ? 200 : 340;
      rotateY = -12;
      scale = 0.84;
      opacity = 0.6;
      zIndex = 3;
    } else if (diff === items.length - 1) {
      translateX = isMobile ? -120 : -200;
      rotateY = 8;
      scale = 0.92;
      opacity = 0.8;
      zIndex = 4;
    } else if (diff === items.length - 2) {
      translateX = isMobile ? -200 : -340;
      rotateY = 12;
      scale = 0.84;
      opacity = 0.6;
      zIndex = 3;
    } else {
      translateX = diff > items.length / 2 ? (isMobile ? -280 : -450) : (isMobile ? 280 : 450);
      rotateY = diff > items.length / 2 ? 15 : -15;
      scale = 0.78;
      opacity = 0;
      zIndex = 0;
    }

    const cardWidth = isMobile ? 220 : 320;
    const cardHeight = isMobile ? 220 : 320;
    const padding = isMobile ? "p-5" : "p-8";
    const fontSize = isMobile ? "text-[16px]" : "text-[22px]";
    const descMaxWidth = isMobile ? "max-w-[170px]" : "max-w-[250px]";

    return {
      cardWidth,
      cardHeight,
      padding,
      fontSize,
      descMaxWidth,
      transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      willChange: "transform, opacity" as const,
      background:
        diff === 0
          ? "linear-gradient(145deg, #dce8dc 0%, #c4d8c4 100%)"
          : "linear-gradient(145deg, #f0ebe0 0%, #e6e1d4 100%)",
      border: `1px solid ${diff === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)"}`,
      boxShadow:
        diff === 0
          ? "0 25px 50px rgba(0,0,0,0.1)"
          : "0 12px 30px rgba(0,0,0,0.04)",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  if (isMobile) {
    return (
      <div className="flex flex-col items-center">
        {/* Mobile: Simple stacked card layout */}
        <div className="w-full max-w-[300px]">
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={item.num}
                className={`rounded-[20px] p-5 mb-3 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-[#dce8dc] to-[#c4d8c4] border border-white/60 shadow-lg opacity-100"
                    : "bg-gradient-to-br from-[#f0ebe0] to-[#e6e1d4] border border-white/30 opacity-60"
                }`}
                onClick={() => setActiveIndex(i)}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5">
                  <span className="text-sm font-bold text-[#1a1a2e]/50" style={{ fontFamily: "var(--font-display)" }}>
                    {item.num}
                  </span>
                </div>
                <span className="block mt-3 text-[10px] font-semibold tracking-wider text-[#1a1a2e]/40 uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  Step {item.num}
                </span>
                <h3 className="mt-1 text-[16px] font-bold tracking-[-0.01em] text-[#1a1a2e]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[12px] leading-[1.5] text-[#1a1a2e]/60">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-8 bg-[#1a1a2e]" : "w-2 bg-[#1a1a2e]/20"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[1000px] h-[380px] flex items-center justify-center overflow-hidden">
        {items.map((item, i) => {
          const style = getCardStyle(i);
          return (
            <div
              key={item.num}
              className="absolute rounded-[28px] p-8 flex flex-col justify-between cursor-pointer"
              style={{
                width: `${style.cardWidth}px`,
                height: `${style.cardHeight}px`,
                transform: style.transform,
                opacity: style.opacity,
                zIndex: style.zIndex,
                willChange: style.willChange,
                background: style.background,
                border: style.border,
                boxShadow: style.boxShadow,
                transition: style.transition,
              }}
              onClick={() => setActiveIndex(i)}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5">
                <span className="text-lg font-bold text-[#1a1a2e]/50" style={{ fontFamily: "var(--font-display)" }}>
                  {item.num}
                </span>
              </div>
              <div>
                <span
                  className="block text-[12px] font-semibold tracking-wider text-[#1a1a2e]/40 uppercase"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Step {item.num}
                </span>
                <h3 className="mt-2 text-[22px] font-bold tracking-[-0.01em] text-[#1a1a2e]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[#1a1a2e]/60 max-w-[250px]">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center gap-4">
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-[#1a1a2e]" : "w-2 bg-[#1a1a2e]/20"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
