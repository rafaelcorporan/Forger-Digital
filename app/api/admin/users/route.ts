import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AdminUsersQuerySchema, AdminUserUpdateSchema } from "@/lib/validation/schemas"
import { validateQueryParams, validateRequestBody } from "@/lib/validation/validator"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userRole = session.user.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    // Rate limiting (user-based for authenticated admins)
    const rateLimitResult = await rateLimit(
      request,
      "/api/admin/users",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate query parameters
    const validation = validateQueryParams(request, AdminUsersQuerySchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || "Invalid query parameters",
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const { page, limit, search, role } = validation.data
    const skip = (page - 1) * limit

    // Build where clause (search is already sanitized by schema)
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }
    if (role && ["USER", "CLIENT", "STAFF", "ADMIN", "SUPER_ADMIN"].includes(role)) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          isActive: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              accounts: true,
              sessions: true,
              payments: true,
              subscriptions: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    const response = NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Admin users error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-users", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userRole = session.user.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    // Rate limiting (user-based for authenticated admins)
    const rateLimitResult = await rateLimit(
      request,
      "/api/admin/users",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate request body
    const validation = await validateRequestBody(request, AdminUserUpdateSchema)
    if (!validation.success) {
      const response = NextResponse.json(
        {
          error: validation.error || "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      )

      // Add rate limit headers even on validation error
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    }

    const { userId, role, name, email, password, isActive } = validation.data

    // Prevent self-demotion
    if (userId === session.user.id && role && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      )
    }

    // Prevent self-deactivation
    if (userId === session.user.id && isActive === false) {
      return NextResponse.json(
        { error: "Cannot disable your own account" },
        { status: 400 }
      )
    }

    // Build update data object with only provided fields
    const updateData: any = {}
    
    if (role !== undefined) {
      updateData.role = role
    }
    
    if (name !== undefined) {
      updateData.name = name
    }
    
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          NOT: { id: userId }
        }
      })
      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use by another account" },
          { status: 400 }
        )
      }
      updateData.email = email
    }
    
    if (password !== undefined) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12)
      updateData.password = hashedPassword
    }
    
    if (isActive !== undefined) {
      updateData.isActive = isActive
    }

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    })

    const response = NextResponse.json({ user: updatedUser })

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Admin update user error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-users", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userRole = session.user.role
    if (userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    // Prevent self-deletion
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin delete user error:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}

