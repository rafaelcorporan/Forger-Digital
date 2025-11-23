/**
 * Blog Posts API
 * Handles CRUD operations for blog posts
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug, estimateReadingTime, extractExcerpt } from "@/lib/blog-utils"
import { z } from "zod"

// Validation schema
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).optional(),
})

/**
 * GET /api/blog/posts
 * List blog posts with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const categoryId = searchParams.get("categoryId")
    const tagId = searchParams.get("tagId")
    const authorId = searchParams.get("authorId")
    const search = searchParams.get("search")
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status
    } else {
      // Default: only show published posts for non-admins
      const session = await auth()
      if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN")) {
        where.status = "PUBLISHED"
        where.publishedAt = { lte: new Date() }
      }
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (tagId) {
      where.tags = {
        some: {
          id: tagId,
        },
      }
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    // Fetch posts with relations
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
          tags: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: [
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog posts",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/blog/posts
 * Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only admins can create posts
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = createPostSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Generate slug if not provided
    const slug = data.slug || generateSlug(data.title)

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: "A post with this slug already exists",
        },
        { status: 409 }
      )
    }

    // Generate excerpt if not provided
    const excerpt = data.excerpt || extractExcerpt(data.content)

    // Calculate reading time
    const readingTime = estimateReadingTime(data.content)

    // Handle publishedAt
    let publishedAt: Date | null = null
    if (data.status === "PUBLISHED") {
      publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date()
    }

    // Create post
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt,
        content: data.content,
        featuredImage: data.featuredImage || null,
        authorId: session.user.id,
        status: data.status,
        publishedAt,
        categoryId: data.categoryId || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || [],
        readingTime,
        tags: data.tagIds ? {
          connect: data.tagIds.map((id: string) => ({ id })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        tags: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: post,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create blog post",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

