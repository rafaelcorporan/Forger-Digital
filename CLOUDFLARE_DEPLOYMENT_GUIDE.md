# 🚀 Cloudflare Workers & Pages Deployment Guide

## ✅ YOUR PROJECT IS READY FOR CLOUDFLARE!

This guide will deploy your **full Next.js application** (with API routes, forms, database, etc.) to Cloudflare Workers & Pages.

---

## 📋 PREREQUISITES

- ✅ Cloudflare account (free tier works)
- ✅ GitHub account (for automatic deployments)
- ✅ Node.js 18+ installed
- ✅ Wrangler CLI installed: `npm install -g wrangler`

---

## 🎯 DEPLOYMENT OPTIONS

### **Option 1: GitHub + Cloudflare Dashboard** (Recommended)

**Benefits:**
- ✅ Auto-deploy on every push
- ✅ Preview deployments for PRs
- ✅ Easy rollbacks
- ✅ No manual builds

**Drawbacks:**
- ⚠️ Requires GitHub repo

---

### **Option 2: Direct Deploy with Wrangler CLI**

**Benefits:**
- ✅ No GitHub needed
- ✅ Deploy from local machine

**Drawbacks:**
- ⚠️ Manual deployments
- ⚠️ No preview environments
- ⚠️ No auto-deploy

---

## 🚀 OPTION 1: GitHub Integration (RECOMMENDED)

### **Step 1: Create GitHub Repository**

```bash
# Initialize git (if not already done)
cd /Users/gundo/Projects_/meetstream-clone
git init

# Create .gitignore (ensure it has these lines)
cat >> .gitignore << 'EOF'
.env*.local
.env.local
node_modules/
.next/
out/
.vercel/
EOF

# Commit your code
git add .
git commit -m "Initial commit: Forger Digital website"

# Create GitHub repo (using GitHub CLI)
gh repo create forger-digital-website --public --source=. --remote=origin --push

# Or create manually at github.com and push:
# git remote add origin https://github.com/yourusername/forger-digital-website.git
# git branch -M main
# git push -u origin main
```

---

### **Step 2: Connect to Cloudflare Pages**

1. **Go to Cloudflare Dashboard:**
   - Visit: https://dash.cloudflare.com/
   - Navigate to: **Workers & Pages** → **Create Application** → **Pages**

2. **Connect to Git:**
   - Click: **Connect to Git**
   - Choose: **GitHub**
   - Authorize Cloudflare
   - Select repository: `forger-digital-website`

3. **Configure Build Settings:**

   ```
   Project name: forger-digital
   Production branch: main
   
   Build settings:
     Framework preset: Next.js
     Build command: npx @cloudflare/next-on-pages
     Build output directory: .vercel/output/static
     Root directory: /
     
   Environment variables:
     Node version: 18
   ```

4. **Add Environment Variables:**

   Click **Environment Variables** and add:

   ```
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=hello@forgerdigital.com
   SMTP_PASSWORD=gioytymruerwpjzk
   SMTP_FROM_EMAIL=hello@forgerdigital.com
   
   # Database (if using)
   DATABASE_URL=your_production_database_url
   
   # NextAuth (if using)
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your_production_secret_here
   
   # Public variables
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

5. **Deploy:**
   - Click **Save and Deploy**
   - Wait for build to complete (~2-5 minutes)

6. **View Your Site:**
   - Cloudflare will provide a URL: `https://forger-digital.pages.dev`
   - Test your forms and API routes!

---

## 🚀 OPTION 2: Direct Deploy with Wrangler CLI

### **Step 1: Login to Cloudflare**

```bash
wrangler login
```

This will open a browser to authenticate.

---

### **Step 2: Build for Cloudflare**

```bash
npm run build:cloudflare
```

**Expected output:**
```
✅ Completed @cloudflare/next-on-pages CLI
✅ Generated static files in .vercel/output/static
```

---

### **Step 3: Add Environment Variables (Secrets)**

```bash
# Add email credentials (secrets)
wrangler pages secret put SMTP_PASSWORD
# Paste when prompted: gioytymruerwpjzk

wrangler pages secret put NEXTAUTH_SECRET
# Paste your NextAuth secret

wrangler pages secret put DATABASE_URL
# Paste your database URL

# Add non-secret variables
wrangler pages var set SMTP_HOST=smtp.gmail.com --project-name=forger-digital
wrangler pages var set SMTP_PORT=587 --project-name=forger-digital
wrangler pages var set SMTP_USER=hello@forgerdigital.com --project-name=forger-digital
wrangler pages var set SMTP_FROM_EMAIL=hello@forgerdigital.com --project-name=forger-digital
```

---

### **Step 4: Deploy**

```bash
npm run deploy:cloudflare
```

**Or manually:**

```bash
wrangler pages deploy .vercel/output/static --project-name=forger-digital
```

**Expected output:**
```
✅ Deployment complete!
✨ Success! Your application is live at:
   https://forger-digital.pages.dev
```

---

## 🧪 TESTING YOUR DEPLOYMENT

### **1. Test Homepage:**

```bash
curl https://forger-digital.pages.dev
```

### **2. Test Contact Form API:**

```bash
curl -X POST https://forger-digital.pages.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

### **3. Test Get Started Form:**

Visit: `https://forger-digital.pages.dev/get-started`

Fill out and submit the form. Check `hello@forgerdigital.com` inbox!

---

## 🔧 TROUBLESHOOTING

