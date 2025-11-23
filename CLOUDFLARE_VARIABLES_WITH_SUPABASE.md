# 🔐 CLOUDFLARE ENVIRONMENT VARIABLES - WITH SUPABASE DATABASE

## ✅ Updated with Production Supabase Database

---

## VARIABLE 1 of 9 ⭐ UPDATED!
```
Variable name: DATABASE_URL
Value: postgresql://postgres.zmefoatwpqeprslxvmvr:LavacPinta$$!@#@aws-0-us-west-2.pooler.supabase.com:6543/postgres
Environment: ☑️ Production  ☑️ Preview
```

---

## VARIABLE 2 of 9
```
Variable name: SMTP_HOST
Value: smtp.gmail.com
Environment: ☑️ Production  ☑️ Preview
```

---

## VARIABLE 3 of 9
```
Variable name: SMTP_PORT
Value: 587
Environment: ☑️ Production  ☑️ Preview
```

---

## VARIABLE 4 of 9
```
Variable name: SMTP_USER
Value: hello@forgerdigital.com
Environment: ☑️ Production  ☑️ Preview
```

---

## VARIABLE 5 of 9
```
Variable name: SMTP_PASSWORD
Value: gioytymruerwpjzk
Environment: ☑️ Production  ☑️ Preview
```

---

## VARIABLE 6 of 9
```
Variable name: SMTP_FROM_EMAIL
Value: hello@forgerdigital.com
Environment: ☑️ Production  ☑️ Preview
```

---

## VARIABLE 7 of 9
```
Variable name: NEXTAUTH_URL
Value: https://forger-digital.pages.dev
Environment: ☑️ Production  ☑️ Preview
```

---

## VARIABLE 8 of 9
```
Variable name: NEXTAUTH_SECRET
Value: Tto3sZoHzoddH4/yoJ69AVElDNoeCUwQZPweXrtujQw=
Environment: ☑️ Production  ☑️ Preview
```

---

## VARIABLE 9 of 9
```
Variable name: NODE_ENV
Value: production
Environment: ☑️ Production  ☑️ Preview
```

---

## ✅ AFTER ADDING ALL 9 VARIABLES:

1. Click "Save" button at the bottom of the page
2. Go to "Deployments" tab (top navigation)
3. Find the failed deployment
4. Click "Retry deployment" button
5. Wait 5-10 minutes for build to complete
6. ✅ Your site will be LIVE at: https://forger-digital.pages.dev

---

## 🗄️ SUPABASE DATABASE INFO:

- **Type:** PostgreSQL with Connection Pooling (Transaction mode)
- **Host:** aws-0-us-west-2.pooler.supabase.com
- **Port:** 6543 (Pooler)
- **Database:** postgres
- **User:** postgres.zmefoatwpqeprslxvmvr
- **Pool Mode:** Transaction (Optimal for serverless)

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT:

### 1. Run Database Migrations
After successful deployment, you'll need to set up your database tables:

```bash
# In your local project
npx prisma migrate deploy
```

### 2. Verify Database Connection
Test that your app can connect to Supabase:
- Visit: https://forger-digital.pages.dev/api/health
- Should return: {"status":"ok"}

### 3. Test Forms
- Contact Form: https://forger-digital.pages.dev/#contact
- Get Started Form: https://forger-digital.pages.dev/get-started

---

## 🔐 SECURITY NOTES:

✅ Database password is encrypted in Cloudflare environment variables
✅ Connection string never committed to GitHub
✅ Supabase pooler provides connection management
✅ Transaction mode is optimal for serverless environments

---

## 📊 CONNECTION POOLING BENEFITS:

Using Supabase's connection pooler (port 6543) provides:
- ✅ Better performance for serverless (Cloudflare Pages)
- ✅ Prevents connection exhaustion
- ✅ Automatic connection management
- ✅ Lower latency
- ✅ Better scalability

---

## 🆘 TROUBLESHOOTING:

**If deployment fails:**
1. Check all 9 variables are added correctly
2. Verify DATABASE_URL doesn't have extra spaces
3. Ensure both Production AND Preview are selected
4. Check build logs for specific errors

**If database connection fails:**
1. Verify Supabase project is active
2. Check database password hasn't changed
3. Ensure your IP isn't blocked in Supabase
4. Test connection with: `psql <connection_string>`

---

## 📖 CLOUDFLARE DASHBOARD LINKS:

**Settings (Environment Variables):**
https://dash.cloudflare.com/a313f914a3caf00d68b03de5eadc54cc/pages/view/forger-digital/settings

**Deployments:**
https://dash.cloudflare.com/a313f914a3caf00d68b03de5eadc54cc/pages/view/forger-digital

