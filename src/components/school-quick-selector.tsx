import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { schools } from "@/data/products";
import { productsHref } from "@/lib/routes";

/**
 * Still part of Inicio: two shortcuts that open /productos with the school
 * filter already applied.
 */
export function SchoolQuickSelector() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
      <SectionHeading>Encuentra tu colegio</SectionHeading>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {schools.map((school) => (
          <Link
            key={school.id}
            href={productsHref(school.id)}
            className="group grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-center gap-4 overflow-hidden rounded-2xl bg-surface py-5 text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="relative block h-44 w-full sm:h-48">
              <Image
                src={school.image}
                alt={`Uniformes de ${school.name}`}
                fill
                sizes="(max-width: 640px) 40vw, 220px"
                className="object-contain object-bottom"
              />
            </span>

            <span className="block self-center py-6 pr-5">
              <span className="block text-[15px] font-bold uppercase tracking-[0.02em] text-primary sm:text-base">
                {school.name}
              </span>
              <span className="mt-1.5 block text-[13px] text-muted sm:text-sm">
                {school.tagline}
              </span>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary sm:text-sm">
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
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
