import { Navigation } from "@/components/navigation"
import { SplineHeroComponent } from "@/components/spline-hero"
import { FeatureGrid } from "@/components/feature-grid"
import { PortfolioSection } from "@/components/portfolio-section"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { generateSEOMetadata, getDefaultKeywords } from "@/lib/seo"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

export const metadata: Metadata = generateSEOMetadata({
  title: "Forger Digital - Custom Software Development & Digital Solutions",
  description:
    "Transform your business with Forger Digital's cutting-edge software development services. Expert custom software, web applications, cloud infrastructure, and AI automation solutions. Based in San Francisco, CA.",
  keywords: [
    ...getDefaultKeywords(),
    "software development company",
    "web development services",
    "cloud solutions",
    "AI automation",
    "digital transformation consulting",
  ],
  canonical: baseUrl,
  ogImage: `${baseUrl}/og-image.jpg`,
  ogType: "website",
})

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen" role="main" aria-label="Main content">
        <SplineHeroComponent />
        <FeatureGrid />
        <AboutSection />
        <PortfolioSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
