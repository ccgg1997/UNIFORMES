import Link from "next/link";

import { WhatsAppButton } from "@/components/whatsapp-button";
import { PRODUCTS_PATH } from "@/lib/routes";

/**
 * CTA fijo solo en móvil: en pantallas pequeñas el hero oculta sus botones,
 * así que WhatsApp y el catálogo quedan siempre a un toque del pulgar.
 * z-40 lo deja debajo del header (z-50) y del drawer de producto (z-60).
 */
export function MobileCtaBar() {
  return (
    <>
      {/* separador: evita que la barra tape el final del footer */}
      <div aria-hidden="true" className="h-[76px] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 backdrop-blur-[6px] [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
        <div className="mx-auto flex w-full max-w-[1180px] gap-3">
          <WhatsAppButton className="btn btn-primary h-12 flex-1 px-4 text-[13px]">
            Pedir por WhatsApp
          </WhatsAppButton>
          <Link
            href={PRODUCTS_PATH}
            className="btn btn-secondary h-12 flex-1 px-4 text-[13px]"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </>
  );
}
