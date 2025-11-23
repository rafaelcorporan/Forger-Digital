/**
 * Form Helper Utilities
 * Functions for form validation, field dependencies, and calculations
 */

export interface FieldDependency {
  field: string
  condition: (value: any, formData: any) => boolean
  show?: boolean
  required?: boolean
  disabled?: boolean
}

/**
 * Calculate form completion percentage
 */
export function calculateFormProgress(
  formData: Record<string, any>,
  requiredFields: string[]
): number {
  const filledFields = requiredFields.filter(
    (field) => {
      const value = formData[field]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== null && value !== undefined && value !== ""
    }
  ).length

  return requiredFields.length > 0
    ? Math.round((filledFields / requiredFields.length) * 100)
    : 0
}

/**
 * Check if field should be shown based on dependencies
 */
export function shouldShowField(
  fieldName: string,
  dependencies: FieldDependency[],
  formData: Record<string, any>
): boolean {
  const dependency = dependencies.find((dep) => dep.field === fieldName)
  if (!dependency) return true

  return dependency.condition(formData[dependency.field], formData)
}

/**
 * Check if field should be required based on dependencies
 */
export function isFieldRequired(
  fieldName: string,
  dependencies: FieldDependency[],
  formData: Record<string, any>
): boolean {
  const dependency = dependencies.find((dep) => dep.field === fieldName)
  if (!dependency || !dependency.required) return false

  return dependency.condition(formData[dependency.field], formData)
}

/**
 * Check if field should be disabled based on dependencies
 */
export function isFieldDisabled(
  fieldName: string,
  dependencies: FieldDependency[],
  formData: Record<string, any>
): boolean {
  const dependency = dependencies.find((dep) => dep.field === fieldName)
  if (!dependency || !dependency.disabled) return false

  return dependency.condition(formData[dependency.field], formData)
}

/**
 * Format phone number
 */
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
  if (match) {
    return [match[1], match[2], match[3]]
      .filter(Boolean)
      .join("-")
      .replace(/^(\d{3})-(\d{3})-(\d{4})$/, "($1) $2-$3")
  }
  return value
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 10 && cleaned.length <= 15
}

