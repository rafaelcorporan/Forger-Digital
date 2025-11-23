"use client"

/**
 * Analytics Provider Component
 * 
 * Manages Google Analytics initialization and lifecycle based on cookie consent.
 * Listens to cookie consent changes and initializes/removes GA4 accordingly.
 */

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { initializeGA4, disableGA4, trackPageView } from "@/lib/analytics"

export function AnalyticsProvider() {
  const pathname = usePathname()

  useEffect(() => {
    // Check initial consent and initialize if needed
    const checkAndInitialize = () => {
      try {
        const preferences = localStorage.getItem("cookie-preferences")
        if (preferences) {
          const parsed = JSON.parse(preferences)
          if (parsed.analytics === true) {
            initializeGA4()
          } else {
            disableGA4()
          }
        }
      } catch (e) {
        // If no preferences, don't initialize
        disableGA4()
      }
    }

    // Initialize on mount
    checkAndInitialize()

    // Listen for cookie consent changes
    const handleCookieConsentUpdate = (event: CustomEvent) => {
      const preferences = event.detail
      if (preferences.analytics === true) {
        initializeGA4()
        // Track page view after initialization
        setTimeout(() => {
          trackPageView(window.location.pathname)
        }, 100)
      } else {
        disableGA4()
      }
    }

    window.addEventListener("cookieConsentUpdated", handleCookieConsentUpdate as EventListener)

    return () => {
      window.removeEventListener("cookieConsentUpdated", handleCookieConsentUpdate as EventListener)
    }
  }, [])

  // Track page views on route changes
  useEffect(() => {
    if (pathname) {
      // Small delay to ensure GA4 is initialized
      const timer = setTimeout(() => {
        trackPageView(pathname)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [pathname])

  return null // This component doesn't render anything
}

