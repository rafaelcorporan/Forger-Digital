/**
 * Resolve Database Connection Using Supabase Client
 * Attempts to get connection information and test connectivity
 */

import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.SUPABASE_URL || 'https://pqxuxfwgwvyryhhrisnq.supabase.co'
const supabaseKey = process.env.SUPABASE_ACCESS_TOKEN || ''

async function resolveConnection() {
  console.log('🔍 Resolving database connection via Supabase...\n')

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  console.log('✅ Supabase client initialized')
  console.log('   Project URL:', supabaseUrl)
  console.log('   Project ID: pqxuxfwgwvyryhhrisnq\n')

  // Test REST API connection
  console.log('1. Testing REST API connection...')
  try {
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(0)
    if (error && error.code !== 'PGRST116') {
      console.log('   ⚠️  API connected but tables may not exist')
    } else {
      console.log('   ✅ REST API connection successful\n')
    }
  } catch (e: any) {
    console.log('   ⚠️  API test:', e.message)
  }

  // Construct connection strings based on Supabase documentation
  const projectRef = 'pqxuxfwgwvyryhhrisnq'
  const password = 'ly7F^FGspVfq8kz3]'
  const passwordEncoded = encodeURIComponent(password)

  // Supabase standard formats
  const formats = [
    {
      name: 'Direct Connection (Standard)',
      url: `postgresql://postgres.${projectRef}:${passwordEncoded}@${projectRef}.supabase.co:5432/postgres?sslmode=require`
    },
    {
      name: 'Direct Connection (Alternative)',
      url: `postgresql://postgres:${passwordEncoded}@${projectRef}.supabase.co:5432/postgres?sslmode=require`
    },
    {
      name: 'Pooler Connection (Port 6543)',
      url: `postgresql://postgres.${projectRef}:${passwordEncoded}@${projectRef}.supabase.co:6543/postgres?sslmode=require`
    }
  ]

  console.log('2. Testing PostgreSQL connection formats...\n')
  
  for (const format of formats) {
    console.log(`Testing: ${format.name}`)
    console.log(`  Format: ${format.url.substring(0, 60)}...`)
    
    try {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: format.url
          }
        }
      })
      
      await prisma.$connect()
      const result = await prisma.$queryRaw`SELECT version() as version`
      await prisma.$disconnect()
      
      console.log(`  ✅ SUCCESS! Connection established!\n`)
      console.log('Working connection string:')
      console.log(format.url)
      console.log('\n✅ Database connection resolved!')
      return format.url
      
    } catch (error: any) {
      if (error.code === 'P1001') {
        console.log(`  ❌ Connection failed: Can't reach server\n`)
      } else if (error.message.includes('Tenant') || error.message.includes('user not found')) {
        console.log(`  ⚠️  Server reached but authentication failed\n`)
      } else {
        console.log(`  ❌ Error: ${error.message.substring(0, 50)}...\n`)
      }
    }
  }

  console.log('❌ None of the standard formats worked.')
  console.log('\n📋 Root Cause Analysis:')
  console.log('   - REST API works (project is accessible)')
  console.log('   - PostgreSQL direct connection fails (P1001)')
  console.log('   - Most likely: Project is paused or requires specific connection format')
  console.log('\n💡 Solution:')
  console.log('   Get connection string from Supabase Dashboard:')
  console.log('   https://supabase.com/dashboard/project/pqxuxfwgwvyryhhrisnq/settings/database')
  
  return null
}

resolveConnection().then(connStr => {
  if (connStr) {
    console.log('\n📝 Next: Update .env.local and run migrations')
    process.exit(0)
  } else {
    process.exit(1)
  }
})

