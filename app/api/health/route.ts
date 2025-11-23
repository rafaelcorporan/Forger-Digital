import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/security/rate-limit-middleware"

/**
 * Health check endpoint for monitoring
 * This endpoint is used by monitoring tools to check system health
 * Includes HTTPS status check
 */
export async function GET(request: NextRequest) {
  // Light rate limiting for health checks
  const rateLimitResult = await rateLimit(request, "/api/health")

  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  const url = new URL(request.url)
  const isHTTPS = url.protocol === "https:"
  const forwardedProto = request.headers.get("x-forwarded-proto")
  const isHTTPSForwarded = forwardedProto === "https"

  const response = NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    https: {
      enabled: isHTTPS || isHTTPSForwarded,
      protocol: url.protocol,
      forwardedProto: forwardedProto,
    },
  })

  // Add rate limit headers
  Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}
