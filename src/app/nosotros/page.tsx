import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce Manantial de Moda y nuestra forma de acompañar a las familias en la elección de uniformes escolares.",
};

export default function AboutPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-border bg-muted/50">
        <Container className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-18">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Manantial de Moda
            </p>
            <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Uniformes hechos para acompañar cada día.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Nos especializamos en uniformes escolares y en una atención cercana que ayuda a cada familia a encontrar la prenda y la talla adecuadas.
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-card">
            <Image
              src="/images/arquidiocesanos/grupo.png"
              alt="Estudiantes usando uniformes escolares"
              fill
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-22">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [Sparkles, "Producto protagonista", "Mostramos prendas reales para que elijas con información visual clara."],
              [ShieldCheck, "Calidad confiable", "Buscamos prendas preparadas para acompañar la rutina escolar cotidiana."],
              [HeartHandshake, "Atención humana", "Cada consulta llega directamente a nuestro equipo por WhatsApp."],
            ].map(([Icon, title, text]) => {
              const FeatureIcon = Icon as typeof Sparkles;
              return (
                <article key={title as string} className="rounded-2xl border border-border bg-card p-7">
                  <FeatureIcon className="size-7 text-primary" />
                  <h2 className="mt-5 text-xl font-extrabold text-card-foreground">{title as string}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
