/**
 * Test Different Username Formats for Supabase Pooler
 */

import { PrismaClient } from '@prisma/client'

const passwordEncoded = 'ly7F%5EFGspVfq8kz3%5D'
const projectRef = 'pqxuxfwgwvyryhhrisnq'

// Try different username formats with pooler
const usernameFormats = [
  `postgres.${projectRef}`,
  `postgres`,
  `${projectRef}`,
  `postgresql.${projectRef}`,
]

const regions = ['us-east-1', 'us-west-1', 'eu-west-1', 'ap-southeast-1']

async function testConnection(username: string, region: string) {
  const connStr = `postgresql://${username}:${passwordEncoded}@aws-0-${region}.pooler.supabase.com:6543/postgres?sslmode=require`
  
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: connStr
        }
      }
    })
    
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT version()`
    await prisma.$disconnect()
    
    return { success: true, result, connStr }
  } catch (error: any) {
    return { success: false, error: error.message, code: error.code, connStr }
  }
}

async function findWorkingFormat() {
  console.log('🔍 Testing username formats with Supabase pooler...\n')
  
  for (const username of usernameFormats) {
    for (const region of regions) {
      console.log(`Testing: ${username} @ ${region}...`)
      const result = await testConnection(username, region)
      
      if (result.success) {
        console.log(`\n✅ SUCCESS! Working connection found!\n`)
        console.log('Connection String:')
        console.log(result.connStr)
        return result.connStr
      } else {
        if (result.code === 'P1001') {
          console.log(`  ❌ Connection failed (P1001)`)
        } else if (result.error.includes('Tenant') || result.error.includes('user not found')) {
          console.log(`  ⚠️  Server reached but auth failed`)
        } else {
          console.log(`  ❌ ${result.error.substring(0, 60)}...`)
        }
      }
    }
  }
  
  return null
}

findWorkingFormat().then(connStr => {
  if (connStr) {
    console.log('\n✅ Found working connection string!')
    process.exit(0)
  } else {
    console.log('\n❌ Could not find working format automatically.')
    console.log('📋 Need connection string from Supabase Dashboard')
    process.exit(1)
  }
})

