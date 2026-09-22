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
 *
 * El nombre comercial parte del sustantivo que usa Odoo —que es el que usa la
 * tienda al responder por WhatsApp— y nunca lleva el colegio. La tienda tuvo
 * que corregir por chat a una clienta que pidio un "pantalon azul" que no
 * existe: en Odoo esa prenda es la SUDADERA COMFANDI.
 */
export const productDefinitions: ProductDefinition[] = [
  {
    id: "arqui-camisa-educacion-fisica",
    name: "Camisa de Educación Física",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-camisa-educacion-fisica.webp",
    odooName: "CAMISA UNISEX ED. FISICA",
    descriptor: "Unisex. Amarilla, con mangas y cuello azul oscuro.",
    searchAliases: [
      "camiseta educacion fisica",
      "camiseta amarilla",
      "camibuso educacion fisica",
      "camisa unisex",
      "deportes",
    ],
  },
  {
    id: "arqui-sudadera-educacion-fisica",
    name: "Sudadera de Educación Física",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-sudadera-educacion-fisica.webp",
    odooName: "SUDADERA ED. FISICA ARQUIDIOCESANOS",
    // Describe SOLO lo que se ve en la foto: no afirmamos si la referencia
    // incluye chaqueta mientras la tienda no lo confirme.
    descriptor: "Azul oscuro, con franja amarilla a los lados.",
    searchAliases: [
      "pantalon sudadera",
      "pantalon educacion fisica",
      "sudadera azul",
      "deportes",
    ],
  },
  {
    id: "arqui-jardinera",
    name: "Jardinera",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-jardinera.webp",
    odooName: "JARDINERA NIÑA",
    // Recupera la venta de la blusa mientras no tengamos su foto: en Odoo hay
    // 187 unidades y todavia no tiene ficha propia (ver /inventario).
    descriptor:
      "Uniforme diario de niña, a cuadros azules. Se usa con la blusa blanca debajo; pregúntanos por ella.",
    searchAliases: [
      "jardinera diaria",
      "jardinera niña",
      "vestido",
      "falda",
      "uniforme diario niña",
      "blusa",
      "blusa blanca",
      "camisa niña",
    ],
  },
  {
    id: "comfandi-camibuso",
    name: "Camibuso",
    school: "comfandi",
    image: "/images/productos/comfandi-camibuso.webp",
    odooName: "CAMIBUSO COMFANDI",
    // Ancla "camibuso" a "polo" a proposito: ese hueco de vocabulario es el que
    // hizo que la clienta escribiera "camiseta blanca".
    descriptor: "Blanco, tipo polo, con el logo de Comfandi.",
    searchAliases: [
      "camiseta blanca",
      "camisa blanca comfandi",
      "polo",
      "polo blanco",
      "camiseta comfandi",
    ],
  },
  {
    id: "comfandi-sudadera",
    name: "Sudadera",
    school: "comfandi",
    image: "/images/productos/comfandi-sudadera.webp",
    odooName: "SUDADERA COMFANDI",
    // Mismo pendiente que la sudadera de Arqui: no afirmamos si trae chaqueta.
    descriptor: "Azul rey, con el logo de Comfandi.",
    searchAliases: [
      "pantalon azul",
      "pantalon comfandi",
      "sudadera azul",
      "pantalon de sudadera",
    ],
  },
  {
    id: "arqui-guayabera-gruesa",
    name: "Guayabera (tela gruesa)",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-guayabera-gruesa.webp",
    odooName: "GUAYABERA NIÑO GRUESA",
    // "tela gruesa" no es adorno: explica el precio frente a la GUAYABERA NIÑO
    // NORMAL, que la tienda decidio no publicar. No la mencionamos aqui.
    descriptor: "Blanca, de manga corta, con alforzas y bolsillo. Tela gruesa.",
    searchAliases: [
      "camisa blanca",
      "camisa diaria",
      "guayabera",
      "camisa niño",
      "uniforme diario niño",
    ],
  },
  {
    id: "arqui-pantalon-diario",
    name: "Pantalón Diario",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-pantalon-diario.webp",
    odooName: "PANTALON DIARIO NIÑO",
    descriptor: "Azul oscuro, en tela, para el uniforme diario.",
    searchAliases: [
      "pantalon uniforme diario",
      "pantalon de tela",
      "pantalon azul oscuro",
      "pantalon niño",
    ],
  },
];

// BLUSA DIARIO NIÑA (DEBAJO) esta publicada en Odoo (10 tallas, 187 unidades)
// y NO esta excluida: sale completa en /inventario, marcada como "sin ficha en
// la web". Lo unico que falta es la foto. Cuando llegue, se descomenta:
// {
//   id: "arqui-blusa-diario",
//   name: "Blusa Diario",
//   school: "arquidiocesanos",
//   image: "/images/productos/arqui-blusa-diario.webp",
//   odooName: "BLUSA DIARIO NIÑA (DEBAJO)",
//   descriptor: "Blanca, se usa debajo de la jardinera.",
//   searchAliases: ["blusa blanca", "camisa niña", "blusa debajo"],
// },

export function schoolName(id: SchoolId) {
  return schools.find((school) => school.id === id)?.name ?? id;
}

export function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`;
}
