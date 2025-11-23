# SEO Optimization Setup Guide

## Quick Start

The SEO optimization module is fully implemented and ready to use. This guide covers configuration and best practices.

## Environment Variables

### Required

```bash
# Base URL for canonical URLs and Open Graph tags
NEXT_PUBLIC_SITE_URL=https://forgerdigital.com
```

### Optional (Search Engine Verification)

```bash
# Google Search Console verification
GOOGLE_SITE_VERIFICATION=your-verification-code

# Yandex verification
YANDEX_VERIFICATION=your-verification-code

# Yahoo verification
YAHOO_VERIFICATION=your-verification-code
```

## Files Overview

### Core SEO Files

1. **`lib/seo.ts`** - SEO utility functions
   - `generateSEOMetadata()` - Complete metadata generation
   - Schema markup generators
   - Keyword management

2. **`app/sitemap.ts`** - Dynamic sitemap generation
   - Automatically includes all pages
   - Accessible at `/sitemap.xml`

3. **`app/robots.ts`** - Dynamic robots.txt
   - Controls search engine crawling
   - Accessible at `/robots.txt`

4. **`components/seo-schema.tsx`** - Schema markup components
   - Organization, Website, Service, Breadcrumb, FAQ, Article schemas

### Page Metadata

- **`app/layout.tsx`** - Root layout with site-wide SEO
- **`app/page.tsx`** - Homepage metadata
- **`app/services/[slug]/metadata.ts`** - Service page metadata generator
- **Layout files** - Portfolio, Team, Careers, Get Started pages

## Adding SEO to New Pages

### Option 1: Using Layout (Recommended)

Create a `layout.tsx` file in your page directory:

```typescript
import { generateSEOMetadata, getDefaultKeywords } from "@/lib/seo"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

export const metadata: Metadata = generateSEOMetadata({
  title: "Your Page Title | Forger Digital",
  description: "Your page description (150-160 characters)",
  keywords: [...getDefaultKeywords(), "additional", "keywords"],
  canonical: `${baseUrl}/your-page`,
  ogImage: `${baseUrl}/og-image.jpg`,
})

export default function YourPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

### Option 2: Using Metadata Export

For server components, export metadata directly:

```typescript
import { generateSEOMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const metadata: Metadata = generateSEOMetadata({
  title: "Your Page Title",
  description: "Your page description",
  canonical: `${baseUrl}/your-page`,
})
```

### Option 3: Using generateMetadata (Dynamic Routes)

For dynamic routes:

```typescript
import { generateSEOMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getData(params.id)
  
  return generateSEOMetadata({
    title: `${data.title} | Forger Digital`,
    description: data.description,
    canonical: `${baseUrl}/page/${params.id}`,
  })
}
```

## Adding Schema Markup

### Organization Schema (Site-wide)

Already included in `app/layout.tsx`. Update business info in `lib/seo.ts`:

```typescript
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Forger Digital",
    // ... update address, contact info, etc.
  }
}
```

### Service Schema (Service Pages)

Already included in service pages. For custom pages:

```typescript
import { ServiceSchema } from "@/components/seo-schema"

export default function YourServicePage() {
  const service = { /* your service data */ }
  
  return (
    <>
      <ServiceSchema service={service} />
      {/* Your page content */}
    </>
  )
}
```

### Breadcrumb Schema

```typescript
import { BreadcrumbSchema } from "@/components/seo-schema"

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Category", url: "/category" },
  { name: "Page", url: "/category/page" },
]

return (
  <>
    <BreadcrumbSchema items={breadcrumbs} />
    {/* Your page content */}
  </>
)
```

## Updating Sitemap

The sitemap automatically includes:
- All static pages
- All service pages (from `lib/serviceData.ts`)
- All legal pages

To add new static pages, edit `app/sitemap.ts`:

```typescript
const staticPages: MetadataRoute.Sitemap = [
  // ... existing pages
  {
    url: `${baseUrl}/your-new-page`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
]
```

## Updating Robots.txt

Edit `app/robots.ts` to modify crawling rules:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/your-private-route/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

## Testing SEO

### 1. Verify Sitemap

```bash
curl http://localhost:3000/sitemap.xml
```

Or visit: `http://localhost:3000/sitemap.xml`

### 2. Verify Robots.txt

```bash
curl http://localhost:3000/robots.txt
```

Or visit: `http://localhost:3000/robots.txt`

### 3. Check Meta Tags

View page source and verify:
- `<title>` tag
- `<meta name="description">`
- `<meta property="og:title">`
- `<meta property="og:description">`
- `<meta name="twitter:card">`
- `<link rel="canonical">`

### 4. Validate Schema Markup

1. Visit: https://search.google.com/test/rich-results
2. Enter your page URL
3. Verify schema markup is valid

### 5. Test Open Graph

1. Visit: https://www.opengraph.xyz/
2. Enter your page URL
3. Verify OG tags display correctly

## Submitting to Search Engines

### Google Search Console

1. Visit: https://search.google.com/search-console
2. Add property: `https://forgerdigital.com`
3. Verify ownership
4. Submit sitemap: `https://forgerdigital.com/sitemap.xml`

### Bing Webmaster Tools

1. Visit: https://www.bing.com/webmasters
2. Add site: `https://forgerdigital.com`
3. Verify ownership
4. Submit sitemap: `https://forgerdigital.com/sitemap.xml`

## Best Practices

### Meta Descriptions

- **Length:** 150-160 characters
- **Content:** Include primary keyword, value proposition, call-to-action
- **Uniqueness:** Each page should have a unique description

### Title Tags

- **Length:** 50-60 characters
- **Format:** `Primary Keyword | Brand Name`
- **Uniqueness:** Each page should have a unique title

### Keywords

- **Primary:** 1-2 main keywords per page
- **Secondary:** 3-5 supporting keywords
- **Location:** Include location keywords if relevant
- **Avoid:** Keyword stuffing

### Canonical URLs

- Always include canonical URL
- Use absolute URLs (with domain)
- Ensure consistency (www vs non-www)

### Schema Markup

- Use JSON-LD format (recommended by Google)
- Only include relevant schema types
- Keep schema data accurate and up-to-date

## Troubleshooting

### Sitemap Not Updating

- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check `app/sitemap.ts` includes your pages

### Meta Tags Not Showing

- Verify metadata export in page/layout
- Check for client component issues (use layout.tsx instead)
- Clear browser cache

### Schema Markup Errors

- Validate at https://search.google.com/test/rich-results
- Check JSON-LD syntax
- Ensure required fields are present

## Support

For issues or questions:
- Check `SEO_IMPLEMENTATION_REPORT.md` for detailed documentation
- Review `lib/seo.ts` for utility function usage
- Test with Google's Rich Results Test tool

---

**Last Updated:** November 22, 2025

