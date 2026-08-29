import { formatPrice, schoolName, WHATSAPP_PHONE } from "@/data/products";
import type { Product, ProductVariant } from "@/types/product";

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
  selectedVariant: ProductVariant,
  quantity: number,
) {
  return link(
    `Hola Manantial de Moda 👋

Estoy interesado(a) en:

${product.name}

Colegio: ${schoolName(product.school)}
Talla: ${selectedVariant.size}
Cantidad: ${quantity}
Precio unitario: ${formatPrice(selectedVariant.price)}

¿Me pueden confirmar el precio y ayudarme con esta solicitud?`,
  );
}

export function openWhatsApp(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
