import type { NextConfig } from "next";

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
};

export default nextConfig;
