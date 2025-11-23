"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/lib/i18n/context"
import Link from "next/link"
import { X } from "lucide-react"

const COOKIE_CONSENT_KEY = "cookie-consent"
const COOKIE_PREFERENCES_KEY = "cookie-preferences"

interface CookiePreferences {
  strictlyNecessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const { t, locale } = useTranslation("cookie")
  const [open, setOpen] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    strictlyNecessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)

    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences(parsed)
      } catch (e) {
        // Invalid preferences, use defaults
      }
    }

    if (consent === "accepted" || consent === "declined") {
      // User has already made a choice, don't show pop-up initially
      setOpen(false)
    } else {
      // Show pop-up if no choice has been made
      setOpen(true)
    }

    // Listen for reopen event (from "Manage Cookies" link)
    const handleOpenCookieConsent = () => {
      setOpen(true)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("openCookieConsent", handleOpenCookieConsent)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("openCookieConsent", handleOpenCookieConsent)
      }
    }
  }, [])

  const handleAllowAll = () => {
    const allAccepted: CookiePreferences = {
      strictlyNecessary: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allAccepted)
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted))
    setOpen(false)
    // Trigger analytics initialization if needed
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: allAccepted }))
    }
  }

  const handleDecline = () => {
    const onlyNecessary: CookiePreferences = {
      strictlyNecessary: true,
      analytics: false,
      marketing: false,
    }
    setPreferences(onlyNecessary)
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(onlyNecessary))
    setOpen(false)
    // Trigger analytics cleanup if needed
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: onlyNecessary }))
    }
  }

  const handleAcceptSelected = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences))
    setOpen(false)
    // Trigger analytics initialization based on preferences
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: preferences }))
    }
  }

  const cookiePolicyUrl = `/legal/cookie-policy`

  if (!open) return null

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only allow closing if user has made a choice
        if (!isOpen && !localStorage.getItem(COOKIE_CONSENT_KEY)) {
          // User is trying to close without making a choice, treat as decline
          handleDecline()
        } else if (!isOpen) {
          setOpen(false)
        }
      }}
    >
      <DialogContent
        className="max-w-2xl bg-gray-900 border-gray-700 text-white"
        onEscapeKeyDown={(e) => {
          // Prevent closing on Escape - user must make a choice
          e.preventDefault()
        }}
        onPointerDownOutside={(e) => {
          // Prevent closing on outside click - user must make a choice
          e.preventDefault()
        }}
        onInteractOutside={(e) => {
          // Prevent closing on outside interaction - user must make a choice
          e.preventDefault()
        }}
        aria-describedby="cookie-description"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            {t("title")}
          </DialogTitle>
          <DialogDescription id="cookie-description" className="text-gray-300">
            {t("description")}{" "}
            <Link
              href={cookiePolicyUrl}
              className="text-orange-500 hover:text-orange-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("cookiePolicyLink")}
            </Link>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Strictly Necessary Cookies */}
          <div className="flex items-start justify-between gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="strictly-necessary" className="text-base font-semibold text-white">
                  {t("strictlyNecessary.title")}
                </Label>
              </div>
              <p className="text-sm text-gray-400">{t("strictlyNecessary.description")}</p>
            </div>
            <Switch
              id="strictly-necessary"
              checked={preferences.strictlyNecessary}
              disabled
              className="opacity-50 cursor-not-allowed"
              aria-label={t("strictlyNecessary.ariaLabel")}
            />
          </div>

          {/* Analytics Cookies */}
          <div className="flex items-start justify-between gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="analytics" className="text-base font-semibold text-white">
                  {t("analytics.title")}
                </Label>
              </div>
              <p className="text-sm text-gray-400">{t("analytics.description")}</p>
            </div>
            <Switch
              id="analytics"
              checked={preferences.analytics}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, analytics: checked }))
              }
              aria-label={t("analytics.ariaLabel")}
            />
          </div>

          {/* Marketing Cookies */}
          <div className="flex items-start justify-between gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="marketing" className="text-base font-semibold text-white">
                  {t("marketing.title")}
                </Label>
              </div>
              <p className="text-sm text-gray-400">{t("marketing.description")}</p>
            </div>
            <Switch
              id="marketing"
              checked={preferences.marketing}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, marketing: checked }))
              }
              aria-label={t("marketing.ariaLabel")}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="text-xs text-gray-400 order-2 sm:order-1">
            {t("poweredBy")}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2 w-full sm:w-auto">
            <Button
              onClick={handleDecline}
              variant="outline"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:text-white"
            >
              {t("decline")}
            </Button>
            <Button
              onClick={handleAcceptSelected}
              variant="outline"
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:text-white"
            >
              {t("acceptSelected")}
            </Button>
            <Button
              onClick={handleAllowAll}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {t("allowAll")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Export function to reopen cookie consent (for "Manage Cookies" link)
export function openCookieConsent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("openCookieConsent"))
  }
}

