/**
 * Comprehensive Zod validation schemas for all input types
 * Following OWASP best practices for input validation
 */

import { z } from "zod"

// Common validation patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
const urlRegex = /^https?:\/\/.+\..+/
const alphanumericRegex = /^[a-zA-Z0-9]+$/
const safeStringRegex = /^[a-zA-Z0-9\s\-_.,!?@#$%&*()]+$/

/**
 * Sanitize string - remove dangerous characters
 */
function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .slice(0, 10000) // Max length
}

/**
 * Sanitize email - normalize and validate
 */
function sanitizeEmail(input: string): string {
  return input.trim().toLowerCase().slice(0, 255)
}

/**
 * Sanitize phone number
 */
function sanitizePhone(input: string): string {
  return input.replace(/[\s\-\(\)]/g, "").slice(0, 20)
}

/**
 * Sanitize URL
 */
function sanitizeUrl(input: string): string {
  try {
    const url = new URL(input)
    // Only allow http/https protocols
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Invalid protocol")
    }
    return url.toString()
  } catch {
    throw new Error("Invalid URL")
  }
}

// Base schemas
export const BaseStringSchema = z
  .string()
  .min(1, "This field is required")
  .max(10000, "Input is too long")
  .transform(sanitizeString)

export const EmailSchema = z
  .string()
  .min(1, "Email is required")
  .max(255, "Email is too long")
  .email("Invalid email address")
  .transform(sanitizeEmail)
  .refine((email) => emailRegex.test(email), {
    message: "Invalid email format",
  })

export const PhoneSchema = z
  .string()
  .optional()
  .transform((val) => (val ? sanitizePhone(val) : undefined))
  .refine(
    (val) => !val || phoneRegex.test(val),
    {
      message: "Invalid phone number format",
    }
  )

export const UrlSchema = z
  .string()
  .url("Invalid URL format")
  .transform(sanitizeUrl)
  .refine((url) => urlRegex.test(url), {
    message: "URL must use http or https protocol",
  })

export const SafeStringSchema = z
  .string()
  .min(1)
  .max(500)
  .transform(sanitizeString)
  .refine((str) => safeStringRegex.test(str), {
    message: "Contains invalid characters",
  })

export const NameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name is too long")
  .transform(sanitizeString)
  .refine(
    (name) => name.length >= 1 && name.length <= 100,
    {
      message: "Name must be between 1 and 100 characters",
    }
  )

export const MessageSchema = z
  .string()
  .min(10, "Message must be at least 10 characters")
  .max(5000, "Message is too long (max 5000 characters)")
  .transform(sanitizeString)

export const CompanySchema = z
  .string()
  .min(1, "Company name is required")
  .max(200, "Company name is too long")
  .transform(sanitizeString)

// Contact Form Schema
export const ContactFormSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  phone: PhoneSchema.optional(),
  company: z
    .string()
    .max(200, "Company name is too long")
    .transform(sanitizeString)
    .optional(),
  message: MessageSchema,
})

// Get Started Form Schema
export const GetStartedFormSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  company: CompanySchema,
  email: EmailSchema,
  phone: PhoneSchema.optional(),
  role: z
    .string()
    .max(100, "Role is too long")
    .transform(sanitizeString)
    .optional(),
  projectDescription: MessageSchema,
  serviceInterests: z
    .array(z.string().max(100).transform(sanitizeString))
    .min(1, "Please select at least one service area")
    .max(10, "Too many service interests selected"),
  contactMethod: z.enum(["email", "phone", "video"], {
    errorMap: () => ({ message: "Invalid contact method" }),
  }),
  timeline: z
    .string()
    .max(100, "Timeline is too long")
    .transform(sanitizeString)
    .optional(),
  budget: z
    .string()
    .max(100, "Budget is too long")
    .transform(sanitizeString)
    .optional(),
})

// Signup Schema
export const SignupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .transform(sanitizeString),
  email: EmailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

// Admin User Update Schema
export const AdminUserUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required").max(100),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
})

// Query Parameter Schemas
export const PaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 1000, {
      message: "Page must be between 1 and 1000",
    }),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),
})

export const SearchSchema = z.object({
  search: z
    .string()
    .max(200, "Search query is too long")
    .transform(sanitizeString)
    .optional(),
})

export const AdminUsersQuerySchema = PaginationSchema.merge(SearchSchema).extend({
  role: z
    .enum(["USER", "ADMIN", "SUPER_ADMIN"])
    .optional(),
})

export const AdminSubmissionsQuerySchema = PaginationSchema.merge(SearchSchema).extend({
  type: z
    .enum(["all", "contact", "get-started"])
    .optional()
    .default("all"),
})

// Stripe Payment Schemas
export const CreateCheckoutSessionSchema = z.object({
  priceId: z
    .string()
    .min(1, "Price ID is required")
    .max(200, "Price ID is too long")
    .regex(/^price_/, "Invalid price ID format"),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity is too large")
    .optional()
    .default(1),
  metadata: z.record(z.string()).optional(),
})

export const CreatePaymentIntentSchema = z.object({
  amount: z
    .number()
    .int()
    .min(50, "Amount must be at least $0.50")
    .max(10000000, "Amount is too large"),
  currency: z
    .enum(["usd", "eur", "gbp"])
    .optional()
    .default("usd"),
  metadata: z.record(z.string()).optional(),
})

// Rate Limit Schema
export const RateLimitSchema = z.object({
  identifier: z
    .string()
    .min(1, "Identifier is required")
    .max(200, "Identifier is too long")
    .transform(sanitizeString),
})

// Type exports
export type ContactFormInput = z.infer<typeof ContactFormSchema>
export type GetStartedFormInput = z.infer<typeof GetStartedFormSchema>
export type SignupInput = z.infer<typeof SignupSchema>
export type AdminUserUpdateInput = z.infer<typeof AdminUserUpdateSchema>
export type AdminUsersQueryInput = z.infer<typeof AdminUsersQuerySchema>
export type AdminSubmissionsQueryInput = z.infer<typeof AdminSubmissionsQuerySchema>
export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>
export type CreatePaymentIntentInput = z.infer<typeof CreatePaymentIntentSchema>
export type RateLimitInput = z.infer<typeof RateLimitSchema>

