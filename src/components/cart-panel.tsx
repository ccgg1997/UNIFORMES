"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";

import { CartIcon } from "@/components/cart-icon";
import { useCart } from "@/components/cart-provider";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { formatPrice, schoolName } from "@/data/products";
import { pushDataLayer } from "@/lib/analytics";
import { maxQuantityFor, prendas } from "@/lib/cart";
import { PRODUCTS_PATH } from "@/lib/routes";
import { useOverlay } from "@/lib/use-overlay";
import { orderLinesFromCart, orderWhatsAppUrl } from "@/lib/whatsapp";
import type { CartLine } from "@/types/cart";

/**
 * El panel solo se monta abierto: así su estado transitorio (el "¿seguro?" de
 * vaciar) se reinicia al cerrar sin necesidad de un efecto que lo limpie.
 */
export function CartPanel() {
  const { isOpen } = useCart();
  if (!isOpen) return null;
  return <CartSheet />;
}

/** Bottom sheet en móvil, panel derecho en escritorio. Mismo lenguaje que el
 *  drawer de producto, una capa por encima para que puedan convivir. */
function CartSheet() {
  const { cart, context, storageAvailable, close, setQuantity, remove, clear } =
    useCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const dialogRef = useOverlay<HTMLDivElement>({ open: true, onClose: close });

  // Se calcula en el render, no en el onClick: un <a> con href listo nunca
  // tropieza con el bloqueador de pop-ups.
  const orderLines = useMemo(() => orderLinesFromCart(cart), [cart]);
  const whatsappUrl = useMemo(
    () => orderWhatsAppUrl(orderLines, context),
    [orderLines, context],
  );

  // Vaciar o quitar la última prenda desmonta el botón que se acaba de pulsar:
  // el foco tiene que ir a algún sitio, no perderse en <body>.
  const rescueFocus = () => closeRef.current?.focus();

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={close}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-3xl bg-background sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2
              id={titleId}
              className="text-lg font-extrabold tracking-[-0.02em] text-ink"
            >
              Tu carrito
            </h2>
            <p className="mt-1 text-[12px] text-muted">
              {cart.count
                ? `${prendas(cart.count)} · una sola consulta`
                : "Consulta sin compromiso"}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
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
          {cart.lines.length ? (
            <>
              {context.inventoryStale ? (
                <p
                  role="status"
                  className="mb-4 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2 text-[11px] font-semibold text-ink"
                >
                  Mostrando el último respaldo validado del inventario: la
                  tienda confirma precio y disponibilidad por WhatsApp.
                </p>
              ) : null}

              <ul aria-label="Prendas en el carrito">
                {cart.lines.map((line) => (
                  <CartRow
                    key={line.key}
                    line={line}
                    onQuantity={setQuantity}
                    onRemove={(odooId) => {
                      if (cart.lines.length <= 1) rescueFocus();
                      remove(odooId);
                    }}
                  />
                ))}
              </ul>

              {!storageAvailable ? (
                <p className="mt-4 text-[11px] text-muted">
                  Tu navegador no permite guardar el carrito, así que se pierde
                  al recargar la página.
                </p>
              ) : null}
            </>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <span
                aria-hidden="true"
                className="grid size-14 place-items-center rounded-full bg-surface text-primary"
              >
                <CartIcon className="size-6" />
              </span>
              <p className="mt-4 text-[15px] font-bold text-ink">
                Tu carrito está vacío
              </p>
              <p className="mt-1.5 max-w-[16rem] text-[13px] text-muted">
                Agrega las prendas que te interesan y consúltalas todas en un
                solo mensaje de WhatsApp.
              </p>
              <Link
                href={PRODUCTS_PATH}
                onClick={close}
                className="btn btn-primary mt-5 h-11 px-5"
              >
                Ver catálogo
              </Link>
            </div>
          )}
        </div>

        {/* El pie solo existe con prendas: si no, se podría enviar un mensaje
            vacío al teléfono de la tienda. */}
        {cart.lines.length ? (
          <div className="border-t border-border bg-background px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
            <div className="flex items-baseline justify-between">
              <p className="text-[13px] text-muted">Total aproximado</p>
              <p className="text-xl font-extrabold text-ink">
                {formatPrice(cart.total)}
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                pushDataLayer({
                  event: "whatsapp_lead",
                  origen: "carrito",
                  currency: "COP",
                  value: cart.total,
                  items: orderLines.map((line) => ({
                    item_id: String(line.odooId),
                    item_name: line.name,
                    quantity: line.quantity,
                  })),
                });
                close();
              }}
              className="btn btn-primary mt-4 h-12 w-full px-5"
            >
              <WhatsAppIcon className="size-[18px]" />
              Consultar todo por WhatsApp
            </a>

            <p className="mt-3 text-center text-[11px] text-muted">
              Un solo mensaje con todas las prendas. La tienda confirma precio y
              disponibilidad.
            </p>

            {confirmClear ? (
              <div className="mt-3 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    rescueFocus();
                    setConfirmClear(false);
                    clear();
                  }}
                  className="text-[12px] font-bold text-[#c82b31] underline underline-offset-4"
                >
                  Sí, vaciar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-[12px] font-semibold text-muted underline underline-offset-4 hover:text-ink"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="mx-auto mt-3 block text-[12px] font-semibold text-muted underline underline-offset-4 transition-colors hover:text-ink"
              >
                Vaciar carrito
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Una línea ya reconciliada. Si la prenda desapareció del catálogo se rotula
 *  con lo último que supimos y lo único que se ofrece es quitarla. */
function CartRow({
  line,
  onQuantity,
  onRemove,
}: {
  line: CartLine;
  onQuantity: (odooId: number, quantity: number) => void;
  onRemove: (odooId: number) => void;
}) {
  const name = line.product?.name ?? line.stored.lastKnownName;
  const size = line.variant?.size ?? line.stored.lastKnownSize;
  const school = line.product?.school ?? line.stored.lastKnownSchool;
  const tallaTexto = size || "única";
  const tope = line.variant ? maxQuantityFor(line.variant) : line.quantity;

  return (
    <li className="relative grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-border py-4 last:border-0">
      <span className="relative block h-20 w-16 overflow-hidden rounded-xl bg-card-media">
        {line.product ? (
          <Image
            src={line.product.image}
            alt=""
            fill
            sizes="64px"
            className="object-contain"
          />
        ) : null}
      </span>

      <div className="min-w-0 pr-9">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
          {schoolName(school)}
        </p>
        <p className="mt-0.5 text-[13px] leading-snug text-ink">{name}</p>
        <p className="mt-0.5 text-[12px] text-muted">
          Talla {tallaTexto}
          {line.unitPrice !== null ? ` · ${formatPrice(line.unitPrice)} c/u` : ""}
        </p>

        {line.status === "no-disponible" ? (
          <p className="mt-1 text-[11px] font-semibold text-[#c82b31]">
            Ya no está en el catálogo. Quítala para continuar.
          </p>
        ) : null}
        {line.status === "agotada" ? (
          <p className="mt-1 text-[11px] font-semibold text-[#c82b31]">
            Sin existencias en la última actualización. Puedes preguntar cuándo
            vuelve.
          </p>
        ) : null}
        {line.status === "ajustada" ? (
          <p className="mt-1 text-[11px] font-semibold text-ink">
            Ajustamos la cantidad a las {tope} unidades disponibles.
          </p>
        ) : null}
        {line.priceChanged && line.unitPrice !== null ? (
          <p className="mt-1 text-[11px] text-muted">
            El precio cambió desde que la agregaste.
          </p>
        ) : null}

        <div className="mt-2.5 flex items-center justify-between gap-3">
          {line.variant ? (
            <div className="inline-flex items-center gap-0.5 rounded-full border border-border p-0.5">
              <button
                type="button"
                aria-label={`Quitar una unidad de ${name}, talla ${tallaTexto}`}
                onClick={() => onQuantity(line.stored.odooId, line.quantity - 1)}
                disabled={line.quantity <= 1}
                className="flex size-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
              >
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="size-3.5"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span className="w-6 text-center text-[13px] font-extrabold text-ink">
                {line.quantity}
              </span>
              <button
                type="button"
                aria-label={`Agregar una unidad de ${name}, talla ${tallaTexto}`}
                onClick={() => onQuantity(line.stored.odooId, line.quantity + 1)}
                disabled={line.status === "agotada" || line.quantity >= tope}
                className="flex size-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
              >
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="size-3.5"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          ) : (
            <span />
          )}

          {line.subtotal !== null ? (
            <p className="text-[13px] font-extrabold text-ink">
              {formatPrice(line.subtotal)}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(line.stored.odooId)}
        aria-label={`Quitar ${name}, talla ${tallaTexto}, del carrito`}
        className="absolute right-0 top-3 flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
          className="size-4"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </li>
  );
}
