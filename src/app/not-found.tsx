import Link from "next/link";

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
        Todo el catálogo vive en una sola página. Vuelve al inicio para ver las
        prendas disponibles.
      </p>
      <Link href="/" className="btn btn-primary mt-7 h-12 px-6">
        Volver al catálogo
      </Link>
    </div>
  );
}
