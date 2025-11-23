/**
 * CSRF Protection Utilities
 * Implements CSRF token generation and validation
 */

import { cookies } from "next/headers"
import { randomBytes, createHmac } from "crypto"

const CSRF_TOKEN_NAME = "csrf-token"
const CSRF_SECRET = process.env.CSRF_SECRET || "change-this-secret-in-production"

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  const token = randomBytes(32).toString("hex")
  const hmac = createHmac("sha256", CSRF_SECRET)
  hmac.update(token)
  const signature = hmac.digest("hex")
  return `${token}.${signature}`
}

/**
 * Validate a CSRF token
 */
export function validateCsrfToken(token: string): boolean {
  if (!token || typeof token !== "string") {
    return false
  }

  const [tokenPart, signature] = token.split(".")
  if (!tokenPart || !signature) {
    return false
  }

  const hmac = createHmac("sha256", CSRF_SECRET)
  hmac.update(tokenPart)
  const expectedSignature = hmac.digest("hex")

  // Use constant-time comparison to prevent timing attacks
  return constantTimeEqual(signature, expectedSignature)
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Get or create CSRF token from cookies
 */
export async function getCsrfToken(): Promise<string> {
  try {
    const cookieStore = await cookies()
    let token = cookieStore.get(CSRF_TOKEN_NAME)?.value

    if (!token || !validateCsrfToken(token)) {
      token = generateCsrfToken()
      cookieStore.set(CSRF_TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      })
    }

    return token
  } catch (error: any) {
    // If cookie access fails, generate a new token anyway
    // This ensures the endpoint always returns a token
    console.error('Error accessing cookies in getCsrfToken:', error)
    const token = generateCsrfToken()
    return token
  }
}

/**
 * Validate CSRF token from request
 */
export async function validateCsrfFromRequest(
  request: Request,
  token?: string
): Promise<boolean> {
  try {
    // Get token from header or body
    const headerToken = request.headers.get("X-CSRF-Token")
    const bodyToken = token

    const requestToken = headerToken || bodyToken

    if (!requestToken) {
      return false
    }

    // Get token from cookie
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value

    if (!cookieToken) {
      return false
    }

    // Validate tokens match
    if (requestToken !== cookieToken) {
      return false
    }

    // Validate token signature
    return validateCsrfToken(requestToken)
  } catch (error: any) {
    // If cookie access fails, return false instead of throwing
    console.error('CSRF validation error:', error)
    return false
  }
}

/**
 * Middleware to require CSRF token for POST/PUT/DELETE requests
 */
export async function requireCsrfToken(request: Request): Promise<{
  valid: boolean
  error?: string
}> {
  try {
    const method = request.method

    // Only require CSRF for state-changing methods
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      return { valid: true }
    }

    const isValid = await validateCsrfFromRequest(request)

    if (!isValid) {
      return {
        valid: false,
        error: "Invalid or missing CSRF token",
      }
    }

    return { valid: true }
  } catch (error: any) {
    // If CSRF validation itself fails, return invalid to prevent HTML error page
    console.error('CSRF validation internal error:', error)
    return {
      valid: false,
      error: "Security validation failed",
    }
  }
}

