import { PrismaClient } from '@prisma/client'
import { encryptionMiddleware } from './prisma-encryption'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Add encryption middleware if encryption is enabled
if (process.env.ENCRYPTION_KEY && typeof prisma.$use === 'function') {
  try {
    prisma.$use(encryptionMiddleware())
  } catch (error) {
    console.warn('Failed to apply encryption middleware:', error)
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

