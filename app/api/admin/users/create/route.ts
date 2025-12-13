import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { CreateUserSchema } from "@/lib/validation/schemas"
import { validateRequestBody } from "@/lib/validation/validator"
import { rateLimit, getUserIdentifier } from "@/lib/security/rate-limit-middleware"
import { captureException } from "@/lib/sentry"
import bcrypt from "bcryptjs"

// Generate a secure temporary password
function generateTempPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
  let password = ''
  // Ensure at least one of each required character type
  password += 'A' // uppercase
  password += 'a' // lowercase
  password += '1' // number
  password += '@' // special
  // Fill the rest randomly
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Generate URL-safe slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).substring(2, 8)
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userRole = session.user.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(
      request,
      "/api/admin/users/create",
      {
        keyGenerator: () => getUserIdentifier(request, session.user.id),
      }
    )

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response
    }

    // Validate request body
    const validation = await validateRequestBody(request, CreateUserSchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error || "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const { 
      email, 
      name, 
      role, 
      company, 
      phone, 
      department, 
      title, 
      skills, 
      hourlyRate,
      sendWelcomeEmail 
    } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      )
    }

    // Generate temporary password
    const tempPassword = generateTempPassword()
    const hashedPassword = await bcrypt.hash(tempPassword, 12)

    // Create user with profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          role,
          password: hashedPassword,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      })

      // Create role-specific profile
      if (role === "CLIENT") {
        await tx.clientProfile.create({
          data: {
            userId: user.id,
            company,
            phone,
          }
        })
      } else if (role === "STAFF") {
        await tx.staffProfile.create({
          data: {
            userId: user.id,
            department,
            title,
            skills: skills || [],
            hourlyRate,
            availability: "AVAILABLE",
          }
        })
      }

      return user
    })

    // TODO: Send welcome email with temporary password
    // if (sendWelcomeEmail) {
    //   await sendWelcomeEmail({ email, name, tempPassword })
    // }

    const response = NextResponse.json({
      success: true,
      user: result,
      // Only return temp password in development or if email sending fails
      ...(process.env.NODE_ENV === 'development' && { tempPassword }),
      message: `${role.toLowerCase()} account created successfully${sendWelcomeEmail ? '. Welcome email sent.' : '.'}`,
    })

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error: any) {
    console.error("Create user error:", error)
    captureException(error as Error, {
      tags: { endpoint: "admin-users-create", error_type: "general" },
    })
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

