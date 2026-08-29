import type { Metadata } from "next";

import { ProductsCatalog, type CatalogFilter } from "@/components/products-catalog";
import { schools } from "@/data/products";
import { getCatalog } from "@/lib/catalog";
import { SCHOOL_PARAM } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Grilla completa de uniformes escolares para Colegios Arquidiocesanos y Comfandi. Elige una prenda y consulta talla y disponibilidad por WhatsApp.",
};

/** ?colegio=comfandi comes from the school cards in Inicio; anything else is "todos". */
function parseSchool(value: string | string[] | undefined): CatalogFilter {
  const id = Array.isArray(value) ? value[0] : value;
  return schools.some((school) => school.id === id)
    ? (id as CatalogFilter)
    : "todos";
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filter = parseSchool((await searchParams)[SCHOOL_PARAM]);
  const products = await getCatalog();

  // key: arriving with a different school must reset the grid, not keep the
  // filter the previous visit left in state.
  return <ProductsCatalog key={filter} products={products} initialFilter={filter} />;
}