### **Issue: Build fails with "Module not found"**

**Solution:**
```bash
# Ensure all dependencies are installed
npm install

# Clear cache and rebuild
rm -rf .next .vercel
npm run build:cloudflare
```

---

### **Issue: API routes return 404**

**Solution:**

Verify `wrangler.toml` has:
```toml
compatibility_flags = ["nodejs_compat"]
```

And redeploy:
```bash
npm run deploy:cloudflare
```

---

### **Issue: Email sending fails in production**

**Solution:**

1. Verify environment variables in Cloudflare Dashboard:
   - Workers & Pages → Your Project → Settings → Environment Variables

2. Ensure all SMTP variables are set:
   ```
   SMTP_HOST
   SMTP_PORT
   SMTP_USER
   SMTP_PASSWORD
   SMTP_FROM_EMAIL
   ```

3. Check logs:
   ```bash
   wrangler pages deployment tail
   ```

---

### **Issue: Database connection fails**

**Solution:**

Cloudflare Workers have connection limits. Consider:

1. **Use connection pooling:** Prisma Accelerate or PgBouncer
2. **Use Cloudflare D1:** Cloudflare's native database
3. **Use HTTP-based database:** PlanetScale, Supabase (REST API)

---

## 📊 COMPARING OPTIONS

| Feature | GitHub + Dashboard | Wrangler CLI |
|---------|-------------------|--------------|
| **Setup Complexity** | Easy | Medium |
| **Auto Deploy** | ✅ Yes | ❌ No |
| **Preview Deploys** | ✅ Yes | ❌ No |
| **Rollbacks** | ✅ Easy | ⚠️ Manual |
| **Team Collaboration** | ✅ Yes | ⚠️ Limited |
| **CI/CD** | ✅ Built-in | ⚠️ Manual |
| **GitHub Required** | ✅ Yes | ❌ No |

**Recommendation:** Use **GitHub + Dashboard** for production projects.

---

## 🎯 CUSTOM DOMAIN SETUP

### **Step 1: Add Domain to Cloudflare**

1. Go to: Cloudflare Dashboard → Websites → Add Site
2. Enter your domain: `forgerdigital.com`
3. Follow DNS setup instructions

---

### **Step 2: Connect Domain to Pages**

1. Go to: Workers & Pages → Your Project → Custom Domains
2. Click: **Set up a custom domain**
3. Enter: `forgerdigital.com` or `www.forgerdigital.com`
4. Cloudflare will automatically configure DNS

---

### **Step 3: Update Environment Variables**

Update these in Cloudflare Dashboard:

```
NEXTAUTH_URL=https://forgerdigital.com
NEXT_PUBLIC_BASE_URL=https://forgerdigital.com
```

Redeploy or trigger new deployment via git push.

---

## 🔐 SECURITY CHECKLIST

Before going live:

- [ ] All environment variables set in Cloudflare
- [ ] Secrets (SMTP_PASSWORD, NEXTAUTH_SECRET) added via CLI or Dashboard
- [ ] Database connection secured with SSL
- [ ] Custom domain configured with HTTPS
- [ ] CORS configured for API routes
- [ ] Rate limiting enabled (already in your code)
- [ ] CSRF protection enabled (already in your code)
- [ ] Test all forms and API endpoints

---

## 📈 MONITORING & LOGS

### **View Real-time Logs:**

```bash
wrangler pages deployment tail
```

### **View Analytics:**

Go to: Workers & Pages → Your Project → Analytics

---

## 🔄 CONTINUOUS DEPLOYMENT

**With GitHub Integration:**

Every time you push to `main` branch:
1. Cloudflare automatically builds your project
2. Runs tests (if configured)
3. Deploys to production
4. Notifies you of success/failure

**With Wrangler CLI:**

You must manually deploy:
```bash
npm run deploy:cloudflare
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] Homepage loads correctly
- [ ] Contact form submits and sends email
- [ ] Get Started form submits and sends email
- [ ] Check `hello@forgerdigital.com` for test emails
- [ ] Verify email sender shows: `Forger Digital <hello@forgerdigital.com>`
- [ ] All images load properly
- [ ] Navigation works
- [ ] Blog pages load (if applicable)
- [ ] Admin dashboard accessible (if applicable)
- [ ] Database queries work
- [ ] Authentication works (if applicable)

---

## 🚀 QUICK COMMANDS REFERENCE

```bash
# Build for Cloudflare
npm run build:cloudflare

# Deploy to Cloudflare
npm run deploy:cloudflare

# Preview locally (after build)
npm run preview:cloudflare

# View logs
wrangler pages deployment tail

# List deployments
wrangler pages deployment list --project-name=forger-digital

# Rollback to previous deployment
wrangler pages deployment rollback --project-name=forger-digital
```

---

## 📞 NEED HELP?

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Next.js on Pages:** https://developers.cloudflare.com/pages/framework-guides/nextjs/
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/

---

## 🎉 SUCCESS!

Once deployed, your website will be:
- ✅ Live at `https://forger-digital.pages.dev`
- ✅ Globally distributed via Cloudflare's edge network
- ✅ Fast, secure, and scalable
- ✅ All forms sending emails from `hello@forgerdigital.com`

---

**Last Updated:** November 23, 2025  
**Deployment Platform:** Cloudflare Workers & Pages  
**Framework:** Next.js with API Routes  
**Email:** hello@forgerdigital.com

