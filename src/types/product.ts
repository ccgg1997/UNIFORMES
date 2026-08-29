export type SchoolId = "arquidiocesanos" | "comfandi";

export type School = {
  id: SchoolId;
  /** Label used on filter pills and product badges. */
  name: string;
  tagline: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  school: SchoolId;
  /** Colombian pesos. */
  price: number;
  image: string;
  sizes: string[];
  /**
   * Nombre EXACTO del producto en Odoo (sin la talla). null = sin mapear
   * todavia: el sitio sigue mostrando el precio fijo de este archivo.
   */
  odooName: string | null;
};
