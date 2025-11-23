import { generateSEOMetadata, getDefaultKeywords } from "@/lib/seo"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

export const metadata: Metadata = generateSEOMetadata({
  title: "Careers - Join Our Team | Forger Digital",
  description:
    "Join Forger Digital and work on cutting-edge software projects. We're hiring talented developers, designers, and consultants. Remote and on-site positions available.",
  keywords: [
    ...getDefaultKeywords(),
    "careers",
    "jobs",
    "hiring",
    "employment",
    "remote jobs",
    "software jobs",
  ],
  canonical: `${baseUrl}/careers`,
  ogImage: `${baseUrl}/og-image.jpg`,
  ogType: "website",
})

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

