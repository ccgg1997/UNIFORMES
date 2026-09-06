import type { Metadata } from "next";

import { ProductsCatalog, type CatalogFilter } from "@/components/products-catalog";
import { schools } from "@/data/products";
import { getCatalog } from "@/lib/catalog";
import { PRODUCTS_PATH, SCHOOL_PARAM } from "@/lib/routes";

export const metadata: Metadata = {
  // Distinto del título del inicio y del H1 de esta página ("Encuentra tu uniforme").
  title: "Catálogo de uniformes Arquidiocesanos y Comfandi",
  description:
    "Catálogo completo de prendas del uniforme diario y de educación física para Colegios Arquidiocesanos y Comfandi en Cali. Filtra por colegio, revisa tallas y precios, y pide por WhatsApp.",
  // Las variantes ?colegio= canonicalizan aquí para no duplicar contenido.
  alternates: { canonical: PRODUCTS_PATH },
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
