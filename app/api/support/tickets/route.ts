import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { requireCsrfToken } from '@/lib/security/csrf'
import { validateRequestBody } from '@/lib/validation/validator'
import { z } from 'zod'
import { sanitizeHtml } from '@/lib/validation/sanitize'
import { captureException } from '@/lib/sentry'
import { rateLimit } from '@/lib/security/rate-limit-middleware'

// Schema for creating a support ticket
const CreateTicketSchema = z.object({
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject must be less than 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be less than 5000 characters'),
  category: z.enum(['GENERAL', 'TECHNICAL', 'BILLING', 'FEATURE_REQUEST', 'BUG_REPORT', 'ACCOUNT', 'OTHER']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
})

// GET - List tickets (authenticated users see their own, admins see all)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}

    if (session?.user) {
      // Authenticated users see their own tickets
      if (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') {
        // Admins can see all tickets
        if (status) where.status = status
        if (category) where.category = category
      } else {
        // Regular users see only their tickets
        where.userId = session.user.id
        if (status) where.status = status
        if (category) where.category = category
      }
    } else {
      // Guest users cannot list tickets (must provide email to view)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
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
            take: 1, // Get latest reply for preview
          },
          _count: {
            select: { replies: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ])

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching tickets:', error)
    captureException(error as Error, {
      tags: { endpoint: 'support-tickets-list', error_type: 'database' },
    })
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// POST - Create a new support ticket
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, '/api/support/tickets')
    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    const session = await auth()

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
    const validation = await validateRequestBody(request, CreateTicketSchema)
    if (!validation.success) {
      console.error('Validation errors:', validation.errors)
      return NextResponse.json(
        {
          error: validation.error || 'Validation failed',
          errors: validation.errors,
          message: 'Please check all required fields and ensure they meet the minimum requirements.',
        },
        { status: 400 }
      )
    }

    const { email, subject, description, category, priority } = validation.data

    // Sanitize description
    const sanitizedDescription = sanitizeHtml(description)

    // Create ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session?.user?.id || null,
        email,
        subject,
        description: sanitizedDescription,
        category: category || 'GENERAL',
        priority: priority || 'MEDIUM',
        status: 'OPEN',
      },
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

    // TODO: Send email notification to support team
    // TODO: Send confirmation email to customer

    const response = NextResponse.json(
      {
        success: true,
        ticket: {
          id: ticket.id,
          subject: ticket.subject,
          status: ticket.status,
          createdAt: ticket.createdAt,
        },
      },
      { status: 201 }
    )

    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error('Error creating ticket:', error)
    captureException(error as Error, {
      tags: { endpoint: 'support-tickets-create', error_type: 'database' },
      extra: { errorMessage: error.message, errorStack: error.stack },
    })
    return NextResponse.json(
      { 
        error: 'Failed to create ticket',
        message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while creating your ticket. Please try again.',
      },
      { status: 500 }
    )
  }
}

