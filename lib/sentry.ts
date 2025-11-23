/**
 * Sentry utility functions for error tracking and monitoring
 * 
 * Note: These functions will work even if Sentry is not installed.
 * They will gracefully degrade if @sentry/nextjs is not available.
 */

let Sentry: any = null
let SentryInitialized = false

// Try to import Sentry, but don't fail if it's not installed
function initializeSentry() {
  if (SentryInitialized) return Sentry
  
  try {
    Sentry = require("@sentry/nextjs")
    SentryInitialized = true
  } catch (e) {
    // Sentry not installed - create mock
    if (typeof console !== "undefined" && console.warn) {
      console.warn("Sentry not installed. Error tracking will be disabled.")
    }
    Sentry = {
      captureException: () => {},
      captureMessage: () => {},
      setUser: () => {},
      addBreadcrumb: () => {},
      withScope: (callback: any) => {
        const scope = {
          setTag: () => {},
          setExtra: () => {},
          setUser: () => {},
          setLevel: () => {},
        }
        callback(scope)
      },
      startTransaction: () => ({ finish: () => {} }),
      startBrowserTracingSpan: () => ({ finish: () => {} }),
    }
    SentryInitialized = true
  }
  
  return Sentry
}

// Initialize on first access
initializeSentry()

/**
 * Capture an exception with context
 */
export function captureException(
  error: Error,
  context?: {
    tags?: Record<string, string>
    extra?: Record<string, any>
    user?: {
      id?: string
      email?: string
      username?: string
    }
    level?: Sentry.SeverityLevel
  }
) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value)
      })
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }

    if (context?.user) {
      scope.setUser(context.user)
    }

    if (context?.level) {
      scope.setLevel(context.level)
    }

    Sentry.captureException(error)
  })
}

/**
 * Capture a message (non-error)
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: {
    tags?: Record<string, string>
    extra?: Record<string, any>
  }
) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value)
      })
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }

    scope.setLevel(level)
    Sentry.captureMessage(message)
  })
}

/**
 * Set user context for error tracking
 */
export function setUser(user: {
  id?: string
  email?: string
  username?: string
  [key: string]: any
}) {
  Sentry.setUser(user)
}

/**
 * Clear user context
 */
export function clearUser() {
  Sentry.setUser(null)
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  level?: Sentry.SeverityLevel,
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category: category || "default",
    level: level || "info",
    data,
  })
}

/**
 * Start a transaction for performance monitoring
 */
export function startTransaction(
  name: string,
  op: string
): Sentry.Transaction | undefined {
  if (typeof window === "undefined") {
    // Server-side
    return Sentry.startTransaction({
      name,
      op,
    })
  }
  // Client-side
  return Sentry.startBrowserTracingSpan({
    name,
    op,
  }) as any
}

/**
 * Wrap an async function with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: {
    tags?: Record<string, string>
    operation?: string
  }
): T {
  return (async (...args: any[]) => {
    const transaction = context?.operation
      ? startTransaction(context.operation, "function")
      : undefined

    try {
      const result = await fn(...args)
      transaction?.finish()
      return result
    } catch (error) {
      transaction?.finish()
      captureException(error as Error, {
        tags: context?.tags,
        extra: {
          function: fn.name,
          args: JSON.stringify(args),
        },
      })
      throw error
    }
  }) as T
}

