import { generateSEOMetadata, getDefaultKeywords } from "@/lib/seo"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

export const metadata: Metadata = generateSEOMetadata({
  title: "Our Team - Expert Developers & Consultants | Forger Digital",
  description:
    "Meet the talented team at Forger Digital. Our expert developers, designers, and consultants bring years of experience in software development, cloud infrastructure, and digital transformation.",
  keywords: [
    ...getDefaultKeywords(),
    "team",
    "developers",
    "consultants",
    "experts",
    "staff",
  ],
  canonical: `${baseUrl}/team`,
  ogImage: `${baseUrl}/og-image.jpg`,
  ogType: "website",
})

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

