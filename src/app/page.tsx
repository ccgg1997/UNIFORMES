import { Hero } from "@/components/hero";
import { ProductsSection } from "@/components/products-section";
import { getCatalog } from "@/lib/catalog";

/** Inicio: hero, atajos de colegio y el carrusel de prendas. La grilla completa vive en /productos. */
export default async function Home() {
  const products = await getCatalog();

  return (
    <>
      <Hero />
      <ProductsSection products={products} />
    </>
  );
}
