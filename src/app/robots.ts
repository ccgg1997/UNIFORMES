import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /inventario es consulta interna (además lleva noindex); /api no es
      // contenido; /page/ se bloquea de forma preventiva por si algún día
      // aparece paginación autogenerada.
      disallow: ["/inventario", "/api/", "/page/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
