import { FaqSection } from "@/components/faq-section";
import { Hero } from "@/components/hero";
import { InfoSection } from "@/components/info-section";
import { ProductsSection } from "@/components/products-section";
import { getCatalog } from "@/lib/catalog";

/**
 * Inicio: hero, atajos de colegio, carrusel de prendas, sección de intención
 * de búsqueda (resumen + prendas por colegio) y preguntas frecuentes.
 * La grilla completa vive en /productos.
 */
export default async function Home() {
  const products = await getCatalog();

  return (
    <>
      <Hero />
      <ProductsSection products={products} />
      <InfoSection />
      <FaqSection />
    </>
  );
}
