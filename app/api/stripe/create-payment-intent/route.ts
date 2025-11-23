import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/auth'
import { formatAmountForStripe } from '@/lib/stripe'
import { CreatePaymentIntentSchema } from '@/lib/validation/schemas'
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
    const validation = await validateRequestBody(request, CreatePaymentIntentSchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const { amount, currency, metadata } = validation.data

    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount, currency),
      currency: currency,
      metadata: {
        userId: session.user.id,
        ...metadata,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Stripe payment intent error:', error)
    captureException(error as Error, {
      tags: { endpoint: 'stripe-payment-intent', error_type: 'payment' },
    })
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

