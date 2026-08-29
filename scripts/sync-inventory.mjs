/**
 * Trae precios, existencias y tallas desde el MCP de Odoo (n8n) y los deja en
 * src/data/inventory.json. No toca products.ts: el catálogo del sitio manda
 * sobre nombres e imágenes, este archivo solo aporta los datos que cambian.
 *
 * Uso: node scripts/sync-inventory.mjs
 * Requiere ODOO_MCP_URL en el entorno (ver .env.local).
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/inventory.json");
const TOOL = "verificar_inventario";
const LETRAS = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL"];

const URL_MCP = process.env.ODOO_MCP_URL;
if (!URL_MCP) {
  console.error("Falta ODOO_MCP_URL. Definelo en .env.local o en el entorno.");
  process.exit(1);
}

/** El servidor responde SSE aunque pidamos JSON: hay que sacar el `data:`. */
function parseSse(text) {
  const line = text.split("\n").find((l) => l.startsWith("data: "));
  if (!line) throw new Error(`Respuesta sin evento data:\n${text.slice(0, 300)}`);
  const payload = JSON.parse(line.slice(6));
  if (payload.error) throw new Error(`MCP error: ${JSON.stringify(payload.error)}`);
  return payload.result;
}

async function rpc(body, sessionId) {
  const res = await fetch(URL_MCP, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify({ jsonrpc: "2.0", ...body }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return { res, text: await res.text() };
}

async function fetchVariants() {
  const init = await rpc({
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "manantial-sync", version: "1.0" },
    },
  });
  const sessionId = init.res.headers.get("mcp-session-id");
  parseSse(init.text);

  await rpc({ method: "notifications/initialized" }, sessionId);

  const call = await rpc(
    { id: 2, method: "tools/call", params: { name: TOOL, arguments: {} } },
    sessionId,
  );
  const result = parseSse(call.text);
  return JSON.parse(result.content[0].text);
}

/** Odoo nombra cada variante `PRODUCTO  (TALLA)`; agrupamos por el nombre base. */
function group(variants) {
  const byProduct = new Map();
  for (const v of variants) {
    const match = /^(.*?)\s*\(([^()]*)\)\s*$/.exec(v.display_name);
    const name = (match ? match[1] : v.display_name).replace(/\s+/g, " ").trim();
    const size = match ? match[2].trim() : "";
    if (!byProduct.has(name)) byProduct.set(name, []);
    byProduct.get(name).push({
      odooId: v.id,
      size,
      price: v.lst_price,
      stock: v.qty_available,
    });
  }
  return [...byProduct.entries()].map(([odooName, sizes]) => ({
    odooName,
    sizes: sizes.sort((a, b) => {
      const rango = (size) => {
        const letra = LETRAS.indexOf(size.toUpperCase());
        if (letra !== -1) return [0, letra];
        const numero = Number(size);
        return Number.isFinite(numero) && size.trim() !== "" ? [1, numero] : [2, 0];
      };
      const [ga, va] = rango(a.size);
      const [gb, vb] = rango(b.size);
      return ga !== gb ? ga - gb : va - vb || a.size.localeCompare(b.size, "es");
    }),
  }));
}

const variants = await fetchVariants();
const products = group(variants);

await mkdir(dirname(OUT), { recursive: true });
await writeFile(
  OUT,
  `${JSON.stringify({ updatedAt: new Date().toISOString(), products }, null, 2)}\n`,
  "utf8",
);

const enStock = products.reduce(
  (total, p) => total + p.sizes.filter((s) => s.stock > 0).length,
  0,
);
console.log(
  `OK ${products.length} productos, ${variants.length} tallas (${enStock} con stock) -> src/data/inventory.json`,
);
