"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { formatPrice, schoolName } from "@/data/products";
import { openWhatsApp, productWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

/** Bottom sheet on mobile, right-hand drawer on desktop. Never a separate route. */
export function ProductDrawer({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // State resets between products because the section remounts the drawer
  // (key={product.id}); this effect only wires up the open-dialog behaviour.
  useEffect(() => {
    if (!product) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const consult = () => {
    if (!size) {
      setError(true);
      return;
    }
    openWhatsApp(productWhatsAppUrl(product, size, quantity));
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
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
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
          </div>
          <button
            ref={closeRef}
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
          <div className="relative mx-auto aspect-4/5 w-full max-w-[260px] overflow-hidden rounded-2xl bg-card-media sm:max-w-none">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 70vw, 380px"
              className="object-contain"
            />
          </div>

          <p className="mt-5 text-2xl font-extrabold text-ink">
            {formatPrice(product.price)}
          </p>

          <fieldset className="mt-6">
            <legend className="text-[13px] font-bold text-ink">Talla</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSize(option);
                    setError(false);
                  }}
                  aria-pressed={size === option}
                  className={`h-10 min-w-11 rounded-full border px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    size === option
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background text-ink hover:border-primary/40"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {error ? (
              <p role="alert" className="mt-3 text-[13px] font-semibold text-[#c82b31]">
                Selecciona una talla para consultar disponibilidad.
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
                className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true" className="size-4">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-background px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
          <button
            type="button"
            onClick={consult}
            className="btn btn-primary h-12 w-full px-5"
          >
            <WhatsAppIcon className="size-[18px]" />
            Consultar disponibilidad
          </button>
          <p className="mt-3 text-center text-[11px] text-muted">
            Te atenderemos directamente por WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
