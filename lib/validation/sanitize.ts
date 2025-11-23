/**
 * Input sanitization utilities
 * Prevents XSS, injection attacks, and data corruption
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Note: For full HTML sanitization, use DOMPurify in browser or sanitize-html on server
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return ""
  }

  return html
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]*/gi, "")
    // Remove javascript: protocol
    .replace(/javascript:/gi, "")
    // Remove data: URLs (potential XSS vector)
    .replace(/data:text\/html/gi, "")
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    // Remove object/embed tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    // Remove dangerous attributes
    .replace(/\s*style\s*=\s*["'][^"']*["']/gi, "")
    // Escape remaining HTML entities
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

/**
 * Sanitize plain text - remove dangerous characters
 */
export function sanitizeText(text: string, maxLength: number = 10000): string {
  if (!text || typeof text !== "string") {
    return ""
  }

  return text
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
    .slice(0, maxLength)
}

/**
 * Sanitize SQL input (for logging, not for queries - use parameterized queries)
 */
export function sanitizeForLogging(input: string): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  return input
    .replace(/['";\\]/g, "") // Remove SQL injection characters
    .replace(/--/g, "") // Remove SQL comments
    .replace(/\/\*/g, "") // Remove SQL block comments
    .replace(/\*\//g, "")
    .slice(0, 1000)
}

/**
 * Sanitize file name to prevent path traversal
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== "string") {
    return "file"
  }

  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "") // Only allow alphanumeric, dots, dashes, underscores
    .replace(/\.\./g, "") // Remove path traversal attempts
    .replace(/^\./, "") // Remove leading dot
    .slice(0, 255) // Max filename length
}

/**
 * Sanitize URL to prevent open redirects and XSS
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return ""
  }

  try {
    const parsed = new URL(url)
    
    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Invalid protocol")
    }

    // Block javascript: and data: URLs
    if (parsed.protocol === "javascript:" || parsed.protocol === "data:") {
      throw new Error("Dangerous protocol")
    }

    return parsed.toString()
  } catch {
    return ""
  }
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return ""
  }

  return email
    .trim()
    .toLowerCase()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .slice(0, 255) // Max email length
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== "string") {
    return ""
  }

  return phone
    .replace(/[^\d+]/g, "") // Only keep digits and +
    .replace(/^\+/, "+") // Ensure + is at start if present
    .slice(0, 20) // Max phone length
}

/**
 * Sanitize JSON input
 */
export function sanitizeJson<T>(json: string): T | null {
  try {
    const parsed = JSON.parse(json)
    // Recursively sanitize string values
    return sanitizeObject(parsed) as T
  } catch {
    return null
  }
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === "string") {
    return sanitizeText(obj)
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  if (obj && typeof obj === "object") {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeText(key, 100)] = sanitizeObject(value)
    }
    return sanitized
  }
  return obj
}

/**
 * Validate and sanitize file upload
 */
export interface FileUploadValidation {
  allowedTypes: string[]
  maxSize: number // in bytes
  allowedExtensions: string[]
}

export function validateFileUpload(
  file: File,
  options: FileUploadValidation
): { valid: boolean; error?: string } {
  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    }
  }

  // Check file size
  if (file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${options.maxSize / 1024 / 1024}MB`,
    }
  }

  // Check file extension
  const extension = file.name.split(".").pop()?.toLowerCase()
  if (!extension || !options.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension .${extension} is not allowed`,
    }
  }

  // Check for dangerous file names
  const sanitizedName = sanitizeFileName(file.name)
  if (sanitizedName !== file.name) {
    return {
      valid: false,
      error: "File name contains invalid characters",
    }
  }

  return { valid: true }
}

