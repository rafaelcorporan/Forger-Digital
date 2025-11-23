/**
 * Google Analytics 4 (GA4) Analytics Utility
 * 
 * This module provides a privacy-compliant analytics implementation that:
 * - Only loads when user consents to analytics cookies
 * - Tracks page views and custom events
 * - Respects GDPR/CCPA requirements
 * - Provides type-safe event tracking
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID

// Check if analytics is enabled based on cookie consent
function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return false

  try {
    const preferences = localStorage.getItem("cookie-preferences")
    if (!preferences) return false

    const parsed = JSON.parse(preferences)
    return parsed.analytics === true
  } catch (e) {
    return false
  }
}

/**
 * Initialize Google Analytics 4
 * Only loads if user has consented to analytics cookies
 */
export function initializeGA4(): void {
  if (typeof window === "undefined") return
  if (!GA4_MEASUREMENT_ID) {
    console.warn("GA4 Measurement ID not configured. Set NEXT_PUBLIC_GA4_MEASUREMENT_ID in environment variables.")
    return
  }

  if (!isAnalyticsEnabled()) {
    return
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function() {
    window.dataLayer.push(arguments)
  }

  // Configure GA4 with privacy settings
  window.gtag("js", new Date())
  window.gtag("config", GA4_MEASUREMENT_ID, {
    // Privacy settings
    anonymize_ip: true, // Anonymize IP addresses for GDPR compliance
    allow_google_signals: false, // Disable Google Signals for privacy
    allow_ad_personalization_signals: false, // Disable ad personalization
    
    // Performance settings
    send_page_view: false, // We'll track page views manually for better control
    
    // Cookie settings
    cookie_flags: "SameSite=None;Secure",
  })

  // Load GA4 script
  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`
  document.head.appendChild(script)

  console.log("✅ Google Analytics 4 initialized")
}

/**
 * Disable/Remove Google Analytics
 * Called when user revokes analytics consent
 */
export function disableGA4(): void {
  if (typeof window === "undefined") return

  // Remove gtag function
  if (window.gtag) {
    window.gtag = function() {} // No-op function
  }

  // Clear dataLayer
  if (window.dataLayer) {
    window.dataLayer = []
  }

  // Remove GA4 script tags
  const scripts = document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')
  scripts.forEach((script) => script.remove())

  // Remove GA4 cookies
  const cookies = document.cookie.split(";")
  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim()
    if (cookieName.startsWith("_ga") || cookieName.startsWith("_gid")) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    }
  })

  console.log("✅ Google Analytics 4 disabled")
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string): void {
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("config", GA4_MEASUREMENT_ID!, {
    page_path: path,
    page_title: title || document.title,
  })

  // Also send as event for better tracking
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
  })
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: {
    [key: string]: string | number | boolean | undefined
  }
): void {
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("event", eventName, eventParams)
}

/**
 * Track form submission
 */
export function trackFormSubmission(
  formName: string,
  formData?: {
    [key: string]: string | number | boolean | undefined
  }
): void {
  trackEvent("form_submit", {
    form_name: formName,
    ...formData,
  })

  // Track as conversion if it's a key form
  if (formName === "contact" || formName === "get_started") {
    trackEvent("conversion", {
      conversion_type: formName,
      value: 1,
      currency: "USD",
    })
  }
}

/**
 * Track button click
 */
export function trackButtonClick(
  buttonName: string,
  location?: string
): void {
  trackEvent("button_click", {
    button_name: buttonName,
    location: location || window.location.pathname,
  })
}

/**
 * Track link click
 */
export function trackLinkClick(
  linkText: string,
  linkUrl: string
): void {
  trackEvent("link_click", {
    link_text: linkText,
    link_url: linkUrl,
  })
}

/**
 * Track service page view
 */
export function trackServiceView(serviceSlug: string, serviceName: string): void {
  trackEvent("view_service", {
    service_slug: serviceSlug,
    service_name: serviceName,
  })
}

/**
 * Track portfolio project view
 */
export function trackProjectView(projectId: string, projectName: string): void {
  trackEvent("view_project", {
    project_id: projectId,
    project_name: projectName,
  })
}

/**
 * Track user signup (if applicable)
 */
export function trackSignup(method: string = "email"): void {
  trackEvent("sign_up", {
    method,
  })

  trackEvent("conversion", {
    conversion_type: "signup",
    value: 1,
    currency: "USD",
  })
}

/**
 * Track search query
 */
export function trackSearch(query: string, resultsCount?: number): void {
  trackEvent("search", {
    search_term: query,
    results_count: resultsCount,
  })
}

/**
 * Set user properties (non-PII only)
 */
export function setUserProperties(properties: {
  [key: string]: string | number | boolean | undefined
}): void {
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("set", "user_properties", properties)
}

/**
 * Set user ID (only if user is logged in and consented)
 */
export function setUserId(userId: string): void {
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("set", "user_id", userId)
}

/**
 * Clear user ID (on logout)
 */
export function clearUserId(): void {
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag("set", "user_id", null)
}

