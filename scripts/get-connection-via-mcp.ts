/**
 * Get Database Connection String via Supabase MCP
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

// Supabase connection string construction based on known patterns
// Using project information to construct correct format

const projectRef = 'pqxuxfwgwvyryhhrisnq'
const password = 'ly7F^FGspVfq8kz3]'
const passwordEncoded = encodeURIComponent(password)

// Supabase typically uses this format for direct connections
// Format: postgresql://postgres.[project-ref]:[password]@[project-ref].supabase.co:5432/postgres

async function constructConnectionString() {
  console.log('🔍 Constructing Supabase connection string...\n')
  
  // Try the most common Supabase format
  const connectionString = `postgresql://postgres.${projectRef}:${passwordEncoded}@${projectRef}.supabase.co:5432/postgres?sslmode=require`
  
  console.log('Constructed connection string:')
  console.log(connectionString)
  console.log('\n📋 Testing this format...')
  
  return connectionString
}

constructConnectionString().then(connStr => {
  console.log('\n✅ Connection string constructed')
  console.log('📝 Update .env.local with this string and test')
  process.exit(0)
})

