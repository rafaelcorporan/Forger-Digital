/**
 * Rate Limiting Middleware for Next.js API Routes
 * Easy-to-use wrapper for rate limiting
 */

import { NextRequest, NextResponse } from "next/server"
import {
  checkRateLimitEnhanced,
  getRateLimitHeadersEnhanced,
  getRateLimitConfig,
  EndpointRateLimits,
} from "./rate-limit-enhanced"
import { captureException } from "@/lib/sentry"

/**
 * Rate limit middleware factory
 */
export function createRateLimitMiddleware(config?: {
  endpoint?: string
  windowMs?: number
  maxRequests?: number
  message?: string
  keyGenerator?: (request: NextRequest) => string
}) {
  return async (request: NextRequest, handler: (request: NextRequest) => Promise<NextResponse>) => {
    try {
      const url = new URL(request.url)
      const endpoint = config?.endpoint || url.pathname

      // Get rate limit config
      const rateLimitConfig = getRateLimitConfig(endpoint, {
        ...(config?.windowMs !== undefined && { windowMs: config.windowMs }),
        ...(config?.maxRequests !== undefined && { maxRequests: config.maxRequests }),
        ...(config?.message && { message: config.message }),
        ...(config?.keyGenerator && {
          keyGenerator: (req: Request) => config.keyGenerator!(req as NextRequest),
        }),
      })

      // Check rate limit
      const result = await checkRateLimitEnhanced(request, rateLimitConfig)

      // If rate limit exceeded
      if (!result.allowed) {
        return NextResponse.json(
          {
            error: rateLimitConfig.message || "Too many requests",
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: getRateLimitHeadersEnhanced(result),
          }
        )
      }

      // Execute handler
      const response = await handler(request)

      // Add rate limit headers to response
      const headers = new Headers(response.headers)
      Object.entries(getRateLimitHeadersEnhanced(result)).forEach(([key, value]) => {
        headers.set(key, value)
      })

      return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    } catch (error: any) {
      console.error("Rate limit middleware error:", error)
      captureException(error as Error, {
        tags: { middleware: "rate-limit", endpoint: request.nextUrl.pathname },
      })

      // On error, allow request but log it
      return handler(request)
    }
  }
}

/**
 * Simple rate limit wrapper for API routes
 */
export async function rateLimit(
  request: NextRequest,
  endpoint?: string,
  customConfig?: {
    windowMs?: number
    maxRequests?: number
    message?: string
    keyGenerator?: (request: NextRequest) => string
  }
): Promise<{
  allowed: boolean
  response?: NextResponse
  headers: Record<string, string>
}> {
  try {
    const url = new URL(request.url)
    const path = endpoint || url.pathname

    const rateLimitConfig = getRateLimitConfig(path, {
      ...(customConfig?.windowMs !== undefined && { windowMs: customConfig.windowMs }),
      ...(customConfig?.maxRequests !== undefined && { maxRequests: customConfig.maxRequests }),
      ...(customConfig?.message && { message: customConfig.message }),
      ...(customConfig?.keyGenerator && {
        keyGenerator: (req: Request) => customConfig.keyGenerator!(req as NextRequest),
      }),
    })

    const result = await checkRateLimitEnhanced(request, rateLimitConfig)

    const headers = getRateLimitHeadersEnhanced(result)

    if (!result.allowed) {
      return {
        allowed: false,
        response: NextResponse.json(
          {
            error: rateLimitConfig.message || "Too many requests",
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers,
          }
        ),
        headers,
      }
    }

    return {
      allowed: true,
      headers,
    }
  } catch (error: any) {
    console.error("Rate limit check error:", error)
    captureException(error as Error, {
      tags: { middleware: "rate-limit", endpoint: request.nextUrl.pathname },
    })

    // On error, allow request
    return {
      allowed: true,
      headers: {},
    }
  }
}

/**
 * Get user-based identifier for rate limiting
 */
export function getUserIdentifier(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  // Fallback to IP
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const ip = forwarded?.split(",")[0] || realIp || "unknown"
  return `ip:${ip}`
}

/**
 * Check if endpoint has rate limiting configured
 */
export function hasRateLimit(endpoint: string): boolean {
  return endpoint in EndpointRateLimits
}

