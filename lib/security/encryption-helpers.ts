/**
 * Encryption Helper Functions
 * Utility functions for manual encryption/decryption when needed
 */

import { encrypt, decrypt, isEncryptionEnabled } from "./encryption"
import { getFieldsToEncrypt } from "./encryption-config"

/**
 * Encrypt a single value
 */
export async function encryptValue(value: string | null | undefined): Promise<string | null | undefined> {
  if (!isEncryptionEnabled()) {
    return value
  }

  if (!value || typeof value !== "string" || value.trim() === "") {
    return value
  }

  try {
    return await encrypt(value)
  } catch (error) {
    console.error("Encryption error:", error)
    throw error
  }
}

/**
 * Decrypt a single value
 */
export async function decryptValue(value: string | null | undefined): Promise<string | null | undefined> {
  if (!isEncryptionEnabled()) {
    return value
  }

  if (!value || typeof value !== "string" || value.trim() === "") {
    return value
  }

  try {
    return await decrypt(value)
  } catch (error) {
    // If decryption fails, might be plaintext (backward compatibility)
    console.warn("Decryption error (may be plaintext):", error)
    return value
  }
}

/**
 * Encrypt object fields based on model configuration
 */
export async function encryptModelFields<T extends Record<string, any>>(
  model: string,
  data: T
): Promise<T> {
  if (!isEncryptionEnabled()) {
    return data
  }

  const fieldsToEncrypt = getFieldsToEncrypt(model)
  if (fieldsToEncrypt.length === 0) {
    return data
  }

  const encrypted = { ...data }

  for (const field of fieldsToEncrypt) {
    if (field in encrypted && encrypted[field] !== null && encrypted[field] !== undefined) {
      if (typeof encrypted[field] === "string" && encrypted[field].trim() !== "") {
        try {
          encrypted[field] = await encrypt(encrypted[field])
        } catch (error) {
          console.error(`Failed to encrypt field ${field}:`, error)
        }
      }
    }
  }

  return encrypted
}

/**
 * Decrypt object fields based on model configuration
 */
export async function decryptModelFields<T extends Record<string, any>>(
  model: string,
  data: T
): Promise<T> {
  if (!isEncryptionEnabled()) {
    return data
  }

  const fieldsToDecrypt = getFieldsToEncrypt(model)
  if (fieldsToDecrypt.length === 0) {
    return data
  }

  const decrypted = { ...data }

  for (const field of fieldsToDecrypt) {
    if (field in decrypted && decrypted[field] !== null && decrypted[field] !== undefined) {
      if (typeof decrypted[field] === "string") {
        try {
          decrypted[field] = await decrypt(decrypted[field])
        } catch (error) {
          // If decryption fails, might be plaintext (backward compatibility)
          console.warn(`Failed to decrypt field ${field} (may be plaintext):`, error)
        }
      }
    }
  }

  return decrypted
}

/**
 * Check if a value is encrypted
 */
export function isEncrypted(value: string): boolean {
  if (!value || typeof value !== "string") {
    return false
  }

  try {
    const decoded = Buffer.from(value, "base64")
    // Encrypted data should have minimum length (salt + iv + tag + data)
    return decoded.length >= 64 // Minimum expected length
  } catch {
    return false
  }
}

