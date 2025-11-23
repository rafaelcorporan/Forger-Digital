import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { ContactFormSchema, sanitizeHtml } from '@/lib/validation'
import { validateRequestBody } from '@/lib/validation/validator'
import { checkRateLimit, RateLimitPresets, getRateLimitHeaders } from '@/lib/security/rate-limit'
import { requireCsrfToken } from '@/lib/security/csrf'
import { captureException } from '@/lib/sentry'

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  message: string
}

// Send email to team (notification)
async function sendNotificationEmail(data: ContactFormData) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates if needed
      }
    })

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to your own email
      subject: `New Contact Form Submission from ${data.firstName} ${data.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF5722;">New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${data.firstName.replace(/</g, '&lt;').replace(/>/g, '&gt;')} ${data.lastName.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a></p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : ''}
            ${data.company ? `<p><strong>Company:</strong> ${data.company.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : ''}
          </div>

          <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #FF5722;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; color: #666; line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            <p>Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('Notification email error:', error)
    return { success: false, error: error.message }
  }
}

// Send confirmation email to the user
async function sendConfirmationEmail(data: ContactFormData) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates if needed
      }
    })

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: data.email,
      subject: 'Thank you for contacting Forger Digital',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF5722 0%, #E91E63 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You, ${data.firstName}!</h1>
          </div>
          
          <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              We've received your message and will get back to you within <strong>24 hours</strong>.
            </p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF5722;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Your Message:</strong><br>
                ${data.message.replace(/\n/g, '<br>')}
              </p>
            </div>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Our team is reviewing your project requirements and will contact you soon to discuss how we can help transform your digital vision into reality.
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong style="color: #FF5722;">Forger Digital Team</strong>
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
          </div>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('Confirmation email error:', error)
    return { success: false, error: error.message }
  }
}

// Fallback storage: Save submission to file when email fails
async function saveSubmissionToFile(data: ContactFormData): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const submissionsDir = join(process.cwd(), 'contact-submissions')
    await mkdir(submissionsDir, { recursive: true })
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `submission-${timestamp}.json`
    const filePath = join(submissionsDir, filename)
    
    const submissionData = {
      timestamp: new Date().toISOString(),
      ...data
    }
    
    await writeFile(filePath, JSON.stringify(submissionData, null, 2), 'utf-8')
    console.log(`✅ Submission saved to file: ${filePath}`)
    
    return { success: true, filePath }
  } catch (error: any) {
    console.error('Failed to save submission to file:', error)
    return { success: false, error: error.message }
  }
}

