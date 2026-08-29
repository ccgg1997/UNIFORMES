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
};
