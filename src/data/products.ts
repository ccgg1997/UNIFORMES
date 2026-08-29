import type { ProductDefinition, School, SchoolId } from "@/types/product";

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

/**
 * Order matters: this is the order the prendas carousel scrolls through.
 *
 * Esta lista solo define metadatos de presentacion. Tallas, precios y
 * existencias se resuelven exclusivamente desde Odoo mediante `odooName`.
 */
export const productDefinitions: ProductDefinition[] = [
  {
    id: "arqui-camiseta-educacion-fisica",
    name: "Camiseta Educación Física",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-camiseta-educacion-fisica.webp",
    odooName: "CAMISA UNISEX ED. FISICA",
  },
  {
    id: "arqui-sudadera-educacion-fisica",
    name: "Sudadera Educación Física",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-sudadera-educacion-fisica.webp",
    odooName: "SUDADERA ED. FISICA ARQUIDIOCESANOS",
  },
  {
    id: "arqui-jardinera-diaria",
    name: "Jardinera Diaria",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-jardinera-diaria.webp",
    odooName: "JARDINERA NIÑA",
  },
  {
    id: "comfandi-camiseta-blanca",
    name: "Camiseta Blanca",
    school: "comfandi",
    image: "/images/productos/comfandi-camiseta-blanca.webp",
    odooName: "CAMIBUSO COMFANDI",
  },
  {
    id: "comfandi-pantalon-azul",
    name: "Pantalón Azul",
    school: "comfandi",
    image: "/images/productos/comfandi-pantalon-azul.webp",
    odooName: "SUDADERA COMFANDI",
  },
  {
    id: "arqui-camisa-blanca",
    name: "Camisa Blanca",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-camisa-blanca.webp",
    odooName: "GUAYABERA NIÑO GRUESA",
  },
  {
    id: "arqui-pantalon-diario",
    name: "Pantalón Uniforme Diario",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-pantalon-diario.webp",
    odooName: "PANTALON DIARIO NIÑO",
  },
];

export function schoolName(id: SchoolId) {
  return schools.find((school) => school.id === id)?.name ?? id;
}

export function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`;
}
