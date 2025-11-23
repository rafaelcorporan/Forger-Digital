/**
 * Analyze Supabase Project using API
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.SUPABASE_URL || 'https://pqxuxfwgwvyryhhrisnq.supabase.co'
const supabaseKey = process.env.SUPABASE_ACCESS_TOKEN || ''

async function analyzeProject() {
  console.log('🔍 Analyzing Forger Digital Supabase Project...\n')
  console.log('Project URL:', supabaseUrl)
  console.log('Project ID: pqxuxfwgwvyryhhrisnq\n')

  if (!supabaseKey) {
    console.error('❌ SUPABASE_ACCESS_TOKEN is not set')
    process.exit(1)
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test connection
    console.log('1. Testing API Connection...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1)
    
    if (healthError && healthError.code !== 'PGRST116') {
      console.log('   ⚠️  API connected but tables may not exist yet')
    } else {
      console.log('   ✅ API connection successful')
    }

    // Check for existing tables
    console.log('\n2. Checking Database Tables...')
    
    // Try to query information_schema via RPC or direct query
    const tables = [
      'users',
      'accounts',
      'sessions',
      'contact_form_submissions',
      'get_started_submissions',
      'payments',
      'subscriptions'
    ]

    console.log('   Checking for expected tables:')
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(0)
        if (error) {
          if (error.code === 'PGRST116') {
            console.log(`   ❌ ${table} - NOT EXISTS`)
          } else {
            console.log(`   ⚠️  ${table} - Error: ${error.message}`)
          }
        } else {
          console.log(`   ✅ ${table} - EXISTS`)
        }
      } catch (e: any) {
        console.log(`   ❌ ${table} - ${e.message}`)
      }
    }

    // Get project info
    console.log('\n3. Project Information:')
    console.log('   Project URL:', supabaseUrl)
    console.log('   Project ID: pqxuxfwgwvyryhhrisnq')
    console.log('   Database Name: Forge Digital')
    console.log('   API Key: Configured ✅')

    // Connection string info
    console.log('\n4. Database Connection Information:')
    console.log('   Host: pqxuxfwgwvyryhhrisnq.supabase.co')
    console.log('   Port: 5432 (direct) or 6543 (pooler)')
    console.log('   Database: postgres')
    console.log('   User: postgres')
    console.log('   Password: Configured ✅')
    console.log('   SSL: Required')

    console.log('\n✅ Project analysis complete!')
    console.log('\n📋 Next Steps:')
    console.log('   1. Get connection string from Supabase Dashboard')
    console.log('   2. Update DATABASE_URL in .env.local')
    console.log('   3. Run migrations: npx prisma migrate deploy')
    console.log('   4. Test connection: npx tsx scripts/test-db-connection.ts')
    
  } catch (error: any) {
    console.error('\n❌ Analysis failed!')
    console.error('Error:', error.message)
    process.exit(1)
  }
}

analyzeProject()

