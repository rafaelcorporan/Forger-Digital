# 🚀 DEPLOY NOW - 5 MINUTE GUIDE

## ⚡ FASTEST PATH TO PRODUCTION

Your code is pushed to GitHub, Cloudflare project is created. Just connect them!

---

## 📋 STEP-BY-STEP (5 MINUTES)

### **STEP 1: Open Cloudflare Dashboard**

**Click this link:**
```
https://dash.cloudflare.com/a313f914a3caf00d68b03de5eadc54cc/pages/view/forger-digital
```

---

### **STEP 2: Connect GitHub**

1. Click **"Settings"** tab (top navigation)
2. Scroll to **"Builds & deployments"** section
3. Click **"Connect to Git"** button
4. Click **"GitHub"**
5. Authorize Cloudflare (if prompted)
6. Select repository: **"rafaelcorporan/Forger-Digital"**
7. Click **"Install & Authorize"**

---

### **STEP 3: Configure Build**

**Use these exact settings:**

```
Production branch: main
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: (leave empty)
Node.js version: 18
```

**❗ DO NOT CLICK "SAVE" YET!**

---

### **STEP 4: Add Environment Variables**

Scroll to **"Environment Variables"** section.

**Click "Add variable" and add these one by one:**

#### **Required Variables (Add to BOTH Production AND Preview):**

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | `your_actual_database_url_here` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `hello@forgerdigital.com` |
| `SMTP_PASSWORD` | `gioytymruerwpjzk` |
| `SMTP_FROM_EMAIL` | `hello@forgerdigital.com` |
| `NEXTAUTH_URL` | `https://forger-digital.pages.dev` |
| `NEXTAUTH_SECRET` | `Tto3sZoHzoddH4/yoJ69AVElDNoeCUwQZPweXrtujQw=` |
| `NODE_ENV` | `production` |

**⚠️ IMPORTANT:** Replace `DATABASE_URL` with your actual database connection string!

**💡 TIP:** All variables are in `CLOUDFLARE_ENV_VARIABLES.txt` for easy copy/paste

---

### **STEP 5: Deploy!**

1. Click **"Save and Deploy"** button
2. Wait 5-10 minutes for build
3. ✅ Your site goes LIVE!

---

## 🎉 AFTER DEPLOYMENT

### **Your Live Site:**
```
https://forger-digital.pages.dev
```

### **Check Deployment Status:**
1. Go to **"Deployments"** tab
2. Watch the build progress in real-time
3. Click on deployment to see logs

### **Test Your Site:**
- Homepage: https://forger-digital.pages.dev
- Contact Form: https://forger-digital.pages.dev/#contact
- Get Started: https://forger-digital.pages.dev/get-started
- API Health: https://forger-digital.pages.dev/api/health

---

## 🔄 AUTOMATIC DEPLOYMENTS

**Now every time you push to GitHub:**

```bash
git add .
git commit -m "Update website"
git push origin main
```

**✅ Cloudflare automatically builds and deploys!**

No manual steps needed after this initial setup!

---

## ⚠️ TROUBLESHOOTING

### **Build Failed?**

**Common issues:**

1. **Missing DATABASE_URL**
   - Go to Settings → Environment Variables
   - Add `DATABASE_URL` with your actual database URL
   - Retry deployment

2. **Module not found errors**
   - Check build logs for specific missing module
   - Usually means environment variable is missing

3. **Authentication errors**
   - Verify `NEXTAUTH_URL` matches your deployment URL
   - Ensure `NEXTAUTH_SECRET` is set and 32+ characters

### **Email Not Working?**

1. Verify all `SMTP_*` variables are set correctly
2. Test Google Workspace App Password
3. Check email deliverability in Google Admin

### **Database Connection Failed?**

1. Verify `DATABASE_URL` format is correct
2. Check database allows connections from Cloudflare
3. Use connection pooling URL (e.g., Supabase pooler)

---

## 📖 FULL DOCUMENTATION

For complete details, see:
- **DEPLOYMENT_STATUS.md** - Complete deployment status
- **CLOUDFLARE_DEPLOYMENT_COMPLETE_GUIDE.md** - Full guide
- **CLOUDFLARE_ENV_VARIABLES.txt** - All environment variables

---

## 🎯 QUICK CHECKLIST

- [ ] Open Cloudflare Dashboard
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Add ALL environment variables (9 required)
- [ ] Update DATABASE_URL with real value
- [ ] Click "Save and Deploy"
- [ ] Wait 5-10 minutes
- [ ] Test live site
- [ ] Verify email forms work
- [ ] Check API endpoints

---

## 🆘 NEED HELP?

If build fails or something doesn't work:

1. Check **build logs** in Cloudflare Dashboard
2. Review **DEPLOYMENT_STATUS.md** for troubleshooting
3. Run `./deploy-to-cloudflare.sh` for setup verification

---

**🚀 READY? GO TO:**

```
https://dash.cloudflare.com/a313f914a3caf00d68b03de5eadc54cc/pages/view/forger-digital
```

**⏱️ 5 MINUTES TO LIVE! LET'S GO! 🎉**

