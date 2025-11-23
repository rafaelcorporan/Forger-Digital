import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlogPostList } from "@/components/blog-post-list"
import { generateSEOMetadata, getDefaultKeywords } from "@/lib/seo"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

export const metadata: Metadata = generateSEOMetadata({
  title: "Blog - Insights & Updates | Forger Digital",
  description:
    "Read the latest insights, updates, and articles from Forger Digital. Learn about software development, digital transformation, and technology trends.",
  keywords: [
    ...getDefaultKeywords(),
    "blog",
    "articles",
    "insights",
    "updates",
    "technology news",
    "software development blog",
  ],
  canonical: `${baseUrl}/blog`,
  ogImage: `${baseUrl}/og-image.jpg`,
  ogType: "website",
})

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Insights, updates, and articles about software development, digital transformation, and technology trends.
            </p>
          </div>
          <BlogPostList />
        </div>
      </main>
      <Footer />
    </>
  )
}

