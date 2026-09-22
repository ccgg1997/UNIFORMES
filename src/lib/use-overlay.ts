"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Capas modales compartidas (drawer de producto, su ampliación de foto y el
 * panel del carrito).
 *
 * Resuelve tres cosas que antes vivían sueltas en product-drawer.tsx:
 *  - Escape: solo responde la capa de arriba de la pila, así la ampliación se
 *    cierra antes que el drawer sin necesidad de un caso especial.
 *  - Bloqueo de scroll: se cuenta, para que cerrar una capa no devuelva el
 *    scroll mientras otra sigue abierta.
 *  - Foco: se atrapa dentro del diálogo y se devuelve a quien lo abrió.
 */

const stack: symbol[] = [];
let lockCount = 0;

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function useOverlay<T extends HTMLElement>({
  open,
  onClose,
  initialFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<T>(null);

  // onClose cambia de identidad en cada render del padre; si entrara en las
  // deps, el efecto se reiniciaría —y robaría el foco— sin motivo.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const id = Symbol("capa");
    stack.push(id);

    const opener = document.activeElement as HTMLElement | null;
    const target =
      initialFocusRef?.current ??
      containerRef.current?.querySelector<HTMLElement>(FOCUSABLE) ??
      null;
    target?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;

      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;
      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((node) => node.offsetParent !== null);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      // Ambas ramas contemplan el foco FUERA del contenedor: si no, un clic en
      // el telón (que vive fuera del diálogo) deja escapar el Tab a la página.
      const outside = !container.contains(active);

      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    lockCount += 1;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      stack.splice(stack.indexOf(id), 1);
      lockCount -= 1;
      if (lockCount === 0) document.body.style.overflow = "";
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, initialFocusRef]);

  return containerRef;
}
