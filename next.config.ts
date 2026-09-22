import type { NextConfig } from "next";

/**
 * Las fotos se renombraron para que el archivo diga la prenda real de Odoo
 * (comfandi-pantalon-azul.webp era en realidad la sudadera). Los redirects
 * evitan que las URLs viejas queden en 404 en Google Imágenes: en Next 16 los
 * redirects se evalúan antes del sistema de archivos, incluido /public.
 */
const IMAGENES_RENOMBRADAS: [string, string][] = [
  ["comfandi-pantalon-azul", "comfandi-sudadera"],
  ["comfandi-camiseta-blanca", "comfandi-camibuso"],
  ["arqui-camisa-blanca", "arqui-guayabera-gruesa"],
  ["arqui-jardinera-diaria", "arqui-jardinera"],
  ["arqui-camiseta-educacion-fisica", "arqui-camisa-educacion-fisica"],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // el badge de dev tapaba el footer; sin él los errores igual se muestran
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  async redirects() {
    return IMAGENES_RENOMBRADAS.map(([antes, ahora]) => ({
      source: `/images/productos/${antes}.webp`,
      destination: `/images/productos/${ahora}.webp`,
      permanent: true,
    }));
  },
};

export default nextConfig;
