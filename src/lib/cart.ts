import { schools } from "@/data/products";
import {
  CART_SCHEMA,
  type Cart,
  type CartLine,
  type CartLineStatus,
  type StoredCart,
  type StoredCartLine,
} from "@/types/cart";
import type { Product, ProductVariant, SchoolId } from "@/types/product";

/**
 * Este módulo viaja al navegador. NO puede importar `@/lib/catalog` ni
 * `@/lib/inventory`: arrastrarían `next/cache` y los 12 KB de
 * `inventory.json` al bundle del cliente.
 */

/** Clave fija: la versión va DENTRO del JSON para no dejar claves huérfanas. */
export const CART_STORAGE_KEY = "mdm.carrito";
/** Un carrito de hace más de una semana está abandonado: se descarta al leer. */
export const CART_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const CART_MAX_QUANTITY = 99;

/** Referencia estable: es el `getServerSnapshot` y no debe mutarse jamás. */
export const EMPTY_CART: StoredCart = Object.freeze({
  v: CART_SCHEMA,
  updatedAt: 0,
  lines: [] as StoredCartLine[],
});

/** "1 prenda" / "3 prendas": el conteo se ve y se lee en voz alta. */
export function prendas(count: number) {
  return `${count} ${count === 1 ? "prenda" : "prendas"}`;
}

/** Odoo devuelve existencias negativas (hay un -1 en ED. FISICA 16): piso en 0. */
export function availableStock(variant: ProductVariant) {
  return Math.max(0, Math.floor(variant.stock));
}

/** El mismo tope para el drawer y para el carrito, en un solo sitio. */
export function maxQuantityFor(variant: ProductVariant) {
  return Math.max(1, Math.min(CART_MAX_QUANTITY, availableStock(variant)));
}

export type VariantHit = { product: Product; variant: ProductVariant };

/**
 * `odooId` es único por variante en Odoo, así que sirve de clave de línea y
 * sobrevive a que renombremos la prenda en el sitio — que es justo lo que se
 * acaba de corregir ("Pantalón Azul" -> la sudadera Comfandi real).
 */
export function indexVariants(products: Product[]) {
  const index = new Map<number, VariantHit>();
  for (const product of products) {
    for (const variant of product.variants) {
      if (!index.has(variant.odooId)) {
        index.set(variant.odooId, { product, variant });
      }
    }
  }
  return index;
}

export function createStoredLine(
  product: Product,
  variant: ProductVariant,
  quantity: number,
): StoredCartLine {
  return {
    odooId: variant.odooId,
    quantity: Math.max(
      1,
      Math.min(maxQuantityFor(variant), Math.floor(quantity)),
    ),
    addedAt: Date.now(),
    lastKnownProductId: product.id,
    lastKnownName: product.name,
    lastKnownSize: variant.size,
    lastKnownSchool: product.school,
    lastKnownPrice: variant.price,
  };
}

/**
 * Regla de reconciliación. El precio y el stock cambian a diario (el cron
 * refresca el inventario), así que NADA de lo guardado se usa para cotizar:
 * todo sale del `ProductVariant` que acaba de llegar de Odoo.
 */
export function reconcileCart(
  stored: StoredCart,
  index: Map<number, VariantHit>,
): Cart {
  const lines = stored.lines.map<CartLine>((line) => {
    const hit = index.get(line.odooId);

    // La prenda ya no está publicada. Nunca se borra sola: el cliente llegaría
    // al chat creyendo que pidió 3 prendas cuando solo se enviaron 2.
    if (!hit) {
      return {
        key: String(line.odooId),
        stored: line,
        product: null,
        variant: null,
        quantity: line.quantity,
        unitPrice: null,
        subtotal: null,
        status: "no-disponible",
        priceChanged: false,
      };
    }

    const { product, variant } = hit;
    const soldOut = availableStock(variant) <= 0;
    // El recorte es de solo lectura: lo guardado es la intención del cliente y
    // vuelve a valer sola si mañana entra mercancía.
    const quantity = soldOut
      ? line.quantity
      : Math.min(line.quantity, maxQuantityFor(variant));
    const status: CartLineStatus = soldOut
      ? "agotada"
      : quantity < line.quantity
        ? "ajustada"
        : "ok";

    return {
      key: String(line.odooId),
      stored: line,
      product,
      variant,
      quantity,
      unitPrice: variant.price,
      subtotal: variant.price * quantity,
      status,
      priceChanged: line.lastKnownPrice !== variant.price,
    };
  });

  return {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    total: lines.reduce((sum, line) => sum + (line.subtotal ?? 0), 0),
    hasIssues: lines.some((line) => line.status !== "ok" || line.priceChanged),
  };
}

function isSchoolId(value: unknown): value is SchoolId {
  return schools.some((school) => school.id === value);
}

function isStoredLine(value: unknown): value is StoredCartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.odooId === "number" &&
    Number.isInteger(line.odooId) &&
    line.odooId > 0 &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity >= 1 &&
    line.quantity <= CART_MAX_QUANTITY &&
    typeof line.addedAt === "number" &&
    Number.isFinite(line.addedAt) &&
    typeof line.lastKnownProductId === "string" &&
    typeof line.lastKnownName === "string" &&
    typeof line.lastKnownSize === "string" &&
    isSchoolId(line.lastKnownSchool) &&
    typeof line.lastKnownPrice === "number" &&
    Number.isFinite(line.lastKnownPrice)
  );
}

/**
 * Tolerante por línea, estricta por carrito: JSON roto, esquema viejo o
 * carrito vencido se descartan enteros; una línea corrupta suelta solo se
 * salta. Devuelve EMPTY_CART (misma referencia) cuando no hay nada válido.
 */
export function parseStoredCart(raw: string | null): StoredCart {
  if (!raw) return EMPTY_CART;

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return EMPTY_CART;
  }
  if (typeof data !== "object" || data === null) return EMPTY_CART;

  const cart = data as Record<string, unknown>;
  if (cart.v !== CART_SCHEMA) return EMPTY_CART;
  if (typeof cart.updatedAt !== "number" || !Number.isFinite(cart.updatedAt)) {
    return EMPTY_CART;
  }
  if (Date.now() - cart.updatedAt > CART_MAX_AGE_MS) return EMPTY_CART;
  if (!Array.isArray(cart.lines)) return EMPTY_CART;

  const seen = new Set<number>();
  const lines: StoredCartLine[] = [];
  for (const value of cart.lines) {
    if (!isStoredLine(value) || seen.has(value.odooId)) continue;
    seen.add(value.odooId);
    lines.push(value);
  }

  return lines.length
    ? { v: CART_SCHEMA, updatedAt: cart.updatedAt, lines }
    : EMPTY_CART;
}