export async function POST(request: NextRequest) {
  try {
    // CSRF Protection - wrapped in try-catch to ensure JSON response on error
    let csrfValidation
    try {
      csrfValidation = await requireCsrfToken(request)
    } catch (csrfError: any) {
      console.error('CSRF validation error:', csrfError)
      return NextResponse.json(
        {
          success: false,
          message: 'Security validation failed. Please refresh the page and try again.',
          error: process.env.NODE_ENV === 'development' ? csrfError.message : 'CSRF validation error'
        },
        { status: 403 }
      )
    }

    if (!csrfValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: csrfValidation.error || 'CSRF validation failed',
        },
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Rate Limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit({
      ...RateLimitPresets.formSubmission,
      identifier: `contact-form:${ip}`,
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(
              rateLimit.allowed,
              rateLimit.remaining,
              rateLimit.resetTime
            ),
          },
        }
      )
    }

    // Validate request body - wrapped in try-catch to ensure JSON response
    let validation
    try {
      validation = await validateRequestBody(request, ContactFormSchema)
    } catch (validationError: any) {
      console.error('Request validation error:', validationError)
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format. Please check your input and try again.',
          error: process.env.NODE_ENV === 'development' ? validationError.message : 'Validation error'
        },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(
              rateLimit.allowed,
              rateLimit.remaining,
              rateLimit.resetTime
            ),
          },
        }
      )
    }

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error || 'Validation failed',
          errors: validation.errors,
        },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(
              rateLimit.allowed,
              rateLimit.remaining,
              rateLimit.resetTime
            ),
          },
        }
      )
    }

    const data = validation.data

    // Sanitize message for database storage
    const sanitizedMessage = sanitizeHtml(data.message)

    // Save to database
    try {
      await prisma.contactFormSubmission.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          message: sanitizedMessage,
        },
      })
      console.log('✅ Contact form submission saved to database')
    } catch (dbError: any) {
      console.error('Database save error:', dbError)
      captureException(dbError as Error, {
        tags: { endpoint: 'contact', error_type: 'database' },
        extra: { email: data.email },
      })
      // Continue with email sending even if DB save fails
    }

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured')
      return NextResponse.json(
        {
          success: false,
          message: 'Email service not configured. Please contact support.',
          error: 'SMTP credentials missing'
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Send emails (both notification and confirmation)
    const results = await Promise.allSettled([
      sendNotificationEmail(data),
      sendConfirmationEmail(data)
    ])

    const [notificationResult, confirmationResult] = results

    // Extract results
    const notificationSuccess = notificationResult.status === 'fulfilled' && notificationResult.value.success
    const confirmationSuccess = confirmationResult.status === 'fulfilled' && confirmationResult.value.success
    
    // Extract error messages for diagnostics
    const notificationError = notificationResult.status === 'rejected' 
      ? notificationResult.reason?.message || String(notificationResult.reason)
      : notificationResult.status === 'fulfilled' && !notificationResult.value.success
      ? notificationResult.value.error
      : null
    
    const confirmationError = confirmationResult.status === 'rejected'
      ? confirmationResult.reason?.message || String(confirmationResult.reason)
      : confirmationResult.status === 'fulfilled' && !confirmationResult.value.success
      ? confirmationResult.value.error
      : null

    // Log detailed results
    console.log('Contact form processing results:', {
      notification: notificationResult.status === 'fulfilled' 
        ? { success: notificationResult.value.success, messageId: notificationResult.value.messageId }
        : { error: notificationError },
      confirmation: confirmationResult.status === 'fulfilled'
        ? { success: confirmationResult.value.success, messageId: confirmationResult.value.messageId }
        : { error: confirmationError }
    })

    // If both emails failed, save to file as fallback
    if (!notificationSuccess && !confirmationSuccess) {
      console.error('Both emails failed - saving submission to file as fallback:', {
        notificationError,
        confirmationError
      })
      
      // Save submission to file
      const fileSaveResult = await saveSubmissionToFile(data)
      
      if (fileSaveResult.success) {
        console.log(`✅ Submission saved to: ${fileSaveResult.filePath}`)
      }
      
      // Check if SMTP AUTH is disabled (common Outlook issue)
      // IMPORTANT: Only match the EXACT phrase "SmtpClientAuthentication is disabled"
      // DO NOT check for error code 535 5.7.139 as it's used for multiple auth errors (wrong password, etc.)
      const isSMTPAuthDisabled = (notificationError && (
                                  notificationError.includes('SmtpClientAuthentication is disabled') ||
                                  notificationError.includes('SmtpClientAuthentication is disabled for the Tenant')
                                )) || 
                                (confirmationError && (
                                  confirmationError.includes('SmtpClientAuthentication is disabled') ||
                                  confirmationError.includes('SmtpClientAuthentication is disabled for the Tenant')
                                ))

      // Return success with warning if saved to file, otherwise return error
      if (fileSaveResult.success) {
        return NextResponse.json({
          success: true,
          message: isSMTPAuthDisabled 
            ? 'Your message has been received and saved. Our email service is currently being configured. We\'ll contact you soon!'
            : 'Your message has been received and saved. We\'ll contact you soon!',
          data: {
            timestamp: new Date().toISOString(),
            emailsSent: {
              notification: false,
              confirmation: false
            },
            savedToFile: true,
            filePath: process.env.NODE_ENV === 'development' ? fileSaveResult.filePath : undefined
          },
          warning: isSMTPAuthDisabled 
            ? 'SMTP authentication is disabled. Please enable SMTP AUTH in Microsoft 365 Admin Center.'
            : 'Emails failed to send, but submission was saved to file.'
        })
      } else {
        // Could not save to file either - return error
        return NextResponse.json(
          {
            success: false,
            message: isSMTPAuthDisabled
              ? 'Email service is not configured. Please enable SMTP AUTH in Microsoft 365 Admin Center or contact support directly.'
              : 'Failed to send emails and save submission. Please try again or contact us directly.',
            error: 'Email sending and file save failed',
            details: process.env.NODE_ENV === 'development' ? {
              notificationError,
              confirmationError,
              fileSaveError: fileSaveResult.error
            } : undefined
          },
          { status: 500 }
        )
      }
    }

    // Log partial failures
    if (!notificationSuccess || !confirmationSuccess) {
      console.error('Email sending partially failed:', {
        notification: notificationError || 'Success',
        confirmation: confirmationError || 'Success'
      })
      
      // Save to file if notification email failed (so we don't lose the lead)
      if (!notificationSuccess) {
        const fileSaveResult = await saveSubmissionToFile(data)
        if (fileSaveResult.success) {
          console.log(`✅ Submission saved to file as backup: ${fileSaveResult.filePath}`)
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully. We\'ll get back to you within 24 hours.',
        data: {
          timestamp: new Date().toISOString(),
          emailsSent: {
            notification: notificationSuccess,
            confirmation: confirmationSuccess
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...getRateLimitHeaders(
            rateLimit.allowed,
            rateLimit.remaining,
            rateLimit.resetTime
          ),
        },
      }
    )
  } catch (error: any) {
    console.error('Contact form submission error:', error)
    
    // Ensure error is captured for monitoring (but don't fail if Sentry fails)
    try {
      captureException(error as Error, {
        tags: { endpoint: 'contact', error_type: 'general' },
      })
    } catch (sentryError) {
      // If Sentry fails, log but don't fail the response
      console.error('Failed to capture exception:', sentryError)
    }

    // ALWAYS return JSON, never HTML - this is critical
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}

