import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const deploymentHost =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(deploymentHost),
  title: {
    default: "Manantial de Moda | Uniformes escolares",
    template: "%s | Manantial de Moda",
  },
  description:
    "Catálogo de uniformes escolares para Colegios Arquidiocesanos y Comfandi. Consulta tallas y disponibilidad por WhatsApp.",
  keywords: [
    "uniformes escolares",
    "Manantial de Moda",
    "uniformes Cali",
    "Comfandi",
    "Colegios Arquidiocesanos",
  ],
  icons: {
    icon: "/images/brand/manantial-logo.png",
  },
  openGraph: {
    title: "Manantial de Moda — Uniformes escolares",
    description: "Calidad, comodidad y presentación para acompañarlos todos los días.",
    images: ["/images/arquidiocesanos/grupo.png"],
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#071426" },
  ],
  colorScheme: "light dark",
};

const themeBootScript = `
  try {
    const saved = localStorage.getItem('manantial-theme');
    const dark = saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (_) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className={`${manrope.variable} ${cormorant.variable} antialiased`}>
        <a
          href="#contenido"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
