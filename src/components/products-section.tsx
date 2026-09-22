"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { ProductDrawer } from "@/components/product-drawer";
import { SectionHeading } from "@/components/section-heading";
import { schools } from "@/data/products";
import { PRODUCTS_PATH } from "@/lib/routes";
import { matchesQuery } from "@/lib/search";
import type { Product, SchoolId } from "@/types/product";

type Filter = SchoolId | "todos";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...schools.map((school) => ({ id: school.id as Filter, label: school.name })),
];

export function ProductsSection({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const matches = useMemo(
    () =>
      products.filter(
        (product) =>
          (filter === "todos" || product.school === filter) &&
          matchesQuery(product, query),
      ),
    [products, filter, query],
  );

  // Arrows only make sense while there is something left to reveal.
  const syncArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 8);
    setCanNext(track.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncArrows();
    const observer = new ResizeObserver(syncArrows);
    observer.observe(track);
    return () => observer.disconnect();
  }, [syncArrows]);

  // A new filter or search starts the row over at the first prenda.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    syncArrows();
  }, [filter, query, syncArrows]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <section id="prendas" className="scroll-mt-24 bg-surface-blue py-14 lg:py-18">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div>
            <SectionHeading align="left">Encuentra tu uniforme</SectionHeading>
            <p className="mt-3 text-[13px] text-muted sm:text-sm">
              Selecciona tu colegio y encuentra las prendas disponibles.
            </p>
            <Link
              href={PRODUCTS_PATH}
              className="group mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary sm:text-sm"
            >
              Ver todas las prendas
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
            </Link>
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

        {matches.length ? (
          <div className="relative mt-8">
            <div
              ref={trackRef}
              onScroll={syncArrows}
              role="group"
              aria-label="Prendas disponibles"
              className="no-scrollbar grid snap-x snap-mandatory grid-flow-col auto-cols-[44%] gap-3 overflow-x-auto scroll-smooth pb-1 sm:auto-cols-[30%] sm:gap-4 md:auto-cols-[23%] xl:auto-cols-[18.4%]"
            >
              {matches.map((product) => (
                <div key={product.id} className="h-full snap-start">
                  <ProductCard product={product} onSelect={setSelected} />
                </div>
              ))}
            </div>

            <CarouselArrow
              direction="prev"
              disabled={!canPrev}
              onClick={() => scrollByPage(-1)}
            />
            <CarouselArrow
              direction="next"
              disabled={!canNext}
              onClick={() => scrollByPage(1)}
            />
          </div>
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

function CarouselArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isNext = direction === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isNext ? "Ver más prendas" : "Ver prendas anteriores"}
      className={`absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-card-border bg-background text-primary shadow-[0_6px_18px_rgba(7,28,58,0.12)] transition-opacity hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-0 ${
        isNext ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-4"
      >
        <path d={isNext ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} />
      </svg>
    </button>
  );
}
