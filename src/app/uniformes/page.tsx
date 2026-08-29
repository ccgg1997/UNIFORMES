import type { Metadata } from "next";

import { CatalogClient } from "@/components/catalog-client";
import { Container } from "@/components/ui/container";
import { products, schools } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo de uniformes",
  description:
    "Explora uniformes escolares por colegio, tipo, categoría y talla. Consulta disponibilidad directamente por WhatsApp.",
};

type CatalogPageProps = {
  searchParams: Promise<{
    colegio?: string | string[];
    uniforme?: string | string[];
  }>;
};

export default async function UniformesPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const school = Array.isArray(params.colegio) ? params.colegio[0] : params.colegio;
  const uniform = Array.isArray(params.uniforme) ? params.uniforme[0] : params.uniforme;
  const normalizedSchool = schools.some((item) => item.id === school) ? school : "";
  const normalizedUniform = ["Diario", "Educación física", "Completo"].includes(
    uniform ?? "",
  )
    ? uniform
    : "";

  return (
    <>
      <section className="border-b border-border bg-muted/60 py-12 sm:py-16">
        <Container>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Catálogo Manantial
          </p>
          <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Encuentra el uniforme que necesitas
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Busca por colegio, tipo de uniforme, categoría o talla. Cuando lo encuentres, consulta disponibilidad directamente con nosotros.
          </p>
        </Container>
      </section>
      <CatalogClient
        key={`${normalizedSchool}-${normalizedUniform}`}
        products={products}
        initialSchool={normalizedSchool}
        initialUniform={normalizedUniform}
      />
    </>
  );
}
