# Contact Form Setup Instructions

## Step 1: Install Nodemailer

Run this command in your terminal:
```bash
npm install nodemailer --legacy-peer-deps
```

## Step 2: Create .env.local File

Create a file named `.env.local` in your project root with the following content:

```env
# Outlook SMTP Configuration
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=info@forgerdigital.com
SMTP_PASSWORD=Rcorpo1480$$$
SMTP_FROM_EMAIL=info@forgerdigital.com
SMTP_FROM_NAME=Forger Digital
```

**Important**: Make sure `.env.local` is in your `.gitignore` file (it should be already) to keep your credentials secure.

## Step 3: Verify Installation

After installing nodemailer and creating `.env.local`, restart your development server:

```bash
npm run dev
```

## How It Works

1. **User fills out contact form** → Form validates input
2. **Form submits** → Sends POST request to `/api/contact`
3. **API endpoint** → Validates data and sends two emails:
   - **Notification email** to: `info@forgerdigital.com` (you receive the inquiry)
   - **Confirmation email** to: User's email (they get a thank you message)

## Testing

1. Navigate to your homepage
2. Scroll to the Contact section (or go to `/#contact`)
3. Fill out the form
4. Click "Send Message"
5. Check your inbox at `info@forgerdigital.com` for the notification
6. Check the user's email for the confirmation

## Troubleshooting

If emails don't send:
- Verify `.env.local` exists and has correct credentials
- Check if your Outlook account requires app passwords (if 2FA is enabled)
- Check server console for error messages
- Verify SMTP_HOST, SMTP_PORT, and SMTP_USER are correct

