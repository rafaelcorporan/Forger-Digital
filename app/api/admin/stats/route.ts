import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    // Verify admin access
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
      "/api/admin/stats",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Get statistics
    const [
      totalUsers,
      totalContactSubmissions,
      totalGetStartedSubmissions,
      activeSessions,
      recentUsers,
      recentSubmissions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.contactFormSubmission.count(),
      prisma.getStartedSubmission.count(),
      prisma.session.count({
        where: {
          expires: {
            gt: new Date(),
          },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.contactFormSubmission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
        },
      }),
    ])

    // Calculate growth metrics (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      newUsersLast30Days,
      newContactSubmissionsLast30Days,
      newGetStartedSubmissionsLast30Days,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.contactFormSubmission.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.getStartedSubmission.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
    ])

    const response = NextResponse.json({
      stats: {
        totalUsers,
        totalContactSubmissions,
        totalGetStartedSubmissions,
        totalSubmissions: totalContactSubmissions + totalGetStartedSubmissions,
        activeSessions,
        newUsersLast30Days,
        newContactSubmissionsLast30Days,
        newGetStartedSubmissionsLast30Days,
      },
      recent: {
        users: recentUsers,
        submissions: recentSubmissions,
      },
    })

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Admin stats error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-stats", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
}

