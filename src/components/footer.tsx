import Image from "next/image";
import Link from "next/link";

import { SchoolDoodles } from "@/components/school-doodles";
import { ShareButton } from "@/components/share-button";
import { WhatsAppDisplay } from "@/components/whatsapp-display";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappDisplay, whatsappPhone } from "@/data/products";
import { productsHref } from "@/lib/routes";
import { BUSINESS_ADDRESS } from "@/lib/site";

/** Interlinkeado del sitio: las mismas rutas que usan el header y las cards. */
const FOOTER_LINKS = [
  { href: "/", label: "Inicio" },
  { href: productsHref(), label: "Todos los productos" },
  { href: productsHref("arquidiocesanos"), label: "Uniformes Arquidiocesanos" },
  { href: productsHref("comfandi"), label: "Uniformes Comfandi" },
  { href: "/#preguntas-frecuentes", label: "Preguntas frecuentes" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <SchoolDoodles
        className="pointer-events-none absolute -right-4 -top-6 h-[190%] w-auto opacity-70"
      />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex items-start gap-4">
            <Image
              src="/images/brand/logo.webp"
              alt="Manantial de Moda"
              width={505}
              height={420}
              className="h-14 w-auto"
            />
            <div>
              <p className="text-[13px] font-extrabold text-ink">
                Manantial de Moda
              </p>
              <p className="mt-0.5 text-[13px] text-muted">
                Uniformes escolares en {BUSINESS_ADDRESS.city}
              </p>
              <p className="mt-2 text-[13px] text-muted">
                {BUSINESS_ADDRESS.street}
                <br />
                {BUSINESS_ADDRESS.city}, {BUSINESS_ADDRESS.region}
              </p>
              <a
                href={`https://wa.me/${whatsappPhone()}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold text-ink transition-colors hover:text-primary"
              >
                <WhatsAppIcon className="size-4 text-whatsapp" />
                <WhatsAppDisplay rendered={whatsappDisplay()} />
              </a>
            </div>
          </div>

          <nav aria-label="Enlaces del sitio">
            <p className="text-[13px] font-extrabold text-ink">Explora</p>
            <ul className="mt-2 space-y-1.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[13px] font-extrabold text-ink">
              ¿Conoces a otra familia del colegio?
            </p>
            <p className="mt-1 max-w-[240px] text-[13px] text-muted">
              Comparte el catálogo con quien también necesite uniformes.
            </p>
            <ShareButton className="btn btn-secondary mt-3 h-10 px-4 text-[13px]" />
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-5 text-[13px] text-muted">
          © {new Date().getFullYear()} Manantial de Moda. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
