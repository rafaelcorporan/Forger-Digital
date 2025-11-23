"use client"

/**
 * CSP Nonce Provider
 * Provides nonce to client components for inline scripts/styles
 * Note: In Next.js, nonces are typically handled server-side
 * This is a client-side helper for components that need nonce
 */

import { createContext, useContext, useEffect, useState } from "react"

interface CSPContextType {
  nonce: string | null
}

const CSPContext = createContext<CSPContextType>({ nonce: null })

export function CSPProvider({ children }: { children: React.ReactNode }) {
  const [nonce, setNonce] = useState<string | null>(null)

  useEffect(() => {
    // Try to get nonce from meta tag or header
    // In Next.js, nonce is typically set server-side
    const metaNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute("content")
    if (metaNonce) {
      setNonce(metaNonce)
    }
  }, [])

  return <CSPContext.Provider value={{ nonce }}>{children}</CSPContext.Provider>
}

export function useCSPNonce(): string | null {
  const { nonce } = useContext(CSPContext)
  return nonce
}

