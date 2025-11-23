/**
 * CSP Configuration Constants
 * Centralized CSP policy configuration
 */

/**
 * Allowed external domains for CSP
 */
export const CSPAllowedDomains = {
  // Scripts
  scripts: [
    "'self'",
    "https://vercel.live",
    "https://va.vercel-scripts.com",
    "https://js.stripe.com",
    "https://browser.sentry.io",
    "https://*.sentry.io",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ],

  // Styles
  styles: [
    "'self'",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ],

  // Images
  images: [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "http:",
    "https://my.spline.design",
    "https://*.spline.design",
  ],

  // Fonts
  fonts: [
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
    "https://fonts.googleapis.com",
  ],

  // Connections (API, WebSocket, etc.)
  connect: [
    "'self'",
    "https://api.stripe.com",
    "https://*.stripe.com",
    "https://*.sentry.io",
    "https://*.supabase.co",
    "https://*.supabase.com",
    "wss://*.supabase.co",
    "wss://*.supabase.com",
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
  ],

  // Frames (iframes)
  frames: [
    "'self'",
    "https://my.spline.design",
    "https://*.spline.design",
    "https://js.stripe.com",
    "https://hooks.stripe.com",
  ],
}

/**
 * CSP Policy Modes
 */
export enum CSPMode {
  ENFORCE = "enforce",
  REPORT_ONLY = "report-only",
}

/**
 * Get CSP mode from environment
 */
export function getCSPMode(): CSPMode {
  if (process.env.CSP_REPORT_ONLY === "true") {
    return CSPMode.REPORT_ONLY
  }
  return CSPMode.ENFORCE
}

/**
 * Check if CSP is enabled
 */
export function isCSPEnabled(): boolean {
  return process.env.DISABLE_CSP !== "true"
}

