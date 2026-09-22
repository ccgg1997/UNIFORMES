"use client";

import { useSyncExternalStore } from "react";

import { whatsappDisplay } from "@/data/products";

const subscribe = () => () => {};

/**
 * Número visible en el footer. Hidrata con el que quedó en el HTML estático
 * (`rendered`) y luego muestra el que toca hoy, sin error de hidratación.
 */
export function WhatsAppDisplay({ rendered }: { rendered: string }) {
  return useSyncExternalStore(
    subscribe,
    () => whatsappDisplay(),
    () => rendered,
  );
}
