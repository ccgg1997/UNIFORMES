"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CartButton } from "@/components/cart-button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PRODUCTS_PATH } from "@/lib/routes";

const NAV: { href: string; label: string }[] = [
  { href: "/", label: "Inicio" },
  { href: PRODUCTS_PATH, label: "Productos" },
];

export function Header() {
  const pathname = usePathname();
  // "/" only matches itself; /productos stays active with ?colegio=... too.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-[6px]">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:h-[86px] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-3"
          aria-label="Manantial de Moda, ir al inicio"
        >
          <Image
            src="/images/brand/isotipo.webp"
            alt=""
            width={256}
            height={300}
            priority
            className="h-10 w-auto sm:h-14"
          />
          <Image
            src="/images/brand/wordmark.webp"
            alt="Manantial de Moda, uniformes"
            width={688}
            height={200}
            priority
            className="h-8 w-auto sm:h-12"
          />
        </Link>

        <nav
          className="ml-auto hidden items-center gap-8 md:flex"
          aria-label="Navegación principal"
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                  active ? "text-primary" : "text-ink hover:text-primary"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-8 md:gap-3">
          <CartButton />
          <WhatsAppButton className="btn btn-primary h-10 px-4 text-[13px] md:h-12 md:px-6 md:text-sm">
            <span className="hidden sm:inline">Consultar por WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </WhatsAppButton>
        </div>
      </div>

      {/* Only two destinations exist, so mobile shows them inline instead of a menu. */}
      <nav
        className="border-t border-border md:hidden"
        aria-label="Navegación principal"
      >
        <div className="mx-auto flex w-full max-w-[1180px] items-center gap-6 px-4 sm:px-6">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-3 text-sm font-semibold transition-colors ${
                  active ? "text-primary" : "text-ink"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
