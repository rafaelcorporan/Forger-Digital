import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"
import { verifyShareToken } from "@/lib/modules/contract-generator"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token || token.length < 20) {
      return NextResponse.json(
        { error: "Invalid contract link" },
        { status: 400 }
      )
    }

    // Rate limiting (IP-based for public access)
    const rateLimitResult = await rateLimit(
      request,
      "/api/contracts/view",
      {
        keyGenerator: () => getUserIdentifier(request),
        maxRequests: 30, // Lower limit for public endpoint
        windowMs: 60000,
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Find contract by share token
    const contract = await prisma.contract.findUnique({
      where: { shareToken: token },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
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

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found or link has expired" },
        { status: 404 }
      )
    }

    // Verify token is not expired (only if expiry is set)
    const tokenVerification = verifyShareToken(
      token,
      contract.shareToken || '',
      contract.shareTokenExpiry || null
    )

    if (!tokenVerification.valid) {
      return NextResponse.json(
        { error: tokenVerification.error || "Contract link has expired" },
        { status: 403 }
      )
    }

    // Check contract validity
    if (contract.validUntil && new Date() > contract.validUntil) {
      return NextResponse.json(
        { error: "This contract has expired and is no longer valid" },
        { status: 410 }
      )
    }

    // Update contract status to VIEWED if it was SENT
    if (contract.status === "SENT") {
      await prisma.contract.update({
        where: { id: contract.id },
        data: { status: "VIEWED" }
      })
    }

    // Return contract data (excluding sensitive internal fields)
    const response = NextResponse.json({
      success: true,
      contract: {
        id: contract.id,
        contractNumber: contract.contractNumber,
        title: contract.title,
        content: contract.content, // HTML content
        status: contract.status === "SENT" ? "VIEWED" : contract.status,
        totalAmount: contract.totalAmount,
        currency: contract.currency,
        validUntil: contract.validUntil,
        signedAt: contract.signedAt,
        signedByClient: contract.signedByClient,
        termsVersion: contract.termsVersion,
        createdAt: contract.createdAt,
        project: {
          name: contract.project.name,
          client: {
            name: contract.project.clientProfile.user.name,
            company: contract.project.clientProfile.company,
          }
        },
        metadata: contract.metadata,
      },
    })

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("View contract error:", error)
    captureException(error as Error, {
      tags: { endpoint: "contract-view", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to load contract" },
      { status: 500 }
    )
  }
}

// Allow client to sign the contract
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    console.log('[Contract Sign] Received signing request for token:', token?.substring(0, 20) + '...')

    if (!token || token.length < 20) {
      console.log('[Contract Sign] Invalid token length:', token?.length)
      return NextResponse.json(
        { error: "Invalid contract link" },
        { status: 400 }
      )
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(
      request,
      "/api/contracts/view/sign",
      {
        keyGenerator: () => getUserIdentifier(request),
        maxRequests: 10,
        windowMs: 60000,
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Parse body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { signatureName, agreedToTerms } = body
    console.log('[Contract Sign] Request body:', { signatureName, agreedToTerms })

    if (!signatureName || typeof signatureName !== 'string' || signatureName.length < 2) {
      console.log('[Contract Sign] Invalid signature name')
      return NextResponse.json(
        { error: "Valid signature name is required" },
        { status: 400 }
      )
    }

    if (!agreedToTerms) {
      console.log('[Contract Sign] Terms not agreed')
      return NextResponse.json(
        { error: "You must agree to the terms to sign the contract" },
        { status: 400 }
      )
    }

    // Find contract by share token
    const contract = await prisma.contract.findUnique({
      where: { shareToken: token },
    })

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      )
    }

    // Verify token is not expired (only if expiry is set)
    const tokenVerification = verifyShareToken(
      token,
      contract.shareToken || '',
      contract.shareTokenExpiry || null
    )

    if (!tokenVerification.valid) {
      return NextResponse.json(
        { error: tokenVerification.error || "Contract link has expired" },
        { status: 403 }
      )
    }

    // Check if already signed
    if (contract.signedByClient) {
      return NextResponse.json(
        { error: "Contract has already been signed" },
        { status: 400 }
      )
    }

    // Check contract validity
    if (contract.validUntil && new Date() > contract.validUntil) {
      return NextResponse.json(
        { error: "This contract has expired and cannot be signed" },
        { status: 410 }
      )
    }

    console.log('[Contract Sign] Updating contract:', contract.id)
    
    // Update contract with signature
    const updatedContract = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        signedByClient: signatureName.trim(),
        signedAt: new Date(),
        status: "SIGNED",
      },
      select: {
        id: true,
        contractNumber: true,
        signedAt: true,
        signedByClient: true,
        status: true,
      }
    })

    console.log('[Contract Sign] Contract updated:', updatedContract)

    // Update project status to APPROVED
    await prisma.project.update({
      where: { id: contract.projectId },
      data: { status: "APPROVED" }
    })

    console.log('[Contract Sign] Project status updated to APPROVED')

    const response = NextResponse.json({
      success: true,
      message: "Contract signed successfully",
      contract: updatedContract,
    })

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Sign contract error:", error)
    captureException(error as Error, {
      tags: { endpoint: "contract-sign", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to sign contract" },
      { status: 500 }
    )
  }
}

