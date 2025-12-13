// Pricing Calculator Engine
// Calculates project costs based on market data

import type { 
  PricingInput, 
  PricingBreakdown, 
  FeatureCostItem,
  CustomFeature
} from './types'
import { 
  MARKET_RATES, 
  FEATURE_CATALOG, 
  getFeatureById 
} from './market-data'

/**
 * Calculate project pricing based on selected features and parameters
 */
export function calculateProjectCost(input: PricingInput): PricingBreakdown {
  const { 
    category, 
    complexity, 
    selectedFeatures, 
    timeline, 
    teamSize, 
    supportLevel,
    customFeatures = []
  } = input

  // Get hourly rate for category and complexity
  const hourlyRate = MARKET_RATES.hourlyRates[category][complexity]

  // Calculate feature costs
  let baseFeaturesCost = 0
  let totalHours = 0
  const breakdown: FeatureCostItem[] = []

  for (const featureId of selectedFeatures) {
    const feature = getFeatureById(featureId)
    if (!feature) continue

    const complexityMultiplier = feature.complexityMultiplier[complexity]
    const adjustedCost = Math.round(feature.baseCost * complexityMultiplier)
    const adjustedHours = Math.round(feature.timeEstimate * complexityMultiplier)

    baseFeaturesCost += adjustedCost
    totalHours += adjustedHours

    breakdown.push({
      featureId: feature.id,
      featureName: feature.name,
      baseCost: feature.baseCost,
      adjustedCost,
      hours: adjustedHours
    })
  }

  // Calculate custom features cost
  let customFeaturesCost = 0
  for (const custom of customFeatures) {
    const rate = custom.hourlyRate || hourlyRate
    const cost = custom.estimatedHours * rate
    customFeaturesCost += cost
    totalHours += custom.estimatedHours

    breakdown.push({
      featureId: `custom_${Date.now()}`,
      featureName: custom.name,
      baseCost: cost,
      adjustedCost: cost,
      hours: custom.estimatedHours
    })
  }

  // Apply timeline multiplier
  const timelineMultiplier = MARKET_RATES.timelineMultipliers[timeline]
  const timelineAdjustment = Math.round(baseFeaturesCost * (timelineMultiplier - 1))

  // Apply team size multiplier
  const teamSizeMultiplier = MARKET_RATES.teamSizeMultipliers[teamSize]
  const teamSizeAdjustment = Math.round(baseFeaturesCost * (teamSizeMultiplier - 1))

  // Calculate complexity adjustment (additional cost for higher complexity)
  const complexityAdjustment = 0 // Already factored into feature costs

  // Support costs
  const supportCost = MARKET_RATES.supportCosts[supportLevel]

  // Calculate subtotal
  const subtotal = baseFeaturesCost + timelineAdjustment + teamSizeAdjustment + 
                   customFeaturesCost + supportCost

  // Calculate volume discount
  let discount = 0
  for (const threshold of [...MARKET_RATES.discountThresholds].reverse()) {
    if (subtotal >= threshold.minAmount) {
      discount = Math.round(subtotal * (threshold.discountPercent / 100))
      break
    }
  }

  // Tax (0 for B2B services - adjust as needed)
  const tax = 0

  // Final total
  const total = subtotal - discount + tax

  // Estimate duration based on hours and team size
  const hoursPerWeek = teamSize === 'small' ? 80 : teamSize === 'medium' ? 200 : 400
  const weeks = Math.ceil(totalHours / hoursPerWeek)
  const estimatedDuration = weeks <= 4 
    ? `${weeks} weeks` 
    : `${Math.ceil(weeks / 4)}-${Math.ceil(weeks / 4) + 1} months`

  return {
    baseFeaturesCost,
    complexityAdjustment,
    timelineAdjustment,
    teamSizeAdjustment,
    supportCost,
    customFeaturesCost,
    subtotal,
    discount,
    tax,
    total,
    currency: 'USD',
    estimatedHours: totalHours,
    estimatedDuration,
    breakdown
  }
}

/**
 * Format currency from cents to display string
 */
