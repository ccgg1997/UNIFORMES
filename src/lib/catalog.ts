import type { Product, School } from "@/types/catalog";

export const WHATSAPP_PHONE = "573133534097";

export const schools: School[] = [
  {
    id: "arquidiocesanos",
    name: "Colegios Arquidiocesanos",
    shortName: "Arquidiocesanos",
    slug: "arquidiocesanos",
    description:
      "Uniformes de diario y educación física con la identidad institucional azul, blanca y dorada.",
    coverImage: "/images/arquidiocesanos/grupo.png",
    primaryColor: "#073E91",
    secondaryColor: "#092C5C",
    accentColor: "#F1A800",
  },
  {
    id: "comfandi",
    name: "Comfandi",
    shortName: "Comfandi",
    slug: "comfandi",
    description:
      "Prendas cómodas y resistentes para acompañar la rutina escolar todos los días.",
    coverImage: "/images/comfandi/grupo.png",
    primaryColor: "#0848A8",
    secondaryColor: "#072E63",
    accentColor: "#24B8CF",
  },
];

export const products: Product[] = [
  {
    id: "arqui-jardinera",
    name: "Jardinera de diario",
    slug: "jardinera-diaria-arquidiocesanos",
    description:
      "Jardinera institucional de cuadros para el uniforme de diario, diseñada para brindar comodidad y buena presentación durante la jornada escolar.",
    details: ["Diseño institucional", "Corte cómodo", "Uso escolar diario"],
    price: null,
    schoolId: "arquidiocesanos",
    uniformType: "Diario",
    category: "Niña",
    images: [
      "/images/arquidiocesanos/jardinera-diaria.png",
      "/images/arquidiocesanos/prendas.png",
    ],
    sizes: ["4", "6", "8", "10", "12", "14", "16"],
    available: true,
    featured: true,
  },
  {
    id: "arqui-diario-nino",
    name: "Uniforme diario masculino",
    slug: "uniforme-diario-masculino-arquidiocesanos",
    description:
      "Conjunto de camisa blanca y pantalón oscuro para una presentación impecable y confortable durante toda la jornada.",
    details: ["Camisa institucional", "Pantalón de diario", "Fácil de combinar"],
    price: null,
    schoolId: "arquidiocesanos",
    uniformType: "Diario",
    category: "Niño",
    images: [
      "/images/arquidiocesanos/uniforme-diario-nino.png",
      "/images/arquidiocesanos/prendas.png",
    ],
    sizes: ["4", "6", "8", "10", "12", "14", "16"],
    available: true,
    featured: true,
  },
  {
    id: "arqui-fisica",
    name: "Uniforme de educación física",
    slug: "uniforme-educacion-fisica-arquidiocesanos",
    description:
      "Conjunto deportivo azul y amarillo pensado para el movimiento, el juego y las actividades escolares.",
    details: ["Camiseta deportiva", "Pantalón con elástico", "Libertad de movimiento"],
    price: null,
    schoolId: "arquidiocesanos",
    uniformType: "Educación física",
    category: "Unisex",
    images: [
      "/images/arquidiocesanos/educacion-fisica.png",
      "/images/arquidiocesanos/prendas.png",
    ],
    sizes: ["4", "6", "8", "10", "12", "14", "16"],
    available: true,
    featured: true,
  },
  {
    id: "arqui-completo",
    name: "Set de prendas institucionales",
    slug: "set-prendas-arquidiocesanos",
    description:
      "Consulta en un solo lugar las prendas de diario y educación física disponibles para Colegios Arquidiocesanos.",
    details: ["Opciones de diario", "Opción deportiva", "Asesoría de talla"],
    price: null,
    schoolId: "arquidiocesanos",
    uniformType: "Completo",
    category: "Unisex",
    images: [
      "/images/arquidiocesanos/prendas.png",
      "/images/arquidiocesanos/campana-duo.png",
    ],
    sizes: ["4", "6", "8", "10", "12", "14", "16"],
    available: true,
    featured: false,
  },
  {
    id: "comfandi-polo",
    name: "Polo Comfandi",
    slug: "polo-comfandi",
    description:
      "Polo blanco institucional de tacto suave y corte clásico, fresco y cómodo para el día a día.",
    details: ["Tela suave", "Cuello clásico", "Emblema institucional"],
    price: null,
    schoolId: "comfandi",
    uniformType: "Diario",
    category: "Unisex",
    images: [
      "/images/comfandi/polo.webp",
      "/images/comfandi/campana-polo.png",
      "/images/comfandi/prendas.png",
    ],
    sizes: ["4", "6", "8", "10", "12", "14", "16", "S", "M", "L"],
    available: true,
    featured: true,
  },
  {
    id: "comfandi-pantalon",
    name: "Pantalón deportivo Comfandi",
    slug: "pantalon-deportivo-comfandi",
    description:
      "Pantalón azul institucional resistente, cómodo y preparado para acompañar el movimiento diario.",
    details: ["Pretina elástica", "Tela deportiva", "Identidad Comfandi"],
    price: null,
    schoolId: "comfandi",
    uniformType: "Educación física",
    category: "Unisex",
    images: [
      "/images/comfandi/pantalon.webp",
      "/images/comfandi/prendas.png",
      "/images/comfandi/uniforme-completo.png",
    ],
    sizes: ["4", "6", "8", "10", "12", "14", "16", "S", "M", "L"],
    available: true,
    featured: true,
  },
  {
    id: "comfandi-completo",
    name: "Uniforme completo Comfandi",
    slug: "uniforme-completo-comfandi",
    description:
      "Polo y pantalón institucional para resolver el uniforme escolar completo con asesoría personalizada.",
    details: ["Polo institucional", "Pantalón deportivo", "Consulta por conjunto"],
    price: null,
    schoolId: "comfandi",
    uniformType: "Completo",
    category: "Unisex",
    images: [
      "/images/comfandi/uniforme-completo.png",
      "/images/comfandi/prendas.png",
      "/images/comfandi/grupo.png",
    ],
    sizes: ["4", "6", "8", "10", "12", "14", "16", "S", "M", "L"],
    available: true,
    featured: true,
  },
];

export function getSchoolBySlug(slug: string) {
  return schools.find((school) => school.slug === slug);
}

export function getSchoolById(id: string) {
  return schools.find((school) => school.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsBySchool(schoolId: string) {
  return products.filter((product) => product.schoolId === schoolId);
}

