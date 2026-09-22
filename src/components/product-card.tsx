import Image from "next/image";

import { formatPrice, schoolName } from "@/data/products";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  // Todas las tallas cuentan para el "Desde": el precio no debe moverse porque
  // una talla se haya agotado.
  const prices = product.variants.map((variant) => variant.price);
  const minimumPrice = Math.min(...prices);
  const hasPriceRange = prices.some((price) => price !== minimumPrice);

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex h-full w-full flex-col rounded-2xl border border-card-border bg-background p-3 text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-3.5"
    >
      <span className="inline-flex self-start rounded-full border border-primary/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.07em] text-primary sm:text-[10px]">
        {schoolName(product.school)}
      </span>

      <span className="relative mt-3 block aspect-4/5 w-full overflow-hidden rounded-xl bg-card-media">
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.name}, uniforme escolar de ${schoolName(product.school)}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 24vw, 220px"
            className="object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <PhotoPending />
        )}
      </span>

      <span className="mt-4 block text-[13px] leading-snug text-ink">
        {product.name}
      </span>
      <span className="mt-1.5 block text-[15px] font-extrabold text-ink">
        {hasPriceRange ? "Desde " : ""}
        {formatPrice(minimumPrice)}
      </span>

      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
        Ver tallas y precios
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-3 transition-transform group-hover:translate-x-0.5"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  );
}

/**
 * Marcador para una prenda que ya se vende pero todavía no tiene foto propia.
 * Se prefiere esto antes que dejar un <img> roto —o, peor, usar la foto de
 * producto de otra tienda.
 */
export function PhotoPending() {
  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-8 text-primary/40"
      >
        <path d="M8 3.5 4 5.5v4h2.5V20h11V9.5H20v-4l-4-2" />
        <path d="M8 3.5a4 4 0 0 0 8 0" />
      </svg>
      <span className="text-[10px] font-semibold leading-tight text-muted">
        Foto en camino
      </span>
    </span>
  );
}
