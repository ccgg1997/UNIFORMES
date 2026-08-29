import type { SchoolId } from "@/types/product";

export type SectionId = "inicio" | "prendas";

/** One page, two anchors: navigation is always a smooth scroll, never a route change. */
export function scrollToSection(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export const SCHOOL_FILTER_EVENT = "manantial:filtrar-colegio";

/**
 * The school cards live in the Inicio section but drive the filter inside
 * Prendas. A DOM event keeps both sides independent — no provider needed.
 */
export function selectSchoolAndScroll(school: SchoolId | "todos") {
  window.dispatchEvent(
    new CustomEvent<SchoolId | "todos">(SCHOOL_FILTER_EVENT, { detail: school }),
  );
  scrollToSection("prendas");
}
