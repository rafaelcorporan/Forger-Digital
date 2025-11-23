/**
 * Blog Categories API
 * Handles CRUD operations for blog categories
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/blog-utils"
import { z } from "zod"

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().optional(),
  description: z.string().max(500).optional(),
})

/**
 * GET /api/blog/categories
 * List all blog categories
 */
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.blogCategory.findMany({
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
      data: categories,
    })
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/blog/categories
 * Create a new category
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

    // Only admins can create categories
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = createCategorySchema.safeParse(body)

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

    // Check if category already exists
    const existing = await prisma.blogCategory.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "A category with this slug already exists",
        },
        { status: 409 }
      )
    }

    const category = await prisma.blogCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: category,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create category",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

