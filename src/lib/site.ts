/**
 * URL canónica del sitio. NEXT_PUBLIC_SITE_URL permite sobreescribirla en
 * previews; el fallback es el dominio real de producción para que el sitemap,
 * robots.txt, llms.txt y los schemas siempre emitan URLs absolutas correctas.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.manantialdemoda.com";

export const SITE_NAME = "Manantial de Moda";

/** NAP (nombre, dirección, teléfono) para el schema de negocio local y el footer. */
export const BUSINESS_ADDRESS = {
  street: "Calle 89 # 24J-54, barrio Compartir",
  city: "Cali",
  region: "Valle del Cauca",
  country: "CO",
} as const;
