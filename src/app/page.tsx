import { Hero } from "@/components/hero";
import { ProductsSection } from "@/components/products-section";

/** Inicio: hero, atajos de colegio y el carrusel de prendas. La grilla completa vive en /productos. */
export default function Home() {
  return (
    <>
      <Hero />
      <ProductsSection />
    </>
  );
}
