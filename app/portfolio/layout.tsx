import { generateSEOMetadata, getDefaultKeywords } from "@/lib/seo"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

export const metadata: Metadata = generateSEOMetadata({
  title: "Portfolio - Our Projects & Success Stories | Forger Digital",
  description:
    "Explore Forger Digital's portfolio of successful projects. See how we've helped businesses transform with custom software, web applications, and digital solutions.",
  keywords: [
    ...getDefaultKeywords(),
    "portfolio",
    "projects",
    "case studies",
    "success stories",
    "client work",
  ],
  canonical: `${baseUrl}/portfolio`,
  ogImage: `${baseUrl}/og-image.jpg`,
  ogType: "website",
})

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

