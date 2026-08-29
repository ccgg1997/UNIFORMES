"use client";

import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { schools } from "@/lib/catalog";
import type { Product } from "@/types/catalog";

type Filters = {
  school: string;
  uniformType: string;
  category: string;
  size: string;
};

const emptyFilters: Filters = {
  school: "",
  uniformType: "",
  category: "",
  size: "",
};

type CatalogClientProps = {
  products: Product[];
  initialSchool?: string;
  initialUniform?: string;
};

function FilterFields({
  filters,
  setFilters,
  products,
}: {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  products: Product[];
}) {
  const sizes = Array.from(new Set(products.flatMap((product) => product.sizes)));

  function update(key: keyof Filters, value: string) {
    setFilters({ ...filters, [key]: value });
  }

  const selectClass =
    "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <>
      <label className="grid gap-1.5 text-xs font-bold text-muted-foreground">
        Colegio
        <select
          value={filters.school}
          onChange={(event) => update("school", event.target.value)}
          className={selectClass}
        >
          <option value="">Todos</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.shortName}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-xs font-bold text-muted-foreground">
        Uniforme
        <select
          value={filters.uniformType}
          onChange={(event) => update("uniformType", event.target.value)}
          className={selectClass}
        >
          <option value="">Todos</option>
          <option value="Diario">Diario</option>
          <option value="Educación física">Educación física</option>
          <option value="Completo">Completo</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-xs font-bold text-muted-foreground">
        Categoría
        <select
          value={filters.category}
          onChange={(event) => update("category", event.target.value)}
          className={selectClass}
        >
          <option value="">Todas</option>
          <option value="Niña">Niña</option>
          <option value="Niño">Niño</option>
          <option value="Unisex">Unisex</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-xs font-bold text-muted-foreground">
        Talla
        <select
          value={filters.size}
          onChange={(event) => update("size", event.target.value)}
          className={selectClass}
        >
          <option value="">Todas</option>
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

export function CatalogClient({
  products,
  initialSchool = "",
  initialUniform = "",
}: CatalogClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    school: initialSchool,
    uniformType: initialUniform,
  });

  useEffect(() => {
    if (!sheetOpen) return;

    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSheetOpen(false);
        return;
      }

      if (event.key !== "Tab" || !sheetRef.current) return;

      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), select:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) {
        event.preventDefault();
        sheetRef.current.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    queueMicrotask(() => {
      sheetRef.current?.querySelector<HTMLElement>("[data-sheet-close]")?.focus();
    });

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [sheetOpen]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");

    return products.filter((product) => {
      const school = schools.find((item) => item.id === product.schoolId);
      const haystack = `${product.name} ${product.description} ${school?.name ?? ""}`.toLocaleLowerCase("es");

      return (
        (!normalizedQuery || haystack.includes(normalizedQuery)) &&
        (!filters.school || product.schoolId === filters.school) &&
        (!filters.uniformType || product.uniformType === filters.uniformType) &&
        (!filters.category || product.category === filters.category) &&
        (!filters.size || product.sizes.includes(filters.size))
      );
    });
  }, [filters, products, query]);

  const activeFilters = Object.values(filters).filter(Boolean).length;

  function clearFilters() {
    setFilters(emptyFilters);
    setQuery("");
    router.replace("/uniformes", { scroll: false });
  }

  return (
    <div>
      <div className="sticky top-20 z-30 border-y border-border bg-background/95 py-3 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <label className="relative flex-1">
            <span className="sr-only">¿Qué uniforme estás buscando?</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="¿Qué uniforme estás buscando?"
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSheetOpen(true)}
            className="lg:hidden"
            aria-haspopup="dialog"
          >
            <Filter className="size-4" />
            Filtrar
            {activeFilters ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeFilters}
              </span>
            ) : null}
          </Button>
        </div>

        <div className="mx-auto mt-3 hidden w-full max-w-7xl grid-cols-4 gap-3 px-8 lg:grid">
          <FilterFields filters={filters} setFilters={setFilters} products={products} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">
            <span className="font-extrabold text-foreground">{filteredProducts.length}</span>{" "}
            {filteredProducts.length === 1 ? "uniforme encontrado" : "uniformes encontrados"}
          </p>
          {activeFilters || query ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {filteredProducts.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-muted/50 px-6 py-16 text-center">
            <SlidersHorizontal className="mx-auto size-8 text-primary" />
            <h2 className="mt-4 text-xl font-extrabold text-foreground">
              No encontramos esa combinación
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Prueba con otro colegio, talla o tipo de uniforme. También podemos ayudarte directamente por WhatsApp.
            </p>
            <Button type="button" onClick={clearFilters} className="mt-6">
              Ver todos los uniformes
            </Button>
          </div>
        )}
      </div>

      {sheetOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-navy/65 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
            aria-label="Cerrar filtros"
          />
          <section
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-background p-5 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                  Catálogo
                </p>
                <h2 id="filter-title" className="mt-1 text-2xl font-extrabold text-foreground">
                  Filtrar uniformes
                </h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSheetOpen(false)}
                aria-label="Cerrar filtros"
                data-sheet-close
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="mt-6 grid gap-4">
              <FilterFields filters={filters} setFilters={setFilters} products={products} />
            </div>
            <div className="sticky bottom-0 mt-6 grid grid-cols-2 gap-3 bg-background pb-[max(0px,env(safe-area-inset-bottom))] pt-3">
              <Button type="button" variant="secondary" onClick={clearFilters}>
                Limpiar
              </Button>
              <Button type="button" onClick={() => setSheetOpen(false)}>
                Ver {filteredProducts.length} resultados
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
