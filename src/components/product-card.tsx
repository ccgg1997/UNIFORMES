import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { getSchoolById } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const school = getSchoolById(product.schoolId);

  if (!school) return null;

  return (
    <article
      className="group min-w-0"
      style={{ "--school-accent": school.accentColor } as CSSProperties}
    >
      <Link
        href={`/producto/${product.slug}`}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={product.images[0]}
            alt={`${product.name} de ${school.name}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-foreground backdrop-blur-sm">
            {product.uniformType}
          </span>
        </div>
        <div className="px-1 pb-2 pt-4">
          <p className="text-xs font-bold text-muted-foreground">
            {school.shortName} <span aria-hidden="true">·</span> {product.category}
          </p>
          <h3 className="mt-1 line-clamp-2 text-base font-extrabold leading-snug text-foreground sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-2 text-sm font-extrabold text-primary">
            {formatPrice(product.price)}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-[0.12em] text-foreground transition-colors group-hover:text-primary">
            Ver producto <ArrowUpRight className="size-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
