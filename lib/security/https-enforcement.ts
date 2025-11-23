/**
 * HTTPS Enforcement Configuration
 * Comprehensive HTTPS redirection and security headers
 */

/**
 * Check if request is over HTTPS
 */
export function isHTTPS(request: Request): boolean {
  const url = new URL(request.url)
  return url.protocol === "https:"
}

/**
 * Check if we should enforce HTTPS
 */
export function shouldEnforceHTTPS(): boolean {
  // Enforce HTTPS in production, or if explicitly enabled
  return (
    process.env.NODE_ENV === "production" ||
    process.env.FORCE_HTTPS === "true"
  )
}

/**
 * Get HTTPS redirect URL
 */
export function getHTTPSRedirectURL(request: Request): string {
  const url = new URL(request.url)
  url.protocol = "https:"
  return url.toString()
}

/**
 * Get HSTS header value
 */
export function getHSTSHeader(): string {
  const maxAge = parseInt(process.env.HSTS_MAX_AGE || "31536000", 10) // 1 year default
  const includeSubDomains = process.env.HSTS_INCLUDE_SUBDOMAINS !== "false"
  const preload = process.env.HSTS_PRELOAD === "true"

  let hsts = `max-age=${maxAge}`
  
  if (includeSubDomains) {
    hsts += "; includeSubDomains"
  }
  
  if (preload) {
    hsts += "; preload"
  }

  return hsts
}

/**
 * Get all HTTPS enforcement headers
 */
export function getHTTPSEnforcementHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}

  // Strict Transport Security (HSTS)
  // Only set in production or if explicitly enabled
  if (shouldEnforceHTTPS()) {
    headers["Strict-Transport-Security"] = getHSTSHeader()
  }

  // Upgrade Insecure Requests (via CSP)
  // This is handled in CSP policy

  return headers
}

/**
 * Check if request should be redirected to HTTPS
 */
export function shouldRedirectToHTTPS(request: Request): boolean {
  // Only redirect if HTTPS enforcement is enabled
  if (!shouldEnforceHTTPS()) {
    return false
  }

  // Don't redirect if already HTTPS
  if (isHTTPS(request)) {
    return false
  }

  // Don't redirect localhost in development
  const url = new URL(request.url)
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    return process.env.FORCE_HTTPS === "true"
  }

  return true
}

