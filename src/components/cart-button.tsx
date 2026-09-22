"use client";

import Link from "next/link";

import { CartIcon } from "@/components/cart-icon";
import { useCart } from "@/components/cart-provider";
import { prendas } from "@/lib/cart";
import { PRODUCTS_PATH } from "@/lib/routes";

/**
 * Abre el panel del carrito. El contador solo aparece tras hidratar (el
 * carrito vive en localStorage), así que nunca hay desajuste con el HTML.
 */
export function CartButton({ className = "" }: { className?: string }) {
  const { cart, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      className={`relative flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:size-12 ${className}`}
    >
      <CartIcon className="size-5" />
      {cart.count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-extrabold leading-none text-ink"
        >
          {cart.count > 99 ? "99+" : cart.count}
        </span>
      ) : null}
      <span className="sr-only">
        Abrir carrito
        {cart.count > 0 ? `, ${prendas(cart.count)}` : ", vacío"}
      </span>
    </button>
  );
}

/**
 * Segunda acción de la barra fija de móvil. Con el carrito vacío no tiene
 * sentido ofrecerlo, así que mantiene el enlace al catálogo que había antes;
 * en cuanto hay prendas se convierte en el acceso al carrito.
 *
 * El texto visible encabeza el nombre accesible (WCAG 2.5.3): quien use control
 * por voz puede decir "Carrito" y el control responde.
 */
export function MobileCartAction() {
  const { cart, open } = useCart();

  if (cart.count === 0) {
    return (
      <Link
        href={PRODUCTS_PATH}
        className="btn btn-secondary h-12 flex-1 px-4 text-[13px]"
      >
        <span className="sm:hidden">Catálogo</span>
        <span className="hidden sm:inline">Ver catálogo</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className="btn btn-secondary h-12 flex-1 px-4 text-[13px]"
    >
      <CartIcon className="size-[18px]" />
      <span>Carrito ({cart.count})</span>
      <span className="sr-only">, {prendas(cart.count)}</span>
    </button>
  );
}
