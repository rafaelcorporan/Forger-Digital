import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { GetStartedFormSchema, sanitizeHtml } from '@/lib/validation'
import { validateRequestBody } from '@/lib/validation/validator'
import { checkRateLimit, RateLimitPresets, getRateLimitHeaders } from '@/lib/security/rate-limit'
import { requireCsrfToken } from '@/lib/security/csrf'
import { captureException } from '@/lib/sentry'
import { analyzeAndAssignProject } from '@/lib/modules/project-assignment/logic'
import { ProjectAssignmentResult } from '@/lib/modules/project-assignment/types'

interface FormData {
  firstName: string
  lastName: string
  company: string
  email: string
  phone?: string
  role?: string
  projectDescription: string
  serviceInterests: string[]
  contactMethod: string
  timeline?: string
  budget?: string
}

// CRM Integration (placeholder - replace with actual CRM API)
async function sendToCRM(data: FormData) {
  try {
    // Example: HubSpot integration
    const hubspotData = {
      properties: {
        firstname: data.firstName,
        lastname: data.lastName,
        company: data.company,
        email: data.email,
        phone: data.phone || '',
        jobtitle: data.role || '',
        message: data.projectDescription,
        service_interests: data.serviceInterests.join(', '),
        preferred_contact_method: data.contactMethod,
        project_timeline: data.timeline || '',
        budget_range: data.budget || '',
        lead_source: 'Website - Get Started Form',
        lead_status: 'New',
        created_date: new Date().toISOString()
      }
    }

    // Replace with actual HubSpot API call
    console.log('CRM Data to be sent:', hubspotData)

    // Simulate API call
    // const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(hubspotData)
    // })

    return { success: true, crmId: 'simulated-crm-id' }
  } catch (error) {
    console.error('CRM integration error:', error)
    return { success: false, error: error.message }
  }
}

// Internal notification system
async function sendInternalNotification(data: FormData, crmId?: string) {
  try {
    const notificationData = {
      text: `🚀 New Lead from Get Started Form`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*New Lead Submission*\n\n*Name:* ${data.firstName} ${data.lastName}\n*Company:* ${data.company}\n*Email:* ${data.email}\n*Phone:* ${data.phone || 'Not provided'}\n*Role:* ${data.role || 'Not provided'}\n\n*Project Description:*\n${data.projectDescription}\n\n*Service Interests:* ${data.serviceInterests.join(', ')}\n*Preferred Contact:* ${data.contactMethod}\n*Timeline:* ${data.timeline || 'Not specified'}\n*Budget:* ${data.budget || 'Not specified'}\n\n*CRM ID:* ${crmId || 'Not available'}`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View in CRM"
              },
              url: `https://app.hubspot.com/contacts/${process.env.HUBSPOT_PORTAL_ID}/contact/${crmId}`,
              action_id: "view_crm"
            }
          ]
        }
      ]
    }

    // Replace with actual Slack webhook
    console.log('Slack notification to be sent:', notificationData)

    // Simulate Slack notification
    // const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(notificationData)
    // })

    return { success: true }
  } catch (error) {
    console.error('Notification error:', error)
    return { success: false, error: error.message }
  }
}

