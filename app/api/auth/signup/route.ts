import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignupSchema } from '@/lib/validation/schemas'
import { validateRequestBody } from '@/lib/validation/validator'
import { checkRateLimit, RateLimitPresets, getRateLimitHeaders } from '@/lib/security/rate-limit'
import { requireCsrfToken } from '@/lib/security/csrf'
import { captureException } from '@/lib/sentry'

export async function POST(request: NextRequest) {
  try {
    // CSRF Protection
    const csrfValidation = await requireCsrfToken(request)
    if (!csrfValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: csrfValidation.error || 'CSRF validation failed',
        },
        { status: 403 }
      )
    }

    // Rate Limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit({
      ...RateLimitPresets.strict,
      identifier: `signup:${ip}`,
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many signup attempts. Please try again later.',
        },
        {
          status: 429,
          headers: getRateLimitHeaders(
            rateLimit.allowed,
            rateLimit.remaining,
            rateLimit.resetTime
          ),
        }
      )
    }

    // Validate request body
    const validation = await validateRequestBody(request, SignupSchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error || 'Validation failed',
          errors: validation.errors,
        },
        {
          status: 400,
          headers: getRateLimitHeaders(
            rateLimit.allowed,
            rateLimit.remaining,
            rateLimit.resetTime
          ),
        }
      )
    }

    const { name, email, password } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists',
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user,
      },
      {
        status: 201,
        headers: getRateLimitHeaders(
          rateLimit.allowed,
          rateLimit.remaining,
          rateLimit.resetTime
        ),
      }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    captureException(error as Error, {
      tags: { endpoint: 'signup', error_type: 'general' },
    })
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

