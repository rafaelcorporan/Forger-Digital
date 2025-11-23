// Quick email test script
// Run with: node test-email.js

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.join(__dirname, '.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

// Set environment variables
Object.keys(envVars).forEach(key => {
  process.env[key] = envVars[key];
});

async function testEmail() {
  console.log('🔍 Testing Google Workspace SMTP Connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  console.log(`  Port: ${process.env.SMTP_PORT || '587'}`);
  console.log(`  User: ${process.env.SMTP_USER}`);
  console.log(`  From: ${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}\n`);

  // Validate configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('❌ SMTP credentials not found in .env.local');
    console.error('Please add SMTP_USER and SMTP_PASSWORD to your .env.local file\n');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    console.log('⏳ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Send test email
    console.log('⏳ Sending test email...');
    const info = await transporter.sendMail({
      from: `Forger Digital <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: '✅ Test Email from Forger Digital Website',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF5722 0%, #E91E63 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 Email System Active!</h1>
          </div>
          
          <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              <strong>Congratulations!</strong> Your Google Workspace email integration is working perfectly.
            </p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF5722;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Configuration Details:</strong><br>
                <strong>Email:</strong> ${process.env.SMTP_USER}<br>
                <strong>SMTP Host:</strong> ${process.env.SMTP_HOST || 'smtp.gmail.com'}<br>
                <strong>Test Date:</strong> ${new Date().toLocaleString()}
              </p>
            </div>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              All contact forms on your website will now send emails from <strong>hello@forgerdigital.com</strong>.
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong style="color: #FF5722;">Forger Digital Team</strong>
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Check your inbox at: ${process.env.SMTP_USER}`);
    console.log('\n🎉 Email system is fully operational!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n📋 Full error details:');
    console.error(error);
    
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed. Possible issues:');
      console.error('  1. Wrong App Password (must be 16 characters without spaces)');
      console.error('  2. App Password not generated correctly');
      console.error('  3. Two-factor authentication not enabled');
      console.error('\n💡 Solution: Generate a new App Password at:');
      console.error('   https://myaccount.google.com/apppasswords');
    }
    if (error.code === 'ETIMEDOUT') {
      console.error('\n⚠️  Connection timeout. Check:');
      console.error('  1. Internet connection');
      console.error('  2. Firewall settings');
      console.error('  3. SMTP port (587) is not blocked');
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Connection refused. Check:');
      console.error('  1. SMTP host: smtp.gmail.com');
      console.error('  2. SMTP port: 587');
    }
    console.error('\n');
  }
}

testEmail();

