/**
 * Validation utility functions
 * Provides easy-to-use validation helpers for API routes
 */

import { z } from "zod"
import { NextRequest } from "next/server"
import { captureException } from "@/lib/sentry"

/**
 * Validate request body against a Zod schema
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string; errors: Record<string, string> }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        const path = err.path.join(".")
        errors[path] = err.message
      })

      return {
        success: false,
        error: "Validation failed",
        errors,
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error: any) {
    captureException(error, {
      tags: { validation: "request_body" },
      level: "warning",
    })

    return {
      success: false,
      error: "Invalid request body",
      errors: { _general: "Request body must be valid JSON" },
    }
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQueryParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string; errors: Record<string, string> } {
  try {
    const { searchParams } = new URL(request.url)
    const params: Record<string, string> = {}

    searchParams.forEach((value, key) => {
      params[key] = value
    })

    const result = schema.safeParse(params)

    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        const path = err.path.join(".")
        errors[path] = err.message
      })

      return {
        success: false,
        error: "Invalid query parameters",
        errors,
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error: any) {
    captureException(error, {
      tags: { validation: "query_params" },
      level: "warning",
    })

    return {
      success: false,
      error: "Invalid query parameters",
      errors: { _general: "Query parameters are invalid" },
    }
  }
}

/**
 * Validate a single value against a schema
 */
export function validateValue<T>(
  value: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(value)

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message || "Validation failed",
    }
  }

  return {
    success: true,
    data: result.data,
  }
}

/**
 * Sanitize and validate string input
 */
export function sanitizeAndValidate(
  input: string,
  options: {
    maxLength?: number
    minLength?: number
    pattern?: RegExp
    required?: boolean
  } = {}
): { valid: boolean; sanitized: string; error?: string } {
  if (!input) {
    if (options.required) {
      return {
        valid: false,
        sanitized: "",
        error: "This field is required",
      }
    }
    return { valid: true, sanitized: "" }
  }

  let sanitized = input.trim()

  // Remove dangerous characters
  sanitized = sanitized
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")

  // Check length
  if (options.maxLength && sanitized.length > options.maxLength) {
    return {
      valid: false,
      sanitized,
      error: `Input must be no more than ${options.maxLength} characters`,
    }
  }

  if (options.minLength && sanitized.length < options.minLength) {
    return {
      valid: false,
      sanitized,
      error: `Input must be at least ${options.minLength} characters`,
    }
  }

  // Check pattern
  if (options.pattern && !options.pattern.test(sanitized)) {
    return {
      valid: false,
      sanitized,
      error: "Input format is invalid",
    }
  }

  return { valid: true, sanitized }
}

