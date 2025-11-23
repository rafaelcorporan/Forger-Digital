import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'
import { auth } from "@/auth-edge"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { generateNonce, getSecurityHeaders } from "@/lib/security/csp"
import {
  shouldRedirectToHTTPS,
  getHTTPSRedirectURL,
  getHTTPSEnforcementHeaders,
} from "@/lib/security/https-enforcement"

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/admin",
  "/profile",
  "/settings",
]

// Routes that require admin role
const adminRoutes = [
  "/admin",
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = [
  "/auth/signin",
  "/auth/signup",
]

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale in URL
})

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const isAuthenticated = !!session
  const userRole = session?.user?.role || "USER"

  // HTTPS Enforcement: Redirect HTTP to HTTPS
  if (shouldRedirectToHTTPS(req)) {
    const httpsUrl = getHTTPSRedirectURL(req)
    return NextResponse.redirect(httpsUrl, 301)
  }

  // Apply next-intl middleware first
  const intlResponse = intlMiddleware(req)
  
  // If intl middleware returns a redirect, apply security headers to it
  if (intlResponse && intlResponse.status === 307) {
    return intlResponse
  }

  // Extract locale from pathname
  const localeMatch = pathname.match(/^\/(en|es|fr|de)/)
  const locale = localeMatch ? localeMatch[1] : defaultLocale
  const pathWithoutLocale = pathname.replace(/^\/(en|es|fr|de)/, '') || '/'

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathWithoutLocale.startsWith(route)) && isAuthenticated) {
    const redirectUrl = new URL(`/${locale}/dashboard`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Protect routes that require authentication
  if (protectedRoutes.some(route => pathWithoutLocale.startsWith(route))) {
    if (!isAuthenticated) {
      const signInUrl = new URL(`/${locale}/auth/signin`, req.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check admin routes
    if (adminRoutes.some(route => pathWithoutLocale.startsWith(route))) {
      if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
        const redirectUrl = new URL(`/${locale}/dashboard`, req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // Generate nonce for CSP
  const nonce = generateNonce()
  
  // Get CSP report URI
  const reportUri = `${req.nextUrl.origin}/api/csp-report`

  // Get security headers including CSP
  const securityHeaders = getSecurityHeaders(nonce, reportUri)

  // Get HTTPS enforcement headers
  const httpsHeaders = getHTTPSEnforcementHeaders()

  // Create response (use intl response if available, otherwise create new)
  const response = intlResponse || NextResponse.next()

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value)
    }
  })

  // Add HTTPS enforcement headers
  Object.entries(httpsHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value)
    }
  })

  // Add nonce to response headers for client-side access
  response.headers.set("X-CSP-Nonce", nonce)

  return response
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

