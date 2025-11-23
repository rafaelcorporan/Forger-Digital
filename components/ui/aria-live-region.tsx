"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AriaLiveRegionProps {
  children?: ReactNode
  level?: "polite" | "assertive" | "off"
  className?: string
  id?: string
}

/**
 * ARIA Live Region component for announcing dynamic content changes
 * to screen readers. Use for important updates that users need to know about.
 */
export function AriaLiveRegion({
  children,
  level = "polite",
  className,
  id = "aria-live-region",
}: AriaLiveRegionProps) {
  return (
    <div
      id={id}
      role="status"
      aria-live={level}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  )
}

/**
 * Hook to announce messages to screen readers
 */
export function useAriaLiveAnnouncement() {
  const announce = (message: string, level: "polite" | "assertive" = "polite") => {
    const region = document.getElementById("aria-live-region")
    if (region) {
      // Clear previous message
      region.textContent = ""
      // Set new message after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        region.textContent = message
        region.setAttribute("aria-live", level)
      }, 100)
    }
  }

  return { announce }
}

