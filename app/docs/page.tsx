"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsContentWithLoading } from "@/components/ui/tabs"
import { FileText, Code, BookOpen, ExternalLink, Download } from "lucide-react"
import Link from "next/link"
import { SkeletonCard, SkeletonList } from "@/components/ui/skeleton-card"
import { LoadingWrapper } from "@/components/ui/loading-wrapper"

export default function APIDocsPage() {
  const [spec, setSpec] = useState<any>(null)
  const [specYaml, setSpecYaml] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load OpenAPI spec as JSON
    Promise.all([
      fetch("/api/docs/openapi")
        .then((res) => res.json())
        .then((json) => {
          setSpec(json)
        })
        .catch((err) => {
          console.error("Error loading OpenAPI JSON:", err)
        }),
      fetch("/docs/openapi.yaml")
        .then((res) => {
          if (res.ok) {
            return res.text()
          }
          throw new Error("YAML file not found")
        })
        .then((yaml) => {
          setSpecYaml(yaml)
        })
        .catch((err) => {
          console.error("Error loading OpenAPI YAML:", err)
          // Set empty string if YAML not found
          setSpecYaml("")
        }),
    ]).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              API Documentation
            </h1>
            <p className="text-gray-400 text-lg">
              Comprehensive API reference for Forger Digital platform
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="interactive" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1 rounded-lg border border-gray-700 mb-8">
              <TabsTrigger 
                value="interactive"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <Code className="w-4 h-4 mr-2" />
                Interactive Docs
              </TabsTrigger>
              <TabsTrigger 
                value="reference"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                API Reference
              </TabsTrigger>
              <TabsTrigger 
                value="spec"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
              >
                <FileText className="w-4 h-4 mr-2" />
                OpenAPI Spec
              </TabsTrigger>
            </TabsList>

            {/* Interactive Documentation Tab */}
            <TabsContentWithLoading value="interactive" isLoading={loading} loadingMessage="Loading API documentation...">
              <Card className="bg-gray-800 border-gray-700 p-6">
                {spec ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Interactive API Documentation</h3>
                      <div className="flex gap-2">
                        <a
                          href="https://editor.swagger.io/?url=/api/docs/openapi"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in Swagger Editor
                        </a>
                        <a
                          href="/api/docs/openapi"
                          download="openapi.json"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download JSON
                        </a>
                      </div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-sm mb-4">
                        Use the Swagger Editor link above to view and test the API interactively.
                        The OpenAPI specification is available in JSON format via the API endpoint.
                      </p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-white font-medium mb-1">API Specification URL:</p>
                          <code className="bg-gray-800 px-3 py-2 rounded text-orange-400 text-sm block">
                            {typeof window !== "undefined" ? window.location.origin : ""}/api/docs/openapi
                          </code>
                        </div>
                        <div>
                          <p className="text-white font-medium mb-1">YAML Specification URL:</p>
                          <code className="bg-gray-800 px-3 py-2 rounded text-orange-400 text-sm block">
                            {typeof window !== "undefined" ? window.location.origin : ""}/docs/openapi.yaml
                          </code>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded-lg">
                      <p className="text-blue-400 text-sm">
                        💡 <strong>Tip:</strong> Copy the JSON URL above and paste it into{" "}
                        <a
                          href="https://editor.swagger.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-300"
                        >
                          Swagger Editor
                        </a>{" "}
                        or{" "}
                        <a
                          href="https://redocly.com/redoc"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-300"
                        >
                          ReDoc
                        </a>{" "}
                        for interactive documentation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-red-400 mb-4">Failed to load API specification</div>
                    <p className="text-gray-400">
                      Please ensure the OpenAPI specification file exists at /docs/openapi.yaml
                    </p>
                  </div>
                )}
              </Card>
            </TabsContentWithLoading>

            {/* API Reference Tab */}
            <TabsContent value="reference" className="mt-8">
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      The Forger Digital API provides programmatic access to platform features including
                      form submissions, user management, and payment processing.
                    </p>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Base URL</h3>
                      <code className="bg-gray-900 px-3 py-1 rounded text-orange-400">
                        {typeof window !== "undefined" ? window.location.origin : "https://forgerdigital.com"}
                      </code>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Authentication</h3>
                      <p className="mb-2">
                        Most endpoints require authentication via NextAuth.js session cookies.
                        Admin endpoints require ADMIN or SUPER_ADMIN role.
                      </p>
                      <p className="text-sm text-gray-400">
                        Session cookies are automatically managed by NextAuth.js when users sign in.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Endpoints</h2>
                  <div className="space-y-6">
                    {/* Authentication */}
                    <div>
                      <h3 className="text-xl font-semibold text-orange-500 mb-3">Authentication</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">POST /api/auth/signup</code>
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Public</span>
                          </div>
                          <p className="text-gray-400 text-sm">Create a new user account</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">POST /api/auth/rate-limit</code>
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Public</span>
                          </div>
                          <p className="text-gray-400 text-sm">Check rate limit status</p>
                        </div>
                      </div>
                    </div>

                    {/* Forms */}
                    <div>
                      <h3 className="text-xl font-semibold text-pink-500 mb-3">Forms</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">POST /api/contact</code>
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Public</span>
                          </div>
                          <p className="text-gray-400 text-sm">Submit contact form</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">POST /api/get-started</code>
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Public</span>
                          </div>
                          <p className="text-gray-400 text-sm">Submit project inquiry form</p>
                        </div>
                      </div>
                    </div>

                    {/* Admin */}
                    <div>
                      <h3 className="text-xl font-semibold text-purple-500 mb-3">Admin</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">GET /api/admin/stats</code>
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Admin</span>
                          </div>
                          <p className="text-gray-400 text-sm">Get platform statistics</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">GET /api/admin/users</code>
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Admin</span>
                          </div>
                          <p className="text-gray-400 text-sm">List users with pagination</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">PATCH /api/admin/users</code>
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Admin</span>
                          </div>
                          <p className="text-gray-400 text-sm">Update user role</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">DELETE /api/admin/users</code>
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Super Admin</span>
                          </div>
                          <p className="text-gray-400 text-sm">Delete user account</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">GET /api/admin/submissions</code>
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Admin</span>
                          </div>
                          <p className="text-gray-400 text-sm">List form submissions</p>
                        </div>
                      </div>
                    </div>

                    {/* Payments */}
                    <div>
                      <h3 className="text-xl font-semibold text-yellow-500 mb-3">Payments</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">POST /api/stripe/create-checkout-session</code>
                            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">Auth</span>
                          </div>
                          <p className="text-gray-400 text-sm">Create subscription checkout session</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">POST /api/stripe/create-payment-intent</code>
                            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">Auth</span>
                          </div>
                          <p className="text-gray-400 text-sm">Create one-time payment intent</p>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-green-400 font-mono">POST /api/stripe/webhook</code>
                            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">Webhook</span>
                          </div>
                          <p className="text-gray-400 text-sm">Handle Stripe webhook events</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-800 border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Response Codes</h2>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-center gap-3">
                      <code className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">200</code>
                      <span>Success</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">400</code>
                      <span>Bad Request - Validation error</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">401</code>
                      <span>Unauthorized - Authentication required</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">403</code>
                      <span>Forbidden - Insufficient permissions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm">409</code>
                      <span>Conflict - Resource already exists</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">500</code>
                      <span>Internal Server Error</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* OpenAPI Spec Tab */}
            <TabsContent value="spec" className="mt-8">
              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">OpenAPI 3.1 Specification</h2>
                  <div className="flex gap-2">
                    <Link
                      href="/docs/openapi.yaml"
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View YAML
                    </Link>
                    <a
                      href="/api/docs/openapi"
                      download="openapi.json"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download JSON
                    </a>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400">Loading specification...</div>
                  </div>
                ) : specYaml ? (
                  <div className="space-y-4">
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-sm mb-2">YAML Format:</p>
                      <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-xs text-gray-300 max-h-[600px] overflow-y-auto">
                        <code>{specYaml}</code>
                      </pre>
                    </div>
                    {spec && (
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-sm mb-2">JSON Format:</p>
                        <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-xs text-gray-300 max-h-[600px] overflow-y-auto">
                          <code>{JSON.stringify(spec, null, 2)}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-red-400 mb-4">Failed to load specification</div>
                    <p className="text-gray-400">
                      Please ensure the OpenAPI specification file exists at /docs/openapi.yaml
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  )
}

