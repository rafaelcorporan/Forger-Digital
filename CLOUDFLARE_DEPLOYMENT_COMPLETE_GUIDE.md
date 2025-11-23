# 🚀 Forger Digital - Cloudflare Pages Deployment Guide

## ✅ COMPLETED STEPS

- ✅ **GitHub Repository Created:** https://github.com/rafaelcorporan/Forger-Digital
- ✅ **Code Pushed:** 391 files, 73,217 lines of code
- ✅ **Cloudflare Account:** Logged in as rafaelcorporan@gmail.com
- ✅ **Account ID:** a313f914a3caf00d68b03de5eadc54cc

---

## 🔗 STEP-BY-STEP DEPLOYMENT

### **1. Access Cloudflare Pages Dashboard**

Open in your browser:
```
https://dash.cloudflare.com/a313f914a3caf00d68b03de5eadc54cc/pages
```

### **2. Create New Pages Project**

1. Click **"Create application"** or **"Connect to Git"**
2. Click **"Pages"** tab
3. Click **"Connect to Git"**

### **3. Connect GitHub Repository**

1. Click **"Connect GitHub"**
2. Authorize Cloudflare to access your GitHub account
3. Select **"Only select repositories"**
4. Choose **"rafaelcorporan/Forger-Digital"**
5. Click **"Install & Authorize"**

### **4. Configure Build Settings**

Use these exact settings:

```yaml
Project name: forger-digital (or your preferred name)
Production branch: main
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: / (leave empty)
Node.js version: 18 (or 20)
```

**IMPORTANT:** Do NOT click "Save and Deploy" yet! First, add environment variables.

### **5. Add Environment Variables**

Click **"Environment Variables"** section and add these:

#### **Required Variables (Add for BOTH Production and Preview):**

```bash
# Database
DATABASE_URL=your_actual_database_url_here

# Email Configuration (Google Workspace)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hello@forgerdigital.com
SMTP_PASSWORD=gioytymruerwpjzk
SMTP_FROM_EMAIL=hello@forgerdigital.com

# NextAuth Authentication
NEXTAUTH_URL=https://forger-digital.pages.dev
NEXTAUTH_SECRET=Tto3sZoHzoddH4/yoJ69AVElDNoeCUwQZPweXrtujQw=

# Node Environment
NODE_ENV=production
```

#### **Optional Variables (if you use these services):**

```bash
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_live_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here

# Redis Cache (optional)
REDIS_URL=redis://your_redis_url

# Sentry Error Tracking (optional)
SENTRY_DSN=https://your_sentry_dsn
SENTRY_AUTH_TOKEN=your_auth_token

# Force HTTPS (recommended)
FORCE_HTTPS=true
```

### **6. Deploy**

1. Click **"Save and Deploy"**
2. Wait for the build to complete (5-10 minutes)
3. Your site will be live at: `https://forger-digital.pages.dev`

---

## 🔧 POST-DEPLOYMENT CONFIGURATION

### **1. Update NEXTAUTH_URL**

After your first deployment, you'll get a URL like:
```
https://forger-digital.pages.dev
```

Update the `NEXTAUTH_URL` environment variable with this exact URL:

1. Go to **Settings → Environment Variables**
2. Find `NEXTAUTH_URL`
3. Click **"Edit"**
4. Replace with your actual Pages URL
5. Click **"Save"**
6. Go to **Deployments** → **Redeploy**

### **2. Add Custom Domain (Optional)**

1. Go to **Custom domains** tab
2. Click **"Set up a custom domain"**
3. Enter your domain: `forgerdigital.com`
4. Follow DNS setup instructions
5. Wait for SSL certificate (automatic)

### **3. Update DNS Records**

If using custom domain, add these DNS records:

```
Type: CNAME
Name: forgerdigital.com (or www)
Target: forger-digital.pages.dev
Proxy: ✅ Enabled (orange cloud)
```

---

## 🔄 AUTOMATIC DEPLOYMENTS

✅ **Now every time you push to GitHub, Cloudflare will:**
1. Automatically detect the push
2. Build your project
3. Deploy to production
4. Generate preview URLs for branches

### **Deploy via Git Push:**

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main

