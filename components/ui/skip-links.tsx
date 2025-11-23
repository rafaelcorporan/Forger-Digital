"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SkipLink {
  href: string
  label: string
}

const defaultSkipLinks: SkipLink[] = [
  { href: "#main-content", label: "Skip to main content" },
  { href: "#navigation", label: "Skip to navigation" },
  { href: "#footer", label: "Skip to footer" },
]

interface SkipLinksProps {
  links?: SkipLink[]
  className?: string
}

export function SkipLinks({ links = defaultSkipLinks, className }: SkipLinksProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip links when Tab is pressed
      if (e.key === "Tab" && !e.shiftKey) {
        setIsVisible(true)
      }
    }

    const handleClick = () => {
      // Hide skip links after a short delay when clicking
      setTimeout(() => setIsVisible(false), 100)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("click", handleClick)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-[9999] flex flex-col gap-2 p-4 bg-gray-900 border-b border-gray-800 shadow-lg",
        className
      )}
      role="navigation"
      aria-label="Skip links"
    >
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            const target = document.querySelector(link.href)
            if (target) {
              target.scrollIntoView({ behavior: "smooth", block: "start" })
              // Focus the target element if it's focusable
              if (target instanceof HTMLElement) {
                target.focus()
                target.setAttribute("tabindex", "-1")
              }
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

