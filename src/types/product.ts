export type SchoolId = "arquidiocesanos" | "comfandi";

export type School = {
  id: SchoolId;
  /** Label used on filter pills and product badges. */
  name: string;
  tagline: string;
  image: string;
};

export type ProductVariant = {
  odooId: number;
  size: string;
  /** Colombian pesos. */
  price: number;
  stock: number;
};

/** Static presentation metadata for a product backed by Odoo. */
export type ProductDefinition = {
  id: string;
  name: string;
  school: SchoolId;
  image: string;
  /** Nombre exacto del producto en Odoo, sin la talla. */
  odooName: string;
};

/** Client-serializable catalog product resolved from the inventory source. */
export type Product = ProductDefinition & {
  variants: ProductVariant[];
  /** Timestamp of the inventory payload used to resolve the variants. */
  inventoryUpdatedAt: string;
  /** True when the live MCP failed and the checked-in snapshot is in use. */
  inventoryStale: boolean;
};
