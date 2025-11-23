/**
 * SEO Schema Markup Components
 * JSON-LD structured data for rich search results
 */

import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo"
import type { ServiceDetail } from "@/lib/serviceData"

interface SEOSchemaProps {
  type: "organization" | "website" | "service" | "breadcrumb" | "faq" | "article"
  data?: any
}

/**
 * Organization Schema Component
 */
export function OrganizationSchema() {
  const schema = generateOrganizationSchema()
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Website Schema Component
 */
export function WebsiteSchema() {
  const schema = generateWebsiteSchema()
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Service Schema Component
 */
export function ServiceSchema({ service }: { service: ServiceDetail }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Forger Digital",
      url: baseUrl,
    },
    areaServed: "US",
    serviceType: service.category,
    url: `${baseUrl}/services/${service.slug}`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Breadcrumb Schema Component
 */
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * FAQ Schema Component
 */
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Article Schema Component
 */
export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
}: {
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: image || `${baseUrl}/og-image.jpg`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author || "Forger Digital",
    },
    publisher: {
      "@type": "Organization",
      name: "Forger Digital",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

