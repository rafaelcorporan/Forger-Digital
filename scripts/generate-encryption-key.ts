/**
 * Generate Encryption Key
 * Utility script to generate a secure encryption key
 */

import { generateEncryptionKey } from "../lib/security/encryption"

/**
 * Generate and display encryption key
 */
function main() {
  console.log("\n🔐 Generating Encryption Key...\n")
  
  const key = generateEncryptionKey()
  
  console.log("✅ Encryption key generated successfully!\n")
  console.log("Add this to your .env.local file:\n")
  console.log(`ENCRYPTION_KEY="${key}"\n`)
  console.log("⚠️  IMPORTANT:")
  console.log("   - Keep this key secure and never commit it to version control")
  console.log("   - Store it in a secure key management system for production")
  console.log("   - If you lose this key, encrypted data cannot be decrypted")
  console.log("   - Use different keys for development and production\n")
}

main()

