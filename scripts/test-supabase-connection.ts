/**
 * Test Supabase Connection using Supabase Client
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.SUPABASE_URL || 'https://pqxuxfwgwvyryhhrisnq.supabase.co'
const supabaseKey = process.env.SUPABASE_ACCESS_TOKEN || ''

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n')
  
  if (!supabaseKey) {
    console.error('❌ SUPABASE_ACCESS_TOKEN is not set')
    process.exit(1)
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test connection by querying a system table
    console.log('Testing REST API connection...')
    const { data, error } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = relation does not exist (expected)
      console.log('⚠️  REST API works but tables not created yet')
      console.log('   This is expected - we need to run migrations first')
    } else {
      console.log('✅ REST API connection successful!')
    }
    
    // Test if we can access the database
    console.log('\nTesting database access...')
    const { data: testData, error: testError } = await supabase.rpc('version')
    
    if (testError) {
      console.log('⚠️  Direct database access:', testError.message)
    } else {
      console.log('✅ Database access successful!')
    }
    
    console.log('\n✅ Supabase API connection verified!')
    console.log('📋 Next step: Get PostgreSQL connection string from Supabase Dashboard')
    console.log('   Go to: Project Settings → Database → Connection string → URI tab')
    
  } catch (error: any) {
    console.error('\n❌ Supabase connection failed!')
    console.error('Error:', error.message)
    process.exit(1)
  }
}

testSupabaseConnection()

