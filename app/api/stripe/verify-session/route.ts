import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/auth'
import { captureException } from '@/lib/sentry'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    // Verify the session belongs to the current user
    if (checkoutSession.metadata?.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Session does not belong to current user' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      session: {
        id: checkoutSession.id,
        payment_status: checkoutSession.payment_status,
        status: checkoutSession.status,
        amount_total: checkoutSession.amount_total,
        currency: checkoutSession.currency,
      },
    })
  } catch (error: any) {
    console.error('Session verification error:', error)
    captureException(error as Error, {
      tags: { endpoint: 'stripe-verify-session', error_type: 'verification' },
    })
    return NextResponse.json(
      { error: error.message || 'Failed to verify session' },
      { status: 500 }
    )
  }
}

