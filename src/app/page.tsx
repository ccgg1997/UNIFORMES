import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  HeartHandshake,
  Ruler,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ProductCard } from "@/components/product-card";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { products, schools, WHATSAPP_PHONE } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const generalMessage = encodeURIComponent(
  "Hola Manantial de Moda 👋\n\nQuiero consultar tallas y disponibilidad de uniformes escolares. ¿Me pueden asesorar?",
);

const moments = [
  {
    title: "Uniforme de diario",
    image: "/images/arquidiocesanos/jardinera-diaria.png",
    href: "/uniformes?uniforme=Diario",
  },
  {
    title: "Educación física",
    image: "/images/arquidiocesanos/educacion-fisica.png",
    href: "/uniformes?uniforme=Educación%20física",
  },
  {
    title: "Preescolar",
    image: "/images/arquidiocesanos/campana-duo.png",
    href: `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola Manantial de Moda 👋\n\nNecesito información sobre uniformes de preescolar.")}`,
    external: true,
  },
  {
    title: "Otros uniformes",
    image: "/images/comfandi/prendas.png",
    href: `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola Manantial de Moda 👋\n\nBusco un uniforme que no veo en el catálogo. ¿Me pueden ayudar?")}`,
    external: true,
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: "Comodidad",
    text: "Diseñados para acompañar su rutina escolar.",
  },
  {
    icon: BadgeCheck,
    title: "Buena presentación",
    text: "Uniformes pensados para verse bien todos los días.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad confiable",
    text: "Prendas preparadas para el uso escolar cotidiano.",
  },
  {
    icon: HeartHandshake,
    title: "Atención personalizada",
    text: "Consulta tallas y disponibilidad directamente con nosotros.",
  },
];

