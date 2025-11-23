import { generateSEOMetadata, getDefaultKeywords } from "@/lib/seo"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

export const metadata: Metadata = generateSEOMetadata({
  title: "Get Started - Start Your Project | Forger Digital",
  description:
    "Start your digital transformation journey with Forger Digital. Tell us about your project and we'll provide a custom solution tailored to your needs.",
  keywords: [
    ...getDefaultKeywords(),
    "get started",
    "contact",
    "quote",
    "project consultation",
    "free consultation",
  ],
  canonical: `${baseUrl}/get-started`,
  ogImage: `${baseUrl}/og-image.jpg`,
  ogType: "website",
})

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

