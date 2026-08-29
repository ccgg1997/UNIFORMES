import { products } from "@/data/products";
import { getInventory } from "@/lib/inventory";
import type { Product } from "@/types/product";

/**
 * El catálogo del sitio manda sobre nombres, fotos y colegio; Odoo solo aporta
 * el precio. Una prenda sin odooName conserva el precio fijo de products.ts.
 */
export async function getCatalog(): Promise<Product[]> {
  const { products: odoo } = await getInventory();
  const byName = new Map(odoo.map((item) => [item.odooName, item]));

  return products.map((product) => {
    const match = product.odooName ? byName.get(product.odooName) : undefined;
    if (!match) return product;

    // El sitio publica tallas 6-16, y Odoo cobra distinto esa banda que S-XL:
    // el precio mostrado es el de las tallas que realmente aparecen.
    const propias = match.sizes.filter((size) =>
      product.sizes.includes(size.size),
    );
    const precios = (propias.length ? propias : match.sizes).map((s) => s.price);
    if (!precios.length) return product;

    return { ...product, price: Math.min(...precios) };
  });
}
