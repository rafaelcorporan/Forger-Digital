import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlogPostDetail } from "@/components/blog-post-detail"
import { generateSEOMetadata } from "@/lib/seo"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams

  try {
    const response = await fetch(`${baseUrl}/api/blog/posts/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      return generateSEOMetadata({
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
        canonical: `${baseUrl}/blog/${slug}`,
      })
    }

    const result = await response.json()
    const post = result.data

    return generateSEOMetadata({
      title: post.metaTitle || `${post.title} | Forger Digital Blog`,
      description: post.metaDescription || post.excerpt || post.content.substring(0, 160),
      keywords: post.metaKeywords || [],
      canonical: `${baseUrl}/blog/${post.slug}`,
      ogImage: post.featuredImage || `${baseUrl}/og-image.jpg`,
      ogType: "article",
    })
  } catch (error) {
    return generateSEOMetadata({
      title: "Blog Post | Forger Digital",
      description: "Read our latest blog post",
      canonical: `${baseUrl}/blog/${slug}`,
    })
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <BlogPostDetail slug={slug} />
      </main>
      <Footer />
    </>
  )
}

