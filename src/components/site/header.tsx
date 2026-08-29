"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { WHATSAPP_PHONE } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/#colegios", label: "Colegios" },
  { href: "/uniformes", label: "Uniformes" },
  { href: "/guia-de-tallas", label: "Guía de tallas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

const generalMessage = encodeURIComponent(
  "Hola Manantial de Moda 👋\n\nQuiero recibir asesoría para elegir un uniforme escolar. ¿Me pueden ayudar?",
);

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-3">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Manantial de Moda, ir al inicio"
        >
          <Image
            src="/images/brand/manantial-logo.png"
            alt="Manantial de Moda Uniformes"
            width={1448}
            height={1086}
            loading="eager"
            className="h-16 w-22 object-contain sm:w-24"
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Navegación principal">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href.startsWith("/uniformes") && pathname.startsWith("/uniformes");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active && "bg-muted text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/uniformes"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden sm:inline-flex")}
            aria-label="Buscar uniformes"
          >
            <Search className="size-4" />
          </Link>
          <ThemeToggle />
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${generalMessage}`}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden whitespace-nowrap md:inline-flex",
            )}
          >
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div id="mobile-navigation" className="border-t border-border bg-background xl:hidden">
          <Container className="py-4">
            <nav className="grid gap-1" aria-label="Navegación móvil">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${generalMessage}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants(), "mt-3")}
              >
                <WhatsAppIcon className="size-4" />
                Consultar por WhatsApp
              </a>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
