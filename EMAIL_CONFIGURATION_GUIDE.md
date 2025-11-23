# 📧 Email Configuration Guide - Forger Digital

## Overview
This document details the email configuration for `hello@forgerdigital.com` using Google Workspace SMTP.

---

## ✅ Configuration Status

**Email Address**: `hello@forgerdigital.com`  
**Provider**: Google Workspace  
**SMTP Host**: `smtp.gmail.com`  
**SMTP Port**: `587` (TLS)  
**Configuration Date**: November 23, 2025

---

## 📋 Environment Variables

Add the following to your `.env.local` file:

```bash
# Google Workspace SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hello@forgerdigital.com
SMTP_PASSWORD=gioytymruerwpjzk
SMTP_FROM_EMAIL=hello@forgerdigital.com
```

**🔐 Security Notes**:
- The `SMTP_PASSWORD` is your **Google App Password** (16 characters, no spaces)
- Never commit `.env.local` to git (it's in `.gitignore`)
- Never share your App Password
- The regular account password is NOT used for SMTP

---

## 🧪 Testing the Configuration

### 1. Test SMTP Connection

Run the test script:

```bash
node test-email.js
```

**Expected Output**:
```
🔍 Testing Google Workspace SMTP Connection...

Configuration:
  Host: smtp.gmail.com
  Port: 587
  User: hello@forgerdigital.com
  From: hello@forgerdigital.com

⏳ Verifying SMTP connection...
✅ SMTP connection verified successfully!

⏳ Sending test email...
✅ Test email sent successfully!
📧 Message ID: <message-id>
📬 Check your inbox at: hello@forgerdigital.com

🎉 Email system is fully operational!
```

### 2. Test Contact Form

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/`

3. Scroll to the "Start Your Project" section

4. Fill out and submit the contact form

5. Check `hello@forgerdigital.com` inbox for:
   - ✅ Notification email (to you)
   - ✅ Confirmation email (if you used your own email in the form)

### 3. Test Get Started Form

1. Navigate to: `http://localhost:3000/get-started`

2. Fill out the complete project inquiry form

3. Submit the form

4. Check `hello@forgerdigital.com` inbox for:
   - ✅ Project inquiry notification
   - ✅ Confirmation email to the submitter

---

## 📧 Email Flow

### Contact Form (`/api/contact`)

**When a user submits the contact form:**

1. **Notification Email** → Sent to `hello@forgerdigital.com`
   - Subject: `New Contact Form Submission from [Name]`
   - Contains: User details and message
   - Purpose: Alert your team about new inquiry

2. **Confirmation Email** → Sent to user's email
   - Subject: `Thank you for contacting Forger Digital`
   - Contains: Confirmation message and next steps
   - Purpose: Acknowledge receipt and set expectations

### Get Started Form (`/api/get-started`)

**When a user submits the project inquiry:**

1. **Project Inquiry Email** → Sent to `hello@forgerdigital.com`
   - Subject: `New Project Inquiry: [Name] from [Company]`
   - Contains: Full project details, services interested, budget, timeline
   - Purpose: Detailed lead information for sales team

2. **Confirmation Email** → Sent to user's email
   - Subject: `Thank you for your interest in Forger Digital`
   - Contains: Project summary and next steps
   - Purpose: Professional acknowledgment with 1-hour response promise

---

## 🔧 Troubleshooting

### Authentication Failed (Error: EAUTH)

**Symptoms**:
```
❌ Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solutions**:
1. Verify the App Password is correct (16 characters, no spaces)
2. Generate a new App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Create new password for "Mail" → "Other (Custom name)"
   - Update `SMTP_PASSWORD` in `.env.local`
3. Ensure 2-Factor Authentication is enabled on the Google account

### Connection Timeout (Error: ETIMEDOUT)

**Symptoms**:
```
❌ Error: Connection timeout while connecting to server
```

**Solutions**:
1. Check internet connection
2. Verify firewall allows outbound connections on port 587
3. Try alternative port 465 (SSL) by updating:
   ```bash
   SMTP_PORT=465
   ```
   And in code, set `secure: true`

### Connection Refused (Error: ECONNREFUSED)

**Symptoms**:
```
❌ Error: connect ECONNREFUSED
```

**Solutions**:
1. Verify SMTP host: `smtp.gmail.com`
2. Verify SMTP port: `587`
3. Check if ISP blocks SMTP ports
4. Try from different network

### Emails Not Sending

**Check**:
1. Verify `.env.local` file exists in project root
2. Restart development server after changing `.env.local`
3. Check console logs for errors
4. Verify Google Workspace account is active
5. Check Gmail spam folder for test emails

---

## 🔐 Google App Password Setup

If you need to regenerate the App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Navigate to "2-Step Verification"
3. Follow prompts to enable 2FA

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter name: `Forger Digital Website`
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
7. Update `.env.local` with password (remove spaces): `abcdefghijklmnop`

---

## 📊 Email Deliverability

### Best Practices

1. **SPF Record** (Ask Google Workspace admin):
   ```
   v=spf1 include:_spf.google.com ~all
   ```

2. **DKIM** (Enabled by default in Google Workspace)
   - Verifies emails are from forgerdigital.com
   - Reduces spam likelihood

3. **DMARC** (Optional but recommended):
   ```
   v=DMARC1; p=none; rua=mailto:hello@forgerdigital.com
   ```

### Monitoring

- Check Google Workspace Admin Console for delivery reports
- Monitor `hello@forgerdigital.com` inbox for bounced emails
- Review contact form submissions in database if emails fail

---

## 🚀 Production Deployment

### Environment Variables

When deploying to production (Vercel, Netlify, etc.):

1. Add all SMTP variables to platform environment settings:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=hello@forgerdigital.com`
   - `SMTP_PASSWORD=gioytymruerwpjzk`
   - `SMTP_FROM_EMAIL=hello@forgerdigital.com`

2. Verify environment variables are loaded correctly

3. Test email functionality in production

### Security Recommendations

1. ✅ Use App Password (NOT regular password)
2. ✅ Enable 2-Factor Authentication
3. ✅ Keep `.env.local` out of git
4. ✅ Use environment variables platform (Vercel, AWS Systems Manager, etc.)
5. ✅ Rotate App Password periodically (every 6 months)
6. ✅ Monitor unauthorized access attempts
7. ✅ Use HTTPS in production
8. ✅ Implement rate limiting (already done)

---

## 📞 Support

If you encounter issues:

1. **Check logs**: Console output and browser network tab
2. **Test SMTP**: Run `node test-email.js`
3. **Verify credentials**: Double-check App Password
4. **Google Support**: https://support.google.com/a/

---

## ✅ Verification Checklist

- [ ] `.env.local` file updated with Google Workspace credentials
- [ ] Development server restarted
- [ ] Test script executed successfully: `node test-email.js`
- [ ] Test email received at `hello@forgerdigital.com`
- [ ] Contact form tested (both notification and confirmation emails)
- [ ] Get Started form tested (both notification and confirmation emails)
- [ ] Production environment variables configured (if deploying)
- [ ] Email deliverability verified (not in spam)

---

## 📝 Change Log

| Date | Change | By |
|------|--------|-----|
| 2025-11-23 | Initial Google Workspace configuration | System |
| 2025-11-23 | Updated test script with enhanced error handling | System |
| 2025-11-23 | Documented email flow and troubleshooting | System |

---

## 🔗 Resources

- [Google Workspace Admin](https://admin.google.com/)
- [App Passwords](https://myaccount.google.com/apppasswords)
- [SMTP Settings](https://support.google.com/a/answer/176600)
- [Nodemailer Documentation](https://nodemailer.com/)

---

**Last Updated**: November 23, 2025  
**Configured By**: AI Assistant  
**Email**: hello@forgerdigital.com

