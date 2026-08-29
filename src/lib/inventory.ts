import { unstable_cache } from "next/cache";

import snapshot from "@/data/inventory.json";

/** Tag que invalida el cron de medianoche. */
export const INVENTORY_TAG = "inventario";

const TOOL = "verificar_inventario";
const UN_DIA = 86400;

/**
 * Productos que existen en Odoo pero no se publican: la guayabera delgada
 * (la gruesa si va), los logos sueltos y las medias.
 */
const EXCLUIDOS_EXACTOS = new Set(["GUAYABERA NIÑO NORMAL"]);

/**
 * Se compara la PRIMERA PALABRA del nombre, no una subcadena: así cae
 * "MEDIAS BLANCAS" pero se sigue publicando una "CAMISA MEDIA MANGA".
 */
const EXCLUIDOS_POR_PALABRA = new Set(["LOGO", "LOGOS", "MEDIA", "MEDIAS"]);

const excluido = (nombre: string) =>
  EXCLUIDOS_EXACTOS.has(nombre) ||
  EXCLUIDOS_POR_PALABRA.has(nombre.split(" ")[0].toUpperCase());

/**
 * n8n ya cortó una vez la consulta en 50 registros justos, y como Odoo entrega
 * en orden alfabético se perdía todo lo posterior a la G. Un total que caiga
 * EXACTO en un tope redondo es la firma de ese bug; 95 (el dato real) no lo es.
 */
const TOPES_SOSPECHOSOS = new Set([10, 20, 25, 50, 100, 200, 250, 500, 1000]);

/**
 * Odoo mezcla tallas de letra y de número (y JARDINERA NIÑA trae 2XL, que
 * Number() convertiria en NaN y dejaria el orden indefinido).
 */
const ORDEN_LETRAS = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL"];

export type SizeRow = {
  odooId: number;
  size: string;
  price: number;
  stock: number;
};

export type OdooProduct = {
  odooName: string;
  sizes: SizeRow[];
};

export type Inventory = {
  updatedAt: string;
  products: OdooProduct[];
  /** true cuando el MCP falló y estamos sirviendo el último snapshot commiteado. */
  stale: boolean;
  /** Variantes crudas recibidas, antes de excluir. */
  received: number;
  /** true si Odoo devolvió justo el tope: hay catálogo que no estamos viendo. */
  truncated: boolean;
  /** Nombres que el filtro dejó por fuera, para que no sea un descarte mudo. */
  excluded: string[];
};

type OdooVariant = {
  id: number;
  lst_price: number;
  qty_available: number;
  display_name: string;
};

/** El servidor contesta SSE aunque pidamos JSON: hay que extraer el `data:`. */
function parseSse(text: string) {
  const line = text.split("\n").find((l) => l.startsWith("data: "));
  if (!line) throw new Error("Respuesta MCP sin evento data:");
  const payload = JSON.parse(line.slice(6));
  if (payload.error) throw new Error(`MCP error: ${JSON.stringify(payload.error)}`);
  return payload.result;
}

async function rpc(url: string, body: object, sessionId?: string | null) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify({ jsonrpc: "2.0", ...body }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`MCP HTTP ${res.status}`);
  return { res, text: await res.text() };
}

/** Letras primero en su orden natural, luego numéricas ascendente, y al final
 *  cualquier cosa que no sea talla (MEDIAS llega sin paréntesis). */
export function sortSizes(sizes: SizeRow[]) {
  const rango = (size: string): [number, number] => {
    const letra = ORDEN_LETRAS.indexOf(size.toUpperCase());
    if (letra !== -1) return [0, letra];
    const numero = Number(size);
    return Number.isFinite(numero) && size.trim() !== ""
      ? [1, numero]
      : [2, 0];
  };
  return [...sizes].sort((a, b) => {
    const [ga, va] = rango(a.size);
    const [gb, vb] = rango(b.size);
    return ga !== gb ? ga - gb : va - vb || a.size.localeCompare(b.size, "es");
  });
}

/** Odoo nombra cada variante `PRODUCTO  (TALLA)`. */
export function groupVariants(variants: OdooVariant[]): OdooProduct[] {
  const byProduct = new Map<string, SizeRow[]>();
  for (const variant of variants) {
    const match = /^(.*?)\s*\(([^()]*)\)\s*$/.exec(variant.display_name);
    const odooName = (match ? match[1] : variant.display_name)
      .replace(/\s+/g, " ")
      .trim();
    if (excluido(odooName)) continue;
    if (!byProduct.has(odooName)) byProduct.set(odooName, []);
    byProduct.get(odooName)!.push({
      odooId: variant.id,
      size: match ? match[2].trim() : "",
      price: variant.lst_price,
      stock: variant.qty_available,
    });
  }
  return [...byProduct.entries()]
    .map(([odooName, sizes]) => ({ odooName, sizes: sortSizes(sizes) }))
    .sort((a, b) => a.odooName.localeCompare(b.odooName, "es"));
}

/** Lo descartado se reporta, no se descarta en silencio. */
export function excludedNames(variants: OdooVariant[]) {
  const fuera = new Set<string>();
  for (const variant of variants) {
    const match = /^(.*?)\s*\(([^()]*)\)\s*$/.exec(variant.display_name);
    const odooName = (match ? match[1] : variant.display_name)
      .replace(/\s+/g, " ")
      .trim();
    if (excluido(odooName)) fuera.add(odooName);
  }
  return [...fuera].sort((a, b) => a.localeCompare(b, "es"));
}

async function fetchInventory(): Promise<Inventory> {
  const url = process.env.ODOO_MCP_URL;
  if (!url) throw new Error("Falta ODOO_MCP_URL");

  const init = await rpc(url, {
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "manantial-web", version: "1.0" },
    },
  });
  const sessionId = init.res.headers.get("mcp-session-id");
  parseSse(init.text);

  await rpc(url, { method: "notifications/initialized" }, sessionId);

  const call = await rpc(
    url,
    { id: 2, method: "tools/call", params: { name: TOOL, arguments: {} } },
    sessionId,
  );
  const result = parseSse(call.text);
  const variants: OdooVariant[] = JSON.parse(result.content[0].text);

  return {
    updatedAt: new Date().toISOString(),
    products: groupVariants(variants),
    stale: false,
    received: variants.length,
    truncated: TOPES_SOSPECHOSOS.has(variants.length),
    excluded: excludedNames(variants),
  };
}

const cached = unstable_cache(fetchInventory, ["odoo-inventario"], {
  tags: [INVENTORY_TAG],
  revalidate: UN_DIA,
});

/**
 * El catch va por fuera del caché a propósito: así un fallo del MCP no queda
 * cacheado 24h y el siguiente request lo reintenta, mientras tanto servimos el
 * último snapshot commiteado.
 */
export async function getInventory(): Promise<Inventory> {
  try {
    return await cached();
  } catch (error) {
    console.error("[inventario] MCP no disponible, usando snapshot:", error);
    const variants = snapshot.products.flatMap((product) =>
      product.sizes.map((size) => ({
        id: size.odooId,
        lst_price: size.price,
        qty_available: size.stock,
        display_name: `${product.odooName} (${size.size})`,
      })),
    );
    return {
      updatedAt: snapshot.updatedAt,
      products: groupVariants(variants),
      stale: true,
      received: variants.length,
      truncated: false,
      excluded: excludedNames(variants),
    };
  }
}
