import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AdminSubmissionsQuerySchema } from "@/lib/validation/schemas"
import { validateQueryParams } from "@/lib/validation/validator"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"

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
      "/api/admin/submissions",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate query parameters
    const validation = validateQueryParams(request, AdminSubmissionsQuerySchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || "Invalid query parameters",
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const { type, page, limit, search } = validation.data
    const skip = (page - 1) * limit

    let contactSubmissions: any[] = []
    let getStartedSubmissions: any[] = []
    let totalContact = 0
    let totalGetStarted = 0

    if (type === "all" || type === "contact") {
      const where: any = {}
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
        ]
      }

      const [results, count] = await Promise.all([
        prisma.contactFormSubmission.findMany({
          where,
          skip: type === "all" ? 0 : skip,
          take: type === "all" ? limit : limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.contactFormSubmission.count({ where }),
      ])

      contactSubmissions = results
      totalContact = count
    }

    if (type === "all" || type === "get-started") {
      const where: any = {}
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
        ]
      }

      const [results, count] = await Promise.all([
        prisma.getStartedSubmission.findMany({
          where,
          skip: type === "all" ? 0 : skip,
          take: type === "all" ? limit : limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.getStartedSubmission.count({ where }),
      ])

      getStartedSubmissions = results
      totalGetStarted = count
    }

    // Combine and sort if type is "all"
    let allSubmissions: any[] = []
    if (type === "all") {
      allSubmissions = [
        ...contactSubmissions.map((s) => ({ ...s, type: "contact" })),
        ...getStartedSubmissions.map((s) => ({ ...s, type: "get-started" })),
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(skip, skip + limit)
    }

    const response = NextResponse.json({
      submissions:
        type === "all"
          ? allSubmissions
          : type === "contact"
            ? contactSubmissions
            : getStartedSubmissions,
      pagination: {
        page,
        limit,
        total: type === "all" ? totalContact + totalGetStarted : type === "contact" ? totalContact : totalGetStarted,
        totalPages: Math.ceil(
          (type === "all" ? totalContact + totalGetStarted : type === "contact" ? totalContact : totalGetStarted) /
            limit
        ),
      },
    })

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Admin submissions error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-submissions", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    )
  }
}

