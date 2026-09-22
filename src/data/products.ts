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
/**
 * El orden manda: asi se recorre el carrusel de Inicio, asi se lista /productos
 * y asi se ordena /inventario. Agrupado como lo pide la tienda: primero
 * Comfandi (camibuso y sudadera) y luego Arquidiocesanos por uso — educacion
 * fisica, uniforme diario de nina y uniforme diario de nino.
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
  // --- Comfandi -----------------------------------------------------------
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
    // No afirmamos si la referencia trae chaqueta: eso lo confirma la tienda.
    descriptor: "Azul rey, con el logo de Comfandi.",
    searchAliases: [
      "pantalon azul",
      "pantalon comfandi",
      "sudadera azul",
      "pantalon de sudadera",
    ],
  },

  // --- Arquidiocesanos · educacion fisica ---------------------------------
  {
    id: "arqui-sudadera-educacion-fisica",
    name: "Sudadera de Educación Física",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-sudadera-educacion-fisica.webp",
    odooName: "SUDADERA ED. FISICA ARQUIDIOCESANOS",
    // Mismo pendiente que la sudadera Comfandi: solo describimos la foto.
    descriptor: "Azul oscuro, con franja amarilla a los lados.",
    searchAliases: [
      "pantalon sudadera",
      "pantalon educacion fisica",
      "sudadera azul",
      "deportes",
    ],
  },
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

  // --- Arquidiocesanos · uniforme diario de nina --------------------------
  {
    id: "arqui-jardinera",
    name: "Jardinera",
    school: "arquidiocesanos",
    image: "/images/productos/arqui-jardinera.webp",
    odooName: "JARDINERA NIÑA",
    descriptor:
      "Uniforme diario de niña, a cuadros azules. Se usa con la blusa blanca debajo.",
    searchAliases: [
      "jardinera diaria",
      "jardinera niña",
      "vestido",
      "falda",
      "uniforme diario niña",
    ],
  },
  {
    id: "arqui-blusa-diario",
    name: "Blusa Diario",
    school: "arquidiocesanos",
    // PENDIENTE: falta la foto propia. Cuando exista, guardarla en
    // public/images/productos/arqui-blusa-diario.webp y descomentar la linea.
    // image: "/images/productos/arqui-blusa-diario.webp",
    odooName: "BLUSA DIARIO NIÑA (DEBAJO)",
    descriptor:
      "Blanca, de manga corta, con vivos oscuros en los puños. Va debajo de la jardinera.",
    searchAliases: [
      "blusa",
      "blusa blanca",
      "camisa niña",
      "blusa debajo",
      "uniforme diario niña",
    ],
  },

  // --- Arquidiocesanos · uniforme diario de nino --------------------------
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

export function schoolName(id: SchoolId) {
  return schools.find((school) => school.id === id)?.name ?? id;
}

export function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`;
}
