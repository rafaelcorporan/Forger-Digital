import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { requireCsrfToken } from '@/lib/security/csrf'
import { captureException } from '@/lib/sentry'
import { rateLimit } from '@/lib/security/rate-limit-middleware'

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, '/api/user/delete-account')
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

    // Prevent admins from deleting their own account via this endpoint
    // (They should use admin panel if needed)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Admin accounts cannot be deleted through this endpoint. Contact system administrator.' },
        { status: 403 }
      )
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    })

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error('Error deleting account:', error)
    captureException(error as Error, {
      tags: { endpoint: 'user-delete-account', error_type: 'database' },
    })
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}

