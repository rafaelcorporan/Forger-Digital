import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { requireCsrfToken } from '@/lib/security/csrf'
import { validateRequestBody } from '@/lib/validation/validator'
import { z } from 'zod'
import { sanitizeHtml } from '@/lib/validation/sanitize'
import { captureException } from '@/lib/sentry'

// Schema for updating a ticket
const UpdateTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional().nullable(),
  category: z.enum(['GENERAL', 'TECHNICAL', 'BILLING', 'FEATURE_REQUEST', 'BUG_REPORT', 'ACCOUNT', 'OTHER']).optional(),
})

// Schema for adding a reply
const AddReplySchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(5000, 'Message must be less than 5000 characters'),
  isInternal: z.boolean().optional().default(false),
  email: z.string().email().optional(), // For guest replies
})

// GET - Get a specific ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            ticket: {
              select: {
                id: true,
                subject: true,
              },
            },
          },
        },
      },
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
      // Guest users need to provide email to view ticket
      const { searchParams } = new URL(request.url)
      const email = searchParams.get('email')

      if (!email || email !== ticket.email) {
        return NextResponse.json(
          { error: 'Unauthorized. Please provide the email address used to create this ticket.' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ ticket })
  } catch (error: any) {
    console.error('Error fetching ticket:', error)
    captureException(error as Error, {
      tags: { endpoint: 'support-ticket-get', error_type: 'database' },
    })
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    )
  }
}

// PATCH - Update a ticket (admin only or ticket owner for status updates)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
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

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN'
    const isOwner = ticket.userId === session.user.id

    // Validate request body
    const validation = await validateRequestBody(request, UpdateTicketSchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const updateData: any = {}

    // Only admins can change assignment, category, priority
    if (isAdmin) {
      if (validation.data.status !== undefined) updateData.status = validation.data.status
      if (validation.data.priority !== undefined) updateData.priority = validation.data.priority
      if (validation.data.assignedTo !== undefined) updateData.assignedTo = validation.data.assignedTo
      if (validation.data.category !== undefined) updateData.category = validation.data.category

      // Set resolvedAt when status changes to RESOLVED
      if (validation.data.status === 'RESOLVED' && ticket.status !== 'RESOLVED') {
        updateData.resolvedAt = new Date()
      } else if (validation.data.status !== 'RESOLVED' && ticket.status === 'RESOLVED') {
        updateData.resolvedAt = null
      }
    } else if (isOwner) {
      // Ticket owners can only update status to CLOSED or RESOLVED
      if (validation.data.status === 'CLOSED' || validation.data.status === 'RESOLVED') {
        updateData.status = validation.data.status
        if (validation.data.status === 'RESOLVED') {
          updateData.resolvedAt = new Date()
        }
      } else {
        return NextResponse.json(
          { error: 'You can only close or resolve your own tickets' },
          { status: 403 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
    })
  } catch (error: any) {
    console.error('Error updating ticket:', error)
    captureException(error as Error, {
      tags: { endpoint: 'support-ticket-update', error_type: 'database' },
    })
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}

