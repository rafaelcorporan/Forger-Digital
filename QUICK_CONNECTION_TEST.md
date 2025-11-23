## Quick Connection Test Commands

# Test direct connection (port 5432)
npx tsx scripts/test-db-connection.ts

# Test with connection pooler (update .env.local first to use port 6543)
# Then run:
npx tsx scripts/test-db-connection.ts

# Check if Supabase host is reachable
ping -c 3 pqxuxfwgwvyryhhrisnq.supabase.co

# Test port connectivity (if nc/netcat installed)
nc -zv pqxuxfwgwvyryhhrisnq.supabase.co 5432
nc -zv pqxuxfwgwvyryhhrisnq.supabase.co 6543
