import { NextRequest, NextResponse } from 'next/server'
import { getCsrfToken } from '@/lib/security/csrf'

/**
 * GET /api/csrf-token
 * Returns the CSRF token for the current session
 * This endpoint allows client-side code to retrieve the CSRF token
 * which is stored in an httpOnly cookie
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getCsrfToken()
    
    return NextResponse.json(
      {
        success: true,
        token: token,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error: any) {
    console.error('Error retrieving CSRF token:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve CSRF token',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

