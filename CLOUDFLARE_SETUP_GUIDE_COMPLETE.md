# Complete Cloudflare Pages Setup Guide - Step-by-Step

## ✅ Pre-Requirements (Already Done!)

- ✅ GitHub repository: `rafaelcorporan/Forger-Digital` (public)
- ✅ All code pushed to `main` branch
- ✅ `package.json` fixed (all build tools in `dependencies`)
- ✅ Commit `c971af0` is the latest with all fixes

---

## PHASE 1: CREATE THE PROJECT

### Step 1.1: Navigate to Cloudflare Pages

1. Go to: https://dash.cloudflare.com
2. Click **"Workers & Pages"** in the left sidebar
3. Click **"Create application"** button at the top

### Step 1.2: Select Pages (NOT Workers!)

1. You'll see two tabs: **"Workers"** and **"Pages"**
2. Click **"Pages"** tab
3. Click **"Connect to Git"** button (NOT "Upload assets")

### Step 1.3: Authorize GitHub

1. If asked, click **"Connect GitHub"**
2. A popup will open asking for authorization
3. Click **"Authorize Cloudflare"**
4. Select **"All repositories"** or just **"rafaelcorporan/Forger-Digital"**
5. Click **"Save"**

### Step 1.4: Select Repository

1. You'll see a list of your GitHub repositories
2. Find and click **"rafaelcorporan/Forger-Digital"**
3. Click **"Begin setup"** button

---

## PHASE 2: CONFIGURE BUILD SETTINGS

### Step 2.1: Fill in Project Information

```
Project name: forger-digital
Production branch: main
```

### Step 2.2: Build Settings

```
Framework preset: None (or Next.js if available)
Build command: npm run build
Build output directory: (leave default - Cloudflare auto-detects .next)
Root directory: /
```

### Step 2.3: Advanced Settings (Optional)

```
☐ Builds for non-production branches
  → UNCHECK this (keep it simple for now)
  
Path: /
  → Leave as default (project is at root of repo)
```

### Step 2.4: Save and Deploy

1. **DO NOT add environment variables yet!**
2. Click **"Save and Deploy"** button
3. Cloudflare will start the first build

---

## PHASE 3: FIRST BUILD WILL FAIL (EXPECTED!)

### What Will Happen:

```
✅ Initializing build environment... (5s)
✅ Cloning repository... (30s)
✅ Installing tools and dependencies... (1m 20s)
  └─ added 468 packages ✅
✅ Generated Prisma Client ✅
✅ Compiled successfully in 20.5s ✅
❌ Building application... (48s)
  └─ Error: STRIPE_SECRET_KEY is not set
```

**This is EXPECTED and NORMAL!**

### Why It Fails:

- Your Next.js app pre-renders pages at build time
- Pre-rendering needs environment variables
- We haven't added them yet
- So the build fails

### What To Do:

1. ✅ Wait for the first build to fail (2-3 minutes)
2. ✅ Don't panic - this is expected!
3. ✅ Now we'll add environment variables
4. ✅ Then retry the build

---

## PHASE 4: ADD ALL ENVIRONMENT VARIABLES

### Step 4.1: Navigate to Environment Variables

1. While still on the project page, click **"Settings"** tab at the top
2. Click **"Environment variables"** in the left sidebar
3. You'll see an empty list (no variables yet)

### Step 4.2: Add Each Variable

For EACH of the 21 variables below, do this:

1. Click **"+ Add variable"** button
2. Fill in:
   - **Variable name:** (copy from list below)
   - **Value:** (copy from your `.env.local` file)
   - **Environment:** ☑ **Production** ☐ Preview
3. Click **"Add variable"** (or **"Save"**)
4. Repeat for the next variable

### Step 4.3: Complete List of Variables

**CRITICAL (Required for build):**
```
1. AUTH_SECRET = [copy from .env.local]
2. DATABASE_URL = [your Supabase connection string]
3. ENCRYPTION_KEY = [copy from .env.local]
4. NEXTAUTH_URL = https://forger-digital.pages.dev
5. STRIPE_SECRET_KEY = [copy from .env.local]
```

**SMTP (Email functionality):**
```
6. SMTP_FROM_EMAIL = hello@forgerdigital.com
7. SMTP_FROM_NAME = Forger Digital
8. SMTP_HOST = smtp.gmail.com
9. SMTP_PASSWORD = gioytymruerwpjzk
10. SMTP_PORT = 587
11. SMTP_USER = hello@forgerdigital.com
```

**STRIPE (Payment functionality):**
```
12. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [copy from .env.local]
13. STRIPE_ACCOUNT_ID = [copy from .env.local]
14. STRIPE_PUBLISHABLE_KEY = [copy from .env.local]
15. STRIPE_WEBHOOK_SECRET = [copy from .env.local]
```