export function formatCurrency(cents: number, currency: string = 'USD'): string {
  const amount = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Generate payment milestones based on total amount
 */
export function generatePaymentMilestones(
  total: number,
  projectDuration: string,
  startDate: Date
): { name: string; percentage: number; amount: number; dueDate: string; description: string }[] {
  const milestones = []
  
  // Parse duration to get estimated weeks
  const durationMatch = projectDuration.match(/(\d+)/)
  const weeks = durationMatch ? parseInt(durationMatch[1]) * 4 : 8 // Default 8 weeks

  if (total < 2500000) { // Under $25k - 2 milestones
    milestones.push({
      name: 'Project Kickoff',
      percentage: 50,
      amount: Math.round(total * 0.5),
      dueDate: startDate.toISOString().split('T')[0],
      description: 'Due upon contract signing and project commencement'
    })
    const finalDate = new Date(startDate)
    finalDate.setDate(finalDate.getDate() + weeks * 7)
    milestones.push({
      name: 'Final Delivery',
      percentage: 50,
      amount: Math.round(total * 0.5),
      dueDate: finalDate.toISOString().split('T')[0],
      description: 'Due upon successful project completion and acceptance'
    })
  } else if (total < 10000000) { // $25k-$100k - 3 milestones
    milestones.push({
      name: 'Project Kickoff',
      percentage: 40,
      amount: Math.round(total * 0.4),
      dueDate: startDate.toISOString().split('T')[0],
      description: 'Due upon contract signing'
    })
    const midDate = new Date(startDate)
    midDate.setDate(midDate.getDate() + Math.round(weeks * 7 / 2))
    milestones.push({
      name: 'Midpoint Review',
      percentage: 30,
      amount: Math.round(total * 0.3),
      dueDate: midDate.toISOString().split('T')[0],
      description: 'Due upon completion of core functionality'
    })
    const finalDate = new Date(startDate)
    finalDate.setDate(finalDate.getDate() + weeks * 7)
    milestones.push({
      name: 'Final Delivery',
      percentage: 30,
      amount: Math.round(total * 0.3),
      dueDate: finalDate.toISOString().split('T')[0],
      description: 'Due upon project completion and acceptance'
    })
  } else { // Over $100k - 4 milestones
    milestones.push({
      name: 'Project Kickoff',
      percentage: 25,
      amount: Math.round(total * 0.25),
      dueDate: startDate.toISOString().split('T')[0],
      description: 'Due upon contract signing'
    })
    const phase1Date = new Date(startDate)
    phase1Date.setDate(phase1Date.getDate() + Math.round(weeks * 7 * 0.33))
    milestones.push({
      name: 'Phase 1 Complete',
      percentage: 25,
      amount: Math.round(total * 0.25),
      dueDate: phase1Date.toISOString().split('T')[0],
      description: 'Due upon completion of phase 1 deliverables'
    })
    const phase2Date = new Date(startDate)
    phase2Date.setDate(phase2Date.getDate() + Math.round(weeks * 7 * 0.66))
    milestones.push({
      name: 'Phase 2 Complete',
      percentage: 25,
      amount: Math.round(total * 0.25),
      dueDate: phase2Date.toISOString().split('T')[0],
      description: 'Due upon completion of phase 2 deliverables'
    })
    const finalDate = new Date(startDate)
    finalDate.setDate(finalDate.getDate() + weeks * 7)
    milestones.push({
      name: 'Final Delivery',
      percentage: 25,
      amount: Math.round(total * 0.25),
      dueDate: finalDate.toISOString().split('T')[0],
      description: 'Due upon project completion and acceptance'
    })
  }

  return milestones
}

/**
 * Validate pricing input
 */
export function validatePricingInput(input: PricingInput): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!input.projectName?.trim()) {
    errors.push('Project name is required')
  }

  if (!input.category) {
    errors.push('Service category is required')
  }

  if (!input.complexity) {
    errors.push('Complexity level is required')
  }

  if (!input.selectedFeatures?.length && !input.customFeatures?.length) {
    errors.push('At least one feature must be selected')
  }

  if (!input.timeline) {
    errors.push('Timeline preference is required')
  }

  if (!input.teamSize) {
    errors.push('Team size is required')
  }

  // Validate selected features exist
  for (const featureId of input.selectedFeatures || []) {
    const feature = getFeatureById(featureId)
    if (!feature) {
      errors.push(`Invalid feature: ${featureId}`)
    }
  }

  // Validate custom features
  for (const custom of input.customFeatures || []) {
    if (!custom.name?.trim()) {
      errors.push('Custom feature name is required')
    }
    if (custom.estimatedHours <= 0) {
      errors.push('Custom feature hours must be positive')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

