import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { requireCsrfToken } from '@/lib/security/csrf'
import { validateRequestBody } from '@/lib/validation/validator'
import { z } from 'zod'
import { captureException } from '@/lib/sentry'
import { rateLimit } from '@/lib/security/rate-limit-middleware'

// Schema for updating profile
const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters').trim(),
})

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    captureException(error as Error, {
      tags: { endpoint: 'user-profile-get', error_type: 'database' },
    })
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, '/api/user/profile')
    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // CSRF Protection
    const csrfValidation = await requireCsrfToken(request)
    if (!csrfValidation.valid) {
      return NextResponse.json(
        { error: csrfValidation.error || 'CSRF validation failed' },
        { status: 403 }
      )
    }

    // Validate request body
    const validation = await validateRequestBody(request, UpdateProfileSchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const { name } = validation.data

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        updatedAt: true,
      },
    })

    const response = NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error('Error updating profile:', error)
    captureException(error as Error, {
      tags: { endpoint: 'user-profile-update', error_type: 'database' },
    })
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

