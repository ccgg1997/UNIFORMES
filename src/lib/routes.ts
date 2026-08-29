import type { SchoolId } from "@/types/product";

export const PRODUCTS_PATH = "/productos";

/** Query key that preselects a school on the products page. */
export const SCHOOL_PARAM = "colegio";

/**
 * Productos is its own route now: the header, the hero and the school cards
 * all navigate here instead of scrolling to a section.
 */
export function productsHref(school?: SchoolId) {
  return school ? `${PRODUCTS_PATH}?${SCHOOL_PARAM}=${school}` : PRODUCTS_PATH;
}
