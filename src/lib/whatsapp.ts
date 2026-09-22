import {
  formatPrice,
  productDefinitions,
  schoolName,
  schools,
  WHATSAPP_PHONE,
} from "@/data/products";
import type { Cart, OrderContext, OrderLine } from "@/types/cart";
import type { Product, ProductVariant, SchoolId } from "@/types/product";

/**
 * wa.me no es solo un esquema: es un GET a un edge real y la request line tiene
 * que caber en su buffer (nginx 8k, Apache 8190); pasado eso responde 414.
 * 3500 deja más del doble de margen. Un carrito normal no se acerca: una prenda
 * son ~385 caracteres y seis líneas de dos colegios ~870.
 */
const MAX_URL_LENGTH = 3500;

const SCHOOL_ORDER = new Map(schools.map((school, index) => [school.id, index]));
const PRODUCT_ORDER = new Map(
  productDefinitions.map((product, index) => [product.id, index]),
);

function link(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Los saltos se arman con join, nunca con un template literal multilínea: el
 * repo se clona en Windows y un checkout con CRLF metería un retorno de carro
 * dentro del literal, que viajaría como %0D%0A. Como secuencia de escape, el
 * salto de línea no lo toca ningún filtro de checkout.
 */
const joinLines = (lines: string[]) => lines.join("\n");

/** Header / hero: consulta suelta, sin prenda. */
export function generalWhatsAppUrl() {
  return link(
    joinLines([
      "Hola Manantial de Moda 👋",
      "Quisiera información sobre sus uniformes escolares.",
    ]),
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

/**
 * Palabras que no identifican la prenda: o son gramática, o son el segmento
 * interno de Odoo (NIÑO/NIÑA/UNISEX), o son el colegio, que el mensaje ya
 * muestra en su propio encabezado.
 */
const RELLENO = new Set([
  "DE",
  "DEL",
  "LA",
  "EL",
  "LOS",
  "LAS",
  "Y",
  "CON",
  "PARA",
  "EN",
  "UNISEX",
  "NINO",
  "NINA",
  "TELA",
  "ED",
  "ARQUIDIOCESANOS",
  "COMFANDI",
]);

const palabrasClave = (value: string) =>
  normalize(value)
    .split(" ")
    .filter((word) => word && !RELLENO.has(word));

/**
 * Red de seguridad permanente contra el bug que originó todo esto: si el nombre
 * comercial no comparte NINGUNA palabra con el de Odoo, el mensaje lleva además
 * la referencia exacta. Con los nombres actuales no se dispara nunca; si mañana
 * alguien vuelve a bautizar una sudadera como "Pantalón Azul", se dispara sola
 * y la tienda no tiene que corregir a nadie por chat.
 */
export function productLabel(line: Pick<OrderLine, "name" | "odooName">) {
  const propias = new Set(palabrasClave(line.name));
  const deOdoo = palabrasClave(line.odooName);
  if (!propias.size || !deOdoo.length) return line.name;
  return deOdoo.some((word) => propias.has(word))
    ? line.name
    : `${line.name} (${line.odooName})`;
}

/** dd/mm a mano: Intl con es-CO y month 2-digit devuelve "29/8" en algunos ICU. */
function shortDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

/** Orden fijo: la tienda ve decenas de estos y su ojo aprende la forma. */
function sortLines(lines: OrderLine[]) {
  return [...lines].sort(
    (a, b) =>
      (SCHOOL_ORDER.get(a.school) ?? 99) - (SCHOOL_ORDER.get(b.school) ?? 99) ||
      (PRODUCT_ORDER.get(a.productId) ?? 99) -
        (PRODUCT_ORDER.get(b.productId) ?? 99) ||
      a.odooId - b.odooId,
  );
}

type Group = { school: SchoolId; head: OrderLine; rows: OrderLine[] };

/** Varias tallas de la misma prenda van en UNA línea: eso la hace legible. */
function groupLines(sorted: OrderLine[]) {
  const groups: Group[] = [];
  for (const line of sorted) {
    const current = groups[groups.length - 1];
    if (current && current.head.productId === line.productId) {
      current.rows.push(line);
    } else {
      groups.push({ school: line.school, head: line, rows: [line] });
    }
  }
  return groups;
}

/** "12 (x2)". El mensaje no marca existencias: la tienda es quien confirma. */
const sizeText = (row: OrderLine) =>
  `${row.size || "única"} (x${row.quantity})`;

function productLine(group: Group, withPrices: boolean) {
  const name = productLabel(group.head);
  const sizes = group.rows.map(sizeText).join(", ");

  if (!withPrices) return `- ${name} · Tallas: ${sizes}`;

  // JARDINERA NIÑA vale 72k en S/M/L, 77k en XL/2XL y 69k en las numéricas:
  // cuando las tallas elegidas no comparten precio, cada una lleva el suyo.
  const samePrice = group.rows.every((row) => row.price === group.rows[0].price);
  if (!samePrice) {
    return `- ${name} · ${group.rows
      .map(
        (row) =>
          `Talla ${sizeText(row)} ${formatPrice(row.price)}${
            row.quantity > 1 ? " c/u" : ""
          }`,
      )
      .join(" · ")}`;
  }

  const unit = group.rows.some((row) => row.quantity > 1) ? " c/u" : "";
  return `- ${name} · Tallas: ${sizes} · ${formatPrice(group.rows[0].price)}${unit}`;
}

type Detail = { withPrices: boolean; withTotal: boolean };

/**
 * Único constructor de mensajes: el drawer manda una línea y el carrito manda
 * todas. Así los dos mensajes no pueden separarse nunca.
 */
export function buildOrderMessage(
  lines: OrderLine[],
  context: OrderContext,
  detail: Detail = { withPrices: true, withTotal: true },
) {
  const sorted = sortLines(lines);
  const groups = groupLines(sorted);
  const schoolsUsed = [...new Set(groups.map((group) => group.school))];
  const units = sorted.reduce((total, line) => total + line.quantity, 0);
  const total = sorted.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const single = sorted.length === 1 && units === 1;

  const out = ["Hola Manantial de Moda 👋", ""];

  // Con un solo colegio el encabezado sobra: el colegio entra en la intro.
  out.push(
    schoolsUsed.length === 1
      ? `${
          single
            ? "Quiero consultar por esta prenda"
            : "Quiero consultar estas prendas"
        } de *${schoolName(schoolsUsed[0])}*:`
      : "Quiero consultar estas prendas:",
    "",
  );

  let previous: SchoolId | null = null;
  for (const group of groups) {
    if (schoolsUsed.length > 1 && group.school !== previous) {
      if (previous) out.push("");
      // Sin espacio tras el asterisco: WhatsApp lo lee como negrita, no viñeta.
      out.push(`*${schoolName(group.school)}*`);
      previous = group.school;
    }
    out.push(productLine(group, detail.withPrices));
  }
  out.push("");

  // "aproximado" siempre: el precio sale de un sync diario y el sitio no
  // publica extras que la tienda sí vende (el logo del colegio, las medias).
  if (detail.withTotal && !single) {
    out.push(
      `Total aproximado: ${formatPrice(total)} · ${units} ${
        units === 1 ? "prenda" : "prendas"
      }`,
      "",
    );
  }

  out.push("¿Me confirman precio y disponibilidad, por favor?");

  const fecha = shortDate(context.inventoryUpdatedAt);
  if (fecha) {
    out.push(
      "",
      context.inventoryStale
        ? `Precios tomados del último respaldo del catálogo (${fecha}); pueden haber cambiado.`
        : `Precios tomados del catálogo web, actualizado el ${fecha}.`,
    );
  }

  return joinLines(out);
}

const DETAIL_LADDER: Detail[] = [
  { withPrices: true, withTotal: true },
  { withPrices: false, withTotal: true },
  { withPrices: false, withTotal: false },
];

/** El carrito entero en UN mensaje. Síncrono a propósito (ver openWhatsApp). */
export function orderWhatsAppUrl(lines: OrderLine[], context: OrderContext) {
  // Un carrito vacío no puede mandar "Total aproximado: $0" al teléfono de la
  // tienda: ese es justo el ruido que este carrito viene a quitar.
  if (!lines.length) return generalWhatsAppUrl();

  for (const detail of DETAIL_LADDER) {
    const url = link(buildOrderMessage(lines, context, detail));
    if (url.length <= MAX_URL_LENGTH) return url;
  }

  // Red de seguridad, hoy inalcanzable con el catálogo publicado. Si algún día
  // hay mucho más catálogo, recorta prendas y LO DICE: un mensaje mudo a medias
  // es peor que uno corto.
  const detail = DETAIL_LADDER[DETAIL_LADDER.length - 1];
  const sorted = sortLines(lines);
  for (let keep = sorted.length - 1; keep >= 1; keep -= 1) {
    const url = link(
      joinLines([
        buildOrderMessage(sorted.slice(0, keep), context, detail),
        "",
        `Me faltan ${sorted.length - keep} prendas más, te las digo por aquí.`,
      ]),
    );
    if (url.length <= MAX_URL_LENGTH) return url;
  }
  return link(buildOrderMessage(sorted.slice(0, 1), context, detail));
}

export function toOrderLine(
  product: Product,
  variant: ProductVariant,
  quantity: number,
): OrderLine {
  return {
    productId: product.id,
    odooId: variant.odooId,
    name: product.name,
    odooName: product.odooName,
    school: product.school,
    size: variant.size,
    price: variant.price,
    quantity,
  };
}

/**
 * Del carrito reconciliado al mensaje. Las líneas cuya prenda desapareció del
 * catálogo no se pueden cotizar, así que no viajan: la tienda no debe recibir
 * una prenda que ya no existe.
 */
export function orderLinesFromCart(cart: Cart): OrderLine[] {
  return cart.lines.flatMap((line) =>
    line.product && line.variant
      ? [toOrderLine(line.product, line.variant, line.quantity)]
      : [],
  );
}

/**
 * Camino directo del drawer: una sola prenda no pasa por el carrito. Es el
 * mismo constructor con una línea, no una plantilla aparte.
 */
export function productWhatsAppUrl(
  product: Product,
  selectedVariant: ProductVariant,
  quantity: number,
) {
  return orderWhatsAppUrl([toOrderLine(product, selectedVariant, quantity)], {
    inventoryUpdatedAt: product.inventoryUpdatedAt,
    inventoryStale: product.inventoryStale,
  });
}

/**
 * Preferir SIEMPRE un <a href> calculado en el render. Esto queda para quien no
 * pueda: window.open solo sobrevive al bloqueador de pop-ups si corre en el
 * mismo tick del click; un solo await antes gasta la activación del usuario.
 */
export function openWhatsApp(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
