import { productsHref } from "@/lib/routes";

export type FaqItem = {
  question: string;
  /** Texto plano: se reutiliza tal cual en el schema FAQPage. */
  answer: string;
  /** Enlace opcional que se muestra debajo de la respuesta (solo en la UI). */
  link?: { href: string; label: string };
};

/**
 * Única fuente de las preguntas frecuentes: la sección visible y el
 * JSON-LD de FAQPage se generan desde esta lista para no divergir.
 */
export const faqItems: FaqItem[] = [
  {
    question: "¿Qué uniformes escolares venden?",
    answer:
      "Vendemos las prendas del uniforme diario y de educación física para los Colegios Arquidiocesanos y los colegios Comfandi: guayaberas, camibusos, camisas de educación física, pantalones, jardineras y sudaderas.",
    link: { href: productsHref(), label: "Ver el catálogo completo" },
  },
  {
    question: "¿Cómo hago un pedido?",
    answer:
      "Elige la prenda en el catálogo, selecciona la talla y la cantidad y agrégala al carrito. Cuando termines, el sitio abre WhatsApp con todas tus prendas en un solo mensaje, agrupadas por colegio; si solo te interesa una, puedes consultarla directamente. Confirmamos precio, disponibilidad y entrega por chat: no hay pagos en línea.",
    link: { href: productsHref(), label: "Elegir una prenda" },
  },
  {
    question: "¿Cómo sé cuál es la talla correcta?",
    answer:
      "Cada prenda muestra sus tallas disponibles. Si tienes dudas entre dos tallas, escríbenos por WhatsApp al +57 313 353 4097 y te asesoramos de forma personalizada antes de comprar.",
  },
  {
    question: "¿Dónde están ubicados?",
    answer:
      "Estamos en Cali, en la Calle 89 # 24J-54, barrio Compartir. También puedes hacer todo el pedido por WhatsApp sin visitar la tienda.",
  },
  {
    question: "¿Los precios y tallas del catálogo están actualizados?",
    answer:
      "Sí. Los precios, las tallas y las existencias que ves en el catálogo se sincronizan todos los días con el inventario de la tienda.",
  },
];
