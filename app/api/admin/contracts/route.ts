import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { CreateContractSchema, PaginationSchema } from "@/lib/validation/schemas"
import { validateRequestBody, validateQueryParams } from "@/lib/validation/validator"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"
import { z } from "zod"
import { calculateProjectCost, generatePaymentMilestones, formatCurrency } from "@/lib/modules/pricing-calculator"
import { generateContract } from "@/lib/modules/contract-generator"
import type { PricingInput } from "@/lib/modules/pricing-calculator/types"
import type { ContractGenerationInput } from "@/lib/modules/contract-generator/types"

// Query schema for contracts
const ContractsQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "SENT", "VIEWED", "SIGNED", "REJECTED", "EXPIRED", "CANCELLED"]).optional(),
  projectId: z.string().optional(),
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
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN" && userRole !== "CLIENT") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(
      request,
      "/api/admin/contracts",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate query parameters
    const validation = validateQueryParams(request, ContractsQuerySchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error || "Invalid query parameters", errors: validation.errors },
        { status: 400 }
      )
    }

    const { page, limit, search, status, projectId } = validation.data
    const skip = (page - 1) * limit

    // Build where clause
    let where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { contractNumber: { contains: search, mode: "insensitive" } },
      ]
    }
    if (status) {
      where.status = status
    }
    if (projectId) {
      where.projectId = projectId
    }

    // Clients can only see contracts for their projects
    if (userRole === "CLIENT") {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: session.user.id }
      })
      if (clientProfile) {
        where.project = {
          clientProfileId: clientProfile.id
        }
      } else {
        // No profile, no contracts
        return NextResponse.json({
          contracts: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        })
      }
    }

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          project: {
            select: {
              id: true,
              name: true,
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
      }),
      prisma.contract.count({ where }),
    ])

    const response = NextResponse.json({
      contracts,
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
    console.error("Get contracts error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-contracts", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
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
      "/api/admin/contracts",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate request body
    const validation = await validateRequestBody(request, CreateContractSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error || "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    const data = validation.data

    // Get project with client info
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
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

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Calculate pricing
    const pricingInput: PricingInput = {
      projectName: project.name,
      description: project.description,
      category: data.category,
      complexity: data.category === 'ai_ml' || data.category === 'blockchain' ? 'high' : 
                  project.complexity?.toLowerCase() as any || 'medium',
      selectedFeatures: data.selectedFeatures,
      timeline: data.timelineType,
      teamSize: data.teamSize,
      supportLevel: data.supportLevel,
      customFeatures: data.customFeatures?.map(f => ({
        name: f.name,
        description: f.description || '',
        estimatedHours: f.estimatedHours,
        hourlyRate: f.hourlyRate,
      })),
    }

    const pricing = calculateProjectCost(pricingInput)

    // Calculate dates
    const startDate = project.startDate || new Date()
    const durationWeeks = parseInt(pricing.estimatedDuration.match(/\d+/)?.[0] || '8')
    const endDate = project.endDate || new Date(startDate.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000)

    // Generate payment milestones
    const paymentSchedule = generatePaymentMilestones(
      pricing.total,
      pricing.estimatedDuration,
      startDate
    )

    // Prepare contract generation input
    const contractInput: ContractGenerationInput = {
      projectId: project.id,
      projectName: project.name,
      projectDescription: project.description,
      scopeOfWork: project.deliverables?.length ? project.deliverables : 
        data.selectedFeatures.map(f => `Implementation of ${f.replace(/_/g, ' ')}`),
      deliverables: project.deliverables || [
        'Complete source code and documentation',
        'Deployment to production environment',
        'Knowledge transfer and training',
        'Post-launch support as per agreement',
      ],
      techStack: project.techStack,
      clientName: project.clientProfile.user.name || 'Client',
      clientCompany: project.clientProfile.company || '',
      clientEmail: project.clientProfile.user.email,
      clientAddress: project.clientProfile.address || '',
      companyName: data.companyName,
      companyAddress: data.companyAddress,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      pricing,
      startDate,
      endDate,
      timeline: pricing.estimatedDuration,
      paymentTerms: data.paymentTerms || 'Payment is due according to the milestone schedule below.',
      paymentSchedule,
      termsVersion: '1.0',
      revisionPolicy: data.revisionPolicy,
      warrantyPeriod: data.warrantyPeriod || '30 days',
      confidentialityClause: data.confidentialityClause,
    }

    // Generate the contract
    const generatedContract = await generateContract(contractInput)

    // Store contract in database
    const contract = await prisma.contract.create({
      data: {
        projectId: project.id,
        contractNumber: generatedContract.contractNumber,
        title: generatedContract.title,
        content: generatedContract.htmlContent,
        status: "DRAFT",
        totalAmount: generatedContract.totalAmount,
        currency: generatedContract.currency,
        validUntil: generatedContract.validUntil,
        shareToken: generatedContract.shareToken,
        shareTokenExpiry: generatedContract.shareTokenExpiry,
        termsVersion: '1.0',
        metadata: {
          pricing,
          paymentSchedule,
          features: data.selectedFeatures,
          customFeatures: data.customFeatures,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            clientProfile: {
              include: {
                user: {
                  select: {
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

    // Update project with estimated cost
    await prisma.project.update({
      where: { id: project.id },
      data: {
        estimatedCost: pricing.total,
        status: project.status === 'DRAFT' ? 'PROPOSAL' : project.status,
      }
    })

    const response = NextResponse.json({
      success: true,
      contract: {
        ...contract,
        shareUrl: `/contracts/view/${contract.shareToken}`,
      },
      pricing,
    })

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Create contract error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-contracts-create", error_type: "general" },
    })
    return NextResponse.json(
      { error: error.message || "Failed to create contract" },
      { status: 500 }
    )
  }
}

