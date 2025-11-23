import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import { ErrorBoundary } from "@/components/error-boundary"
import { CookieConsent } from "@/components/cookie-consent"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { DevIndicatorRemover } from "@/components/dev-indicator-remover"
import { headers } from "next/headers"
import { SkipLinks } from "@/components/ui/skip-links"
import { AriaLiveRegion } from "@/components/ui/aria-live-region"
import { generateSEOMetadata, getDefaultKeywords } from "@/lib/seo"
import { OrganizationSchema, WebsiteSchema } from "@/components/seo-schema"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

export const metadata: Metadata = generateSEOMetadata({
  title: "Forger Digital - Custom Software Development & Digital Solutions",
  description:
    "Forger Digital provides cutting-edge digital solutions - custom software development, web applications, cloud infrastructure, and AI-powered automation services. Transform your business with expert technology solutions.",
  keywords: getDefaultKeywords(),
  canonical: baseUrl,
  ogImage: `${baseUrl}/og-image.jpg`,
  ogType: "website",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get nonce from headers (set by middleware)
  const headersList = await headers()
  const nonce = headersList.get("x-csp-nonce") || ""

  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Add nonce to meta tag for client-side access */}
        {nonce && <meta name="csp-nonce" content={nonce} />}
        {/* SEO Schema Markup */}
        <OrganizationSchema />
        <WebsiteSchema />
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=yes" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`font-sans antialiased`}>
        <SkipLinks />
        <AriaLiveRegion />
        <ErrorBoundary>
          <Providers>
            {children}
            <CookieConsent />
            <AnalyticsProvider />
          </Providers>
        </ErrorBoundary>
        <Analytics />
        <DevIndicatorRemover />
      </body>
    </html>
  )
}
