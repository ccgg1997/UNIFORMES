import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[65svh] flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">Error 404</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Esta página no está en el catálogo
      </h1>
      <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
        Es posible que el uniforme o colegio que buscas haya cambiado de dirección.
      </p>
      <Link href="/uniformes" className={`${buttonVariants()} mt-7`}>
        Ver todos los uniformes
      </Link>
    </Container>
  );
}

