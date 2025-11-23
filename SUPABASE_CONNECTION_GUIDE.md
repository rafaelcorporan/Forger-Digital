# Supabase Connection Establishment Guide

## What's Necessary to Establish Connection

### ✅ Already Configured (Complete)

1. **Connection String Format** ✅
   - DATABASE_URL in `.env.local`
   - SSL mode configured (`sslmode=require`)
   - Correct host, port, and credentials

2. **Prisma Configuration** ✅
   - `prisma.config.ts` loads `.env.local`
   - Prisma Client generated successfully
   - Schema defined correctly

3. **Code Implementation** ✅
   - API routes ready to save to database
   - Migration files created
   - Test scripts prepared

---

## Required Actions to Establish Connection

### 1. **Verify Supabase Project Status** (CRITICAL)

**Most Common Issue:** Free tier Supabase projects pause after 7 days of inactivity.

**Steps:**
1. Go to: https://supabase.com/dashboard/project/pqxuxfwgwvyryhhrisnq
2. Sign in to your Supabase account
3. Check project status:
   - ✅ **Active** = Project is running (connection should work)
   - ⏸️ **Paused** = Project is paused (needs reactivation)

**If Paused:**
- Click **"Restore"** or **"Resume"** button
- Wait 1-2 minutes for project to activate
- Project will show as "Active" when ready

---

### 2. **Verify Database Credentials**

**Current Configuration:**
- **Host:** `pqxuxfwgwvyryhhrisnq.supabase.co`
- **Port:** `5432` (direct) or `6543` (connection pooler)
- **Database:** `postgres`
- **User:** `postgres`
- **Password:** `ly7F^FGspVfq8kz3]`

**To Verify:**
1. Go to Supabase Dashboard → Project Settings → Database
2. Check "Connection string" section
3. Verify password matches (can reset if needed)
4. Note the connection pooler URL (port 6543)

---

### 3. **Test Connection Methods**

#### Method A: Direct Connection (Port 5432)

**Test with psql (if installed):**
```bash
psql "postgresql://postgres:ly7F%5EFGspVfq8kz3]@pqxuxfwgwvyryhhrisnq.supabase.co:5432/postgres?sslmode=require"
```

**Test with Prisma:**
```bash
npx tsx scripts/test-db-connection.ts
```

#### Method B: Connection Pooler (Port 6543) - Recommended

**Why use pooler:**
- Better for serverless environments
- Handles connection limits better
- More reliable for production

**Update `.env.local`:**
```env
DATABASE_URL="postgresql://postgres:ly7F%5EFGspVfq8kz3]@pqxuxfwgwvyryhhrisnq.supabase.co:6543/postgres?schema=public&sslmode=require"
```

**Test:**
```bash
npx tsx scripts/test-db-connection.ts
```

---

### 4. **Password URL Encoding** (If Direct Connection Fails)

**Special Characters in Password:**
- `^` = `%5E`
- `]` = `%5D`

**Current Password:** `ly7F^FGspVfq8kz3]`  
**URL Encoded:** `ly7F%5EFGspVfq8kz3%5D`

**Try with encoded password:**
```env
DATABASE_URL="postgresql://postgres:ly7F%5EFGspVfq8kz3%5D@pqxuxfwgwvyryhhrisnq.supabase.co:5432/postgres?schema=public&sslmode=require"
```

---

### 5. **Network/Firewall Checks**

**If connection still fails:**

1. **Check Local Firewall:**
   ```bash
   # Test if port is accessible
   nc -zv pqxuxfwgwvyryhhrisnq.supabase.co 5432
   nc -zv pqxuxfwgwvyryhhrisnq.supabase.co 6543
   ```

2. **Check IP Restrictions:**
   - Go to Supabase Dashboard → Settings → Database
   - Check "Connection Pooling" → "Allowed IPs"
   - Ensure your IP is not blocked
   - For development: Allow all IPs (0.0.0.0/0)

3. **VPN/Proxy Issues:**
   - Disable VPN if active
   - Check if corporate firewall blocks port 5432

---

### 6. **Alternative: Get New Connection String from Supabase**

**Steps:**
1. Go to Supabase Dashboard → Project Settings → Database
2. Scroll to "Connection string" section
3. Select "URI" format
4. Copy the connection string
5. Update `.env.local` with the new string

**Format from Supabase:**
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
```

---

## Quick Diagnostic Checklist

Run these checks in order:

```bash
# 1. Check if project is active
# → Visit: https://supabase.com/dashboard/project/pqxuxfwgwvyryhhrisnq

# 2. Test connection with our script
npx tsx scripts/test-db-connection.ts

# 3. If fails, try connection pooler (port 6543)
# → Update .env.local with port 6543
# → Run test again

# 4. If still fails, try URL-encoded password
# → Update .env.local with encoded password
# → Run test again

# 5. Check network connectivity
nc -zv pqxuxfwgwvyryhhrisnq.supabase.co 5432
nc -zv pqxuxfwgwvyryhhrisnq.supabase.co 6543
```

---

## Once Connection is Established

### Step 1: Verify Connection
```bash
npx tsx scripts/test-db-connection.ts
```

**Expected Output:**
```
✅ Database connection successful!
✅ Database query successful
📊 Existing tables in database:
  ✅ contact_form_submissions - EXISTS
  ✅ get_started_submissions - EXISTS
  ...
```

### Step 2: Run Migrations
```bash
npx tsx scripts/run-migrations.ts
```

### Step 3: Test Form Submissions
```bash
npx tsx scripts/test-form-submissions.ts
```

---

## Common Issues & Solutions

### Issue 1: "Project is Paused"
**Solution:** Reactivate project in Supabase Dashboard

### Issue 2: "Connection Timeout"
**Solution:** 
- Try connection pooler (port 6543)
- Check firewall settings
- Verify IP is not blocked

### Issue 3: "Authentication Failed"
**Solution:**
- Verify password in Supabase Dashboard
- Reset password if needed
- Update `.env.local` with new password

### Issue 4: "SSL Required"
**Solution:** Ensure `sslmode=require` is in connection string

### Issue 5: "Special Characters in Password"
**Solution:** URL encode special characters (`^` → `%5E`, `]` → `%5D`)

---

## Summary

**What You Need:**
1. ✅ Active Supabase project (not paused)
2. ✅ Correct database credentials
3. ✅ Network access to Supabase (ports 5432 or 6543)
4. ✅ SSL enabled in connection string
5. ✅ Proper password encoding (if special characters)

**Most Likely Issue:** Project is paused - reactivate in Supabase Dashboard

**Next Step:** Visit https://supabase.com/dashboard/project/pqxuxfwgwvyryhhrisnq and check project status

---

**Current Status:** All code ready, awaiting Supabase project activation