// Send notification email to team
async function sendNotificationEmail(data: FormData, fileUrls: string[] = [], assignment?: ProjectAssignmentResult) {
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

    // Sanitize all user input before including in email
    const safeFirstName = sanitizeHtml(data.firstName)
    const safeLastName = sanitizeHtml(data.lastName)
    const safeCompany = sanitizeHtml(data.company)
    const safeEmail = sanitizeHtml(data.email)
    const safeRole = data.role ? sanitizeHtml(data.role) : ''
    const safePhone = data.phone ? sanitizeHtml(data.phone) : ''
    const safeProjectDescription = sanitizeHtml(data.projectDescription)

    const serviceInterestsList = data.serviceInterests.length > 0
      ? data.serviceInterests.map(s => `• ${sanitizeHtml(s)}`).join('<br>')
      : 'None selected'

    const recipients = [process.env.SMTP_USER];

    // Add assigned staff to recipients
    if (assignment?.assignedStaff) {
      assignment.assignedStaff.forEach(staff => {
        if (staff.email && !recipients.includes(staff.email)) {
          recipients.push(staff.email);
        }
      });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: recipients.join(', '), // Send to Admin + Assigned Staff
      subject: `New Project Inquiry: ${safeFirstName} ${safeLastName} from ${safeCompany}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF5722;">New Project Inquiry - Get Started Form</h2>
          
          ${assignment ? `
          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #c8e6c9;">
            <h3 style="color: #2e7d32; margin-top: 0; font-size: 16px;">✅ Project Assignment</h3>
            <p style="margin: 5px 0;"><strong>Assigned To:</strong> ${assignment.assignedStaff.map(s => `${s.name} (${s.role})`).join(', ') || 'General Admin'}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Detected Keywords:</strong> ${assignment.detectedKeywords.join(', ') || 'None'}</p>
          </div>
          ` : ''}
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${safeFirstName} ${safeLastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Company:</strong> ${safeCompany}</p>
            ${safeRole ? `<p><strong>Role:</strong> ${safeRole}</p>` : ''}
            ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
          </div>

          <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #FF5722; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Description</h3>
            <p style="white-space: pre-wrap; color: #666; line-height: 1.6;">${safeProjectDescription.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Details</h3>
            <p><strong>Service Interests:</strong></p>
            <div style="margin-left: 20px; color: #666;">${serviceInterestsList}</div>
            ${data.timeline ? `<p style="margin-top: 15px;"><strong>Timeline:</strong> ${sanitizeHtml(data.timeline)}</p>` : ''}
            ${data.budget ? `<p><strong>Budget Range:</strong> ${sanitizeHtml(data.budget)}</p>` : ''}
            <p style="margin-top: 15px;"><strong>Preferred Contact Method:</strong> ${sanitizeHtml(data.contactMethod)}</p>
          </div>

          ${fileUrls.length > 0 ? `
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
            <h3 style="color: #333; margin-top: 0;">📎 Uploaded Files (${fileUrls.length})</h3>
            ${fileUrls.map(url => {
        const fileName = url.split('/').pop() || url
        const displayName = fileName.replace(/^\d+_/, '') // Remove timestamp prefix
        return `<p style="margin: 8px 0;"><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${url}" style="color: #2196F3; text-decoration: none;">📄 ${sanitizeHtml(displayName)}</a></p>`
      }).join('')}
          </div>
          ` : ''}

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

// Send confirmation email to the lead
async function sendConfirmationEmail(data: FormData) {
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

    // Sanitize all user input before including in email
    const safeFirstName = sanitizeHtml(data.firstName)
    const safeCompany = sanitizeHtml(data.company)

    const serviceInterestsList = data.serviceInterests.length > 0
      ? data.serviceInterests.map(s => `• ${sanitizeHtml(s)}`).join('<br>')
      : 'None selected'

    const contactMethodText = data.contactMethod === 'email' ? 'email' : data.contactMethod === 'phone' ? 'phone call' : 'video call'

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: data.email,
      subject: 'Thank you for your interest in Forger Digital',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF5722 0%, #E91E63 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You, ${safeFirstName}!</h1>
          </div>
          
          <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              We've received your project inquiry and are excited about the opportunity to help <strong>transform your digital vision into reality</strong>. A Principal Engineer will contact you via ${contactMethodText} within <strong>1 business hour</strong>.
            </p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF5722;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Your Project Details:</strong><br>
                <strong>Company:</strong> ${safeCompany}<br>
                <strong>Service Interests:</strong><br>
                ${serviceInterestsList}<br>
                ${data.timeline ? `<strong>Timeline:</strong> ${sanitizeHtml(data.timeline)}<br>` : ''}
                ${data.budget ? `<strong>Budget Range:</strong> ${sanitizeHtml(data.budget)}<br>` : ''}
              </p>
            </div>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Our team of expert engineers is reviewing your project requirements and preparing personalized recommendations tailored to your specific needs. We'll discuss your vision, challenges, and how Forger Digital can help you achieve your business goals with cutting-edge technology.
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
async function saveSubmissionToFile(data: FormData): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const submissionsDir = join(process.cwd(), 'contact-submissions')
    await mkdir(submissionsDir, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `project-inquiry-${timestamp}.json`
    const filePath = join(submissionsDir, filename)

    const submissionData = {
      timestamp: new Date().toISOString(),
      formType: 'get-started',
      ...data
    }

    await writeFile(filePath, JSON.stringify(submissionData, null, 2), 'utf-8')
    console.log(`✅ Project inquiry saved to file: ${filePath}`)

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
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          }
        }
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
      identifier: `get-started:${ip}`,
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

    // Parse FormData (for file uploads)
    let formDataRequest
    let uploadedFiles: File[] = []
    try {
      formDataRequest = await request.formData()
    } catch (formDataError: any) {
      console.error('FormData parsing error:', formDataError)
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format. Please check your input and try again.',
          error: process.env.NODE_ENV === 'development' ? formDataError.message : 'FormData parsing error'
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

    // Extract form fields from FormData
    const formFields: any = {}
    for (const [key, value] of formDataRequest.entries()) {
      if (key.startsWith('file_')) {
        // Collect uploaded files
        if (value instanceof File) {
          uploadedFiles.push(value)
        }
      } else if (key === 'serviceInterests') {
        // Parse JSON array
        try {
          formFields[key] = JSON.parse(value as string)
        } catch {
          formFields[key] = []
        }
      } else {
        formFields[key] = value
      }
    }

    // Validate extracted data
    const validation = GetStartedFormSchema.safeParse(formFields)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        const path = err.path.join(".")
        errors[path] = err.message
      })

      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors,
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

    // Save uploaded files to disk
    const savedFiles: string[] = []
    if (uploadedFiles.length > 0) {
      try {
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'get-started')
        await mkdir(uploadsDir, { recursive: true })

        for (const file of uploadedFiles) {
          const timestamp = Date.now()
          const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
          const fileName = `${timestamp}_${safeFileName}`
          const filePath = join(uploadsDir, fileName)

          const arrayBuffer = await file.arrayBuffer()
          await writeFile(filePath, new Uint8Array(arrayBuffer))

          savedFiles.push(`/uploads/get-started/${fileName}`)
          console.log(`✅ File saved: ${fileName}`)
        }
      } catch (fileError: any) {
        console.error('File save error:', fileError)
        captureException(fileError as Error, {
          tags: { endpoint: 'get-started', error_type: 'file_upload' },
        })
        // Continue with form submission even if file save fails
      }
    }

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured')
      // Save to file as fallback
      const fileSaveResult = await saveSubmissionToFile(data)
      return NextResponse.json(
        {
          success: fileSaveResult.success,
          message: fileSaveResult.success
            ? 'Your inquiry has been received and saved. We\'ll contact you soon!'
            : 'Email service not configured. Please contact support.',
          error: 'SMTP credentials missing',
          data: {
            timestamp: new Date().toISOString(),
            savedToFile: fileSaveResult.success,
            filesUploaded: savedFiles.length
          }
        },
        {
          status: fileSaveResult.success ? 200 : 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // 1. Run Project Assignment Analysis
    const assignmentResult = analyzeAndAssignProject({
      serviceInterests: data.serviceInterests,
      projectDescription: data.projectDescription
    });

    console.log('🤖 Project Assignment Analysis:', {
      assigned: assignmentResult.assignedStaff.map(s => s.role),
      keywords: assignmentResult.detectedKeywords,
      log: assignmentResult.analysisLog
    });

    // Sanitize project description for database storage
    const sanitizedProjectDescription = sanitizeHtml(data.projectDescription)

    // Save to database
    try {
      await prisma.getStartedSubmission.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
          email: data.email,
          phone: data.phone || null,
          role: data.role || null,
          projectDescription: sanitizedProjectDescription,
          serviceInterests: data.serviceInterests || [],
          contactMethod: data.contactMethod,
          timeline: data.timeline || null,
          budget: data.budget || null,
          assignmentData: assignmentResult as any, // Cast to any to avoid type error until client is regenerated
        },
      })
      console.log('✅ Get started submission saved to database')
    } catch (dbError: any) {
      console.error('Database save error:', dbError)
      captureException(dbError as Error, {
        tags: { endpoint: 'get-started', error_type: 'database' },
        extra: { email: data.email },
      })
      // Continue with email sending even if DB save fails
    }

    // Send emails (both notification and confirmation) and process CRM
    const results = await Promise.allSettled([
      sendNotificationEmail(data, savedFiles, assignmentResult),
      sendConfirmationEmail(data),
      sendToCRM(data),
      sendInternalNotification(data)
    ])

    const [notificationResult, confirmationResult, crmResult, internalNotificationResult] = results

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
    console.log('Get Started form processing results:', {
      notification: notificationResult.status === 'fulfilled'
        ? { success: notificationResult.value.success, messageId: notificationResult.value.messageId }
        : { error: notificationError },
      confirmation: confirmationResult.status === 'fulfilled'
        ? { success: confirmationResult.value.success, messageId: confirmationResult.value.messageId }
        : { error: confirmationError },
      crm: crmResult.status === 'fulfilled' ? crmResult.value : crmResult.reason,
      internalNotification: internalNotificationResult.status === 'fulfilled' ? internalNotificationResult.value : internalNotificationResult.reason
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
        console.log(`✅ Project inquiry saved to: ${fileSaveResult.filePath}`)
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
            ? 'Your inquiry has been received and saved. Our email service is currently being configured. We\'ll contact you soon!'
            : 'Your inquiry has been received and saved. We\'ll contact you soon!',
          data: {
            timestamp: new Date().toISOString(),
            emailsSent: {
              notification: false,
              confirmation: false
            },
            savedToFile: true,
            leadId: crmResult.status === 'fulfilled' ? crmResult.value?.crmId : null,
            filePath: process.env.NODE_ENV === 'development' ? fileSaveResult.filePath : undefined
          },
          warning: isSMTPAuthDisabled
            ? 'SMTP authentication is disabled. Please enable SMTP AUTH in Microsoft 365 Admin Center.'
            : 'Emails failed to send, but inquiry was saved to file.'
        })
      } else {
        // Could not save to file either - return error
        return NextResponse.json(
          {
            success: false,
            message: isSMTPAuthDisabled
              ? 'Email service is not configured. Please enable SMTP AUTH in Microsoft 365 Admin Center or contact support directly.'
              : 'Failed to send emails and save inquiry. Please try again or contact us directly.',
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
          console.log(`✅ Project inquiry saved to file as backup: ${fileSaveResult.filePath}`)
        }
      }
    }

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully. A Principal Engineer will contact you within 1 business hour.',
        data: {
          timestamp: new Date().toISOString(),
          emailsSent: {
            notification: notificationSuccess,
            confirmation: confirmationSuccess
          },
          leadId: crmResult.status === 'fulfilled' ? crmResult.value?.crmId : null,
          filesUploaded: savedFiles.length,
          fileUrls: savedFiles
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

  } catch (error) {
    console.error('Form submission error:', error)

    // Ensure error is captured for monitoring (but don't fail if Sentry fails)
    try {
      captureException(error as Error, {
        tags: { endpoint: 'get-started', error_type: 'general' },
      })
    } catch (sentryError) {
      console.error('Failed to capture exception:', sentryError)
    }

    // ALWAYS return JSON, never HTML - this is critical
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
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

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