# Cloudflare automatically deploys!
```

---

## 🧪 TESTING YOUR DEPLOYMENT

### **1. Check Build Logs**

If deployment fails:
1. Go to **Deployments** tab
2. Click on the failed deployment
3. View **Build logs**
4. Look for errors (usually missing environment variables)

### **2. Test Your Site**

Visit: `https://forger-digital.pages.dev`

**Test these pages:**
- ✅ Homepage: `/`
- ✅ Services: `/services/web-design`
- ✅ Portfolio: `/portfolio`
- ✅ Contact Form: `/` (scroll down)
- ✅ Get Started Form: `/get-started`
- ✅ Blog: `/blog`

### **3. Test Email Sending**

1. Fill out the contact form
2. Check if you receive email at `hello@forgerdigital.com`
3. Check user receives confirmation email

---

## ⚠️ TROUBLESHOOTING

### **Build Failed?**

**Error: Missing DATABASE_URL**
- Add `DATABASE_URL` to environment variables
- Redeploy

**Error: Module not found**
- Check `package.json` dependencies
- Ensure all imports are correct

**Error: Authentication failed**
- Verify `NEXTAUTH_URL` matches your deployment URL
- Ensure `NEXTAUTH_SECRET` is set

### **Email Not Working?**

1. Verify SMTP credentials in environment variables
2. Check Google Workspace App Password is correct
3. Test with: `/api/contact` endpoint

### **Database Not Connected?**

1. Ensure `DATABASE_URL` is correct
2. Check if database allows connections from Cloudflare IPs
3. Use connection pooling URL for Supabase/Neon

---

## 📊 MONITORING

### **Performance Monitoring**

Cloudflare Pages provides:
- ✅ Real-time analytics
- ✅ Request logs
- ✅ Error tracking
- ✅ Core Web Vitals

Access: **Analytics** tab in your Pages project

### **Build History**

See all deployments:
- **Deployments** tab
- Each deployment shows:
  - Build time
  - Git commit
  - Build logs
  - Preview URL

---

## 🔐 SECURITY CHECKLIST

- ✅ Environment variables added securely (not in code)
- ✅ `.env.local` in `.gitignore` (confirmed)
- ✅ HTTPS enabled automatically
- ✅ CSP headers configured
- ✅ Rate limiting enabled
- ✅ CSRF protection enabled

---

## 🎯 QUICK REFERENCE

### **Your URLs:**
- **GitHub Repo:** https://github.com/rafaelcorporan/Forger-Digital
- **Cloudflare Dashboard:** https://dash.cloudflare.com/a313f914a3caf00d68b03de5eadc54cc/pages
- **Live Site:** https://forger-digital.pages.dev (after deployment)

### **Key Commands:**

```bash
# View repository status
git status

# Pull latest changes
git pull origin main

# Push changes (triggers deployment)
git add .
git commit -m "Update"
git push origin main

# View Cloudflare deployment status
wrangler pages deployment list --project-name=forger-digital
```

---

## 📝 NEXT STEPS AFTER DEPLOYMENT

1. ✅ Test all forms (Contact, Get Started)
2. ✅ Verify email sending works
3. ✅ Test authentication (login/signup)
4. ✅ Check mobile responsiveness
5. ✅ Add custom domain (optional)
6. ✅ Set up monitoring/alerts
7. ✅ Submit sitemap to Google Search Console
8. ✅ Configure CDN settings
9. ✅ Enable Cloudflare Analytics
10. ✅ Set up backup strategy

---

## 🆘 NEED HELP?

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Issues:** https://github.com/rafaelcorporan/Forger-Digital/issues

---

## ✅ DEPLOYMENT VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Site is accessible at Pages URL
- [ ] All pages load without errors
- [ ] Contact form works and sends email
- [ ] Get Started form works and sends email
- [ ] Images load correctly
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] SSL certificate active (https://)
- [ ] API routes work
- [ ] Database connections established
- [ ] Authentication works (if testing)
- [ ] Blog posts visible
- [ ] Search functionality works
- [ ] Social media icons link correctly
- [ ] Footer displays correctly
- [ ] No console errors in browser

---

**🎉 Your site is ready to go live!**

Once you complete the manual steps in Cloudflare Dashboard, your Forger Digital website will be live and automatically deploy on every GitHub push!

