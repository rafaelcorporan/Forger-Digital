# How to Get Supabase Connection String

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard
**URL:** https://supabase.com/dashboard/project/pqxuxfwgwvyryhhrisnq

### 2. Navigate to Database Settings
- Click **"Project Settings"** (gear icon in left sidebar)
- Click **"Database"** in the settings menu

### 3. Find Connection String Section
- Scroll down to **"Connection string"** section
- You'll see tabs: **"URI"**, **"JDBC"**, **"Golang"**, etc.

### 4. Select URI Tab
- Click the **"URI"** tab
- You'll see a connection string like:
  ```
  postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
  ```

### 5. Copy the Connection String
- Click the **copy icon** next to the connection string
- This is what we need for `DATABASE_URL`

---

## What the Connection String Contains

The connection string includes:
- **Host:** `aws-0-[REGION].pooler.supabase.com` or `[PROJECT-REF].supabase.co`
- **Port:** `6543` (pooler) or `5432` (direct)
- **User:** `postgres.[PROJECT-REF]` or `postgres`
- **Password:** Your database password (embedded in URL)
- **Database:** `postgres`

---

## Alternative: Get Individual Components

If connection string is not available, get these from Dashboard:

1. **Host:** Database Settings → Connection info → Host
2. **Port:** Usually `6543` (pooler) or `5432` (direct)
3. **Database:** Usually `postgres`
4. **User:** Usually `postgres.[PROJECT-REF]`
5. **Password:** Database Settings → Database password (or reset it)

---

## Format for .env.local

Once you have the connection string, it should be:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require"
```

**Note:** Add `?sslmode=require` at the end if not already included.

