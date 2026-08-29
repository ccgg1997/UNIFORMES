import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { Container } from "@/components/ui/container";
import { WHATSAPP_PHONE } from "@/lib/catalog";

const footerLinks = [
  {
    title: "Catálogo",
    links: [
      ["Uniformes", "/uniformes"],
      ["Colegios", "/#colegios"],
      ["Guía de tallas", "/guia-de-tallas"],
    ],
  },
  {
    title: "Manantial",
    links: [
      ["Nosotros", "/nosotros"],
      ["Contacto", "/#contacto"],
    ],
  },
  {
    title: "Ayuda",
    links: [
      ["Preguntas frecuentes", "/#preguntas"],
      ["Tallas", "/guia-de-tallas"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacidad", "/legal#privacidad"],
      ["Tratamiento de datos", "/legal#datos"],
      ["Términos", "/legal#terminos"],
    ],
  },
];

export function Footer() {
  return (
    <footer id="contacto" className="bg-navy text-white">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.35fr_2fr] lg:py-18">
        <div>
          <div className="inline-flex rounded-2xl bg-white p-2">
            <Image
              src="/images/brand/manantial-logo.png"
              alt="Manantial de Moda Uniformes"
              width={1448}
              height={1086}
              className="h-24 w-32 object-contain"
            />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
            Uniformes escolares con calidad, comodidad y atención personalizada para cada etapa.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-white/80">
            <a
              className="flex items-center gap-3 transition-colors hover:text-accent"
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon className="size-4 text-accent" />
              +57 313 353 4097
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="size-4 text-accent" />
              Cali, Colombia
            </span>
            <span className="flex items-center gap-3">
              <Mail className="size-4 text-accent" />
              Atención directa por WhatsApp
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
                {section.title}
              </h2>
              <ul className="mt-4 grid gap-3 text-sm text-white/70">
                {section.links.map(([label, href]) => (
                  <li key={label}>
                    <Link className="transition-colors hover:text-white" href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Manantial de Moda. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <Phone className="size-3" /> Atención personalizada, sin carrito ni intermediarios.
          </p>
        </Container>
      </div>
    </footer>
  );
}
