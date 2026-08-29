import { Info, Ruler } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { WHATSAPP_PHONE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Guía de tallas",
  description: "Recomendaciones para elegir la talla de uniformes escolares Manantial de Moda.",
};

const sizeSteps = [
  ["1", "Mide sobre ropa ligera", "Usa una cinta métrica sin apretarla contra el cuerpo."],
  ["2", "Compara las medidas", "Ten a la mano estatura, pecho, cintura y cadera."],
  ["3", "Confirma con nosotros", "Envíanos las medidas y el producto antes de decidir."],
];

export default function SizeGuidePage() {
  const message = encodeURIComponent(
    "Hola Manantial de Moda 👋\n\nNecesito ayuda para elegir la talla de un uniforme. Tengo las medidas listas.",
  );

  return (
    <>
      <section className="border-b border-border bg-muted py-14 sm:py-20">
        <Container className="text-center">
          <Ruler className="mx-auto size-9 text-primary" />
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Compra con más confianza
          </p>
          <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Guía para elegir tu talla
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Una buena medida es el mejor punto de partida. La talla final puede variar según la prenda, por eso siempre recomendamos confirmarla con nosotros.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-22">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {sizeSteps.map(([step, title, text]) => (
              <article key={step} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                  {step}
                </span>
                <h2 className="mt-5 text-xl font-extrabold text-card-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card">
            <div className="border-b border-border p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-card-foreground">Medidas que debes tomar</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No publicamos una equivalencia genérica porque cada referencia puede tener un ajuste distinto.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-left text-sm">
                <thead className="bg-muted text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-extrabold">Medida</th>
                    <th className="px-6 py-4 font-extrabold">Cómo tomarla</th>
                    <th className="px-6 py-4 font-extrabold">Consejo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {[
                    ["Estatura", "De la coronilla al piso, sin zapatos.", "Mantén la espalda recta."],
                    ["Pecho", "Alrededor de la parte más amplia del torso.", "La cinta debe quedar horizontal."],
                    ["Cintura", "Alrededor de la cintura natural.", "No contengas la respiración."],
                    ["Cadera", "Alrededor de la parte más amplia de la cadera.", "Mide con los pies juntos."],
                  ].map(([measure, how, tip]) => (
                    <tr key={measure}>
                      <th className="px-6 py-5 font-extrabold">{measure}</th>
                      <td className="px-6 py-5 text-muted-foreground">{how}</td>
                      <td className="px-6 py-5 text-muted-foreground">{tip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-6 text-muted-foreground">
            <Info className="mt-0.5 size-5 shrink-0 text-primary" />
            <p>
              Esta guía explica cómo medir; no reemplaza la confirmación específica de la referencia. Envíanos las medidas junto con el nombre del producto para asesorarte.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center rounded-3xl bg-navy px-6 py-10 text-center text-white sm:px-10">
            <h2 className="text-3xl font-extrabold">¿Ya tienes las medidas?</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Escríbenos y revisamos contigo la talla más conveniente para la prenda seleccionada.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className={`${buttonVariants({ variant: "gold" })} mt-6`}
            >
              <WhatsAppIcon className="size-4" /> Consultar mi talla
            </a>
            <Link href="/uniformes" className="mt-4 text-sm font-bold text-white/70 hover:text-white">
              Volver al catálogo
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

