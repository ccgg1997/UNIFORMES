import Image from "next/image";

import { SchoolDoodles } from "@/components/school-doodles";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { WHATSAPP_DISPLAY, WHATSAPP_PHONE } from "@/data/products";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <SchoolDoodles
        className="pointer-events-none absolute -right-4 -top-6 h-[190%] w-auto opacity-70"
      />

      <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-4 pb-14 pt-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-4">
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
            <p className="mt-0.5 text-[13px] text-muted">Uniformes escolares</p>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold text-ink transition-colors hover:text-primary"
            >
              <WhatsAppIcon className="size-4 text-whatsapp" />
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        <p className="text-[13px] text-muted md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          © 2024 Manantial de Moda. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
