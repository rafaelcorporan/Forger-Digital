/**
 * Run Database Migrations Script
 * Executes Prisma migrations to create database tables
 * 
 * Usage: npx tsx scripts/run-migrations.ts
 */

import { execSync } from 'child_process'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

console.log('🔄 Running database migrations...\n')

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment')
  process.exit(1)
}

try {
  // Run migrations
  console.log('Executing: npx prisma migrate deploy\n')
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
  })
  
  console.log('\n✅ Migrations completed successfully!')
  
} catch (error: any) {
  console.error('\n❌ Migration failed!')
  console.error('Error:', error.message)
  process.exit(1)
}

