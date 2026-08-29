"use client";

import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { ProductDrawer } from "@/components/product-drawer";
import { SectionHeading } from "@/components/section-heading";
import { products, schools } from "@/data/products";
import { SCHOOL_FILTER_EVENT } from "@/lib/scroll";
import type { Product, SchoolId } from "@/types/product";

type Filter = SchoolId | "todos";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...schools.map((school) => ({ id: school.id as Filter, label: school.name })),
];

const INITIAL_COUNT = 5;

export function ProductsSection() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  // The school cards up in Inicio drive this filter.
  useEffect(() => {
    const onFilter = (event: Event) => {
      setFilter((event as CustomEvent<Filter>).detail);
      setQuery("");
      setExpanded(false);
    };
    window.addEventListener(SCHOOL_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(SCHOOL_FILTER_EVENT, onFilter);
  }, []);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const bySchool = filter === "todos" || product.school === filter;
      const byName = !needle || product.name.toLowerCase().includes(needle);
      return bySchool && byName;
    });
  }, [filter, query]);

  const visible = expanded ? matches : matches.slice(0, INITIAL_COUNT);
  const hasMore = matches.length > INITIAL_COUNT;

  return (
    <section id="prendas" className="scroll-mt-24 bg-surface-blue py-14 lg:py-18">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div>
            <SectionHeading align="left">Encuentra tu uniforme</SectionHeading>
            <p className="mt-3 text-[13px] text-muted sm:text-sm">
              Selecciona tu colegio y encuentra las prendas disponibles.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0 lg:pt-1">
            {/* three options only: a scrollable row beats a modal on mobile */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
              {FILTERS.map((option) => {
                const active = filter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setFilter(option.id);
                      setExpanded(false);
                    }}
                    aria-pressed={active}
                    className={`h-10 shrink-0 rounded-full border px-4 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-background text-primary hover:border-primary/40"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="relative sm:w-52">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5L21 21" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setExpanded(false);
                }}
                placeholder="Buscar prenda..."
                aria-label="Buscar prenda"
                className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-[13px] text-ink outline-none transition-colors placeholder:text-muted focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {visible.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelected}
              />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-muted">
            No encontramos prendas con esa búsqueda.
          </p>
        )}

        {hasMore && !expanded ? (
          <div className="mt-9 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="btn btn-primary h-11 px-6"
            >
              Ver más prendas
            </button>
          </div>
        ) : null}
      </div>

      <ProductDrawer
        key={selected?.id ?? "cerrado"}
        product={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
