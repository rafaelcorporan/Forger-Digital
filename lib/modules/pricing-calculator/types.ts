// Pricing Calculator Types
// Market-based pricing for tech services

export type ServiceCategory = 
  | 'web_development'
  | 'mobile_development'
  | 'ai_ml'
  | 'blockchain'
  | 'cloud_infrastructure'
  | 'cybersecurity'
  | 'data_engineering'
  | 'devops'
  | 'ui_ux_design'
  | 'consulting'

export type ComplexityLevel = 'low' | 'medium' | 'high' | 'enterprise'

export interface FeatureDefinition {
  id: string
  name: string
  description: string
  category: ServiceCategory
  baseCost: number // In cents
  timeEstimate: number // In hours
  complexityMultiplier: Record<ComplexityLevel, number>
}

export interface PricingInput {
  projectName: string
  description: string
  category: ServiceCategory
  complexity: ComplexityLevel
  selectedFeatures: string[] // Feature IDs
  timeline: 'urgent' | 'standard' | 'flexible' // Affects pricing
  teamSize: 'small' | 'medium' | 'large'
  supportLevel: 'basic' | 'standard' | 'premium'
  customFeatures?: CustomFeature[]
}

export interface CustomFeature {
  name: string
  description: string
  estimatedHours: number
  hourlyRate?: number // Optional override
}

export interface PricingBreakdown {
  baseFeaturesCost: number
  complexityAdjustment: number
  timelineAdjustment: number
  teamSizeAdjustment: number
  supportCost: number
  customFeaturesCost: number
  subtotal: number
  discount: number
  tax: number
  total: number
  currency: string
  estimatedHours: number
  estimatedDuration: string // e.g., "8-12 weeks"
  breakdown: FeatureCostItem[]
}

export interface FeatureCostItem {
  featureId: string
  featureName: string
  baseCost: number
  adjustedCost: number
  hours: number
}

export interface MarketRates {
  hourlyRates: Record<ServiceCategory, Record<ComplexityLevel, number>>
  timelineMultipliers: Record<'urgent' | 'standard' | 'flexible', number>
  teamSizeMultipliers: Record<'small' | 'medium' | 'large', number>
  supportCosts: Record<'basic' | 'standard' | 'premium', number>
  discountThresholds: { minAmount: number; discountPercent: number }[]
}

export interface ContractData {
  projectName: string
  clientName: string
  clientCompany: string
  clientEmail: string
  projectDescription: string
  scopeOfWork: string[]
  deliverables: string[]
  timeline: string
  startDate: string
  endDate: string
  pricing: PricingBreakdown
  paymentTerms: string
  paymentSchedule: PaymentMilestone[]
  termsAndConditions: string[]
  warrantyPeriod: string
  revisionPolicy: string
}

export interface PaymentMilestone {
  name: string
  percentage: number
  amount: number
  dueDate: string
  description: string
}

