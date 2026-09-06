import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { faqItems } from "@/data/faq";

/** JSON-LD FAQPage generado desde la misma lista que se ve en pantalla. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export function FaqSection() {
  return (
    <section id="preguntas-frecuentes" className="scroll-mt-24 py-14 lg:py-18">
      <div className="mx-auto w-full max-w-[820px] px-4 sm:px-6 lg:px-8">
        <SectionHeading>Preguntas frecuentes</SectionHeading>

        <div className="mt-8 space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-card-border bg-background px-5 py-4 open:bg-surface-blue"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[15px] font-bold text-ink sm:text-base">
                  {item.question}
                </h3>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary transition-transform group-open:rotate-180"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
              {item.link ? (
                <Link
                  href={item.link.href}
                  className="mt-2 inline-block text-sm font-bold text-primary hover:underline"
                >
                  {item.link.label} →
                </Link>
              ) : null}
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}
