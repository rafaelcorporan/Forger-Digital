# How to Get Supabase Connection String

## Quick Steps

1. **Open:** https://supabase.com/dashboard/project/pqxuxfwgwvyryhhrisnq/settings/database

2. **Scroll to:** "Connection string" section

3. **Click:** "URI" tab

4. **Copy:** The entire connection string

5. **Update:** `.env.local` file:
   ```env
   DATABASE_URL="[paste-connection-string-here]"
   ```

6. **Run:** `npx tsx scripts/complete-database-integration.ts`

## That's It!

The script will automatically:
- ✅ Test connection
- ✅ Run migrations
- ✅ Create all tables
- ✅ Test form submissions
- ✅ Verify everything works

**Time:** ~2 minutes after connection string is added
