"use client";

import { Check, Minus, Plus } from "lucide-react";
import { useState } from "react";

import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { WHATSAPP_PHONE } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/utils";
import type { Product, School } from "@/types/catalog";

export function ProductPurchasePanel({
  product,
  school,
}: {
  product: Product;
  school: School;
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  function openWhatsApp() {
    if (!selectedSize) {
      setError("Selecciona una talla para consultar disponibilidad.");
      document.getElementById("product-sizes")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setError("");
    const message = `Hola Manantial de Moda 👋

Estoy interesado(a) en este uniforme:

Producto: ${product.name}
Colegio: ${school.name}
Talla: ${selectedSize}
Cantidad: ${quantity}
Precio: ${formatPrice(product.price)}

Producto:
${window.location.href}

¿Me pueden confirmar disponibilidad?`;

    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <>
      <div id="product-sizes" className="scroll-mt-32">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-foreground">Selecciona una talla</h2>
          <a
            href="/guia-de-tallas"
            className="text-xs font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Ver guía de tallas
          </a>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Tallas disponibles">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setSelectedSize(size);
                setError("");
              }}
              className={cn(
                "flex min-w-11 items-center justify-center rounded-xl border px-3 py-2 text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/50",
              )}
              aria-pressed={selectedSize === size}
            >
              {size}
            </button>
          ))}
        </div>
        {error ? (
          <p className="mt-3 text-sm font-semibold text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="text-sm font-extrabold text-foreground">Cantidad</p>
        <div className="mt-3 inline-flex items-center rounded-full border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            aria-label="Disminuir cantidad"
            disabled={quantity === 1}
          >
            <Minus className="size-4" />
          </button>
          <output className="w-10 text-center text-sm font-extrabold" aria-live="polite">
            {quantity}
          </output>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(10, value + 1))}
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            aria-label="Aumentar cantidad"
            disabled={quantity === 10}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <Button type="button" size="lg" onClick={openWhatsApp} className="mt-7 w-full">
        <WhatsAppIcon className="size-5" />
        Consultar talla y disponibilidad
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Te responderemos directamente por WhatsApp.
      </p>

      <div className="mt-6 grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
        {["Atención personalizada", "Consulta disponibilidad antes de comprar"].map((item) => (
          <p key={item} className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="size-3" />
            </span>
            {item}
          </p>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">{product.name}</p>
            <p className="text-sm font-extrabold text-foreground">
              {selectedSize ? `Talla ${selectedSize}` : "Elige tu talla"}
            </p>
          </div>
          <Button type="button" onClick={openWhatsApp} className="shrink-0 px-4">
            <WhatsAppIcon className="size-4" />
            Consultar
          </Button>
        </div>
      </div>
    </>
  );
}

