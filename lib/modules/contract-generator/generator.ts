// Contract Generator Service
// Generates complete contract documents

import type { ContractGenerationInput, GeneratedContract } from './types'
import { generateContractNumber, generateShareToken, htmlToPlainText } from './templates'
import { generateMSAContract } from './msa-template'

/**
 * Generate a complete contract from input data
 */
export async function generateContract(
  input: ContractGenerationInput
): Promise<GeneratedContract> {
  // Validate required fields
  validateContractInput(input)

  // Generate contract number
  const contractNumber = generateContractNumber()
  
  // Generate share token
  const shareToken = generateShareToken()
  
  // Set token expiry (30 days from now)
  const shareTokenExpiry = new Date()
  shareTokenExpiry.setDate(shareTokenExpiry.getDate() + 30)
  
  // Set contract validity (60 days from now)
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 60)
  
  // Generate HTML content using MSA template
  const htmlContent = generateMSAContract(input)
  
  // Generate plain text version
  const plainTextContent = htmlToPlainText(htmlContent)
  
  // Create contract title
  const title = `Service Agreement - ${input.projectName}`
  
  // Create generated contract object
  const contract: GeneratedContract = {
    id: `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    contractNumber,
    title,
    htmlContent,
    plainTextContent,
    totalAmount: input.pricing.total,
    currency: input.pricing.currency,
    createdAt: new Date(),
    validUntil,
    shareToken,
    shareTokenExpiry
  }

  return contract
}

/**
 * Validate contract generation input
 */
export function validateContractInput(input: ContractGenerationInput): void {
  const errors: string[] = []

  // Required project fields
  if (!input.projectName?.trim()) {
    errors.push('Project name is required')
  }
  if (!input.projectDescription?.trim()) {
    errors.push('Project description is required')
  }
  if (!input.scopeOfWork?.length) {
    errors.push('Scope of work is required')
  }
  if (!input.deliverables?.length) {
    errors.push('Deliverables are required')
  }

  // Required client fields
  if (!input.clientName?.trim()) {
    errors.push('Client name is required')
  }
  if (!input.clientEmail?.trim()) {
    errors.push('Client email is required')
  }

  // Required company fields
  if (!input.companyName?.trim()) {
    errors.push('Company name is required')
  }
  if (!input.companyAddress?.trim()) {
    errors.push('Company address is required')
  }
  if (!input.companyEmail?.trim()) {
    errors.push('Company email is required')
  }

  // Required pricing
  if (!input.pricing) {
    errors.push('Pricing information is required')
  } else if (input.pricing.total <= 0) {
    errors.push('Total amount must be greater than 0')
  }

  // Required timeline
  if (!input.startDate) {
    errors.push('Start date is required')
  }
  if (!input.endDate) {
    errors.push('End date is required')
  }
  if (input.startDate && input.endDate && input.startDate > input.endDate) {
    errors.push('End date must be after start date')
  }

  // Required payment schedule
  if (!input.paymentSchedule?.length) {
    errors.push('Payment schedule is required')
  }

  if (errors.length > 0) {
    throw new Error(`Contract validation failed: ${errors.join(', ')}`)
  }
}

/**
 * Verify a share token is valid
 */
export function verifyShareToken(
  token: string,
  storedToken: string,
  expiry: Date | null
): { valid: boolean; error?: string } {
  if (!token || !storedToken) {
    return { valid: false, error: 'Invalid token' }
  }

  if (token !== storedToken) {
    return { valid: false, error: 'Token mismatch' }
  }

  // If expiry is not set or is year 1970 (default), consider token valid (no expiry)
  // This handles contracts created before expiry tracking was added
  if (expiry && expiry.getTime() > 0 && new Date() > expiry) {
    return { valid: false, error: 'Token expired' }
  }

  return { valid: true }
}

/**
 * Regenerate share token for a contract
 */
export function regenerateShareToken(): { token: string; expiry: Date } {
  const token = generateShareToken()
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 30) // 30 days validity
  
  return { token, expiry }
}

