// Contract Generator Types

import type { PricingBreakdown, PaymentMilestone } from '../pricing-calculator/types'

export interface ContractGenerationInput {
  // Project details
  projectId?: string
  projectName: string
  projectDescription: string
  scopeOfWork: string[]
  deliverables: string[]
  techStack?: string[]
  
  // Client details
  clientName: string
  clientCompany: string
  clientEmail: string
  clientAddress?: string
  
  // Company details (service provider)
  companyName: string
  companyAddress: string
  companyEmail: string
  companyPhone?: string
  
  // Pricing
  pricing: PricingBreakdown
  
  // Timeline
  startDate: Date
  endDate: Date
  timeline: string // e.g., "12 weeks"
  
  // Payment terms
  paymentTerms: string
  paymentSchedule: PaymentMilestone[]
  
  // Legal terms
  termsVersion: string
  revisionPolicy?: string
  warrantyPeriod?: string
  confidentialityClause?: boolean
  
  // Additional metadata
  metadata?: Record<string, unknown>
}

export interface GeneratedContract {
  id: string
  contractNumber: string
  title: string
  htmlContent: string
  plainTextContent: string
  pdfBuffer?: Buffer
  totalAmount: number
  currency: string
  createdAt: Date
  validUntil: Date
  shareToken: string
  shareTokenExpiry: Date
}

export interface ContractTemplate {
  id: string
  name: string
  description: string
  htmlTemplate: string
  isDefault: boolean
}

// Standard contract sections
export interface ContractSections {
  header: string
  parties: string
  projectOverview: string
  scopeOfWork: string
  deliverables: string
  timeline: string
  pricing: string
  paymentTerms: string
  termsAndConditions: string
  confidentiality: string
  intellectualProperty: string
  termination: string
  warranty: string
  signatures: string
}

