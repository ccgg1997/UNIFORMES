type DataLayerEvent = Record<string, unknown> & { event: string };

/**
 * GTM ya está montado en el layout; esto solo empuja eventos a su cola.
 * Cast local: no hace falta un .d.ts global para un par de pushes.
 */
export function pushDataLayer(payload: DataLayerEvent) {
  if (typeof window === "undefined") return;
  const scope = window as Window & { dataLayer?: unknown[] };
  scope.dataLayer = scope.dataLayer ?? [];
  scope.dataLayer.push(payload);
}
