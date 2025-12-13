import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PricingCalculatorSchema } from "@/lib/validation/schemas"
import { validateRequestBody } from "@/lib/validation/validator"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"
import { 
  calculateProjectCost, 
  validatePricingInput, 
  formatCurrency,
  generatePaymentMilestones 
} from "@/lib/modules/pricing-calculator"
import type { PricingInput } from "@/lib/modules/pricing-calculator/types"

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
      "/api/admin/pricing/calculate",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate request body
    const validation = await validateRequestBody(request, PricingCalculatorSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error || "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    const data = validation.data

    // Prepare pricing input
    const pricingInput: PricingInput = {
      projectName: data.projectName,
      description: data.description,
      category: data.category,
      complexity: data.complexity,
      selectedFeatures: data.selectedFeatures,
      timeline: data.timeline,
      teamSize: data.teamSize,
      supportLevel: data.supportLevel,
      customFeatures: data.customFeatures?.map(f => ({
        name: f.name,
        description: f.description || '',
        estimatedHours: f.estimatedHours,
        hourlyRate: f.hourlyRate,
      })),
    }

    // Validate pricing input
    const inputValidation = validatePricingInput(pricingInput)
    if (!inputValidation.valid) {
      return NextResponse.json(
        { error: "Invalid pricing input", errors: inputValidation.errors },
        { status: 400 }
      )
    }

    // Calculate pricing
    const pricing = calculateProjectCost(pricingInput)

    // Generate payment milestones
    const startDate = new Date()
    const paymentMilestones = generatePaymentMilestones(
      pricing.total,
      pricing.estimatedDuration,
      startDate
    )

    // Format amounts for display
    const formattedPricing = {
      ...pricing,
      formattedTotal: formatCurrency(pricing.total, pricing.currency),
      formattedSubtotal: formatCurrency(pricing.subtotal, pricing.currency),
      formattedDiscount: formatCurrency(pricing.discount, pricing.currency),
      formattedBaseFeaturesCost: formatCurrency(pricing.baseFeaturesCost, pricing.currency),
      formattedSupportCost: formatCurrency(pricing.supportCost, pricing.currency),
      breakdown: pricing.breakdown.map(item => ({
        ...item,
        formattedBaseCost: formatCurrency(item.baseCost, pricing.currency),
        formattedAdjustedCost: formatCurrency(item.adjustedCost, pricing.currency),
      })),
    }

    const response = NextResponse.json({
      success: true,
      pricing: formattedPricing,
      paymentMilestones: paymentMilestones.map(m => ({
        ...m,
        formattedAmount: formatCurrency(m.amount, pricing.currency),
      })),
      summary: {
        totalAmount: pricing.total,
        formattedTotal: formatCurrency(pricing.total, pricing.currency),
        currency: pricing.currency,
        estimatedHours: pricing.estimatedHours,
        estimatedDuration: pricing.estimatedDuration,
        featureCount: pricing.breakdown.length,
        hasDiscount: pricing.discount > 0,
        discountPercent: pricing.discount > 0 
          ? Math.round((pricing.discount / pricing.subtotal) * 100) 
          : 0,
      },
    })

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Pricing calculation error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-pricing-calculate", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to calculate pricing" },
      { status: 500 }
    )
  }
}

