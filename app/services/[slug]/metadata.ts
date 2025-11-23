import { generateSEOMetadata, getDefaultKeywords } from "@/lib/seo"
import { getServiceBySlug } from "@/lib/serviceData"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

/**
 * Generate SEO metadata for service pages
 */
export function generateServiceMetadata(slug: string): Metadata {
  const service = getServiceBySlug(slug)
  
  if (!service) {
    return generateSEOMetadata({
      title: "Service Not Found",
      description: "The requested service page could not be found.",
      canonical: `${baseUrl}/services/${slug}`,
    })
  }

  const keywords = [
    ...getDefaultKeywords(),
    service.title.toLowerCase(),
    service.category.toLowerCase(),
    ...service.technologies.map((tech) => tech.toLowerCase()),
  ]

  return generateSEOMetadata({
    title: `${service.title} - Forger Digital`,
    description: `${service.description} ${service.detailedContent.substring(0, 100)}...`,
    keywords,
    canonical: `${baseUrl}/services/${service.slug}`,
    ogImage: `${baseUrl}/og-image.jpg`,
    ogType: "website",
  })
}

