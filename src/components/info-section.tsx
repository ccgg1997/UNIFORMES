import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { productDefinitions, schools } from "@/data/products";
import { productsHref } from "@/lib/routes";
import { BUSINESS_ADDRESS } from "@/lib/site";

const TAKEAWAYS = [
  "Uniforme diario y de educación física para Colegios Arquidiocesanos y Comfandi.",
  "Precios, tallas y existencias sincronizados a diario con el inventario de la tienda.",
  "Sin pagos en línea: eliges la prenda y confirmas el pedido por WhatsApp.",
  `Tienda física en ${BUSINESS_ADDRESS.street}, ${BUSINESS_ADDRESS.city}.`,
];

/**
 * Sección de intención de búsqueda del inicio: responde "uniformes escolares
 * en Cali" con el resumen (TL;DR), la tabla de prendas por colegio y los
 * enlaces al catálogo filtrado.
 */
export function InfoSection() {
  return (
    <section id="uniformes-cali" className="scroll-mt-24 py-14 lg:py-18">
      <div className="mx-auto w-full max-w-[820px] px-4 sm:px-6 lg:px-8">
        <SectionHeading>Uniformes escolares en Cali</SectionHeading>

        <p className="mt-6 text-[15px] leading-[1.8] text-muted">
          En <strong className="font-bold text-ink">Manantial de Moda</strong>{" "}
          vendemos los uniformes de los{" "}
          <Link
            href={productsHref("arquidiocesanos")}
            className="font-semibold text-primary hover:underline"
          >
            Colegios Arquidiocesanos
          </Link>{" "}
          y de los{" "}
          <Link
            href={productsHref("comfandi")}
            className="font-semibold text-primary hover:underline"
          >
            colegios Comfandi
          </Link>{" "}
          en Cali: prendas del uniforme diario y de educación física, con
          tallas infantiles y juveniles. Puedes revisar precios y
          disponibilidad en línea y hacer tu pedido por WhatsApp, o visitarnos
          en el barrio Compartir.
        </p>

        {/* CTA inmediatamente después del primer párrafo */}
        <div className="mt-5 flex flex-wrap gap-3">
          <WhatsAppButton className="btn btn-primary h-11 px-5 text-[13px]">
            Consultar por WhatsApp
          </WhatsAppButton>
          <Link
            href={productsHref()}
            className="btn btn-secondary h-11 px-5 text-[13px]"
          >
            Ver todas las prendas
          </Link>
        </div>

        {/* TL;DR / puntos clave */}
        <div className="mt-8 rounded-2xl border border-card-border bg-surface-blue p-5 sm:p-6">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-primary">
            En resumen
          </h3>
          <ul className="mt-3 space-y-2">
            {TAKEAWAYS.map((takeaway) => (
              <li
                key={takeaway}
                className="flex items-start gap-2.5 text-sm leading-6 text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-gold"
                >
                  <path d="M4 12l5 5L20 6" />
                </svg>
                {takeaway}
              </li>
            ))}
          </ul>
        </div>

        {/* Prendas por colegio: derivadas del catálogo para no divergir */}
        <h3 className="mt-10 text-lg font-extrabold tracking-[-0.02em] text-ink">
          Prendas disponibles por colegio
        </h3>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-card-border">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-surface-blue text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
                <th scope="col" className="px-4 py-3 sm:px-5">
                  Colegio
                </th>
                <th scope="col" className="px-4 py-3 sm:px-5">
                  Prendas
                </th>
                <th scope="col" className="px-4 py-3 sm:px-5">
                  Catálogo
                </th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id} className="border-t border-border">
                  <th
                    scope="row"
                    className="px-4 py-3.5 align-top font-bold text-ink sm:px-5"
                  >
                    {school.name}
                  </th>
                  <td className="px-4 py-3.5 align-top leading-6 text-muted sm:px-5">
                    {productDefinitions
                      .filter((product) => product.school === school.id)
                      .map((product) => product.name)
                      .join(", ")}
                  </td>
                  <td className="px-4 py-3.5 align-top sm:px-5">
                    <Link
                      href={productsHref(school.id)}
                      className="whitespace-nowrap font-bold text-primary hover:underline"
                    >
                      Ver prendas →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
