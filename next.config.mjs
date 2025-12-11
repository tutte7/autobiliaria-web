/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-dev.autobiliaria.cloud', // Autorizamos al servidor de desarrollo
      },
      {
        protocol: 'https',
        hostname: 'api.autobiliaria.cloud',     // Autorizamos al de producción (por si acaso)
      },
      {
        protocol: 'https',
        hostname: 'http2.mlstatic.com',         // Por si usaste fotos de prueba de ML
      },
    ],
  },
};

export default nextConfig;