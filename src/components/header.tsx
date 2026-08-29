"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { WhatsAppButton } from "@/components/whatsapp-button";
import { scrollToSection, type SectionId } from "@/lib/scroll";

const NAV: { id: SectionId; label: string }[] = [
  { id: "inicio", label: "Inicio" },
  { id: "prendas", label: "Productos" },
];

export function Header() {
  const [active, setActive] = useState<SectionId>("inicio");

  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => node !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-[6px]">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:h-[86px] sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => scrollToSection("inicio")}
          className="flex shrink-0 items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-3"
          aria-label="Manantial de Moda, ir al inicio"
        >
          <Image
            src="/images/brand/isotipo.webp"
            alt=""
            width={256}
            height={300}
            priority
            className="h-10 w-auto sm:h-14"
          />
          <Image
            src="/images/brand/wordmark.webp"
            alt="Manantial de Moda, uniformes"
            width={688}
            height={200}
            priority
            className="h-8 w-auto sm:h-12"
          />
        </button>

        <nav
          className="ml-auto hidden items-center gap-8 md:flex"
          aria-label="Navegación principal"
        >
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              aria-current={active === item.id ? "true" : undefined}
              className={`relative py-1 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                active === item.id
                  ? "text-primary"
                  : "text-ink hover:text-primary"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary transition-opacity ${
                  active === item.id ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </nav>

        <WhatsAppButton className="btn btn-primary ml-auto h-10 px-4 text-[13px] md:ml-8 md:h-12 md:px-6 md:text-sm">
          <span className="hidden sm:inline">Consultar por WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </WhatsAppButton>
      </div>

      {/* Only two destinations exist, so mobile shows them inline instead of a menu. */}
      <nav
        className="border-t border-border md:hidden"
        aria-label="Navegación principal"
      >
        <div className="mx-auto flex w-full max-w-[1180px] items-center gap-6 px-4 sm:px-6">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              aria-current={active === item.id ? "true" : undefined}
              className={`relative py-3 text-sm font-semibold transition-colors ${
                active === item.id ? "text-primary" : "text-ink"
              }`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary transition-opacity ${
                  active === item.id ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
