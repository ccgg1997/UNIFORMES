"use client";

import { useEffect } from "react";

import { whatsappPhone } from "@/data/products";

/**
 * Las páginas son estáticas (ISR): un HTML generado antes del corte del número
 * temporal seguiría apuntando a él después. Justo antes de navegar se reescribe
 * el número de cualquier enlace a wa.me con el que toca en ese instante, así el
 * cambio de número ocurre a la hora exacta sin depender de un nuevo build.
 */
export function WhatsAppNumberGuard() {
  useEffect(() => {
    const rewrite = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="https://wa.me/"]');
      if (!anchor) return;

      const url = new URL(anchor.href);
      const path = `/${whatsappPhone()}`;
      if (url.pathname === path) return;
      url.pathname = path;
      anchor.href = url.toString();
    };

    // Captura: corre antes que cualquier handler y antes de la navegación.
    document.addEventListener("click", rewrite, true);
    document.addEventListener("auxclick", rewrite, true);
    return () => {
      document.removeEventListener("click", rewrite, true);
      document.removeEventListener("auxclick", rewrite, true);
    };
  }, []);

  return null;
}
