/**
 * Error handler for Next.js middleware
 * Wraps middleware functions to track errors
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { captureException, addBreadcrumb } from "@/lib/sentry"

/**
 * Wraps middleware with error tracking
 */
export function withMiddlewareErrorTracking(
  middleware: (request: NextRequest) => NextResponse | Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      addBreadcrumb(
        `Middleware: ${request.nextUrl.pathname}`,
        "middleware",
        "info",
        {
          pathname: request.nextUrl.pathname,
          method: request.method,
        }
      )

      return await middleware(request)
    } catch (error: any) {
      captureException(error as Error, {
        tags: {
          error_type: "middleware_error",
          pathname: request.nextUrl.pathname,
        },
        extra: {
          url: request.url,
          method: request.method,
        },
        level: "error",
      })

      // Return error response
      return NextResponse.json(
        {
          error: "Internal server error",
        },
        { status: 500 }
      )
    }
  }
}

