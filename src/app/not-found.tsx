import Link from "next/link";

import { PRODUCTS_PATH } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] w-full max-w-[1180px] flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        Error 404
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
        Esta página no está en el catálogo
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-7 text-muted">
        Revisa el inicio o abre la grilla de productos para ver todas las
        prendas disponibles.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href={PRODUCTS_PATH} className="btn btn-primary h-12 px-6">
          Ver productos
        </Link>
        <Link href="/" className="btn btn-secondary h-12 px-6">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
