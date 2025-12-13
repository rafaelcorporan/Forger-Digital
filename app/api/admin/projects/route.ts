import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { CreateProjectSchema, UpdateProjectSchema, PaginationSchema } from "@/lib/validation/schemas"
import { validateRequestBody, validateQueryParams } from "@/lib/validation/validator"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"
import { z } from "zod"

// Query schema for projects
const ProjectsQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  status: z.enum(["DRAFT", "PROPOSAL", "APPROVED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"]).optional(),
  clientId: z.string().optional(),
})

// Generate URL-safe slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).substring(2, 8)
}

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
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN" && userRole !== "STAFF") {
      return NextResponse.json(
        { error: "Forbidden - Admin or Staff access required" },
        { status: 403 }
      )
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(
      request,
      "/api/admin/projects",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate query parameters
    const validation = validateQueryParams(request, ProjectsQuerySchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error || "Invalid query parameters", errors: validation.errors },
        { status: 400 }
      )
    }

    const { page, limit, search, status, clientId } = validation.data
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }
    if (status) {
      where.status = status
    }
    if (clientId) {
      where.clientProfileId = clientId
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          clientProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          },
          _count: {
            select: {
              contracts: true,
              assignments: true,
            }
          }
        }
      }),
      prisma.project.count({ where }),
    ])

    const response = NextResponse.json({
      projects,
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
    console.error("Get projects error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-projects", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
      "/api/admin/projects",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate request body
    const validation = await validateRequestBody(request, CreateProjectSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error || "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    const { 
      name, 
      description, 
      clientProfileId, 
      features, 
      complexity, 
      timeline, 
      deliverables, 
      techStack,
      startDate,
      endDate
    } = validation.data

    // Verify client profile exists
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { id: clientProfileId }
    })

    if (!clientProfile) {
      return NextResponse.json(
        { error: "Client profile not found" },
        { status: 404 }
      )
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        slug: generateSlug(name),
        description,
        clientProfileId,
        features: features || undefined,
        complexity,
        timeline,
        deliverables: deliverables || [],
        techStack: techStack || [],
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status: "DRAFT",
      },
      include: {
        clientProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    })

    const response = NextResponse.json({
      success: true,
      project,
    })

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Create project error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-projects", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}

