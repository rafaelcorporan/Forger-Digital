/**
 * Blog Comments API
 * Handles comment submission and management
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  content: z.string().min(1, "Content is required").max(5000),
  parentId: z.string().optional(),
  authorName: z.string().min(1, "Name is required").max(100).optional(),
  authorEmail: z.string().email("Valid email is required").optional(),
})

/**
 * GET /api/blog/comments
 * List comments for a post
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const status = searchParams.get("status") || "APPROVED"

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      )
    }

    const session = await auth()
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"

    const comments = await prisma.blogComment.findMany({
      where: {
        postId,
        status: isAdmin ? (status as any) : "APPROVED",
        parentId: null, // Only top-level comments
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
            status: isAdmin ? (status as any) : "APPROVED",
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
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: comments,
    })
  } catch (error: any) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch comments",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/blog/comments
 * Create a new comment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const validation = createCommentSchema.safeParse(body)

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

    // Verify post exists and is published
    const post = await prisma.blogPost.findUnique({
      where: { id: data.postId },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      )
    }

    if (post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) {
      return NextResponse.json(
        { success: false, error: "Comments are only allowed on published posts" },
        { status: 403 }
      )
    }

    // If user is authenticated, use their info
    // Otherwise, require name and email
    let authorId: string | null = null
    let authorName = ""
    let authorEmail = ""

    if (session?.user) {
      authorId = session.user.id
      authorName = session.user.name || "Anonymous"
      authorEmail = session.user.email || ""
    } else {
      if (!data.authorName || !data.authorEmail) {
        return NextResponse.json(
          { success: false, error: "Name and email are required for guest comments" },
          { status: 400 }
        )
      }
      authorName = data.authorName
      authorEmail = data.authorEmail
    }

    // Verify parent comment exists if parentId is provided
    if (data.parentId) {
      const parentComment = await prisma.blogComment.findUnique({
        where: { id: data.parentId },
      })

      if (!parentComment || parentComment.postId !== data.postId) {
        return NextResponse.json(
          { success: false, error: "Parent comment not found" },
          { status: 404 }
        )
      }
    }

    // Create comment
    const comment = await prisma.blogComment.create({
      data: {
        postId: data.postId,
        authorId,
        authorName,
        authorEmail,
        content: data.content,
        parentId: data.parentId || null,
        status: session?.user ? "APPROVED" : "PENDING", // Auto-approve authenticated users
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
    })

    return NextResponse.json({
      success: true,
      data: comment,
      message: session?.user ? "Comment posted successfully" : "Comment submitted for review",
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create comment",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

