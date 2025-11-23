import { MetadataRoute } from "next"

/**
 * Dynamic Robots.txt Generation
 * Controls search engine crawling behavior
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

  // Allow all crawlers by default
  // Disallow admin, dashboard, and API routes
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
          "/auth/",
          "/_next/",
          "/payment/",
          "/support/tickets/",
        ],
      },
      // Google-specific rules
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
          "/auth/",
          "/_next/",
          "/payment/",
          "/support/tickets/",
        ],
      },
      // Bing-specific rules
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
          "/auth/",
          "/_next/",
          "/payment/",
          "/support/tickets/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

