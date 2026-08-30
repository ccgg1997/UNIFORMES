import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

import "./globals.css";

const GTM_ID = "GTM-5GFGPG26";
const GOOGLE_ADS_ID = "AW-18416101049";
const GOOGLE_ADS_CONVERSION_LABEL = "V9pzCLmdz-ocELnNvc1E";

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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-base" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* End Google Tag Manager */}

        {/* Google tag (gtag.js) — Google Ads */}
        <Script
          id="google-ads-lib"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
gtag('event', 'conversion', {'send_to': '${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}'});`}
        </Script>
        {/* End Google tag */}
      </head>
      <body className={`${manrope.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
