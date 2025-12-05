/**
 * Enhanced Rate Limiting System
 * Production-ready rate limiting with Redis support and middleware integration
 */

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (request: Request) => string
  onLimitReached?: (identifier: string, request: Request) => void
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
    firstRequest: number
  }
}

// In-memory store (fallback when Redis is not available)
const inMemoryStore: RateLimitStore = {}

// Redis client (optional)
let redisClient: any = null
let redisAvailable = false

// Try to initialize Redis if available
async function initRedis() {
  if (process.env.REDIS_URL) {
    try {
      // Dynamic import with error handling for optional dependency
      const redisModule = await import("redis").catch(() => null)
      if (!redisModule) {
        console.warn("Redis package not installed, using in-memory rate limiting")
        redisAvailable = false
        return
      }
      const { createClient } = redisModule
      redisClient = createClient({
        url: process.env.REDIS_URL,
      })
      redisClient.on("error", (err: Error) => {
        console.warn("Redis rate limit error:", err)
        redisAvailable = false
      })
      await redisClient.connect()
      redisAvailable = true
      console.log("✅ Redis rate limiting enabled")
    } catch (error) {
      console.warn("Redis not available, using in-memory rate limiting:", error)
      redisAvailable = false
    }
  }
}

// Initialize Redis on module load
if (typeof window === "undefined") {
  initRedis()
}

/**
 * Get identifier for rate limiting
 */
export function getIdentifier(
  request: Request,
  keyGenerator?: (request: Request) => string
): string {
  if (keyGenerator) {
    return keyGenerator(request)
  }

  // Default: Use IP address
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const ip = forwarded?.split(",")[0] || realIp || "unknown"

  // Try to get user ID from session if available
  // This would require passing session info, so for now we use IP
  return ip
}

/**
 * Check rate limit using Redis (if available) or in-memory store
 */
async function checkRateLimitRedis(
  key: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult> {
  if (!redisAvailable || !redisClient) {
    throw new Error("Redis not available")
  }

  const now = Date.now()
  const windowStart = now - windowMs

  // Use sliding window with sorted set
  const pipeline = redisClient.multi()
  pipeline.zremrangebyscore(key, 0, windowStart)
  pipeline.zcard(key)
  pipeline.zadd(key, now, `${now}-${Math.random()}`)
  pipeline.expire(key, Math.ceil(windowMs / 1000))
  const results = await pipeline.exec()

  const count = results[1] as number
  const allowed = count < maxRequests
  const remaining = Math.max(0, maxRequests - count - 1)
  const resetTime = now + windowMs

  return {
    allowed,
    remaining,
    resetTime,
    limit: maxRequests,
  }
}

/**
 * Check rate limit using in-memory store
 */
function checkRateLimitMemory(
  key: string,
  windowMs: number,
  maxRequests: number
): RateLimitResult {
  const now = Date.now()
  const record = inMemoryStore[key]

  // No record or window expired
  if (!record || now > record.resetTime) {
    inMemoryStore[key] = {
      count: 1,
      resetTime: now + windowMs,
      firstRequest: now,
    }

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
      limit: maxRequests,
    }
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      limit: maxRequests,
    }
  }

  // Increment count
  record.count++

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
    limit: maxRequests,
  }
}

/**
 * Check rate limit (with Redis fallback to in-memory)
 */
export async function checkRateLimitEnhanced(
  request: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const identifier = getIdentifier(request, config.keyGenerator)
  const key = `rate-limit:${config.windowMs}:${config.maxRequests}:${identifier}`

  try {
    // Try Redis first if available
    if (redisAvailable && redisClient) {
      return await checkRateLimitRedis(key, config.windowMs, config.maxRequests)
    }
  } catch (error) {
    // Fallback to in-memory if Redis fails
    if (process.env.NODE_ENV === "development") {
      console.warn("Redis rate limit check failed, using in-memory:", error)
    }
  }

  // Use in-memory store
  return checkRateLimitMemory(key, config.windowMs, config.maxRequests)
}

/**
 * Get rate limit headers
 */
