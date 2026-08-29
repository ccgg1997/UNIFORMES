import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
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
    "Comfandi",
    "Colegios Arquidiocesanos",
  ],
  icons: { icon: "/images/brand/isotipo.webp" },
  openGraph: {
    title: "Manantial de Moda — Uniformes escolares",
    description:
      "Calidad, comodidad y presentación para acompañarlos todos los días.",
    images: ["/images/hero/estudiantes.webp"],
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
