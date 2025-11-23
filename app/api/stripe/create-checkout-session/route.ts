import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/auth'
import { CreateCheckoutSessionSchema } from '@/lib/validation/schemas'
import { validateRequestBody } from '@/lib/validation/validator'
import { requireCsrfToken } from '@/lib/security/csrf'
import { captureException } from '@/lib/sentry'

export async function POST(request: NextRequest) {
  try {
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
    const validation = await validateRequestBody(request, CreateCheckoutSessionSchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const { priceId, quantity, metadata } = validation.data

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        ...metadata,
      },
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/cancel`,
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error: any) {
    console.error('Stripe checkout session error:', error)
    captureException(error as Error, {
      tags: { endpoint: 'stripe-checkout', error_type: 'payment' },
    })
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

