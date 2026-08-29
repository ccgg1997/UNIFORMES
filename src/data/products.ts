import type { Product, School } from "@/types/product";

export const WHATSAPP_PHONE = "573133534097";
export const WHATSAPP_DISPLAY = "+57 313 353 4097";

export const schools: School[] = [
  {
    id: "arquidiocesanos",
    name: "Arquidiocesanos",
    tagline: "Así luce puesto",
    image: "/images/colegios/arquidiocesanos.webp",
  },
  {
    id: "comfandi",
    name: "Comfandi",
    tagline: "Comodidad para cada día",
    image: "/images/colegios/comfandi.webp",
  },
];

const SIZES = ["6", "8", "10", "12", "14", "16"];

/** Order matters: the first five are the prendas shown before "Ver más prendas". */
export const products: Product[] = [
  {
    id: "arqui-camiseta-educacion-fisica",
    name: "Camiseta Educación Física",
    school: "arquidiocesanos",
    price: 45000,
    image: "/images/productos/arqui-camiseta-educacion-fisica.webp",
    sizes: SIZES,
  },
  {
    id: "arqui-sudadera-educacion-fisica",
    name: "Sudadera Educación Física",
    school: "arquidiocesanos",
    price: 80000,
    image: "/images/productos/arqui-sudadera-educacion-fisica.webp",
    sizes: SIZES,
  },
  {
    id: "arqui-jardinera-diaria",
    name: "Jardinera Diaria",
    school: "arquidiocesanos",
    price: 90000,
    image: "/images/productos/arqui-jardinera-diaria.webp",
    sizes: SIZES,
  },
  {
    id: "comfandi-camiseta-blanca",
    name: "Camiseta Blanca",
    school: "comfandi",
    price: 38000,
    image: "/images/productos/comfandi-camiseta-blanca.webp",
    sizes: SIZES,
  },
  {
    id: "comfandi-pantalon-azul",
    name: "Pantalón Azul",
    school: "comfandi",
    price: 70000,
    image: "/images/productos/comfandi-pantalon-azul.webp",
    sizes: SIZES,
  },
  {
    id: "arqui-camisa-blanca",
    name: "Camisa Blanca",
    school: "arquidiocesanos",
    price: 55000,
    image: "/images/productos/arqui-camisa-blanca.webp",
    sizes: SIZES,
  },
  {
    id: "arqui-pantalon-diario",
    name: "Pantalón Uniforme Diario",
    school: "arquidiocesanos",
    price: 65000,
    image: "/images/productos/arqui-pantalon-diario.webp",
    sizes: SIZES,
  },
];

export function schoolName(id: Product["school"]) {
  return schools.find((school) => school.id === id)?.name ?? id;
}

export function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`;
}
