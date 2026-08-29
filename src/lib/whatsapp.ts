import { formatPrice, schoolName, WHATSAPP_PHONE } from "@/data/products";
import type { Product } from "@/types/product";

function link(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/** Header / hero button: a plain enquiry with no product attached. */
export function generalWhatsAppUrl() {
  return link(
    "Hola Manantial de Moda 👋\nQuisiera información sobre sus uniformes escolares.",
  );
}

export function productWhatsAppUrl(
  product: Product,
  selectedSize: string,
  quantity: number,
) {
  return link(
    `Hola Manantial de Moda 👋

Estoy interesado(a) en:

${product.name}

Colegio: ${schoolName(product.school)}
Talla: ${selectedSize}
Cantidad: ${quantity}
Precio: ${formatPrice(product.price)}

¿Me pueden confirmar disponibilidad?`,
  );
}

export function openWhatsApp(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
