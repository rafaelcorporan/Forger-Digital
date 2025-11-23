/**
 * Prisma Encryption Middleware
 * Automatically encrypts/decrypts sensitive fields
 */

import { Prisma } from "@prisma/client"
import { encrypt, decrypt, isEncryptionEnabled } from "./security/encryption"
import {
  getFieldsToEncrypt,
  shouldEncryptField,
} from "./security/encryption-config"

/**
 * Prisma middleware for automatic encryption/decryption
 */
export function encryptionMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    if (!isEncryptionEnabled()) {
      return next(params)
    }

    const model = params.model
    if (!model) {
      return next(params)
    }

    const fieldsToEncrypt = getFieldsToEncrypt(model)
    if (fieldsToEncrypt.length === 0) {
      return next(params)
    }

    // Encrypt on write operations
    if (params.action === "create" || params.action === "update" || params.action === "upsert") {
      if (params.args.data) {
        // Handle single object
        if (typeof params.args.data === "object" && !Array.isArray(params.args.data)) {
          for (const field of fieldsToEncrypt) {
            if (field in params.args.data && params.args.data[field] !== null && params.args.data[field] !== undefined) {
              if (typeof params.args.data[field] === "string" && params.args.data[field].trim() !== "") {
                try {
                  params.args.data[field] = await encrypt(params.args.data[field])
                } catch (error) {
                  console.error(`Failed to encrypt field ${field}:`, error)
                  // Continue without encryption if it fails
                }
              }
            }
          }
        }

        // Handle nested create/update
        if (params.args.data.create) {
          for (const field of fieldsToEncrypt) {
            if (field in params.args.data.create && typeof params.args.data.create[field] === "string") {
              try {
                params.args.data.create[field] = await encrypt(params.args.data.create[field])
              } catch (error) {
                console.error(`Failed to encrypt nested field ${field}:`, error)
              }
            }
          }
        }

        if (params.args.data.update) {
          for (const field of fieldsToEncrypt) {
            if (field in params.args.data.update && typeof params.args.data.update[field] === "string") {
              try {
                params.args.data.update[field] = await encrypt(params.args.data.update[field])
              } catch (error) {
                console.error(`Failed to encrypt nested update field ${field}:`, error)
              }
            }
          }
        }
      }
    }

    // Execute the operation
    const result = await next(params)

    // Decrypt on read operations
    if (result) {
      if (Array.isArray(result)) {
        // Handle array of results
        for (const item of result) {
          if (item && typeof item === "object") {
            for (const field of fieldsToEncrypt) {
              if (field in item && typeof item[field] === "string") {
                try {
                  item[field] = await decrypt(item[field])
                } catch (error) {
                  // If decryption fails, field might be plaintext (backward compatibility)
                  console.warn(`Failed to decrypt field ${field}, may be plaintext:`, error)
                }
              }
            }
          }
        }
      } else if (typeof result === "object") {
        // Handle single object
        for (const field of fieldsToEncrypt) {
          if (field in result && typeof result[field] === "string") {
            try {
              result[field] = await decrypt(result[field])
            } catch (error) {
              // If decryption fails, field might be plaintext (backward compatibility)
              console.warn(`Failed to decrypt field ${field}, may be plaintext:`, error)
            }
          }
        }
      }
    }

    return result
  }
}

