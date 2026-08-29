import { ChevronRight, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { Container } from "@/components/ui/container";
import {
  getProductBySlug,
  getSchoolById,
  products,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return {};

  const school = getSchoolById(product.schoolId);

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} — ${school?.shortName ?? "Manantial de Moda"}`,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const school = getSchoolById(product.schoolId);

  if (!school) notFound();

  const related = products
    .filter((item) => item.schoolId === product.schoolId && item.id !== product.id)
    .slice(0, 4);

  return (
    <div
      className="pb-24 lg:pb-0"
      style={
        {
          "--primary": school.primaryColor,
          "--primary-hover": school.secondaryColor,
          "--accent": school.accentColor,
        } as CSSProperties
      }
    >
      <Container className="py-6 sm:py-8">
        <nav
          aria-label="Migas de pan"
          className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-xs font-semibold text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary">
            Inicio
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <Link href={`/colegios/${school.slug}`} className="hover:text-primary">
            {school.shortName}
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </Container>

      <Container className="grid gap-10 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:pb-22">
        <ProductGallery images={product.images} productName={product.name} />

        <section className="lg:sticky lg:top-28 lg:self-start" aria-labelledby="product-title">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/colegios/${school.slug}`}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary/15"
            >
              {school.shortName}
            </Link>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
              {product.uniformType}
            </span>
          </div>
          <h1
            id="product-title"
            className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-extrabold text-primary">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Info className="size-3.5" /> El valor final se confirma al revisar talla y disponibilidad.
          </p>
          <p className="mt-6 text-base leading-7 text-muted-foreground">{product.description}</p>

          <ul className="my-7 grid gap-2 rounded-2xl bg-muted p-5 text-sm text-foreground">
            {product.details.map((detail) => (
              <li key={detail} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-accent" />
                {detail}
              </li>
            ))}
          </ul>

          <ProductPurchasePanel product={product} school={school} />
        </section>
      </Container>

      {related.length ? (
        <section className="border-t border-border bg-muted py-16 sm:py-22">
          <Container>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              También te puede interesar
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Más uniformes de {school.shortName}
            </h2>
            <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
