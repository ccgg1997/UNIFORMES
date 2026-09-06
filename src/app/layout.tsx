import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { WHATSAPP_PHONE } from "@/data/products";
import { BUSINESS_ADDRESS, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const GTM_ID = "GTM-5GFGPG26";
const GOOGLE_ADS_ID = "AW-18416101049";
const GOOGLE_ADS_CONVERSION_LABEL = "V9pzCLmdz-ocELnNvc1E";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // El H1 del inicio dice "Uniformes para cada etapa escolar": el título
    // apunta a la búsqueda ("uniformes escolares en Cali"), no repite el H1.
    default: "Uniformes escolares en Cali | Manantial de Moda",
    template: "%s | Manantial de Moda",
  },
  description:
    "Tienda de uniformes escolares en Cali para Colegios Arquidiocesanos y Comfandi: uniforme diario y de educación física. Revisa tallas y precios en línea y pide por WhatsApp, sin pagos en línea.",
  keywords: [
    "uniformes escolares",
    "uniformes escolares Cali",
    "Manantial de Moda",
    "uniformes Comfandi",
    "uniformes Colegios Arquidiocesanos",
  ],
  // La home no define metadata propia, así que esta canónica es la suya;
  // /productos e /inventario la sobreescriben con la ruta correspondiente.
  alternates: { canonical: "/" },
  icons: { icon: "/images/brand/isotipo.webp" },
  openGraph: {
    siteName: SITE_NAME,
    title: "Manantial de Moda — Uniformes escolares en Cali",
    description:
      "Uniformes de Colegios Arquidiocesanos y Comfandi: calidad, comodidad y presentación para acompañarlos todos los días.",
    images: ["/images/hero/estudiantes.webp"],
    locale: "es_CO",
    type: "website",
  },
};

/** Schema de negocio local: tienda física de ropa en Cali. */
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": `${SITE_URL}/#negocio`,
  name: SITE_NAME,
  description:
    "Tienda de uniformes escolares en Cali para Colegios Arquidiocesanos y Comfandi.",
  url: SITE_URL,
  telephone: `+${WHATSAPP_PHONE}`,
  image: `${SITE_URL}/images/brand/logo.webp`,
  logo: `${SITE_URL}/images/brand/logo.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS_ADDRESS.street,
    addressLocality: BUSINESS_ADDRESS.city,
    addressRegion: BUSINESS_ADDRESS.region,
    addressCountry: BUSINESS_ADDRESS.country,
  },
  currenciesAccepted: "COP",
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
        <MobileCtaBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
