import { CART_STORAGE_KEY, EMPTY_CART, parseStoredCart } from "@/lib/cart";
import { CART_SCHEMA, type StoredCart, type StoredCartLine } from "@/types/cart";

/**
 * Store externo para `useSyncExternalStore`. Vive fuera de React a propósito:
 * el badge del header, la barra móvil, el panel del carrito y el drawer de
 * producto son ramas distintas del árbol y todas deben ver el mismo carrito.
 */

type Listener = () => void;

let state: StoredCart = EMPTY_CART;
let hydrated = false;
let writable = true;
const listeners = new Set<Listener>();

/**
 * En Safari privado y con cookies bloqueadas `localStorage` LANZA en vez de
 * devolver null, así que el try/catch tiene que envolver también la lectura.
 */
function read(): StoredCart {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = parseStoredCart(raw);
    // Había algo guardado pero no sirvió (esquema viejo, JSON roto, vencido):
    // se limpia para no volver a parsearlo en cada visita.
    if (raw && parsed === EMPTY_CART) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
    return parsed;
  } catch {
    writable = false;
    return EMPTY_CART;
  }
}

function write(next: StoredCart) {
  try {
    if (next.lines.length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Sin storage el carrito sigue funcionando, solo que no sobrevive al reload.
    writable = false;
  }
}

/** Init perezosa memoizada: no toca el DOM, por eso es segura desde el render. */
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = read();
}

function emit() {
  for (const listener of listeners) listener();
}

function commit(lines: StoredCartLine[]) {
  state = { v: CART_SCHEMA, updatedAt: Date.now(), lines };
  write(state);
  emit();
}

/** `storage` solo llega a las OTRAS pestañas; la propia se entera por `emit`. */
function onStorage(event: StorageEvent) {
  // key === null lo emite localStorage.clear(): también hay que atenderlo.
  if (event.key !== null && event.key !== CART_STORAGE_KEY) return;
  state = read();
  emit();
}

export function subscribe(listener: Listener) {
  ensureHydrated();
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): StoredCart {
  ensureHydrated();
  return state;
}

/**
 * React 19 usa este snapshot en el SSR y en el render de hidratación, así que
 * el primer render del cliente es idéntico al HTML: sin mismatch. Debe devolver
 * SIEMPRE la misma referencia o el render entra en bucle.
 */
export function getServerSnapshot(): StoredCart {
  return EMPTY_CART;
}

export function isWritable() {
  return writable;
}

/** Misma talla dos veces = una sola línea con las cantidades sumadas. */
export function addLine(line: StoredCartLine, max: number) {
  ensureHydrated();
  const existing = state.lines.find((item) => item.odooId === line.odooId);
  if (!existing) {
    commit([...state.lines, { ...line, quantity: Math.min(max, line.quantity) }]);
    return;
  }
  commit(
    state.lines.map((item) =>
      item.odooId === line.odooId
        ? {
            // se refrescan los lastKnown*, pero el addedAt original manda el orden
            ...item,
            ...line,
            addedAt: item.addedAt,
            quantity: Math.min(max, item.quantity + line.quantity),
          }
        : item,
    ),
  );
}

export function setQuantity(odooId: number, quantity: number, max: number) {
  ensureHydrated();
  const clamped = Math.max(1, Math.min(max, Math.floor(quantity)));
  commit(
    state.lines.map((item) =>
      item.odooId === odooId ? { ...item, quantity: clamped } : item,
    ),
  );
}

export function removeLine(odooId: number) {
  ensureHydrated();
  commit(state.lines.filter((item) => item.odooId !== odooId));
}

export function clear() {
  ensureHydrated();
  commit([]);
}
