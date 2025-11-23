"use client"

import { useEffect } from "react"

/**
 * Aggressively removes Next.js development indicators from the DOM
 * This component runs after client-side hydration to ensure all dev overlays are eliminated
 */
export function DevIndicatorRemover() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    const removeDevIndicators = () => {
      // Target Next.js dev indicator buttons - VERIFIED SELECTORS
      const selectors = [
        // Next.js Dev Tools Badge (VERIFIED - from actual DOM)
        'div[data-next-badge-root="true"]',
        '[data-next-badge-root]',
        'div[data-next-badge="true"]',
        '[data-next-badge]',
        'button[id="next-logo"]',
        '#next-logo',
        'button[data-nextjs-dev-tools-button="true"]',
        '[data-nextjs-dev-tools-button]',
        'button[data-next-mark="true"]',
        '[data-next-mark]',
        '[data-dot]',
        // Route announcer buttons
        'button[data-nextjs-route-announcer-button]',
        'button[aria-label*="Route"]',
        'button[aria-label*="Info"]',
        'button[aria-label*="Dynamic"]',
        'button[aria-label*="Turbopack"]',
        // Target parent containers
        'div[style*="position: fixed"][style*="bottom"]',
        'div[style*="position:fixed"][style*="bottom"]',
      ]

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => {
          // Remove from DOM completely
          el.remove()
        })
      })

      // Target any unnamed div at body root with fixed-position buttons
      const bodyChildren = Array.from(document.body.children)
      bodyChildren.forEach(child => {
        // Skip known app containers
        if (
          child.id === '__next' ||
          child.hasAttribute('data-root') ||
          child.tagName === 'SCRIPT' ||
          child.tagName === 'STYLE'
        ) {
          return
        }

        // VERIFIED: Check for Next.js badge container by data attributes
        if (
          child.hasAttribute('data-next-badge-root') ||
          child.querySelector('[data-next-badge-root]') ||
          child.querySelector('[data-next-badge]') ||
          child.querySelector('#next-logo')
        ) {
          child.remove()
          return
        }

        // Check if it contains a button without class/id (likely dev indicator)
        const hasUnnamedButton = child.querySelector('button:not([class]):not([id])')
        if (hasUnnamedButton) {
          child.remove()
          return
        }

        // VERIFIED: Check for Next.js badge by inline styles and structure
        if (child instanceof HTMLElement) {
          // Check for the exact style combination from user's provided code
          const hasNextBadgeStyle = 
            child.style.touchAction === 'none' && 
            child.style.userSelect === 'none' &&
            child.querySelector('button[data-nextjs-dev-tools-button]')
          
          if (hasNextBadgeStyle) {
            child.remove()
            return
          }

          // Check for container with data-next-badge-root inside
          const hasBadgeRoot = child.querySelector('[data-next-badge-root]')
          if (hasBadgeRoot) {
            child.remove()
            return
          }

          // Check for any div with Next.js logo button inside
          const hasNextLogo = child.querySelector('#next-logo') || 
                             child.querySelector('button[aria-label*="Next.js"]')
          if (hasNextLogo) {
            child.remove()
            return
          }
        }
      })
    }

    // Run immediately
    removeDevIndicators()

    // Run after short delay
    setTimeout(removeDevIndicators, 50)
    setTimeout(removeDevIndicators, 100)
    setTimeout(removeDevIndicators, 200)
    setTimeout(removeDevIndicators, 500)

    // AGGRESSIVE: Run continuously every 50ms to catch any late-mounted indicators
    const intervalId = setInterval(removeDevIndicators, 50)

    // Set up mutation observer to catch dynamically added indicators
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // VERIFIED: Check for Next.js badge by data attributes
            if (
              node.hasAttribute('data-next-badge-root') ||
              node.hasAttribute('data-next-badge') ||
              node.querySelector('[data-next-badge-root]') ||
              node.querySelector('[data-next-badge]') ||
              node.querySelector('#next-logo') ||
              node.querySelector('[data-nextjs-dev-tools-button]')
            ) {
              node.remove()
              return
            }
            
            // Check if added node is a dev indicator
            if (
              node.tagName === 'BUTTON' ||
              node.querySelector('button:not([class]):not([id])')
            ) {
              removeDevIndicators()
            }
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearInterval(intervalId)
      observer.disconnect()
    }
  }, [])

  return null
}

