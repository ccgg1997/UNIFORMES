export type School = {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  description: string;
  coverImage: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string[];
  price: number | null;
  schoolId: School["id"];
  uniformType: "Diario" | "Educación física" | "Completo";
  category: "Niña" | "Niño" | "Unisex";
  images: string[];
  sizes: string[];
  available: boolean;
  featured: boolean;
};

