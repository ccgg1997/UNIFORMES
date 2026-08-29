"use client";

import Image from "next/image";

import { SchoolDoodles } from "@/components/school-doodles";
import { SchoolQuickSelector } from "@/components/school-quick-selector";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { scrollToSection } from "@/lib/scroll";

const BENEFITS = [
  {
    lines: ["Atención", "personalizada"],
    icon: (
      <>
        <circle cx="12" cy="7.5" r="3.75" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
  },
  {
    lines: ["Sin pagos", "en línea"],
    icon: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
        <path d="M2.5 10h19M6 14.5h3.5" />
      </>
    ),
  },
  {
    lines: ["Consulta de", "talla directa"],
    icon: (
      <>
        <rect x="2" y="8.5" width="20" height="7" rx="3.5" />
        <path d="M7 8.5v3M12 8.5v4M17 8.5v3" />
      </>
    ),
  },
];

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden scroll-mt-24">
      {/* page-edge decoration: sits behind everything, cropped by the section */}
      <SchoolDoodles className="pointer-events-none absolute right-0 top-10 hidden h-[560px] w-auto lg:block" />

      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-10 px-4 pt-10 pb-4 sm:px-6 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-8 lg:px-8 lg:pt-12 lg:pb-6">
        <div className="relative z-10 max-w-xl">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted sm:text-xs">
            <span className="size-1.5 rounded-full bg-gold" />
            Catálogo de uniformes escolares
          </p>

          <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[3.15rem]">
            Uniformes para cada{" "}
            <span className="text-primary lg:block">etapa escolar.</span>
          </h1>

          <span className="mt-7 block h-[3px] w-16 rounded-full bg-gold" />

          <p className="mt-6 max-w-[22rem] text-[15px] leading-[1.75] text-muted sm:text-base">
            Calidad, comodidad y presentación para acompañarlos todos los días.
            Encuentra el uniforme de tu colegio en pocos pasos.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("prendas")}
              className="btn btn-primary group h-12 px-6"
            >
              Ver prendas
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <WhatsAppButton className="btn btn-secondary h-12 px-6">
              Consultar por WhatsApp
            </WhatsAppButton>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-5">
            {BENEFITS.map((benefit) => (
              <li key={benefit.lines[0]} className="flex items-center gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-6 shrink-0 text-primary"
                >
                  {benefit.icon}
                </svg>
                <span className="text-[13px] font-medium leading-[1.35] text-ink">
                  {benefit.lines[0]}
                  <br />
                  {benefit.lines[1]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <HeroArtwork />
      </div>

      <SchoolQuickSelector />
    </section>
  );
}

function HeroArtwork() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] pt-12 sm:max-w-[500px] lg:pt-14">
      {/* soft stage: one almost-white circle and a single thin gold arc */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[16%] aspect-square w-[92%] -translate-x-1/2 rounded-full bg-surface-blue"
      />
      <svg
        viewBox="0 0 400 420"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-4 h-full w-[112%] text-gold/50"
      >
        <path
          d="M336 8C382 104 386 268 292 386"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative aspect-[1047/1250] w-full">
        <Image
          src="/images/hero/estudiantes.webp"
          alt="Estudiantes con uniformes de Colegios Arquidiocesanos y Comfandi"
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 500px"
          className="object-contain object-bottom"
        />
      </div>

      <SchoolTag
        className="left-0 top-0 bg-primary"
        tailClassName="left-7 bg-primary"
        name="Arquidiocesanos"
        tagline="Así luce puesto"
      />
      <SchoolTag
        className="right-0 top-0 bg-cyan"
        tailClassName="right-9 bg-cyan"
        name="Comfandi"
        tagline="Comodidad para cada día"
      />
    </div>
  );
}

function SchoolTag({
  className,
  tailClassName,
  name,
  tagline,
}: {
  className: string;
  tailClassName: string;
  name: string;
  tagline: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute z-10 rounded-xl px-3.5 py-2 text-white shadow-[0_10px_24px_rgba(7,28,58,0.14)] sm:px-4 sm:py-2.5 ${className}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.04em] sm:text-[13px]">
        {name}
      </p>
      <p className="text-[10px] leading-tight text-white/90 sm:text-xs">
        {tagline}
      </p>
      <span
        className={`absolute -bottom-1.5 size-3 rotate-45 rounded-[2px] ${tailClassName}`}
      />
    </div>
  );
}
