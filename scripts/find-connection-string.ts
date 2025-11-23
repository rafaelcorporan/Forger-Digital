/**
 * Find Working Supabase Connection String
 * Tests multiple connection string formats to find the working one
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const password = 'ly7F^FGspVfq8kz3]'
const passwordEncoded = 'ly7F%5EFGspVfq8kz3%5D'
const projectRef = 'pqxuxfwgwvyryhhrisnq'

// Try different connection string formats
const connectionStrings = [
  // Format 1: Direct with project ref
  `postgresql://postgres:${passwordEncoded}@${projectRef}.supabase.co:5432/postgres?sslmode=require`,
  
  // Format 2: Pooler with project ref
  `postgresql://postgres:${passwordEncoded}@${projectRef}.supabase.co:6543/postgres?sslmode=require`,
  
  // Format 3: Pooler format with aws-0 (common regions)
  `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require`,
  `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require`,
  `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require`,
  `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`,
  
  // Format 4: Direct pooler
  `postgresql://postgres:${passwordEncoded}@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require`,
  
  // Format 5: With schema parameter
  `postgresql://postgres:${passwordEncoded}@${projectRef}.supabase.co:5432/postgres?schema=public&sslmode=require`,
  `postgresql://postgres:${passwordEncoded}@${projectRef}.supabase.co:6543/postgres?schema=public&sslmode=require`,
]

async function testConnection(connectionString: string, formatName: string) {
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionString
        }
      }
    })
    
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    await prisma.$disconnect()
    
    return { success: true, result }
  } catch (error: any) {
    return { success: false, error: error.message, code: error.code }
  }
}

async function findWorkingConnection() {
  console.log('🔍 Testing multiple Supabase connection string formats...\n')
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const connStr = connectionStrings[i]
    const formatName = `Format ${i + 1}`
    
    console.log(`Testing ${formatName}...`)
    console.log(`  Host: ${connStr.match(/@([^:]+)/)?.[1] || 'unknown'}`)
    console.log(`  Port: ${connStr.match(/:(\d+)\//)?.[1] || 'unknown'}`)
    
    const result = await testConnection(connStr, formatName)
    
    if (result.success) {
      console.log(`\n✅ SUCCESS! Working connection found: ${formatName}\n`)
      console.log('Connection String:')
      console.log(connStr)
      console.log('\n✅ This connection string works!')
      return connStr
    } else {
      console.log(`  ❌ Failed: ${result.code || result.error}\n`)
    }
  }
  
  console.log('\n❌ None of the tested formats worked.')
  console.log('📋 You need to get the connection string from Supabase Dashboard:')
  console.log('   https://supabase.com/dashboard/project/pqxuxfwgwvyryhhrisnq/settings/database')
  return null
}

findWorkingConnection().then(connStr => {
  if (connStr) {
    console.log('\n📝 Next step: Update .env.local with this connection string')
    process.exit(0)
  } else {
    process.exit(1)
  }
})

