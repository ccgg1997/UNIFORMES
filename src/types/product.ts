export type SchoolId = "arquidiocesanos" | "comfandi";

export type School = {
  id: SchoolId;
  /** Label used on filter pills and product badges. */
  name: string;
  tagline: string;
  image: string;
};

export type ProductVariant = {
  /**
   * Único por variante en Odoo (producto + talla). Es la clave de línea del
   * carrito: sobrevive a que renombremos la prenda en el sitio.
   */
  odooId: number;
  size: string;
  /** Colombian pesos. */
  price: number;
  stock: number;
};

/** Static presentation metadata for a product backed by Odoo. */
export type ProductDefinition = {
  /** Slug de presentación. NO lo persistas: el carrito usa `odooId`. */
  id: string;
  /**
   * Nombre que ve el cliente. Regla: parte del sustantivo que usa Odoo (y que
   * usa la tienda al responder por WhatsApp) y solo agrega lo que Odoo ya
   * implica. Nunca inventa una prenda ni un color que Odoo no tenga, y nunca
   * lleva el colegio: la tarjeta, el drawer, el carrito y el mensaje ya lo
   * muestran por su cuenta.
   */
  name: string;
  school: SchoolId;
  /**
   * Opcional: una prenda puede publicarse antes de tener foto propia. Sin
   * imagen se dibuja un marcador neutro — nunca se toma prestada la foto de
   * otra tienda ni se deja un <img> roto.
   */
  image?: string;
  /** Nombre exacto del producto en Odoo, sin la talla. */
  odooName: string;
  /** Aclaración de una línea. Solo UI: nunca viaja en el mensaje de WhatsApp. */
  descriptor?: string;
  /**
   * Lo que el cliente escribe en el buscador, incluidos los nombres viejos.
   * Solo se compara: NUNCA se renderiza, o volveríamos a publicar en el HTML
   * el nombre equivocado que estamos corrigiendo.
   */
  searchAliases?: string[];
};

/** Client-serializable catalog product resolved from the inventory source. */
export type Product = ProductDefinition & {
  variants: ProductVariant[];
  /** Timestamp of the inventory payload used to resolve the variants. */
  inventoryUpdatedAt: string;
  /** True when the live MCP failed and the checked-in snapshot is in use. */
  inventoryStale: boolean;
};
