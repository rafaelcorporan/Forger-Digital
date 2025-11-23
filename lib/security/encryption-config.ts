/**
 * Encryption Configuration
 * Defines which fields should be encrypted for each model
 */

/**
 * Fields that should be encrypted for each model
 */
export const EncryptionFields = {
  // User model
  User: {
    // Note: password is already hashed with bcrypt, no encryption needed
    // email is used for login, so we might want to keep it searchable
    // For now, we'll encrypt name if it contains sensitive info
    fields: [] as string[], // Email needs to be searchable for login
  },

  // Account model (OAuth tokens)
  Account: {
    fields: ["refresh_token", "access_token", "id_token"],
  },

  // Contact form submissions
  ContactFormSubmission: {
    fields: ["firstName", "lastName", "email", "phone", "message"],
  },

  // Get started form submissions
  GetStartedSubmission: {
    fields: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "projectDescription",
      "budget",
    ],
  },

  // Payment model
  Payment: {
    // metadata may contain sensitive info, but it's JSON
    // We'll handle JSON encryption separately if needed
    fields: [] as string[],
  },

  // Subscription model
  Subscription: {
    // metadata may contain sensitive info, but it's JSON
    fields: [] as string[],
  },
}

/**
 * Check if a field should be encrypted for a model
 */
export function shouldEncryptField(
  model: string,
  field: string
): boolean {
  const modelConfig = EncryptionFields[model as keyof typeof EncryptionFields]
  if (!modelConfig) {
    return false
  }

  return modelConfig.fields.includes(field)
}

/**
 * Get fields to encrypt for a model
 */
export function getFieldsToEncrypt(model: string): string[] {
  const modelConfig = EncryptionFields[model as keyof typeof EncryptionFields]
  if (!modelConfig) {
    return []
  }

  return modelConfig.fields
}

