import { NextRequest, NextResponse } from 'next/server'
import { RateLimitSchema } from '@/lib/validation/schemas'
import { validateRequestBody } from '@/lib/validation/validator'
import { checkRateLimit, RateLimitPresets, getRateLimitHeaders } from '@/lib/security/rate-limit'
import { captureException } from '@/lib/sentry'

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequestBody(request, RateLimitSchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const { identifier } = validation.data

    // Use standard rate limiting preset
    const rateLimit = checkRateLimit({
      ...RateLimitPresets.standard,
      identifier,
    })

    return NextResponse.json(
      {
        allowed: rateLimit.allowed,
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime,
      },
      {
        headers: getRateLimitHeaders(
          rateLimit.allowed,
          rateLimit.remaining,
          rateLimit.resetTime
        ),
      }
    )
  } catch (error: any) {
    console.error('Rate limit check error:', error)
    captureException(error as Error, {
      tags: { endpoint: 'rate-limit', error_type: 'general' },
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

