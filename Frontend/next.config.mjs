/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  outputFileTracingRoot: process.cwd(),
  // Empty turbopack config to silence the warning
  turbopack: {},
}

export default nextConfig
