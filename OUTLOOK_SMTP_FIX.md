# Outlook SMTP Authentication Fix

## Problem
The error message indicates:
> **"SmtpClientAuthentication is disabled for the Tenant"**

This means SMTP authentication is disabled for your Microsoft 365 account.

## Solution: Enable SMTP AUTH

### Option 1: Enable for Your Account (Easiest)

1. **Sign in to Microsoft 365 Admin Center**
   - Go to: https://admin.microsoft.com
   - Sign in with: `info@forgerdigital.com`

2. **Navigate to Users**
   - Go to **Users** > **Active users**
   - Find and select: `info@forgerdigital.com`

3. **Enable SMTP AUTH**
   - Click on **Mail** tab
   - Scroll down to **Email apps**
   - Toggle **ON** the option: **Authenticated SMTP**
   - Click **Save**

4. **Wait 5-10 minutes** for changes to propagate

### Option 2: Enable via PowerShell (Advanced)

If you have admin access, run this PowerShell command:

```powershell
Set-CASMailbox -Identity "info@forgerdigital.com" -SmtpClientAuthenticationDisabled $false
```

### Option 3: Enable for Entire Tenant (If Admin)

1. Go to **Microsoft 365 Admin Center** > **Settings** > **Org settings**
2. Find **Mail** section
3. Enable **Authenticated SMTP** for the organization

## Alternative: Use Microsoft Graph API

If SMTP AUTH cannot be enabled, we can switch to Microsoft Graph API with OAuth2 authentication (requires Azure app registration).

## Testing After Fix

After enabling SMTP AUTH, run the test script again:

```bash
node test-email.js
```

You should see: `✅ SMTP connection verified!` and `✅ Test email sent successfully!`

## Need Help?

If you need assistance enabling SMTP AUTH, contact your Microsoft 365 administrator or visit:
https://aka.ms/smtp_auth_disabled

