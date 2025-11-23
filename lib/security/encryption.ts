/**
 * Data Encryption at Rest
 * AES-256-GCM encryption for sensitive data fields
 */

import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto"
import { promisify } from "util"

const scryptAsync = promisify(scrypt)

/**
 * Encryption configuration
 */
const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32 // 32 bytes = 256 bits
const IV_LENGTH = 16 // 16 bytes for GCM
const SALT_LENGTH = 32 // 32 bytes for key derivation
const TAG_LENGTH = 16 // 16 bytes for GCM authentication tag

/**
 * Get encryption key from environment
 */
function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error(
      "ENCRYPTION_KEY environment variable is required for data encryption"
    )
  }

  // Validate key length (should be at least 32 bytes when base64 decoded)
  try {
    const decoded = Buffer.from(key, "base64")
    if (decoded.length < KEY_LENGTH) {
      throw new Error(
        `ENCRYPTION_KEY must be at least ${KEY_LENGTH} bytes (base64 encoded)`
      )
    }
    return key
  } catch (error) {
    throw new Error("ENCRYPTION_KEY must be valid base64 encoded string")
  }
}

/**
 * Derive encryption key from master key and salt
 */
async function deriveKey(
  masterKey: string,
  salt: Buffer
): Promise<Buffer> {
  const masterKeyBuffer = Buffer.from(masterKey, "base64")
  const derivedKey = (await scryptAsync(
    masterKeyBuffer,
    salt,
    KEY_LENGTH
  )) as Buffer
  return derivedKey
}

/**
 * Encrypt data using AES-256-GCM
 */
export async function encrypt(plaintext: string): Promise<string> {
  if (!plaintext || plaintext.trim() === "") {
    return plaintext // Don't encrypt empty strings
  }

  try {
    const masterKey = getEncryptionKey()

    // Generate random salt and IV
    const salt = randomBytes(SALT_LENGTH)
    const iv = randomBytes(IV_LENGTH)

    // Derive key from master key and salt
    const key = await deriveKey(masterKey, salt)

    // Create cipher
    const cipher = createCipheriv(ALGORITHM, key, iv)

    // Encrypt data
    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ])

    // Get authentication tag
    const tag = cipher.getAuthTag()

    // Combine salt + iv + tag + encrypted data
    const combined = Buffer.concat([salt, iv, tag, encrypted])

    // Return base64 encoded
    return combined.toString("base64")
  } catch (error: any) {
    console.error("Encryption error:", error)
    throw new Error(`Failed to encrypt data: ${error.message}`)
  }
}

/**
 * Decrypt data using AES-256-GCM
 */
export async function decrypt(encryptedData: string): Promise<string> {
  if (!encryptedData || encryptedData.trim() === "") {
    return encryptedData // Empty string, return as-is
  }

  // Check if data is encrypted (base64 format with minimum length)
  // If it doesn't look like encrypted data, return as-is (for backward compatibility)
  try {
    const combined = Buffer.from(encryptedData, "base64")

    // Minimum length check (salt + iv + tag + at least 1 byte of data)
    if (combined.length < SALT_LENGTH + IV_LENGTH + TAG_LENGTH + 1) {
      // Likely not encrypted, return as-is
      return encryptedData
    }

    const masterKey = getEncryptionKey()

    // Extract components
    const salt = combined.subarray(0, SALT_LENGTH)
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    const tag = combined.subarray(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH
    )
    const encrypted = combined.subarray(
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH
    )

    // Derive key from master key and salt
    const key = await deriveKey(masterKey, salt)

    // Create decipher
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    // Decrypt data
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ])

    return decrypted.toString("utf8")
  } catch (error: any) {
    // If decryption fails, it might be plaintext (backward compatibility)
    // Log error but return original data
    console.warn("Decryption error (may be plaintext):", error.message)
    return encryptedData
  }
}

/**
 * Check if encryption is enabled
 */
export function isEncryptionEnabled(): boolean {
  return !!process.env.ENCRYPTION_KEY
}

/**
 * Encrypt multiple fields
 */
export async function encryptFields(
  data: Record<string, any>,
  fieldsToEncrypt: string[]
): Promise<Record<string, any>> {
  if (!isEncryptionEnabled()) {
    return data // Encryption disabled, return as-is
  }

  const encrypted = { ...data }

  for (const field of fieldsToEncrypt) {
    if (field in encrypted && encrypted[field] !== null && encrypted[field] !== undefined) {
      if (typeof encrypted[field] === "string") {
        encrypted[field] = await encrypt(encrypted[field])
      }
    }
  }

  return encrypted
}

/**
 * Decrypt multiple fields
 */
export async function decryptFields(
  data: Record<string, any>,
  fieldsToDecrypt: string[]
): Promise<Record<string, any>> {
  if (!isEncryptionEnabled()) {
    return data // Encryption disabled, return as-is
  }

  const decrypted = { ...data }

  for (const field of fieldsToDecrypt) {
    if (field in decrypted && decrypted[field] !== null && decrypted[field] !== undefined) {
      if (typeof decrypted[field] === "string") {
        decrypted[field] = await decrypt(decrypted[field])
      }
    }
  }

  return decrypted
}

/**
 * Generate encryption key (for setup)
 */
export function generateEncryptionKey(): string {
  return randomBytes(KEY_LENGTH).toString("base64")
}

