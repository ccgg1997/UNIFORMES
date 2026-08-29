import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getProductsBySchool, getSchoolBySlug, schools } from "@/lib/catalog";

type SchoolPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return schools.map((school) => ({ slug: school.slug }));
}

export async function generateMetadata({ params }: SchoolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);

  if (!school) return {};

  return {
    title: `Uniformes ${school.shortName}`,
    description: school.description,
    openGraph: {
      images: [school.coverImage],
    },
  };
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);

  if (!school) notFound();

  const schoolProducts = getProductsBySchool(school.id);

  return (
    <div
      style={
        {
          "--school-primary": school.primaryColor,
          "--school-secondary": school.secondaryColor,
          "--school-accent": school.accentColor,
          "--primary": school.primaryColor,
          "--primary-hover": school.secondaryColor,
          "--accent": school.accentColor,
        } as CSSProperties
      }
    >
      <section className="school-grid-pattern overflow-hidden border-b border-border bg-muted/45">
        <Container className="grid items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div>
            <nav className="text-xs font-bold text-muted-foreground" aria-label="Migas de pan">
              <Link href="/" className="hover:text-primary">
                Inicio
              </Link>{" "}
              <span aria-hidden="true">/</span>{" "}
              <span>{school.shortName}</span>
            </nav>
            <span
              className="mt-8 block h-1.5 w-14 rounded-full"
              style={{ backgroundColor: school.accentColor }}
            />
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Catálogo por colegio
            </p>
            <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Uniformes {school.shortName}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              {school.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground">
              {["Productos reales", "Asesoría de talla", "Consulta por WhatsApp"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" /> {item}
                </span>
              ))}
            </div>
            <Link
              href={`/uniformes?colegio=${school.id}`}
              className={`${buttonVariants({ size: "lg" })} mt-8`}
            >
              Explorar uniformes <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-card">
            <Image
              src={school.coverImage}
              alt={`Estudiantes con uniformes ${school.name}`}
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
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Prendas disponibles
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Elige tu uniforme
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Los precios y la disponibilidad se confirman al momento de tu consulta para ofrecerte información actualizada.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {schoolProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-muted py-14 sm:py-18">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">¿Necesitas ayuda con la talla?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Consulta la guía antes de escribirnos y tendremos una conversación más ágil.
            </p>
          </div>
          <Link href="/guia-de-tallas" className={buttonVariants({ variant: "secondary" })}>
            Ver guía de tallas <ArrowRight className="size-4" />
          </Link>
        </Container>
      </section>
    </div>
  );
}
