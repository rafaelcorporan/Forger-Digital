# ⚡ Quick Email Setup Guide

## 🚀 5-Minute Setup

### Step 1: Update `.env.local`

Open `/Users/gundo/Projects_/meetstream-clone/.env.local` and add:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hello@forgerdigital.com
SMTP_PASSWORD=gioytymruerwpjzk
SMTP_FROM_EMAIL=hello@forgerdigital.com
```

### Step 2: Test Configuration

```bash
node test-email.js
```

**Expected**: ✅ "Email system is fully operational!"

### Step 3: Test Contact Forms

```bash
# Start dev server
npm run dev

# Test forms at:
# - http://localhost:3000/ (Contact Form)
# - http://localhost:3000/get-started (Get Started Form)
```

---

## ✅ That's It!

All forms will now send emails from **hello@forgerdigital.com**

---

## 📧 What Happens When Forms Are Submitted?

### Contact Form
1. **You receive**: Notification email with inquiry details
2. **Customer receives**: Confirmation email

### Get Started Form
1. **You receive**: Project inquiry email with full details
2. **Customer receives**: Professional confirmation with next steps

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Authentication failed | Verify App Password (no spaces): `gioytymruerwpjzk` |
| Connection timeout | Check internet / firewall on port 587 |
| No email received | Check spam folder at hello@forgerdigital.com |

---

## 🔐 Security Reminder

- ✅ App Password is in `.env.local` (git-ignored)
- ✅ Never commit `.env.local` to git
- ✅ Never share your App Password
- ✅ Regular password `Aa1234567$$$` is NOT used for SMTP

---

**Need detailed help?** See `EMAIL_CONFIGURATION_GUIDE.md`

