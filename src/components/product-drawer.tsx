"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { PhotoPending } from "@/components/product-card";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { formatPrice, schoolName } from "@/data/products";
import { pushDataLayer } from "@/lib/analytics";
import { CART_MAX_QUANTITY, isLowStock } from "@/lib/cart";
import { useOverlay } from "@/lib/use-overlay";
import { productWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

/** Bottom sheet on mobile, right-hand drawer on desktop. Never a separate route. */
export function ProductDrawer({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [variantId, setVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [added, setAdded] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const { add, open: openCart } = useCart();

  // State resets between products because the section remounts the drawer
  // (key={product.id}). useOverlay se encarga del foco, del Escape por capas
  // (la ampliación se cierra antes que el drawer) y del bloqueo de scroll.
  const dialogRef = useOverlay<HTMLDivElement>({
    open: Boolean(product),
    onClose,
  });

  if (!product) return null;

  const selectedVariant =
    product.variants.find((variant) => variant.odooId === variantId) ?? null;
  // El rango de precios mira TODAS las tallas: filtrar por existencias haría
  // que el "Desde" saltara solo porque una talla se agotó.
  const prices = product.variants.map((variant) => variant.price);
  const minimumPrice = Math.min(...prices);
  const maximumPrice = Math.max(...prices);
  const hasPriceRange = minimumPrice !== maximumPrice;
  const displayedPrice = selectedVariant?.price ?? minimumPrice;
  const lowStock = selectedVariant ? isLowStock(selectedVariant) : false;
  const maximumQuantity = selectedVariant ? CART_MAX_QUANTITY : 1;

  // La URL se calcula en el render: un <a> con href listo nunca tropieza con
  // el bloqueador de pop-ups, pase lo que pase con este handler.
  const whatsappUrl = selectedVariant
    ? productWhatsAppUrl(product, selectedVariant, quantity)
    : undefined;

  const addToCart = () => {
    if (!selectedVariant) {
      setError(true);
      return;
    }
    add(product, selectedVariant, quantity);
    setAdded(true);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={product.descriptor ? descriptionId : undefined}
        className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-3xl bg-background sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
              {schoolName(product.school)}
            </p>
            <h2
              id={titleId}
              className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-ink"
            >
              {product.name}
            </h2>
            {product.descriptor ? (
              <p
                id={descriptionId}
                className="mt-1 text-[12px] leading-5 text-muted"
              >
                {product.descriptor}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-1 flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
              className="size-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {/* la foto se mide por alto: así las tallas quedan sobre el pliegue
             incluso en pantallas de portátil */}
          {/* Sin foto no hay nada que ampliar: el botón se cae y queda el
              marcador, que no es pulsable. */}
          {product.image ? (
            <button
              type="button"
              onClick={() => setZoom(true)}
              aria-label={`Ver ${product.name} en grande`}
              className="group relative mx-auto block aspect-4/5 h-[clamp(180px,30vh,300px)] w-auto overflow-hidden rounded-2xl bg-card-media focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 60vw, 260px"
                className="object-contain"
              />
              <span className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-[11px] font-bold text-primary shadow-[0_4px_12px_rgba(7,28,58,0.14)] transition-colors group-hover:bg-background">
                <ZoomIcon />
                Ampliar
              </span>
            </button>
          ) : (
            <span className="relative mx-auto block aspect-4/5 h-[clamp(180px,30vh,300px)] w-auto overflow-hidden rounded-2xl bg-card-media">
              <PhotoPending />
            </span>
          )}

          <p
            aria-live="polite"
            className="mt-5 text-2xl font-extrabold text-ink"
          >
            {!selectedVariant && hasPriceRange ? "Desde " : ""}
            {formatPrice(displayedPrice)}
          </p>
          {/* El catálogo no afirma disponibilidad: quien confirma es la tienda
              por WhatsApp. Lo único que se dice es cuándo quedan pocas, y solo
              con existencias reales. */}
          <p aria-live="polite" className="mt-1 text-[12px] text-muted">
            {selectedVariant
              ? ""
              : hasPriceRange
                ? "El precio cambia según la talla."
                : "Selecciona tu talla."}
          </p>
          {lowStock ? (
            <p
              role="status"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 text-[12px] font-bold text-ink"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
              ¡Últimas unidades! Escríbenos para apartarla.
            </p>
          ) : null}

          <fieldset className="mt-5">
            <legend className="text-[13px] font-bold text-ink">Talla</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {/* Ninguna talla se tacha ni se bloquea: si no hay, lo dice la
                  tienda por chat. Las que quedan pocas llevan un punto dorado
                  para empujar la consulta. */}
              {product.variants.map((option) => {
                const active = selectedVariant?.odooId === option.odooId;
                const pocas = isLowStock(option);

                return (
                  <button
                    key={option.odooId}
                    type="button"
                    onClick={() => {
                      setVariantId(option.odooId);
                      setQuantity(1);
                      setError(false);
                      setAdded(false);
                    }}
                    aria-label={`Talla ${option.size}${
                      pocas ? ", últimas unidades" : ""
                    }`}
                    aria-pressed={active}
                    className={`relative h-10 min-w-11 rounded-full border px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-background text-ink hover:border-primary/40"
                    }`}
                  >
                    {option.size}
                    {pocas && !active ? (
                      <span
                        aria-hidden="true"
                        className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-gold"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
            {error ? (
              <p role="alert" className="mt-3 text-[13px] font-semibold text-[#c82b31]">
                Selecciona una talla para continuar.
              </p>
            ) : null}
          </fieldset>

          <div className="mt-6">
            <p className="text-[13px] font-bold text-ink">Cantidad</p>
            <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border p-1">
              <button
                type="button"
                aria-label="Quitar una unidad"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={!selectedVariant || quantity <= 1}
                className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true" className="size-4">
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span aria-live="polite" className="w-8 text-center text-sm font-extrabold text-ink">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Agregar una unidad"
                onClick={() =>
                  setQuantity((value) => Math.min(maximumQuantity, value + 1))
                }
                disabled={
                  !selectedVariant || quantity >= maximumQuantity
                }
                className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true" className="size-4">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-background px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
          {/* Dos caminos, sin que el cliente tenga que adivinar: sumar esta
              prenda a una consulta más grande, o preguntar solo por ella. */}
          <button
            type="button"
            onClick={addToCart}
            className="btn btn-primary h-12 w-full px-5"
          >
            Agregar al carrito
          </button>

          <a
            href={whatsappUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              if (!selectedVariant) {
                event.preventDefault();
                setError(true);
                return;
              }
              pushDataLayer({
                event: "whatsapp_lead",
                origen: "producto",
                currency: "COP",
                value: selectedVariant.price * quantity,
                items: [
                  {
                    item_id: String(selectedVariant.odooId),
                    item_name: product.name,
                    quantity,
                  },
                ],
              });
            }}
            className="btn btn-secondary mt-2.5 h-12 w-full px-5"
          >
            <WhatsAppIcon className="size-[18px] text-whatsapp" />
            Consultar solo esta prenda
          </a>

          {added ? (
            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[12px] font-semibold text-ink">
              Agregada al carrito.
              <button
                type="button"
                onClick={openCart}
                className="font-bold text-primary underline underline-offset-4"
              >
                Ver carrito
              </button>
            </p>
          ) : (
            <p className="mt-3 text-center text-[11px] text-muted">
              Agrega varias prendas y consúltalas todas en un solo mensaje.
            </p>
          )}
        </div>
      </div>

      {zoom && product.image ? (
        <ImageLightbox
          product={{ ...product, image: product.image }}
          onClose={() => setZoom(false)}
        />
      ) : null}
    </div>
  );
}

/**
 * Foto a pantalla completa; se cierra con la X, con el fondo o con Escape.
 * Al entrar en la pila de capas queda por encima del drawer, así que Escape la
 * cierra a ella primero y el drawer sigue abierto detrás.
 */
function ImageLightbox({
  product,
  onClose,
}: {
  /** Solo se monta desde el botón de ampliar, que exige que haya foto. */
  product: Product & { image: string };
  onClose: () => void;
}) {
  const boxRef = useOverlay<HTMLDivElement>({ open: true, onClose });

  return (
    <div
      ref={boxRef}
      className="absolute inset-0 z-10 flex items-center justify-center bg-ink/80 p-4 sm:p-8"
    >
      <button
        type="button"
        aria-label="Cerrar ampliación"
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out"
      />

      <div className="pointer-events-none relative h-full max-h-[90vh] w-full max-w-[560px]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 92vw, 560px"
          quality={90}
          className="object-contain"
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar ampliación"
        autoFocus
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background text-ink shadow-[0_6px_18px_rgba(7,28,58,0.24)] transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
          className="size-5"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}

function ZoomIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21M11 8.5v5M8.5 11h5" />
    </svg>
  );
}
