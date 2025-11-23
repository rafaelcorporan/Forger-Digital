/**
 * Blog Tags API
 * Handles CRUD operations for blog tags
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/blog-utils"
import { z } from "zod"

const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().optional(),
})

/**
 * GET /api/blog/tags
 * List all blog tags
 */
export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      data: tags,
    })
  } catch (error: any) {
    console.error("Error fetching tags:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tags",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/blog/tags
 * Create a new tag
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

    // Only admins can create tags
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = createTagSchema.safeParse(body)

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
    const slug = data.slug || generateSlug(data.name)

    // Check if tag already exists
    const existing = await prisma.blogTag.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "A tag with this slug already exists",
        },
        { status: 409 }
      )
    }

    const tag = await prisma.blogTag.create({
      data: {
        name: data.name,
        slug,
      },
    })

    return NextResponse.json({
      success: true,
      data: tag,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating tag:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create tag",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

