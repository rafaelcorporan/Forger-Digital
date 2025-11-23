import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/config.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable all development overlay indicators - ABSOLUTELY
  devIndicators: false,
  // Disable build indicator
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Disable error overlay in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Completely disable Next.js development overlays
  reactStrictMode: true,
  // HTTPS redirection (for platforms that support it)
  async redirects() {
    // Note: Most platforms (Vercel, etc.) handle HTTPS automatically
    // This is a fallback for self-hosted deployments
    const forceHTTPS = process.env.FORCE_HTTPS === "true"
    const isProduction = process.env.NODE_ENV === "production"

    if (forceHTTPS || isProduction) {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://:host/:path*',
          permanent: true,
        },
      ]
    }

    return []
  },
  // Security headers (additional to middleware CSP)
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Download-Options',
            value: 'noopen'
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
