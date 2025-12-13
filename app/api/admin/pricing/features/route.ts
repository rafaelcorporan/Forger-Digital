import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { 
  FEATURE_CATALOG, 
  SERVICE_CATEGORIES, 
  MARKET_RATES,
  getFeaturesByCategory 
} from "@/lib/modules/pricing-calculator"
import { formatCurrency } from "@/lib/modules/pricing-calculator/calculator"
import type { ServiceCategory } from "@/lib/modules/pricing-calculator/types"

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
      "/api/admin/pricing/features",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Check for category filter
    const { searchParams } = new URL(request.url)
    const categoryFilter = searchParams.get('category') as ServiceCategory | null

    // Get features (optionally filtered by category)
    const features = categoryFilter 
      ? getFeaturesByCategory(categoryFilter)
      : FEATURE_CATALOG

    // Format features for response
    const formattedFeatures = features.map(feature => ({
      ...feature,
      formattedBaseCost: formatCurrency(feature.baseCost, 'USD'),
      categoryLabel: SERVICE_CATEGORIES.find(c => c.value === feature.category)?.label || feature.category,
    }))

    // Group features by category
    const featuresByCategory: Record<string, typeof formattedFeatures> = {}
    for (const feature of formattedFeatures) {
      if (!featuresByCategory[feature.category]) {
        featuresByCategory[feature.category] = []
      }
      featuresByCategory[feature.category].push(feature)
    }

    // Format market rates for display
    const formattedRates: Record<string, Record<string, string>> = {}
    for (const [category, rates] of Object.entries(MARKET_RATES.hourlyRates)) {
      formattedRates[category] = {}
      for (const [complexity, rate] of Object.entries(rates)) {
        formattedRates[category][complexity] = formatCurrency(rate, 'USD') + '/hr'
      }
    }

    const response = NextResponse.json({
      features: formattedFeatures,
      featuresByCategory,
      categories: SERVICE_CATEGORIES,
      marketRates: formattedRates,
      multipliers: {
        timeline: MARKET_RATES.timelineMultipliers,
        teamSize: MARKET_RATES.teamSizeMultipliers,
      },
      supportCosts: {
        basic: { cost: MARKET_RATES.supportCosts.basic, formatted: formatCurrency(MARKET_RATES.supportCosts.basic, 'USD'), description: 'Included - Email support during business hours' },
        standard: { cost: MARKET_RATES.supportCosts.standard, formatted: formatCurrency(MARKET_RATES.supportCosts.standard, 'USD'), description: '3 months priority support with 24hr response' },
        premium: { cost: MARKET_RATES.supportCosts.premium, formatted: formatCurrency(MARKET_RATES.supportCosts.premium, 'USD'), description: '6 months dedicated support with 4hr response SLA' },
      },
      discountThresholds: MARKET_RATES.discountThresholds.map(t => ({
        ...t,
        formattedMinAmount: formatCurrency(t.minAmount, 'USD'),
      })),
    })

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Get features error:", error)
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    )
  }
}

