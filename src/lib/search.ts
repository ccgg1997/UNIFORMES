import { schoolName } from "@/data/products";
import type { ProductDefinition } from "@/types/product";

/** Nadie escribe la tilde en el celular: "pantalon" y "Pantalón" son lo mismo. */
export function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * El cliente busca con la palabra que conoce ("camiseta blanca", "pantalon
 * azul") o con el colegio, no con la palabra que usa la tienda. Los alias son
 * el puente: viven solo en los datos y no se renderizan nunca.
 *
 * Se tipa contra ProductDefinition, no contra Product, para que también sirva
 * desde código de servidor que solo tiene las fichas.
 */
export function matchesQuery(product: ProductDefinition, query: string) {
  const needle = fold(query);
  if (!needle) return true;
  return [
    product.name,
    product.odooName,
    schoolName(product.school),
    ...(product.searchAliases ?? []),
  ].some((term) => fold(term).includes(needle));
}
