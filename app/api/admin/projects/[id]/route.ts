import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { UpdateProjectSchema } from "@/lib/validation/schemas"
import { validateRequestBody } from "@/lib/validation/validator"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userRole = session.user.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN" && userRole !== "STAFF" && userRole !== "CLIENT") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Build query based on role
    let whereClause: any = { id }
    
    // Clients can only see their own projects
    if (userRole === "CLIENT") {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: session.user.id }
      })
      if (!clientProfile) {
        return NextResponse.json(
          { error: "Client profile not found" },
          { status: 404 }
        )
      }
      whereClause.clientProfileId = clientProfile.id
    }

    const project = await prisma.project.findFirst({
      where: whereClause,
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
        contracts: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            contractNumber: true,
            title: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          }
        },
        assignments: {
          include: {
            staffProfile: {
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
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error: any) {
    console.error("Get project error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-project-detail", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Rate limiting
    const rateLimitResult = await rateLimit(
      request,
      `/api/admin/projects/${id}`,
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate request body
    const validation = await validateRequestBody(request, UpdateProjectSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error || "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    const { 
      name, 
      description, 
      features, 
      complexity, 
      timeline, 
      deliverables, 
      techStack,
      startDate,
      endDate,
      status,
      estimatedCost,
      finalCost
    } = validation.data

    // Update project
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(features && { features: { features } }),
        ...(complexity && { complexity }),
        ...(timeline && { timeline }),
        ...(deliverables && { deliverables }),
        ...(techStack && { techStack }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status }),
        ...(estimatedCost !== undefined && { estimatedCost }),
        ...(finalCost !== undefined && { finalCost }),
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
    console.error("Update project error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-project-update", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Delete project (cascades to contracts and assignments)
    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete project error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-project-delete", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
}

