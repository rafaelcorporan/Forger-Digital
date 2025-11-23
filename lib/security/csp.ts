/**
 * Content Security Policy (CSP) Configuration
 * Comprehensive CSP headers to prevent XSS and content injection attacks
 */

import { CSPAllowedDomains, isCSPEnabled } from "./csp-config"

/**
 * Generate a nonce for inline scripts/styles
 * Uses Web Crypto API for Edge Runtime compatibility
 */
export function generateNonce(): string {
  // Use Web Crypto API (available in Edge Runtime)
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    // Convert to base64 using btoa (available in Edge Runtime)
    // Convert Uint8Array to base64 manually for Edge compatibility
    const binary = String.fromCharCode(...array)
    return btoa(binary)
  }
  
  // Fallback for Node.js runtime (should not be needed in Edge)
  // This will only execute in Node.js runtime, not Edge
  if (typeof require !== "undefined") {
    try {
      const { randomBytes } = require("crypto")
      return randomBytes(16).toString("base64")
    } catch {
      // If crypto is not available, generate a simple nonce
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
  }
  
  // Last resort fallback
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Get CSP policy string
 */
export function getCSPPolicy(nonce: string, reportUri?: string): string {
  if (!isCSPEnabled()) {
    return "" // CSP disabled
  }

  const directives: string[] = []

  // Default source - 'self' for same-origin
  directives.push("default-src 'self'")

  // Script sources
  // Allow scripts from self, Vercel Analytics, Stripe, Sentry (if used)
  // Use nonce for inline scripts, strict-dynamic for script loading
  // In development, allow unsafe-eval for Next.js dev tools
  const isDevelopment = process.env.NODE_ENV === "development"
  const scriptSrc = isDevelopment
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' 'unsafe-inline' ${CSPAllowedDomains.scripts.join(" ")}`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${CSPAllowedDomains.scripts.join(" ")}`
  directives.push(scriptSrc)

  // Style sources
  // Allow styles from self, Google Fonts, inline styles with nonce
  // Note: 'unsafe-inline' needed for some third-party libraries, but nonce provides additional security
  directives.push(
    `style-src 'self' 'nonce-${nonce}' ${CSPAllowedDomains.styles.join(" ")} 'unsafe-inline'`
  )

  // Image sources
  // Allow images from self, data URIs, blob URIs, external CDNs, Spline
  directives.push(`img-src ${CSPAllowedDomains.images.join(" ")}`)

  // Font sources
  // Allow fonts from self, Google Fonts, data URIs
  directives.push(`font-src ${CSPAllowedDomains.fonts.join(" ")}`)

  // Connect sources (API calls, WebSockets, etc.)
  // Allow connections to self, Stripe API, Sentry, Supabase, own API
  const connectSources = [
    ...CSPAllowedDomains.connect,
    process.env.NEXTAUTH_URL || "http://localhost:3000",
  ]
  directives.push(`connect-src ${connectSources.join(" ")}`)

  // Frame sources (iframes)
  // Allow Spline embeds, Stripe checkout
  directives.push(`frame-src ${CSPAllowedDomains.frames.join(" ")}`)

  // Frame ancestors (who can embed this site)
  // Restrict to self only (prevent clickjacking)
  directives.push("frame-ancestors 'self'")

  // Object sources (plugins, Flash, etc.)
  // Block all object/embed/applet tags
  directives.push("object-src 'none'")

  // Media sources (audio, video)
  // Allow from self and data URIs
  directives.push("media-src 'self' data: blob:")

  // Worker sources (Web Workers, Service Workers)
  // Allow from self and blob URIs
  directives.push("worker-src 'self' blob:")

  // Manifest sources (web app manifests)
  // Allow from self
  directives.push("manifest-src 'self'")

  // Base URI (restrict base tag)
  // Allow only self
  directives.push("base-uri 'self'")

  // Form actions (where forms can submit)
  // Allow only to self
  directives.push("form-action 'self'")

  // Upgrade insecure requests (HTTPS only)
  if (process.env.NODE_ENV === "production") {
    directives.push("upgrade-insecure-requests")
  }

  // Report URI for CSP violations
  if (reportUri) {
    directives.push(`report-uri ${reportUri}`)
  }

  // Report-To header (newer CSP reporting)
  // This would be set separately in headers

  return directives.join("; ")
}

/**
 * Get CSP Report-Only policy (for testing)
 */
export function getCSPReportOnlyPolicy(nonce: string, reportUri?: string): string {
  // Same as enforce policy but in report-only mode
  return getCSPPolicy(nonce, reportUri)
}

/**
 * Get all security headers including CSP
 */
export function getSecurityHeaders(nonce: string, reportUri?: string): Record<string, string> {
  const headers: Record<string, string> = {}

  // Content Security Policy
  if (process.env.CSP_REPORT_ONLY === "true") {
    // Report-only mode for testing
    headers["Content-Security-Policy-Report-Only"] = getCSPReportOnlyPolicy(nonce, reportUri)
  } else {
    // Enforce mode
    headers["Content-Security-Policy"] = getCSPPolicy(nonce, reportUri)
  }

  // Additional security headers
  headers["X-Content-Type-Options"] = "nosniff"
  headers["X-Frame-Options"] = "DENY"
  headers["X-XSS-Protection"] = "1; mode=block"
  headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
  headers["Permissions-Policy"] =
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"

  // Strict Transport Security (HSTS)
  // Note: HSTS is now handled by https-enforcement.ts for better control
  // This ensures consistent HSTS configuration across the application

  return headers
}

/**
 * Validate CSP nonce format
 */
export function isValidNonce(nonce: string): boolean {
  // Nonce should be base64 encoded, 16-32 bytes
  try {
    const decoded = Buffer.from(nonce, "base64")
    return decoded.length >= 16 && decoded.length <= 32
  } catch {
    return false
  }
}

