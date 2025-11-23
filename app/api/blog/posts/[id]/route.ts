/**
 * Individual Blog Post API
 * Handles GET, PUT, DELETE operations for a specific blog post
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug, estimateReadingTime, extractExcerpt } from "@/lib/blog-utils"
import { z } from "zod"

const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(),
  featuredImage: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).optional(),
})

/**
 * GET /api/blog/posts/[id]
 * Get a single blog post by ID or slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams

    // Check if it's a slug or ID
    const isSlug = !id.match(/^[a-z0-9]{25}$/i) // CUIDs are 25 chars

    const where = isSlug ? { slug: id } : { id }

    const post = await prisma.blogPost.findUnique({
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
        comments: {
          where: {
            status: "APPROVED",
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            replies: {
              where: {
                status: "APPROVED",
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      )
    }

    // Check permissions - only admins can see non-published posts
    const session = await auth()
    if (
      post.status !== "PUBLISHED" ||
      (post.publishedAt && post.publishedAt > new Date())
    ) {
      if (
        !session ||
        (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN")
      ) {
        return NextResponse.json(
          { success: false, error: "Post not found" },
          { status: 404 }
        )
      }
    }

    // Increment view count for published posts
    if (post.status === "PUBLISHED" && post.publishedAt && post.publishedAt <= new Date()) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      })
    }

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error: any) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog post",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/blog/posts/[id]
 * Update a blog post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only admins can update posts
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const resolvedParams = await params
    const { id } = resolvedParams
    const body = await request.json()
    const validation = updatePostSchema.safeParse(body)

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

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      )
    }

    // Check if user is the author or super admin
    if (existingPost.authorId !== session.user.id && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden - You can only edit your own posts" },
        { status: 403 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (data.title) {
      updateData.title = data.title
    }

    if (data.slug !== undefined) {
      // Check if new slug conflicts with another post
      if (data.slug !== existingPost.slug) {
        const slugConflict = await prisma.blogPost.findUnique({
          where: { slug: data.slug },
        })
        if (slugConflict) {
          return NextResponse.json(
            { success: false, error: "A post with this slug already exists" },
            { status: 409 }
          )
        }
      }
      updateData.slug = data.slug
    }

    if (data.excerpt !== undefined) {
      updateData.excerpt = data.excerpt
    }

    if (data.content !== undefined) {
      updateData.content = data.content
      // Recalculate reading time
      updateData.readingTime = estimateReadingTime(data.content)
      // Regenerate excerpt if not provided
      if (!data.excerpt) {
        updateData.excerpt = extractExcerpt(data.content)
      }
    }

    if (data.featuredImage !== undefined) {
      updateData.featuredImage = data.featuredImage || null
    }

    if (data.categoryId !== undefined) {
      updateData.categoryId = data.categoryId
    }

    if (data.status !== undefined) {
      updateData.status = data.status
      // Handle publishedAt
      if (data.status === "PUBLISHED" && !existingPost.publishedAt) {
        updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date()
      } else if (data.status !== "PUBLISHED") {
        updateData.publishedAt = null
      } else if (data.publishedAt !== undefined) {
        updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null
      }
    }

    if (data.metaTitle !== undefined) {
      updateData.metaTitle = data.metaTitle || null
    }

    if (data.metaDescription !== undefined) {
      updateData.metaDescription = data.metaDescription || null
    }

    if (data.metaKeywords !== undefined) {
      updateData.metaKeywords = data.metaKeywords
    }

    // Update tags if provided
    if (data.tagIds !== undefined) {
      updateData.tags = {
        set: data.tagIds.map((tagId: string) => ({ id: tagId })),
      }
    }

    // Update post
    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
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
    })
  } catch (error: any) {
    console.error("Error updating blog post:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update blog post",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/blog/posts/[id]
 * Delete a blog post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only admins can delete posts
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const resolvedParams = await params
    const { id } = resolvedParams

    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      )
    }

    // Check if user is the author or super admin
    if (post.authorId !== session.user.id && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden - You can only delete your own posts" },
        { status: 403 }
      )
    }

    // Delete post (cascade will delete comments)
    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete blog post",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

