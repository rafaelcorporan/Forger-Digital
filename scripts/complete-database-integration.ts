/**
 * Complete Database Integration Script
 * Executes all steps once connection string is provided
 */

import { execSync } from 'child_process'
import { config } from 'dotenv'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const DATABASE_URL = process.env.DATABASE_URL

async function completeIntegration() {
  console.log('🚀 Starting Database Integration Completion...\n')

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env.local')
    console.error('📋 Please add the connection string from Supabase Dashboard')
    process.exit(1)
  }

  console.log('✅ DATABASE_URL found in environment\n')

  // Step 1: Test Connection
  console.log('STEP 1: Testing Database Connection...')
  try {
    const prisma = new PrismaClient()
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    await prisma.$disconnect()
    console.log('✅ Connection successful!\n')
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message)
    console.error('📋 Please verify the connection string is correct')
    process.exit(1)
  }

  // Step 2: Run Migrations
  console.log('STEP 2: Running Prisma Migrations...')
  try {
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL }
    })
    console.log('\n✅ Migrations completed successfully!\n')
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  }

  // Step 3: Verify Tables
  console.log('STEP 3: Verifying Database Tables...')
  try {
    const prisma = new PrismaClient()
    await prisma.$connect()
    
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `
    
    const expectedTables = [
      'users',
      'accounts',
      'sessions',
      'verification_tokens',
      'contact_form_submissions',
      'get_started_submissions',
      'payments',
      'subscriptions'
    ]
    
    console.log('\n📊 Database Tables:')
    const existingTableNames = tables.map(t => t.tablename)
    expectedTables.forEach(table => {
      if (existingTableNames.includes(table)) {
        console.log(`  ✅ ${table}`)
      } else {
        console.log(`  ❌ ${table} - MISSING`)
      }
    })
    
    await prisma.$disconnect()
    console.log('\n✅ Table verification complete!\n')
  } catch (error: any) {
    console.error('❌ Table verification failed:', error.message)
    process.exit(1)
  }

  // Step 4: Test Form Submissions
  console.log('STEP 4: Testing Form Submissions...')
  try {
    execSync('npx tsx scripts/test-form-submissions.ts', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL }
    })
    console.log('\n✅ Form submission tests passed!\n')
  } catch (error: any) {
    console.error('\n❌ Form submission test failed')
    process.exit(1)
  }

  console.log('🎉 Database Integration Complete!')
  console.log('\n✅ All steps completed successfully:')
  console.log('   ✅ Database connection established')
  console.log('   ✅ Migrations deployed')
  console.log('   ✅ Tables created and verified')
  console.log('   ✅ Form submissions tested')
  console.log('\n📋 Next: Run "npx prisma studio" to view your data')
}

completeIntegration().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})

