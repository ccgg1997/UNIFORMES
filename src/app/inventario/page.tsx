import type { Metadata } from "next";

import { formatPrice } from "@/data/products";
import { getInventory } from "@/lib/inventory";

export const metadata: Metadata = {
  title: "Inventario",
  // Página de consulta interna: no debe aparecer en Google.
  robots: { index: false, follow: false },
};

export default async function InventarioPage() {
  const { products, updatedAt, stale, received, truncated, excluded, missing } =
    await getInventory();

  const totalUnidades = products.reduce(
    (total, product) =>
      total + product.sizes.reduce((sum, size) => sum + size.stock, 0),
    0,
  );

  return (
    <section className="min-h-[70svh] bg-surface-blue py-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <h1 className="text-[1.6rem] font-extrabold tracking-[-0.025em] text-ink sm:text-[2rem]">
          Inventario
        </h1>
        <p className="mt-2 text-[13px] text-muted sm:text-sm">
          {products.length} productos · {totalUnidades} unidades · actualizado{" "}
          <time dateTime={updatedAt}>
            {new Date(updatedAt).toLocaleString("es-CO", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        </p>

        {truncated ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-[#c82b31]/40 bg-[#c82b31]/10 px-4 py-3 text-[13px] font-semibold text-ink"
          >
            El MCP devolvió una respuesta incompleta de {received} variantes.
            {missing.length ? ` Faltan: ${missing.join(", ")}.` : ""} Se
            mantiene el último respaldo completo; revisa que el nodo Odoo de
            n8n tenga activa la opción <b>Return All</b>.
          </p>
        ) : null}

        {excluded.length ? (
          <p className="mt-4 text-[13px] text-muted">
            Excluidos a propósito: {excluded.join(", ")}.
          </p>
        ) : null}

        {stale ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-[13px] font-semibold text-ink"
          >
            No se pudo consultar Odoo. Estos datos son del último respaldo
            guardado, no del inventario en vivo.
          </p>
        ) : null}

        <div className="mt-8 space-y-6">
          {products.map((product) => (
            <div
              key={product.odooName}
              className="overflow-hidden rounded-2xl border border-card-border bg-background"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
                <h2 className="text-[15px] font-extrabold text-ink">
                  {product.odooName}
                </h2>
                <p className="text-[13px] text-muted">
                  {product.sizes.reduce((sum, size) => sum + size.stock, 0)}{" "}
                  unidades
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[380px] border-collapse text-left">
                  <thead>
                    <tr className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
                      <th scope="col" className="px-4 py-2 sm:px-5">
                        Talla
                      </th>
                      <th scope="col" className="px-4 py-2 text-right sm:px-5">
                        Cantidad
                      </th>
                      <th scope="col" className="px-4 py-2 text-right sm:px-5">
                        Precio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizes.map((size) => (
                      <tr
                        key={size.odooId}
                        className="border-t border-border text-sm text-ink"
                      >
                        <th
                          scope="row"
                          className="px-4 py-2.5 font-bold sm:px-5"
                        >
                          {size.size}
                        </th>
                        <td
                          className={`px-4 py-2.5 text-right font-bold tabular-nums sm:px-5 ${
                            size.stock <= 0 ? "text-[#c82b31]" : "text-ink"
                          }`}
                        >
                          {size.stock}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-muted sm:px-5">
                          {formatPrice(size.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
