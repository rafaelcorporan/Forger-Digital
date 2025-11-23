# Outlook SMTP Setup Guide (Simple - No Azure Required)

## Option 1: Using Your Outlook Email Password Directly

### If You DON'T Have 2FA Enabled:
1. Your Outlook email address (e.g., `yourname@outlook.com`)
2. Your Outlook password

**SMTP Settings:**
- **SMTP Server**: `smtp.office365.com`
- **Port**: `587`
- **Encryption**: STARTTLS
- **Username**: Your full Outlook email address
- **Password**: Your Outlook account password

---

## Option 2: Using App Password (If 2FA is Enabled)

### If You HAVE 2FA Enabled:
You'll need to create an **App Password** (not your regular password).

### Steps to Create App Password:

1. **Go to Microsoft Account Security**:
   - Visit: https://account.microsoft.com/security
   - Sign in with your Outlook account

2. **Enable 2FA (if not already enabled)**:
   - Go to "Security" tab
   - Click "Advanced security options"
   - Enable "Two-step verification" if needed

3. **Create App Password**:
   - Go to: https://account.microsoft.com/security/app-passwords
   - Or: Security → Advanced security → App passwords
   - Click "Create a new app password"
   - Give it a name: "Contact Form" or "Website Email Service"
   - Click "Generate"
   - **Copy the password immediately** (it's only shown once!)
   - Format: `xxxx-xxxx-xxxx-xxxx` (16 characters with dashes)

4. **Use This App Password**:
   - Use your regular email address as username
   - Use the **app password** (not your regular password) for SMTP

---

## Environment Variables Setup

Add these to your `.env.local` file:

```env
# Outlook SMTP Configuration
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password-or-app-password
SMTP_FROM_EMAIL=your-email@outlook.com
SMTP_FROM_NAME=Forger Digital
```

---

## Important Security Notes

⚠️ **Security Best Practices**:
1. **Use App Passwords** if you have 2FA enabled (more secure)
2. **Never commit passwords to Git** - Use `.env.local` (should be in `.gitignore`)
3. **Consider using environment variables** in your hosting platform (Vercel, etc.)
4. **App passwords expire** - You may need to regenerate them periodically

---

## Testing Your SMTP Settings

You can test your SMTP settings using:
- Email client like Outlook or Thunderbird
- Or I can help you test once the code is implemented

---

## Alternative: Easier Email Services

If SMTP setup is too complex, consider these **easier alternatives**:

### **Resend** (Recommended - Very Easy)
- Free tier: 3,000 emails/month
- Simple API setup
- Sign up: https://resend.com/
- Just need an API key

### **SendGrid**
- Free tier: 100 emails/day
- Simple API setup
- Sign up: https://sendgrid.com/

Both are easier than SMTP and designed for transactional emails.

