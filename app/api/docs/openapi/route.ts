import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { rateLimit } from "@/lib/security/rate-limit-middleware"

// OpenAPI 3.1 Specification (converted from YAML)
const openAPISpec = {
  openapi: "3.1.0",
  info: {
    title: "Forger Digital API",
    description: "Comprehensive API documentation for Forger Digital platform.",
    version: "1.0.0",
    contact: {
      name: "Forger Digital API Support",
      email: "info@forgerdigital.com"
    },
    license: {
      name: "Proprietary"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server"
    },
    {
      url: "https://forgerdigital.com",
      description: "Production server"
    }
  ],
  tags: [
    { name: "Authentication", description: "User authentication and authorization" },
    { name: "Forms", description: "Contact and project inquiry form submissions" },
    { name: "Admin", description: "Administrative endpoints (requires ADMIN role)" },
    { name: "Payments", description: "Stripe payment processing" }
  ],
  paths: {
    "/api/auth/signup": {
      post: {
        tags: ["Authentication"],
        summary: "Create a new user account",
        description: "Register a new user with email and password",
        operationId: "signup",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SignupRequest"
              },
              example: {
                name: "John Doe",
                email: "john@example.com",
                password: "SecurePass123!"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SignupResponse"
                }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "409": {
            description: "User already exists",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/rate-limit": {
      post: {
        tags: ["Authentication"],
        summary: "Check rate limit status",
        description: "Check if an identifier (IP/email) has exceeded rate limits",
        operationId: "checkRateLimit",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["identifier"],
                properties: {
                  identifier: {
                    type: "string",
                    description: "IP address or email to check",
                    example: "192.168.1.1"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Rate limit status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    allowed: {
                      type: "boolean",
                      description: "Whether the request is allowed"
                    },
                    remaining: {
                      type: "integer",
                      description: "Remaining requests in the window"
                    },
                    resetTime: {
                      type: "integer",
                      description: "Unix timestamp when the rate limit resets"
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/contact": {
      post: {
        tags: ["Forms"],
        summary: "Submit contact form",
        description: "Submit a contact form with user information and message",
        operationId: "submitContactForm",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ContactFormRequest"
              },
              example: {
                firstName: "Jane",
                lastName: "Smith",
                email: "jane@example.com",
                phone: "+1-347-829-4952",
                company: "Acme Corp",
                message: "I'm interested in your services"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Form submitted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ContactFormResponse"
                }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse"
                }
              }
            }
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/get-started": {
      post: {
        tags: ["Forms"],
        summary: "Submit get started form",
        description: "Submit a project inquiry form with detailed project information",
        operationId: "submitGetStartedForm",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetStartedFormRequest"
              },
              example: {
                firstName: "Bob",
                lastName: "Johnson",
                company: "Tech Startup Inc",
                email: "bob@techstartup.com",
                phone: "+1-555-987-6543",
                role: "CTO",
                projectDescription: "We need a custom web application",
                serviceInterests: ["Web & Blockchain", "AI & Automation"],
                contactMethod: "email",
                timeline: "3-6 months",
                budget: "$50k-$100k"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Form submitted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GetStartedFormResponse"
                }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse"
                }
              }
            }
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/admin/stats": {
      get: {
        tags: ["Admin"],
        summary: "Get admin statistics",
        description: "Get comprehensive platform statistics (requires ADMIN or SUPER_ADMIN role)",
        operationId: "getAdminStats",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Statistics retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AdminStatsResponse"
                }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "403": {
            description: "Forbidden - Admin access required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "List users",
        description: "Get paginated list of users with search and filtering (requires ADMIN or SUPER_ADMIN role)",
        operationId: "listUsers",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number (default: 1)",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1
            }
          },
          {
            name: "limit",
            in: "query",
            description: "Items per page (default: 10)",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10
            }
          },
          {
            name: "search",
            in: "query",
            description: "Search by name or email",
            schema: {
              type: "string"
            }
          },
          {
            name: "role",
            in: "query",
            description: "Filter by user role",
            schema: {
              type: "string",
              enum: ["USER", "ADMIN", "SUPER_ADMIN"]
            }
          }
        ],
        responses: {
          "200": {
            description: "Users retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UsersListResponse"
                }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "403": {
            description: "Forbidden - Admin access required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ["Admin"],
        summary: "Update user role",
        description: "Update a user's role (requires ADMIN or SUPER_ADMIN role)",
        operationId: "updateUserRole",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "role"],
                properties: {
                  userId: {
                    type: "string",
                    description: "User ID to update"
                  },
                  role: {
                    type: "string",
                    enum: ["USER", "ADMIN", "SUPER_ADMIN"],
                    description: "New role for the user"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "User updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Forbidden - Admin access required"
          }
        }
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete user",
        description: "Delete a user account (requires SUPER_ADMIN role)",
        operationId: "deleteUser",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "query",
            required: true,
            description: "User ID to delete",
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "User deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean"
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Forbidden - SUPER_ADMIN access required"
          }
        }
      }
    },
    "/api/admin/submissions": {
      get: {
        tags: ["Admin"],
        summary: "List form submissions",
        description: "Get paginated list of form submissions (requires ADMIN or SUPER_ADMIN role)",
        operationId: "listSubmissions",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "type",
            in: "query",
            description: "Filter by submission type",
            schema: {
              type: "string",
              enum: ["all", "contact", "get-started"],
              default: "all"
            }
          },
          {
            name: "page",
            in: "query",
            description: "Page number (default: 1)",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1
            }
          },
          {
            name: "limit",
            in: "query",
            description: "Items per page (default: 10)",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10
            }
          },
          {
            name: "search",
            in: "query",
            description: "Search by name, email, or company",
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "Submissions retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SubmissionsListResponse"
                }
              }
            }
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Forbidden - Admin access required"
          }
        }
      }
    },
    "/api/stripe/create-checkout-session": {
      post: {
        tags: ["Payments"],
        summary: "Create Stripe checkout session",
        description: "Create a Stripe checkout session for subscription payments (requires authentication)",
        operationId: "createCheckoutSession",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["priceId"],
                properties: {
                  priceId: {
                    type: "string",
                    description: "Stripe price ID",
                    example: "price_1234567890"
                  },
                  quantity: {
                    type: "integer",
                    description: "Quantity (default: 1)",
                    default: 1
                  },
                  metadata: {
                    type: "object",
                    description: "Additional metadata"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Checkout session created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    sessionId: {
                      type: "string",
                      description: "Stripe checkout session ID"
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request"
          },
          "401": {
            description: "Unauthorized"
          },
          "500": {
            description: "Server error"
          }
        }
      }
    },
    "/api/stripe/create-payment-intent": {
      post: {
        tags: ["Payments"],
        summary: "Create Stripe payment intent",
        description: "Create a Stripe payment intent for one-time payments (requires authentication)",
        operationId: "createPaymentIntent",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: {
                  amount: {
                    type: "number",
                    description: "Amount in cents",
                    example: 10000
                  },
                  currency: {
                    type: "string",
                    description: "Currency code (default: usd)",
                    default: "usd"
                  },
                  metadata: {
                    type: "object",
                    description: "Additional metadata"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Payment intent created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clientSecret: {
                      type: "string",
                      description: "Payment intent client secret"
                    },
                    paymentIntentId: {
                      type: "string",
                      description: "Payment intent ID"
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request"
          },
          "401": {
            description: "Unauthorized"
          },
          "500": {
            description: "Server error"
          }
        }
      }
    },
    "/api/stripe/webhook": {
      post: {
        tags: ["Payments"],
        summary: "Stripe webhook handler",
        description: "Handle Stripe webhook events (requires Stripe signature verification)",
        operationId: "handleStripeWebhook",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                description: "Stripe event payload"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Webhook processed successfully"
          },
          "400": {
            description: "Invalid webhook signature"
          },
          "500": {
            description: "Server error"
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "next-auth.session-token",
        description: "NextAuth.js session cookie"
      }
    },
    schemas: {
      SignupRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            example: "John Doe"
          },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com"
          },
          password: {
            type: "string",
            minLength: 8,
            description: "Must contain uppercase, lowercase, number, and special character",
            example: "SecurePass123!"
          }
        }
      },
      SignupResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean"
          },
          message: {
            type: "string"
          },
          user: {
            $ref: "#/components/schemas/User"
          }
        }
      },
      ContactFormRequest: {
        type: "object",
        required: ["firstName", "lastName", "email", "message"],
        properties: {
          firstName: {
            type: "string",
            minLength: 1,
            example: "Jane"
          },
          lastName: {
            type: "string",
            minLength: 1,
            example: "Smith"
          },
          email: {
            type: "string",
            format: "email",
            example: "jane@example.com"
          },
          phone: {
            type: "string",
            description: "Optional phone number",
            example: "+1-347-829-4952"
          },
          company: {
            type: "string",
            description: "Optional company name",
            example: "Acme Corp"
          },
          message: {
            type: "string",
            minLength: 10,
            example: "I'm interested in your services"
          }
        }
      },
      ContactFormResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean"
          },
          message: {
            type: "string"
          },
          data: {
            type: "object",
            properties: {
              timestamp: {
                type: "string",
                format: "date-time"
              },
              emailsSent: {
                type: "object",
                properties: {
                  notification: {
                    type: "boolean"
                  },
                  confirmation: {
                    type: "boolean"
                  }
                }
              }
            }
          }
        }
      },
      GetStartedFormRequest: {
        type: "object",
        required: ["firstName", "lastName", "company", "email", "projectDescription", "serviceInterests", "contactMethod"],
        properties: {
          firstName: {
            type: "string",
            minLength: 1,
            example: "Bob"
          },
          lastName: {
            type: "string",
            minLength: 1,
            example: "Johnson"
          },
          company: {
            type: "string",
            minLength: 1,
            example: "Tech Startup Inc"
          },
          email: {
            type: "string",
            format: "email",
            example: "bob@techstartup.com"
          },
          phone: {
            type: "string",
            description: "Optional phone number",
            example: "+1-555-987-6543"
          },
          role: {
            type: "string",
            description: "Optional job role",
            example: "CTO"
          },
          projectDescription: {
            type: "string",
            minLength: 1,
            example: "We need a custom web application"
          },
          serviceInterests: {
            type: "array",
            items: {
              type: "string"
            },
            minItems: 1,
            example: ["Web & Blockchain", "AI & Automation"]
          },
          contactMethod: {
            type: "string",
            enum: ["email", "phone", "video"],
            example: "email"
          },
          timeline: {
            type: "string",
            description: "Optional project timeline",
            example: "3-6 months"
          },
          budget: {
            type: "string",
            description: "Optional budget range",
            example: "$50k-$100k"
          }
        }
      },
      GetStartedFormResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean"
          },
          message: {
            type: "string"
          },
          data: {
            type: "object",
            properties: {
              timestamp: {
                type: "string",
                format: "date-time"
              },
              emailsSent: {
                type: "object",
                properties: {
                  notification: {
                    type: "boolean"
                  },
                  confirmation: {
                    type: "boolean"
                  }
                }
              },
              leadId: {
                type: "string",
                nullable: true,
                description: "CRM lead ID if available"
              }
            }
          }
        }
      },
      AdminStatsResponse: {
        type: "object",
        properties: {
          stats: {
            type: "object",
            properties: {
              totalUsers: {
                type: "integer"
              },
              totalContactSubmissions: {
                type: "integer"
              },
              totalGetStartedSubmissions: {
                type: "integer"
              },
              totalSubmissions: {
                type: "integer"
              },
              activeSessions: {
                type: "integer"
              },
              newUsersLast30Days: {
                type: "integer"
              },
              newContactSubmissionsLast30Days: {
                type: "integer"
              },
              newGetStartedSubmissionsLast30Days: {
                type: "integer"
              }
            }
          },
          recent: {
            type: "object",
            properties: {
              users: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/User"
                }
              },
              submissions: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Submission"
                }
              }
            }
          }
        }
      },
      UsersListResponse: {
        type: "object",
        properties: {
          users: {
            type: "array",
            items: {
              $ref: "#/components/schemas/User"
            }
          },
          pagination: {
            $ref: "#/components/schemas/Pagination"
          }
        }
      },
      SubmissionsListResponse: {
        type: "object",
        properties: {
          submissions: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Submission"
            }
          },
          pagination: {
            $ref: "#/components/schemas/Pagination"
          }
        }
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          name: {
            type: "string",
            nullable: true
          },
          email: {
            type: "string"
          },
          role: {
            type: "string",
            enum: ["USER", "ADMIN", "SUPER_ADMIN"]
          },
          emailVerified: {
            type: "string",
            format: "date-time",
            nullable: true
          },
          image: {
            type: "string",
            nullable: true
          },
          createdAt: {
            type: "string",
            format: "date-time"
          },
          updatedAt: {
            type: "string",
            format: "date-time"
          },
          _count: {
            type: "object",
            properties: {
              accounts: {
                type: "integer"
              },
              sessions: {
                type: "integer"
              },
              payments: {
                type: "integer"
              },
              subscriptions: {
                type: "integer"
              }
            }
          }
        }
      },
      Submission: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          type: {
            type: "string",
            enum: ["contact", "get-started"]
          },
          firstName: {
            type: "string"
          },
          lastName: {
            type: "string"
          },
          email: {
            type: "string"
          },
          phone: {
            type: "string",
            nullable: true
          },
          company: {
            type: "string",
            nullable: true
          },
          message: {
            type: "string",
            nullable: true
          },
          projectDescription: {
            type: "string",
            nullable: true
          },
          serviceInterests: {
            type: "array",
            items: {
              type: "string"
            },
            nullable: true
          },
          contactMethod: {
            type: "string",
            nullable: true
          },
          timeline: {
            type: "string",
            nullable: true
          },
          budget: {
            type: "string",
            nullable: true
          },
          createdAt: {
            type: "string",
            format: "date-time"
          }
        }
      },
      Pagination: {
        type: "object",
        properties: {
          page: {
            type: "integer"
          },
          limit: {
            type: "integer"
          },
          total: {
            type: "integer"
          },
          totalPages: {
            type: "integer"
          }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string"
          },
          message: {
            type: "string",
            nullable: true
          }
        }
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false
          },
          message: {
            type: "string",
            example: "Validation failed"
          },
          errors: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        }
      }
    }
  }
}

export async function GET(request: NextRequest) {
  // Light rate limiting for API docs
  const rateLimitResult = await rateLimit(request, "/api/docs/openapi")

  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  const response = NextResponse.json(openAPISpec)

  // Add rate limit headers
  Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}
