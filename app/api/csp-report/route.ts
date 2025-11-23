/**
 * CSP Violation Reporting Endpoint
 * Receives and logs CSP violation reports
 */

import { NextRequest, NextResponse } from "next/server"
import { captureException, captureMessage } from "@/lib/sentry"

interface CSPReport {
  "csp-report": {
    "document-uri": string
    "referrer": string
    "violated-directive": string
    "effective-directive": string
    "original-policy": string
    "disposition": "enforce" | "report"
    "blocked-uri": string
    "line-number"?: number
    "column-number"?: number
    "source-file"?: string
    "status-code": number
    "script-sample"?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const report: CSPReport = await request.json()

    if (!report["csp-report"]) {
      return NextResponse.json(
        { error: "Invalid CSP report format" },
        { status: 400 }
      )
    }

    const violation = report["csp-report"]

    // Log CSP violation
    console.warn("CSP Violation:", {
      documentUri: violation["document-uri"],
      violatedDirective: violation["violated-directive"],
      blockedUri: violation["blocked-uri"],
      sourceFile: violation["source-file"],
      lineNumber: violation["line-number"],
      columnNumber: violation["column-number"],
      scriptSample: violation["script-sample"],
    })

    // Send to Sentry for monitoring
    captureMessage("CSP Violation", {
      level: "warning",
      tags: {
        csp_violation: true,
        directive: violation["violated-directive"],
        disposition: violation.disposition,
      },
      extra: {
        documentUri: violation["document-uri"],
        referrer: violation.referrer,
        violatedDirective: violation["violated-directive"],
        effectiveDirective: violation["effective-directive"],
        originalPolicy: violation["original-policy"],
        blockedUri: violation["blocked-uri"],
        sourceFile: violation["source-file"],
        lineNumber: violation["line-number"],
        columnNumber: violation["column-number"],
        scriptSample: violation["script-sample"],
        statusCode: violation["status-code"],
      },
    })

    // In production, you might want to:
    // 1. Store violations in database
    // 2. Alert on suspicious patterns
    // 3. Aggregate violations for analysis

    // 204 No Content cannot have a body
    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    console.error("CSP report processing error:", error)
    captureException(error as Error, {
      tags: { endpoint: "csp-report", error_type: "processing" },
    })

    // Still return success to avoid breaking CSP reporting
    // 204 No Content cannot have a body
    return new NextResponse(null, { status: 204 })
  }
}

// Allow GET for testing
export async function GET() {
  return NextResponse.json({
    message: "CSP violation reporting endpoint",
    usage: "POST JSON with csp-report object",
  })
}

