// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",
  
  // Replay may only be enabled for the client-side
  replaysOnErrorSampleRate: 1.0,
  
  // If the entire session should be sampled, use the following line:
  replaysSessionSampleRate: 0.1,
  
  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Set sample rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  
  // Configure which errors to capture
  beforeSend(event, hint) {
    // Filter out non-critical errors in production
    if (process.env.NODE_ENV === "production") {
      // Don't send errors from browser extensions
      if (event.exception) {
        const error = hint.originalException
        if (error && typeof error === "object" && "message" in error) {
          const message = String(error.message)
          if (
            message.includes("chrome-extension://") ||
            message.includes("moz-extension://") ||
            message.includes("safari-extension://")
          ) {
            return null
          }
        }
      }
    }
    return event
  },
  
  // Add user context
  initialScope: {
    tags: {
      environment: process.env.NODE_ENV || "development",
    },
  },
})

