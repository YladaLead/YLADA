import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  /** Menos workers em paralelo no container 8 GB da Vercel (evita OOM no compile + SSG). */
  ...(isVercel
    ? {
        staticGenerationMaxConcurrency: 1,
        experimental: {
          cpus: 1,
          workerThreads: false,
          webpackMemoryOptimizations: true,
        },
      }
    : {}),
  /**
   * Predefinição 60s: em Vercel (2 vCPU) a fase "Generating static pages" com ~1300+ rotas
   * faz várias páginas falharem por timeout em paralelo. 180s reduz falhas espúrias no build.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/staticPageGenerationTimeout
   */
  staticPageGenerationTimeout: 180,
  async redirects() {
    const areas = [
      'nutri',
      'psi',
      'psicanalise',
      'odonto',
      'med',
      'coach',
      'estetica',
      'fitness',
      'nutra',
      'perfumaria',
    ]
    return [
      ...areas.map((area) => ({
        source: `/pt/pilot/${area}`,
        destination: `/pt/${area}`,
        permanent: true,
      })),
      {
        source: '/pro-lideres/membro/como-acceder',
        destination: '/pro-lideres/membro/como-acessar',
        permanent: true,
      },
    ]
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      // Configurações para Tesseract.js no servidor
      config.externals = [...(config.externals || []), 'canvas', 'jsdom']
    }
    if (!dev && isVercel) {
      config.parallelism = 1
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/pro-lideres/consultoria/responder/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

export default nextConfig;