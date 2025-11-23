/**
 * SEO Utility Functions
 * Comprehensive SEO metadata generation and optimization utilities
 */

import type { Metadata } from "next"

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: "website" | "article" | "profile"
  noindex?: boolean
  nofollow?: boolean
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"
const SITE_NAME = "Forger Digital"
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

/**
 * Generate comprehensive SEO metadata
 */
export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = "website",
    noindex = false,
    nofollow = false,
  } = config

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = canonical || SITE_URL

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@forgerdigital",
      site: "@forgerdigital",
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  }
}

/**
 * Generate Organization Schema (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: "Forger Digital provides cutting-edge digital solutions - custom software development, web applications, cloud infrastructure, and AI-powered automation services.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-347-829-4952",
      contactType: "Customer Service",
      email: "hello@forgerdigital.com",
      areaServed: "US",
      availableLanguage: ["en"],
    },
    sameAs: [
      "https://www.linkedin.com/company/forger-digital",
      "https://twitter.com/forgerdigital",
      "https://www.facebook.com/forgerdigital",
    ],
  }
}

/**
 * Generate Website Schema (JSON-LD)
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/api/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/**
 * Generate Service Schema (JSON-LD)
 */
export function generateServiceSchema(service: {
  name: string
  description: string
  url: string
  provider?: string
  areaServed?: string
  serviceType?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: service.provider || SITE_NAME,
      url: SITE_URL,
    },
    areaServed: service.areaServed || "US",
    serviceType: service.serviceType || "Digital Services",
    url: service.url,
  }
}

/**
 * Generate Breadcrumb Schema (JSON-LD)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate FAQ Schema (JSON-LD)
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
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
}

/**
 * Generate Article Schema (JSON-LD)
 */
export function generateArticleSchema(article: {
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
  publisher?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: article.image || DEFAULT_OG_IMAGE,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: article.publisher || SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  }
}

/**
 * Get default SEO keywords for the site
 */
export function getDefaultKeywords(): string[] {
  return [
    "custom software development",
    "web application development",
    "mobile app development",
    "cloud infrastructure",
    "AI automation",
    "digital transformation",
    "enterprise solutions",
    "software consulting",
    "San Francisco",
    "California",
    "Forger Digital",
  ]
}

