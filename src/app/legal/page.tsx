import type { Metadata } from "next";

import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Información legal",
  description: "Información de privacidad, tratamiento de datos y uso del catálogo Manantial de Moda.",
};

const sections = [
  {
    id: "privacidad",
    title: "Privacidad",
    paragraphs: [
      "Este catálogo no exige registro, no incluye formularios de compra y no solicita datos personales dentro del sitio. La preferencia de tema claro u oscuro se guarda únicamente en el navegador del visitante.",
      "Al abrir WhatsApp, la conversación continúa en un servicio externo sujeto a sus propias condiciones y controles de privacidad.",
    ],
  },
  {
    id: "datos",
    title: "Tratamiento de datos",
    paragraphs: [
      "La información que una persona decida compartir voluntariamente por WhatsApp se utiliza para responder consultas sobre prendas, tallas, precios y disponibilidad, y para coordinar la atención solicitada.",
      "Para consultar, actualizar o solicitar la eliminación de información compartida durante una conversación, puedes comunicarte al +57 313 353 4097.",
    ],
  },
  {
    id: "terminos",
    title: "Términos de uso",
    paragraphs: [
      "El sitio funciona como catálogo informativo: no procesa pagos ni confirma compras automáticamente. Los precios, tallas, existencias, tiempos de entrega y demás condiciones se confirman directamente por WhatsApp.",
      "Las fotografías representan las referencias disponibles y pueden presentar variaciones de color según la pantalla. La información comercial confirmada por el equipo de Manantial de Moda al momento de la consulta prevalece sobre el contenido general del catálogo.",
    ],
  },
];

export default function LegalPage() {
  return (
    <>
      <section className="border-b border-border bg-muted py-14 sm:py-18">
        <Container>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Manantial de Moda
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Información legal del catálogo
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Información clara sobre cómo funciona este sitio y cómo se atienden las consultas.
          </p>
        </Container>
      </section>
      <Container className="grid gap-6 py-14 sm:py-18">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28 rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <h2 className="text-2xl font-extrabold text-card-foreground">{section.title}</h2>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-muted-foreground">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}

