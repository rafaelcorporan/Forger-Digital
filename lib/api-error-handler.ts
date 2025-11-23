/**
 * API Error Handler with Sentry Integration
 * Wraps API route handlers to automatically track errors
 */

import { NextRequest, NextResponse } from "next/server"
import { captureException, addBreadcrumb } from "./sentry"

interface ApiHandlerOptions {
  operation?: string
  tags?: Record<string, string>
  skipErrorTracking?: boolean
}

/**
 * Wraps an API route handler with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options: ApiHandlerOptions = {}
): T {
  return (async (request: NextRequest, ...args: any[]) => {
    const startTime = Date.now()
    
    try {
      // Add breadcrumb for request
      addBreadcrumb(
        `${request.method} ${request.nextUrl.pathname}`,
        "http",
        "info",
        {
          method: request.method,
          url: request.nextUrl.pathname,
          query: Object.fromEntries(request.nextUrl.searchParams),
        }
      )

      // Execute handler
      const response = await handler(request, ...args)
      
      // Track performance
      const duration = Date.now() - startTime
      if (duration > 1000) {
        // Log slow requests
        addBreadcrumb(
          `Slow request: ${request.method} ${request.nextUrl.pathname} (${duration}ms)`,
          "performance",
          "warning",
          {
            duration,
            method: request.method,
            url: request.nextUrl.pathname,
          }
        )
      }

      return response
    } catch (error: any) {
      // Track error
      if (!options.skipErrorTracking) {
        captureException(error as Error, {
          tags: {
            api_route: request.nextUrl.pathname,
            http_method: request.method,
            ...options.tags,
            ...(options.operation && { operation: options.operation }),
          },
          extra: {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
            duration: Date.now() - startTime,
          },
          level: "error",
        })
      }

      // Return error response
      const statusCode = error.statusCode || error.status || 500
      const message =
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error"

      return NextResponse.json(
        {
          success: false,
          error: message,
          ...(process.env.NODE_ENV === "development" && {
            details: error.stack,
          }),
        },
        { status: statusCode }
      )
    }
  }) as T
}

/**
 * Creates an error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  error?: Error
) {
  if (error) {
    captureException(error, {
      tags: {
        error_type: "api_error",
      },
      extra: {
        message,
        statusCode,
      },
    })
  }

  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(process.env.NODE_ENV === "development" && error && {
        details: error.message,
      }),
    },
    { status: statusCode }
  )
}

