import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { requireCsrfToken } from '@/lib/security/csrf'
import { validateRequestBody } from '@/lib/validation/validator'
import { sanitizeHtml } from '@/lib/validation/sanitize'
import { captureException } from '@/lib/sentry'
import { rateLimit } from '@/lib/security/rate-limit-middleware'
import { z } from 'zod'

// Schema for adding a reply
const AddReplySchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(5000, 'Message must be less than 5000 characters'),
  isInternal: z.boolean().optional().default(false),
  email: z.string().email().optional(), // For guest replies
})

// GET - Get replies for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    // Verify ticket exists and user has access
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Authorization check
    if (session?.user) {
      const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN'
      const isOwner = ticket.userId === session.user.id

      if (!isAdmin && !isOwner) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
    } else {
      // Guest users need to provide email
      const { searchParams } = new URL(request.url)
      const email = searchParams.get('email')

      if (!email || email !== ticket.email) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
    }

    const replies = await prisma.supportTicketReply.findMany({
      where: {
        ticketId: id,
        // Filter out internal replies for non-admin users
        ...(session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN'
          ? { isInternal: false }
          : {}),
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ replies })
  } catch (error: any) {
    console.error('Error fetching replies:', error)
    captureException(error as Error, {
      tags: { endpoint: 'support-ticket-replies-get', error_type: 'database' },
    })
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    )
  }
}

// POST - Add a reply to a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    // Rate limiting
    const rateLimitResult = await rateLimit(request, '/api/support/tickets/replies')
    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Verify ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Authorization check
    let authorized = false
    let replyEmail: string | undefined

    if (session?.user) {
      const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN'
      const isOwner = ticket.userId === session.user.id
      authorized = isAdmin || isOwner
    } else {
      // Guest users can reply if they provide the correct email
      const validation = await validateRequestBody(request, AddReplySchema)
      if (validation.success && validation.data.email === ticket.email) {
        authorized = true
        replyEmail = validation.data.email
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // CSRF Protection (if authenticated)
    if (session?.user) {
      const csrfValidation = await requireCsrfToken(request)
      if (!csrfValidation.valid) {
        return NextResponse.json(
          { error: csrfValidation.error || 'CSRF validation failed' },
          { status: 403 }
        )
      }
    }

    // Validate request body
    const validation = await validateRequestBody(request, AddReplySchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const { message, isInternal } = validation.data

    // Sanitize message
    const sanitizedMessage = sanitizeHtml(message)

    // Only admins can create internal replies
    const canCreateInternal = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
    const finalIsInternal = canCreateInternal ? (isInternal || false) : false

    // Create reply
    const reply = await prisma.supportTicketReply.create({
      data: {
        ticketId: id,
        userId: session?.user?.id || null,
        email: replyEmail || session?.user?.email || ticket.email,
        message: sanitizedMessage,
        isInternal: finalIsInternal,
      },
    })

    // Update ticket status if customer replies (set to WAITING_CUSTOMER if it was IN_PROGRESS)
    if (!finalIsInternal && ticket.status === 'IN_PROGRESS') {
      await prisma.supportTicket.update({
        where: { id },
        data: { status: 'WAITING_CUSTOMER' },
      })
    } else if (finalIsInternal && ticket.status === 'WAITING_CUSTOMER') {
      // If admin replies, set to IN_PROGRESS
      await prisma.supportTicket.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      })
    }

    // TODO: Send email notification to customer (if admin reply) or support team (if customer reply)

    const response = NextResponse.json(
      {
        success: true,
        reply,
      },
      { status: 201 }
    )

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error('Error creating reply:', error)
    captureException(error as Error, {
      tags: { endpoint: 'support-ticket-replies-create', error_type: 'database' },
    })
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    )
  }
}

