/**
 * Seed Admin User Script
 * 
 * Creates an admin user for testing the new account management system.
 * 
 * Usage:
 *   npx tsx scripts/seed-admin-user.ts
 * 
 * Or with custom credentials:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=YourPassword123! npx tsx scripts/seed-admin-user.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local BEFORE importing PrismaClient
config({ path: resolve(process.cwd(), '.env.local') })

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@forgerdigital.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin123!@#'
  const name = process.env.ADMIN_NAME || 'System Admin'

  console.log('\n🔧 Seeding Admin User...\n')

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (existingUser) {
    console.log(`⚠️  User ${email} already exists.`)
    
    // Update to admin if not already
    if (existingUser.role !== 'SUPER_ADMIN' && existingUser.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: 'SUPER_ADMIN' }
      })
      console.log(`✅ Updated ${email} to SUPER_ADMIN role.`)
    } else {
      console.log(`ℹ️  User already has ${existingUser.role} role.`)
    }
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create admin user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
      isActive: true,
    }
  })

  console.log('✅ Admin user created successfully!\n')
  console.log('📧 Email:', email)
  console.log('🔑 Password:', password)
  console.log('👤 Role: SUPER_ADMIN')
  console.log('\n🔗 Login at: http://localhost:3000/auth/signin')
  console.log('📊 Admin dashboard: http://localhost:3000/admin\n')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

