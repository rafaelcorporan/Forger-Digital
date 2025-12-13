import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PaginationSchema } from "@/lib/validation/schemas"
import { validateQueryParams } from "@/lib/validation/validator"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"
import { z } from "zod"

// Query schema for clients
const ClientsQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
})

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

    // Rate limiting
    const rateLimitResult = await rateLimit(
      request,
      "/api/admin/clients",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate query parameters
    const validation = validateQueryParams(request, ClientsQuerySchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error || "Invalid query parameters", errors: validation.errors },
        { status: 400 }
      )
    }

    const { page, limit, search } = validation.data
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { company: { contains: search, mode: "insensitive" } },
      ]
    }

    const [clients, total] = await Promise.all([
      prisma.clientProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isActive: true,
              createdAt: true,
            }
          },
          _count: {
            select: {
              projects: true,
            }
          }
        }
      }),
      prisma.clientProfile.count({ where }),
    ])

    const response = NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Get clients error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-clients", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    )
  }
}

