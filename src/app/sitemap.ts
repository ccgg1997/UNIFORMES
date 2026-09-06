import type { MetadataRoute } from "next";

import { PRODUCTS_PATH } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

/**
 * Solo las páginas indexables: /inventario lleva noindex y las variantes
 * ?colegio= canonicalizan hacia /productos, así que no se listan.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}${PRODUCTS_PATH}`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
