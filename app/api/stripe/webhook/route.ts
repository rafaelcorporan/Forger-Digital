import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { rateLimit } from '@/lib/security/rate-limit-middleware'
import { captureException } from '@/lib/sentry'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  // Rate limiting for webhooks (higher limit since they come from Stripe)
  const rateLimitResult = await rateLimit(request, "/api/stripe/webhook")

  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout session completed:', session.id)
        
        // Retrieve full session with line items
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'subscription'],
        })
        
        const userId = session.metadata?.userId
        const subscriptionId = fullSession.subscription as Stripe.Subscription | string
        
        if (subscriptionId && userId) {
          // Handle subscription creation
          if (typeof subscriptionId === 'object') {
            const subscription = subscriptionId
            const priceId = subscription.items.data[0]?.price.id || ''
            const customerId = subscription.customer as string
            
            // Determine plan ID from price ID or metadata
            const planId = session.metadata?.planId || 'starter'
            
            // Create or update subscription in database
            await prisma.subscription.upsert({
              where: { stripeSubscriptionId: subscription.id },
              create: {
                userId,
                stripeSubscriptionId: subscription.id,
                stripePriceId: priceId,
                stripeCustomerId: customerId,
                status: subscription.status === 'active' ? 'ACTIVE' : subscription.status === 'canceled' ? 'CANCELED' : 'INCOMPLETE',
                planId,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
                metadata: subscription.metadata || {},
              },
              update: {
                status: subscription.status === 'active' ? 'ACTIVE' : subscription.status === 'canceled' ? 'CANCELED' : 'INCOMPLETE',
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
                metadata: subscription.metadata || {},
              },
            })
          }
          
          // Create payment record
          if (fullSession.payment_intent) {
            const paymentIntentId = typeof fullSession.payment_intent === 'string' 
              ? fullSession.payment_intent 
              : fullSession.payment_intent.id
            
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
            
            await prisma.payment.upsert({
              where: { stripePaymentId: paymentIntentId },
              create: {
                userId,
                stripePaymentId: paymentIntentId,
                stripeSessionId: session.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status === 'succeeded' ? 'SUCCEEDED' : 'PENDING',
                paymentMethod: paymentIntent.payment_method_types[0] || 'card',
                metadata: paymentIntent.metadata || {},
                subscriptionId: typeof subscriptionId === 'object' 
                  ? (await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subscriptionId.id } }))?.id 
                  : undefined,
              },
              update: {
                status: paymentIntent.status === 'succeeded' ? 'SUCCEEDED' : 'PENDING',
                metadata: paymentIntent.metadata || {},
              },
            })
          }
        }
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment intent succeeded:', paymentIntent.id)
        
        const paymentUserId = paymentIntent.metadata?.userId
        
        // Update payment status in database
        await prisma.payment.upsert({
          where: { stripePaymentId: paymentIntent.id },
          create: {
            userId: paymentUserId || null,
            stripePaymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'SUCCEEDED',
            paymentMethod: paymentIntent.payment_method_types[0] || 'card',
            metadata: paymentIntent.metadata || {},
          },
          update: {
            status: 'SUCCEEDED',
            metadata: paymentIntent.metadata || {},
          },
        })
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', failedPayment.id)
        
        const failedUserId = failedPayment.metadata?.userId
        
        // Update payment status to failed
        await prisma.payment.upsert({
          where: { stripePaymentId: failedPayment.id },
          create: {
            userId: failedUserId || null,
            stripePaymentId: failedPayment.id,
            amount: failedPayment.amount,
            currency: failedPayment.currency,
            status: 'FAILED',
            paymentMethod: failedPayment.payment_method_types[0] || 'card',
            metadata: {
              ...failedPayment.metadata,
              failure_reason: failedPayment.last_payment_error?.message || 'Unknown error',
            },
          },
          update: {
            status: 'FAILED',
            metadata: {
              ...failedPayment.metadata,
              failure_reason: failedPayment.last_payment_error?.message || 'Unknown error',
            },
          },
        })
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription event:', event.type, subscription.id)
        
        const subscriptionUserId = subscription.metadata?.userId
        if (!subscriptionUserId) {
          console.warn('No userId in subscription metadata')
          break
        }
        
        const priceId = subscription.items.data[0]?.price.id || ''
        const customerId = subscription.customer as string
        const planId = subscription.metadata?.planId || 'starter'
        
        // Map Stripe status to our enum
        let subscriptionStatus: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'TRIALING' = 'INCOMPLETE'
        if (subscription.status === 'active') {
          subscriptionStatus = 'ACTIVE'
        } else if (subscription.status === 'canceled') {
          subscriptionStatus = 'CANCELED'
        } else if (subscription.status === 'unpaid') {
          subscriptionStatus = 'UNPAID'
        } else if (subscription.status === 'past_due') {
          subscriptionStatus = 'PAST_DUE'
        } else if (subscription.status === 'incomplete') {
          subscriptionStatus = 'INCOMPLETE'
        } else if (subscription.status === 'incomplete_expired') {
          subscriptionStatus = 'INCOMPLETE_EXPIRED'
        } else if (subscription.status === 'trialing') {
          subscriptionStatus = 'TRIALING'
        }
        
        if (event.type === 'customer.subscription.deleted') {
          // Mark subscription as canceled
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              status: 'CANCELED',
              cancelAtPeriodEnd: false,
            },
          })
        } else {
          // Create or update subscription
          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: subscription.id },
            create: {
              userId: subscriptionUserId,
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              stripeCustomerId: customerId,
              status: subscriptionStatus,
              planId,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
              metadata: subscription.metadata || {},
            },
            update: {
              status: subscriptionStatus,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
              metadata: subscription.metadata || {},
            },
          })
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    const response = NextResponse.json({ received: true })

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    captureException(error as Error, {
      tags: { endpoint: 'stripe-webhook', error_type: 'webhook' },
    })
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

