"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  CART_MAX_QUANTITY,
  createStoredLine,
  indexVariants,
  reconcileCart,
} from "@/lib/cart";
import * as cartStore from "@/lib/cart-store";
import type { Cart, OrderContext } from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";

type Announcement = { id: number; text: string };

type CartApi = {
  cart: Cart;
  /** Procedencia de los precios: fecha el mensaje de WhatsApp. */
  context: OrderContext;
  /** false cuando el navegador bloquea localStorage: no sobrevive al reload. */
  storageAvailable: boolean;
  isOpen: boolean;
  announcements: Announcement[];
  add: (product: Product, variant: ProductVariant, quantity: number) => void;
  setQuantity: (odooId: number, quantity: number) => void;
  remove: (odooId: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartApi | null>(null);

/**
 * Lo monta el root layout dentro de <body>, envolviendo header, main, footer,
 * barra móvil y panel: el carrito tiene que verse en todas las rutas, así que
 * este es el punto más profundo del árbol que los cubre a todos.
 *
 * `products` llega ya resuelto desde el servidor (getCatalog()) porque la
 * reconciliación necesita precio y stock vivos también en rutas sin grilla.
 */
export function CartProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const stored = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // `products` solo cambia en navegación dura (el layout no se re-renderiza en
  // las soft), así que estos memos son estables durante toda la sesión.
  const index = useMemo(() => indexVariants(products), [products]);
  const cart = useMemo(() => reconcileCart(stored, index), [stored, index]);

  const context = useMemo<OrderContext>(
    () => ({
      inventoryUpdatedAt: products[0]?.inventoryUpdatedAt ?? "",
      inventoryStale: products[0]?.inventoryStale ?? false,
    }),
    [products],
  );

  /**
   * Una cola, no un string: repetir el mismo texto no muta el DOM y el lector
   * de pantalla se quedaría callado justo al agregar dos veces la misma talla.
   */
  const announce = useCallback((text: string) => {
    setAnnouncements((current) => [
      ...current.slice(-3),
      { id: current.length ? current[current.length - 1].id + 1 : 1, text },
    ]);
  }, []);

  const add = useCallback(
    (product: Product, variant: ProductVariant, quantity: number) => {
      cartStore.addLine(
        createStoredLine(product, variant, quantity),
        CART_MAX_QUANTITY,
      );
      announce(
        `${product.name}, talla ${variant.size || "única"}, agregada al carrito.`,
      );
    },
    [announce],
  );

  const setQuantity = useCallback(
    (odooId: number, quantity: number) => {
      const hit = index.get(odooId);
      // Sin variante viva no hay tope que respetar: lo único razonable sobre
      // una línea huérfana es quitarla.
      if (!hit) return;
      cartStore.setQuantity(odooId, quantity, CART_MAX_QUANTITY);
    },
    [index],
  );

  const remove = useCallback(
    (odooId: number) => {
      cartStore.removeLine(odooId);
      announce("Prenda quitada del carrito.");
    },
    [announce],
  );

  const clear = useCallback(() => {
    cartStore.clear();
    announce("Carrito vacío.");
  }, [announce]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartApi>(
    () => ({
      cart,
      context,
      storageAvailable: cartStore.isWritable(),
      isOpen,
      announcements,
      add,
      setQuantity,
      remove,
      clear,
      open,
      close,
    }),
    [
      cart,
      context,
      isOpen,
      announcements,
      add,
      setQuantity,
      remove,
      clear,
      open,
      close,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Cada anuncio es un nodo nuevo: insertarlo SÍ es una mutación y por eso
          se lee en voz alta aunque el texto se repita. */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcements.map((item) => (
          <p key={item.id}>{item.text}</p>
        ))}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return context;
}
