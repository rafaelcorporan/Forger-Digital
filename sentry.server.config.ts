// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",
  
  // Set sample rate for profiling
  profilesSampleRate: 1.0,
  
  // Configure which errors to capture
  beforeSend(event, hint) {
    // Add additional context
    if (event.request) {
      event.request.headers = event.request.headers || {}
    }
    
    // Filter out health check errors
    if (event.request?.url?.includes("/health")) {
      return null
    }
    
    return event
  },
  
  // Add environment tags
  initialScope: {
    tags: {
      environment: process.env.NODE_ENV || "development",
      platform: "nextjs",
    },
  },
  
  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    "chrome-extension://",
    "moz-extension://",
    "safari-extension://",
    // Network errors that are expected
    "NetworkError",
    "Failed to fetch",
    // Prisma errors that are handled
    "P1001", // Can't reach database server
  ],
})

