import { Hero } from "@/components/hero";
import { ProductsSection } from "@/components/products-section";

/**
 * The whole catalogue is one route: Inicio (hero + school shortcuts) and
 * Prendas (filters + grid + drawer). Nothing else.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ProductsSection />
    </>
  );
}