export function getRateLimitHeadersEnhanced(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
  }

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000)
    headers["Retry-After"] = retryAfter.toString()
  }

  return headers
}

/**
 * Clean up expired in-memory rate limit records
 */
export function cleanupInMemoryStore() {
  const now = Date.now()
  Object.keys(inMemoryStore).forEach((key) => {
    if (inMemoryStore[key].resetTime < now) {
      delete inMemoryStore[key]
    }
  })
}

// Clean up every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupInMemoryStore, 5 * 60 * 1000)
}

/**
 * Endpoint-specific rate limit configurations
 */
export const EndpointRateLimits: Record<string, RateLimitConfig> = {
  // Authentication endpoints
  "/api/auth/signup": {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: "Too many signup attempts. Please try again later.",
  },
  "/api/auth/signin": {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
    message: "Too many login attempts. Please try again later.",
  },
  "/api/auth/rate-limit": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    message: "Too many rate limit checks.",
  },

  // Form submission endpoints
  "/api/contact": {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3,
    message: "Too many contact form submissions. Please try again later.",
  },
  "/api/get-started": {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3,
    message: "Too many project inquiries. Please try again later.",
  },

  // Admin endpoints (higher limits for authenticated admins)
  "/api/admin/stats": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    message: "Too many requests to admin stats.",
  },
  "/api/admin/users": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    message: "Too many requests to user management.",
  },
  "/api/admin/submissions": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    message: "Too many requests to submissions.",
  },

  // Payment endpoints
  "/api/stripe/create-checkout-session": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: "Too many checkout session requests.",
  },
  "/api/stripe/create-payment-intent": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: "Too many payment intent requests.",
  },
  "/api/stripe/webhook": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // Higher limit for webhooks
    message: "Too many webhook requests.",
  },

  // Utility endpoints
  "/api/health": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: "Too many health check requests.",
  },
  "/api/docs/openapi": {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: "Too many API documentation requests.",
  },
}

/**
 * Get rate limit config for an endpoint
 */
export function getRateLimitConfig(
  endpoint: string,
  defaultConfig?: Partial<RateLimitConfig>
): RateLimitConfig {
  const config = EndpointRateLimits[endpoint]
  
  // Merge configs, with defaultConfig taking precedence
  const merged: RateLimitConfig = {
    windowMs: defaultConfig?.windowMs ?? config?.windowMs ?? 60 * 1000,
    maxRequests: defaultConfig?.maxRequests ?? config?.maxRequests ?? 60,
    message: defaultConfig?.message ?? config?.message ?? "Too many requests. Please try again later.",
    ...(defaultConfig?.keyGenerator && { keyGenerator: defaultConfig.keyGenerator }),
    ...(defaultConfig?.skipSuccessfulRequests !== undefined && {
      skipSuccessfulRequests: defaultConfig.skipSuccessfulRequests,
    }),
    ...(defaultConfig?.skipFailedRequests !== undefined && {
      skipFailedRequests: defaultConfig.skipFailedRequests,
    }),
    ...(defaultConfig?.onLimitReached && { onLimitReached: defaultConfig.onLimitReached }),
  }

  return merged
}

/**
 * Rate limit middleware for Next.js API routes
 */
export async function withRateLimit<T>(
  request: Request,
  handler: (request: Request) => Promise<Response>,
  config?: RateLimitConfig
): Promise<Response> {
  const url = new URL(request.url)
  const endpoint = url.pathname

  // Get config for this endpoint
  const rateLimitConfig = config || getRateLimitConfig(endpoint)

  // Check rate limit
  const result = await checkRateLimitEnhanced(request, rateLimitConfig)

  // Call onLimitReached callback if provided
  if (!result.allowed && rateLimitConfig.onLimitReached) {
    const identifier = getIdentifier(request, rateLimitConfig.keyGenerator)
    rateLimitConfig.onLimitReached(identifier, request)
  }

  // If rate limit exceeded, return 429
  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: rateLimitConfig.message || "Too many requests",
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...getRateLimitHeadersEnhanced(result),
        },
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

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

