/**
 * Database Connection Test Script
 * Tests connection to Supabase PostgreSQL database
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Testing database connection...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment')
    process.exit(1)
  }

  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database query successful:', result)
    
    // Check if tables exist
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `
    console.log('\n📊 Existing tables in database:')
    if (tables.length === 0) {
      console.log('  ⚠️  No tables found - migrations may not have been run')
    } else {
      tables.forEach(table => {
        console.log(`  - ${table.tablename}`)
      })
    }
    
    // Check for our specific tables
    const requiredTables = [
      'contact_form_submissions',
      'get_started_submissions',
      'users',
      'payments',
      'subscriptions'
    ]
    
    console.log('\n🔍 Checking required tables:')
    const existingTableNames = tables.map(t => t.tablename)
    requiredTables.forEach(table => {
      if (existingTableNames.includes(table)) {
        console.log(`  ✅ ${table} - EXISTS`)
      } else {
        console.log(`  ❌ ${table} - MISSING`)
      }
    })
    
    console.log('\n✅ Connection test completed successfully!')
    
  } catch (error: any) {
    console.error('\n❌ Database connection failed!')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    if (error.code === 'P1001') {
      console.error('\n💡 Troubleshooting steps:')
      console.error('1. Verify Supabase project is active (not paused)')
      console.error('2. Check if database server is running')
      console.error('3. Verify network/firewall allows connection')
      console.error('4. Check DATABASE_URL format and credentials')
      console.error('5. Try connection pooler port 6543 instead of 5432')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

