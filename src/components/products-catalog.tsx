"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { ProductDrawer } from "@/components/product-drawer";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { schools } from "@/data/products";
import type { Product, SchoolId } from "@/types/product";

export type CatalogFilter = SchoolId | "todos";

const FILTERS: { id: CatalogFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...schools.map((school) => ({ id: school.id as CatalogFilter, label: school.name })),
];

/**
 * The whole grid of prendas. Filters and search stay client-side state; the
 * URL only seeds the first filter (see productsHref).
 */
export function ProductsCatalog({
  products,
  initialFilter = "todos",
}: {
  /** Ya vienen con el precio resuelto contra Odoo (ver getCatalog). */
  products: Product[];
  initialFilter?: CatalogFilter;
}) {
  const [filter, setFilter] = useState<CatalogFilter>(initialFilter);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const bySchool = filter === "todos" || product.school === filter;
      const byName = !needle || product.name.toLowerCase().includes(needle);
      return bySchool && byName;
    });
  }, [products, filter, query]);

  return (
    <section className="min-h-[70svh] bg-surface-blue py-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div>
            {/* único H1 de /productos; el meta-título dice "Catálogo de uniformes…" */}
            <SectionHeading as="h1" align="left">
              Encuentra tu uniforme
            </SectionHeading>
            <p className="mt-3 text-[13px] text-muted sm:text-sm">
              Selecciona tu colegio y encuentra las prendas del uniforme diario
              y de educación física disponibles.
            </p>
            {/* CTA justo después del primer párrafo */}
            <WhatsAppButton className="btn btn-secondary mt-4 h-10 px-4 text-[13px]">
              ¿Dudas con la talla? Escríbenos
            </WhatsAppButton>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0 lg:pt-1">
            {/* three options only: a scrollable row beats a modal on mobile */}
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
              {FILTERS.map((option) => {
                const active = filter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFilter(option.id)}
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
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar prenda..."
                aria-label="Buscar prenda"
                className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-[13px] text-ink outline-none transition-colors placeholder:text-muted focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        <p aria-live="polite" className="mt-6 text-[13px] text-muted">
          {matches.length === 1
            ? "1 prenda disponible"
            : `${matches.length} prendas disponibles`}
        </p>

        {matches.length ? (
          <ul
            aria-label="Prendas disponibles"
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
          >
            {matches.map((product) => (
              <li key={product.id} className="h-full">
                <ProductCard product={product} onSelect={setSelected} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-center text-sm text-muted">
            No encontramos prendas con esa búsqueda.
          </p>
        )}
      </div>

      <ProductDrawer
        key={selected?.id ?? "cerrado"}
        product={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
