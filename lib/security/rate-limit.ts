/**
 * Enhanced Rate Limiting
 * Prevents abuse and brute force attacks
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (use Redis in production)
const rateLimitStore: RateLimitStore = {}

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  identifier: string // Unique identifier (IP, user ID, etc.)
}

/**
 * Check rate limit
 */
export function checkRateLimit(options: RateLimitOptions): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const { windowMs, maxRequests, identifier } = options
  const now = Date.now()
  const key = `rate-limit:${identifier}`

  const record = rateLimitStore[key]

  // No record or window expired
  if (!record || now > record.resetTime) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs,
    }

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    }
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  // Increment count
  record.count++

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Get rate limit headers
 */
export function getRateLimitHeaders(
  allowed: boolean,
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    "X-RateLimit-Limit": "10",
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
    ...(allowed ? {} : { "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString() }),
  }
}

/**
 * Clean up expired rate limit records
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  })
}

// Clean up every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}

/**
 * Rate limit presets
 */
export const RateLimitPresets = {
  // Strict rate limiting (5 requests per 15 minutes)
  strict: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  },
  // Standard rate limiting (10 requests per minute)
  standard: {
    windowMs: 60 * 1000,
    maxRequests: 10,
  },
  // Lenient rate limiting (100 requests per hour)
  lenient: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 100,
  },
  // Form submission (3 requests per 15 minutes)
  formSubmission: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 3,
  },
  // API endpoint (60 requests per minute)
  api: {
    windowMs: 60 * 1000,
    maxRequests: 60,
  },
}

