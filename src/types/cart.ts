import type { Product, ProductVariant, SchoolId } from "@/types/product";

/** Versión del esquema guardado. Subirla descarta los carritos anteriores. */
export const CART_SCHEMA = 2;

/**
 * Lo ÚNICO que se persiste.
 *
 * Nombre, talla, precio e imagen NO se guardan para cotizar: se vuelven a leer
 * del catálogo vivo en cada render (ver `reconcileCart`). Así un carrito de
 * ayer nunca manda a WhatsApp un precio viejo ni el nombre que la tienda ya
 * corrigió. Los `lastKnown*` son solo el último rastro conocido y se muestran
 * únicamente cuando la línea ya no existe en el catálogo.
 */
export type StoredCartLine = {
  /** Variante exacta en Odoo (producto + talla). Es la clave de la línea. */
  odooId: number;
  quantity: number;
  addedAt: number;
  /** id del ProductDefinition; solo para rotular una línea huérfana. */
  lastKnownProductId: string;
  lastKnownName: string;
  lastKnownSize: string;
  lastKnownSchool: SchoolId;
  /** Solo sirve para avisar "el precio cambió". NUNCA se cotiza con él. */
  lastKnownPrice: number;
};

export type StoredCart = {
  v: number;
  updatedAt: number;
  lines: StoredCartLine[];
};

/** El catalogo no opina sobre existencias: solo importa si la prenda sigue publicada. */
export type CartLineStatus = "ok" | "no-disponible";

/** Línea ya reconciliada contra el catálogo: esto es lo que se pinta y cotiza. */
export type CartLine = {
  key: string;
  stored: StoredCartLine;
  /** null cuando la prenda ya no está en el catálogo. */
  product: Product | null;
  variant: ProductVariant | null;
  /** Recortada al stock vivo; lo guardado sigue siendo la intención original. */
  quantity: number;
  /** Siempre del catálogo vivo. null solo si la prenda desapareció. */
  unitPrice: number | null;
  subtotal: number | null;
  status: CartLineStatus;
  priceChanged: boolean;
};

export type Cart = {
  lines: CartLine[];
  /** Unidades totales: es lo que muestra el badge. */
  count: number;
  total: number;
  /** true si alguna línea se ajustó, se agotó, cambió de precio o desapareció. */
  hasIssues: boolean;
};

/**
 * Línea plana que consume el constructor del mensaje de WhatsApp. Se arma
 * SIEMPRE con datos vivos (ver `orderLinesFromCart`), nunca con lo guardado.
 */
export type OrderLine = {
  productId: string;
  odooId: number;
  name: string;
  odooName: string;
  school: SchoolId;
  size: string;
  price: number;
  quantity: number;
};

/** Procedencia de los precios, para fechar el mensaje. */
export type OrderContext = {
  inventoryUpdatedAt: string;
  inventoryStale: boolean;
};