export default function Home() {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

  return (
    <>
      <section className="hero-glow school-grid-pattern overflow-hidden border-b border-border">
        <Container className="grid min-h-[calc(100svh-5rem)] items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-14">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-primary backdrop-blur-sm">
              <span className="size-2 rounded-full bg-accent" />
              Catálogo de uniformes escolares
            </div>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
              Uniformes para cada{" "}
              <span className="relative whitespace-nowrap text-primary">
                etapa escolar.
                <span className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-accent/80" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              Calidad, comodidad y presentación para acompañarlos todos los días. Encuentra el uniforme de tu colegio en pocos pasos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/uniformes" className={cn(buttonVariants({ size: "lg" }), "group")}>
                Ver uniformes
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${generalMessage}`}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                <WhatsAppIcon className="size-5" />
                Consultar por WhatsApp
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-bold text-muted-foreground">
              {["Atención personalizada", "Sin pagos en línea", "Consulta de talla directa"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" /> {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
            <div className="relative ml-auto aspect-[4/5] w-[88%] overflow-hidden rounded-[2rem] bg-muted sm:w-[78%] lg:w-[82%]">
              <Image
                src="/images/arquidiocesanos/campana-duo.png"
                alt="Estudiantes con uniformes de Colegios Arquidiocesanos"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 80vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-0 w-[44%] overflow-hidden rounded-2xl border-8 border-background bg-white shadow-[0_18px_50px_rgba(7,46,99,0.16)] sm:w-[38%]">
              <div className="relative aspect-square">
                <Image
                  src="/images/comfandi/polo.webp"
                  alt="Polo blanco Comfandi"
                  fill
                  sizes="240px"
                  className="object-contain p-3"
                />
              </div>
              <p className="border-t border-slate-100 px-3 py-2 text-center text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-900 sm:text-xs">
                Productos reales
              </p>
            </div>
            <div className="absolute right-0 top-6 rounded-2xl border border-border bg-background/92 px-4 py-3 backdrop-blur-md">
              <p className="font-serif text-2xl font-bold italic text-primary">Hechos</p>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                para acompañar
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="colegios" className="py-18 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Elige tu institución"
            title="Encuentra los uniformes de tu colegio"
            description="Selecciona tu institución y encuentra fácilmente las prendas que necesitas."
            align="center"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {schools.map((school) => (
              <Link
                key={school.id}
                href={`/colegios/${school.slug}`}
                style={
                  {
                    "--school-primary": school.primaryColor,
                    "--school-accent": school.accentColor,
                  } as CSSProperties
                }
                className="group grid min-h-84 overflow-hidden rounded-3xl border border-border bg-card transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-70 overflow-hidden bg-muted md:min-h-full">
                  <Image
                    src={school.coverImage}
                    alt={`Uniformes de ${school.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-8">
                  <span
                    className="h-1 w-12 rounded-full"
                    style={{ backgroundColor: school.accentColor }}
                  />
                  <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                    Colegio
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold text-card-foreground sm:text-3xl">
                    {school.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {school.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-primary">
                    Ver uniformes
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-muted py-18 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Selección Manantial"
              title="Uniformes destacados"
              description="Conoce las prendas más consultadas y encuentra la talla que necesitas."
            />
            <Link
              href="/uniformes"
              className={cn(buttonVariants({ variant: "secondary" }), "shrink-0 self-start")}
            >
              Ver catálogo completo <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-18 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Para cada jornada"
            title="Uniformes para cada momento"
            description="Opciones pensadas para el día a día, la actividad física y cada etapa escolar."
          />
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {moments.map((moment) => {
              const content = (
                <>
                  <Image
                    src={moment.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <h3 className="text-base font-extrabold text-white sm:text-xl">{moment.title}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white/80">
                      Consultar <ArrowRight className="size-3" />
                    </span>
                  </div>
                </>
              );

              const className =
                "group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4";

              return moment.external ? (
                <a
                  key={moment.title}
                  href={moment.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {content}
                </a>
              ) : (
                <Link key={moment.title} href={moment.href} className={className}>
                  {content}
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-navy py-18 text-white sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              Comodidad para cada día
            </p>
            <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
              Uniformes que acompañan su rutina escolar.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
              Prendas cómodas, buena presentación y asesoría directa para encontrar la opción correcta.
            </p>
            <Link
              href="/colegios/comfandi"
              className={cn(buttonVariants({ variant: "gold", size: "lg" }), "mt-8")}
            >
              Ver Comfandi <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white">
            <Image
              src="/images/comfandi/grupo.png"
              alt="Estudiantes con uniforme Comfandi"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[68%_58%]"
            />
          </div>
        </Container>
      </section>

      <section className="py-18 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="La diferencia Manantial"
            title="Pensados para acompañar"
            description="Un catálogo sencillo y una atención humana para resolver lo que necesitas."
            align="center"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <benefit.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-card-foreground">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-muted py-18 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Simple y directo"
            title="Encuentra tu uniforme en 3 pasos"
            align="center"
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              ["01", "Elige tu colegio", "Selecciona la institución para ver sus prendas."],
              ["02", "Escoge talla y cantidad", "Revisa la ficha y selecciona lo que necesitas."],
              ["03", "Consulta por WhatsApp", "Confirma disponibilidad con atención personalizada."],
            ].map(([step, title, text]) => (
              <article key={step} className="text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                  {step}
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="preguntas" className="py-18 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Te ayudamos</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Preguntas frecuentes
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Si necesitas una respuesta específica, escríbenos y te asesoramos personalmente.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              ["¿Cómo confirmo la talla?", "Consulta nuestra guía y envíanos por WhatsApp la talla seleccionada. Te ayudaremos a verificarla antes de confirmar disponibilidad."],
              ["¿Los precios están publicados?", "Los valores se confirman directamente por WhatsApp para darte información actualizada según la prenda y la talla."],
              ["¿Puedo comprar directamente en la web?", "Este sitio funciona como catálogo. La atención, disponibilidad y coordinación de compra se realizan directamente por WhatsApp."],
            ].map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-border bg-card p-5">
                <summary className="cursor-pointer list-none pr-8 text-sm font-extrabold text-card-foreground marker:hidden">
                  {question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="px-4 pb-18 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground sm:px-10 sm:py-14">
          <Ruler className="mx-auto size-8 text-accent" />
          <h2 className="mt-4 text-balance text-3xl font-extrabold sm:text-4xl">
            ¿No sabes qué talla elegir?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-primary-foreground/75 sm:text-base">
            Revisa nuestra guía o escríbenos. Te ayudamos a encontrar la talla adecuada.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/guia-de-tallas" className={buttonVariants({ variant: "gold" })}>
              Ver guía de tallas
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${generalMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <WhatsAppIcon className="size-4" /> Hablar con nosotros
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
