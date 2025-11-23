import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { requireCsrfToken } from '@/lib/security/csrf'
import { validateRequestBody } from '@/lib/validation/validator'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { captureException } from '@/lib/sentry'
import { rateLimit } from '@/lib/security/rate-limit-middleware'

// Schema for changing password
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
})

// POST - Change password
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, '/api/user/change-password')
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
    const validation = await validateRequestBody(request, ChangePasswordSchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = validation.data

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has a password (OAuth users don't have passwords)
    if (!user.password) {
      return NextResponse.json(
        { error: 'Password cannot be changed for OAuth accounts' },
        { status: 400 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    const response = NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error('Error changing password:', error)
    captureException(error as Error, {
      tags: { endpoint: 'user-change-password', error_type: 'database' },
    })
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}

