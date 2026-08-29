import { productDefinitions } from "@/data/products";
import { getInventory } from "@/lib/inventory";
import type { Product } from "@/types/product";

/**
 * Los metadatos visuales viven en el sitio; todas las variantes publicadas
 * (talla, precio y existencias) deben existir en la fuente de inventario.
 */
export async function getCatalog(): Promise<Product[]> {
  const {
    products: odoo,
    updatedAt: inventoryUpdatedAt,
    stale: inventoryStale,
  } = await getInventory();
  const byName = new Map(odoo.map((item) => [item.odooName, item]));

  return productDefinitions.flatMap((definition) => {
    const match = byName.get(definition.odooName);
    if (!match?.sizes.length) return [];

    return [
      {
        ...definition,
        inventoryUpdatedAt,
        inventoryStale,
        variants: match.sizes.map(({ odooId, size, price, stock }) => ({
          odooId,
          size,
          price,
          stock,
        })),
      },
    ];
  });
}