**SUPABASE (Database - optional if DATABASE_URL is set):**
```
16. SUPABASE_ACCESS_TOKEN = [copy from .env.local]
17. SUPABASE_DB_NAME = [copy from .env.local]
18. SUPABASE_DB_PASSWORD = [copy from .env.local]
19. SUPABASE_MCP_URL = [copy from .env.local]
20. SUPABASE_PROJECT_ID = [copy from .env.local]
21. SUPABASE_URL = [copy from .env.local]
```

### Step 4.4: Save All Variables

1. After adding ALL variables, scroll to the bottom
2. Click the final **"Save"** button
3. Variables are now configured!

---

## PHASE 5: RETRY BUILD - SITE GOES LIVE!

### Step 5.1: Navigate to Deployments

1. Click **"Deployments"** tab at the top
2. You'll see the failed build from Phase 3
3. Look for **"Retry deployment"** button

### Step 5.2: Retry the Build

1. Click **"Retry deployment"** button
2. Cloudflare will start a NEW build
3. This time WITH all environment variables!

### Step 5.3: Wait for Success

**Expected build time:** 5-10 minutes

**Expected log:**
```
✅ Initializing build environment... (5s)
✅ Cloning repository... (30s)
✅ Installing tools and dependencies... (1m 20s)
  └─ added 468 packages ✅
✅ Generated Prisma Client ✅
✅ Compiled successfully ✅
✅ Building application... ✅
  └─ Collecting page data... ✅
  └─ All pages pre-rendered! ✅
✅ Deploying to Cloudflare's global network... ✅
✅ Deployment complete!
```

### Step 5.4: Access Your Live Site!

1. After build succeeds, you'll see a green checkmark ✅
2. Your site URL will be displayed: **https://forger-digital.pages.dev**
3. Click the link to visit your live site!
4. 🎉 **YOUR SITE IS LIVE!**

---

## PHASE 6: VERIFY EVERYTHING WORKS

### Step 6.1: Test Your Site

1. **Homepage:** https://forger-digital.pages.dev
2. **Navigation:** Click through all pages
3. **Forms:** Test contact form (sends email)
4. **Images:** Check all images load
5. **Animations:** Verify scroll animations work

### Step 6.2: Common Issues & Solutions

**Issue 1: Site shows "This site can't be reached"**
- **Cause:** Build is still in progress
- **Solution:** Wait 5-10 more minutes

**Issue 2: Site loads but forms don't work**
- **Cause:** SMTP environment variables incorrect
- **Solution:** Double-check SMTP_* variables

**Issue 3: Database errors in console**
- **Cause:** DATABASE_URL incorrect
- **Solution:** Verify Supabase connection string

**Issue 4: Stripe payment errors**
- **Cause:** STRIPE_SECRET_KEY incorrect
- **Solution:** Verify Stripe API key

---

## TROUBLESHOOTING

### If Build Fails Again:

1. Click on the failed deployment
2. Click **"Download log"** or **"Copy log"**
3. Look for the error message (usually at the bottom)
4. Common errors:
   - Missing environment variable: Add it in Settings
   - Wrong variable value: Update it in Settings
   - Typo in variable name: Fix it in Settings

### How to Update Environment Variables:

1. Go to **Settings** → **Environment variables**
2. Find the variable you want to change
3. Click the **"..."** menu on the right
4. Click **"Edit"**
5. Update the value
6. Click **"Save"**
7. Go to **Deployments** → **Retry deployment**

---

## SUMMARY

### Timeline:
- **Phase 1:** Create project (5 minutes)
- **Phase 2:** Configure settings (2 minutes)
- **Phase 3:** First build fails (3 minutes)
- **Phase 4:** Add environment variables (10 minutes)
- **Phase 5:** Retry build succeeds (7 minutes)
- **Total:** ~30 minutes

### Key Points:
- ✅ ALL build tools must be in `dependencies` (already fixed!)
- ✅ First build WILL fail (expected - no env vars)
- ✅ Add ALL environment variables before retry
- ✅ Second build WILL succeed
- ✅ Site goes live at: https://forger-digital.pages.dev

### Your Site Will Be:
- ✅ Deployed globally on Cloudflare's edge network
- ✅ Auto-deploys when you push to `main` branch
- ✅ Free SSL certificate included
- ✅ CDN caching for fast loading worldwide
- ✅ DDoS protection included

---

## NEXT STEPS AFTER LAUNCH

### Optional: Add Custom Domain

1. Go to **Settings** → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter your domain (e.g., `forgerdigital.com`)
4. Follow DNS instructions
5. Wait for DNS propagation (5 minutes - 24 hours)

### Optional: Enable Preview Deployments

1. Go to **Settings** → **Builds & deployments**
2. Check **"Enable builds for non-production branches"**
3. Now every branch gets its own preview URL!

### Monitor Your Site

1. **Deployments tab:** See all deployments
2. **Analytics:** Coming soon (Cloudflare feature)
3. **Logs:** Click any deployment to see build logs

---

**Ready? Let's start with PHASE 1!**

Your GitHub repo is ready: ✅  
Your code is fixed: ✅  
Let's create the project! 🚀
