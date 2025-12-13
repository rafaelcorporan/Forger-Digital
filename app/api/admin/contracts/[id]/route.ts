import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"
import { regenerateShareToken } from "@/lib/modules/contract-generator"
import { z } from "zod"

const UpdateContractSchema = z.object({
  status: z.enum(["DRAFT", "PENDING_REVIEW", "SENT", "VIEWED", "SIGNED", "REJECTED", "EXPIRED", "CANCELLED"]).optional(),
  signedByClient: z.string().max(200).optional(),
  signedByAdmin: z.string().max(200).optional(),
  regenerateToken: z.boolean().optional(),
})

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
    const { id } = await params

    // Build where clause based on role
    let whereClause: any = { id }

    // Clients can only see contracts for their projects
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
      whereClause = {
        id,
        project: {
          clientProfileId: clientProfile.id
        }
      }
    } else if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const contract = await prisma.contract.findFirst({
      where: whereClause,
      include: {
        project: {
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
        }
      }
    })

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      contract: {
        ...contract,
        shareUrl: `/contracts/view/${contract.shareToken}`,
      }
    })
  } catch (error: any) {
    console.error("Get contract error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-contract-detail", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to fetch contract" },
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
      `/api/admin/contracts/${id}`,
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Parse and validate body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    const parseResult = UpdateContractSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { status, signedByClient, signedByAdmin, regenerateToken } = parseResult.data

    // Check if contract exists
    const existingContract = await prisma.contract.findUnique({
      where: { id }
    })

    if (!existingContract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    
    if (status) {
      updateData.status = status
    }
    
    if (signedByClient) {
      updateData.signedByClient = signedByClient
      updateData.signedAt = new Date()
    }
    
    if (signedByAdmin) {
      updateData.signedByAdmin = signedByAdmin
    }

    // Regenerate share token if requested
    if (regenerateToken) {
      const { token, expiry } = regenerateShareToken()
      updateData.shareToken = token
      updateData.shareTokenExpiry = expiry
    }

    // Update contract
    const contract = await prisma.contract.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    const response = NextResponse.json({
      success: true,
      contract: {
        ...contract,
        shareUrl: `/contracts/view/${contract.shareToken}`,
      },
    })

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Update contract error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-contract-update", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to update contract" },
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

    // Check if contract exists
    const existingContract = await prisma.contract.findUnique({
      where: { id }
    })

    if (!existingContract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      )
    }

    // Only allow deletion of draft contracts
    if (existingContract.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft contracts can be deleted" },
        { status: 400 }
      )
    }

    await prisma.contract.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Contract deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete contract error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-contract-delete", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to delete contract" },
      { status: 500 }
    )
  }
}

