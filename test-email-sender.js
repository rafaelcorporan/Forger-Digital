// Email Sender Address Test
// Run with: node test-email-sender.js
// This script verifies the email sender address is correct

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

console.log('🧪 EMAIL SENDER ADDRESS TEST\n');
console.log('=' .repeat(70));

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
const envVars = {};

if (!fs.existsSync(envPath)) {
  console.error('\n❌ CRITICAL: .env.local file not found!');
  console.error('   Run: node check-current-email.js for diagnosis\n');
  process.exit(1);
}

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

// Set environment variables
Object.keys(envVars).forEach(key => {
  process.env[key] = envVars[key];
});

// Verify configuration
console.log('\n1️⃣  CONFIGURATION CHECK:\n');

const expectedEmail = 'hello@forgerdigital.com';
const expectedHost = 'smtp.gmail.com';

let configValid = true;

// Check SMTP_USER
if (process.env.SMTP_USER === expectedEmail) {
  console.log(`   ✅ SMTP_USER: ${process.env.SMTP_USER}`);
} else {
  console.log(`   ❌ SMTP_USER: ${process.env.SMTP_USER || 'NOT SET'}`);
  console.log(`      Expected: ${expectedEmail}`);
  configValid = false;
}

// Check SMTP_FROM_EMAIL
if (process.env.SMTP_FROM_EMAIL === expectedEmail) {
  console.log(`   ✅ SMTP_FROM_EMAIL: ${process.env.SMTP_FROM_EMAIL}`);
} else if (!process.env.SMTP_FROM_EMAIL) {
  console.log(`   ⚠️  SMTP_FROM_EMAIL: Not set (will use SMTP_USER)`);
} else {
  console.log(`   ❌ SMTP_FROM_EMAIL: ${process.env.SMTP_FROM_EMAIL}`);
  console.log(`      Expected: ${expectedEmail}`);
  configValid = false;
}

// Check SMTP_HOST
if (process.env.SMTP_HOST === expectedHost) {
  console.log(`   ✅ SMTP_HOST: ${process.env.SMTP_HOST}`);
} else {
  console.log(`   ❌ SMTP_HOST: ${process.env.SMTP_HOST || 'NOT SET'}`);
  console.log(`      Expected: ${expectedHost}`);
  configValid = false;
}

if (!configValid) {
  console.log('\n❌ CONFIGURATION INVALID!\n');
  console.log('📝 Fix required:');
  console.log('   1. Run: node check-current-email.js');
  console.log('   2. Update .env.local with correct values');
  console.log('   3. Run this test again\n');
  console.log('=' .repeat(70) + '\n');
  process.exit(1);
}

console.log('\n   ✅ Configuration is correct!\n');

// Test email sending
async function testEmailSender() {
  console.log('2️⃣  SMTP CONNECTION TEST:\n');
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('   ⏳ Verifying SMTP connection...');
    await transporter.verify();
    console.log('   ✅ SMTP connection verified!\n');

    console.log('3️⃣  SENDER ADDRESS TEST:\n');
    console.log('   ⏳ Sending test email...');
    
    const fromAddress = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const fromName = 'Forger Digital';
    const fromFull = `${fromName} <${fromAddress}>`;
    
    const info = await transporter.sendMail({
      from: fromFull,
      to: process.env.SMTP_USER,
      subject: '✅ Sender Address Verification Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF5722 0%, #E91E63 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Sender Test Passed!</h1>
          </div>
          
          <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Email Sender Verification</h2>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <p style="margin: 0; color: #0c4a6e; font-size: 14px; font-family: monospace;">
                <strong>From Name:</strong> ${fromName}<br>
                <strong>From Email:</strong> ${fromAddress}<br>
                <strong>Full From:</strong> ${fromFull}<br>
                <strong>Message ID:</strong> ${info.messageId}<br>
                <strong>Test Date:</strong> ${new Date().toLocaleString()}
              </p>
            </div>

            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <p style="margin: 0; color: #166534; font-weight: bold;">
                ✅ If you can see this email FROM "${fromFull}", then the sender address is configured correctly!
              </p>
            </div>

            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              <strong>What to check:</strong>
            </p>
            <ul style="color: #666; font-size: 14px;">
              <li>The sender name should be: <strong>Forger Digital</strong></li>
              <li>The sender email should be: <strong>hello@forgerdigital.com</strong></li>
              <li>Should NOT be: info@cyberiteck.co or any other email</li>
            </ul>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Email Verification Test<br>
                <strong style="color: #FF5722;">Forger Digital Email System</strong>
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log('   ✅ Test email sent successfully!\n');
    console.log('=' .repeat(70));
    console.log('\n4️⃣  VERIFICATION RESULTS:\n');
    console.log(`   From Name: ${fromName}`);
    console.log(`   From Email: ${fromAddress}`);
    console.log(`   Full From: ${fromFull}`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Sent To: ${process.env.SMTP_USER}\n`);
    
    // Final verdict
    if (fromAddress === expectedEmail) {
      console.log('   ✅✅✅ SENDER ADDRESS IS CORRECT! ✅✅✅\n');
      console.log('=' .repeat(70));
      console.log('\n🎉 SUCCESS! Email sender address verified:\n');
      console.log(`   ${fromFull}\n`);
      console.log('📬 Check your inbox at: ' + process.env.SMTP_USER);
      console.log('   Look for the email with subject: "Sender Address Verification Test"');
      console.log('   Verify the FROM field shows: Forger Digital <hello@forgerdigital.com>\n');
      console.log('✅ If the sender is correct in your inbox, configuration is PROVEN!\n');
      console.log('📝 Next steps:');
      console.log('   1. Check email in inbox (verify FROM address)');
      console.log('   2. Test contact form at: http://localhost:3000/');
      console.log('   3. Test get-started form at: http://localhost:3000/get-started');
      console.log('   4. Verify all form emails show correct sender\n');
      console.log('=' .repeat(70) + '\n');
      process.exit(0);
    } else {
      console.log('   ❌❌❌ SENDER ADDRESS IS WRONG! ❌❌❌\n');
      console.log(`   Expected: ${expectedEmail}`);
      console.log(`   Got: ${fromAddress}\n`);
      console.log('=' .repeat(70));
      console.log('\n❌ FAILED! Sender address is incorrect.\n');
      console.log('🔧 Fix required:');
      console.log('   1. Run: node check-current-email.js');
      console.log('   2. Update .env.local');
      console.log('   3. RESTART dev server: npm run dev');
      console.log('   4. Run this test again\n');
      console.log('=' .repeat(70) + '\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n📋 Error details:');
    console.error(error);
    
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed!');
      console.error('   Check SMTP_PASSWORD in .env.local');
      console.error('   Should be: gioytymruerwpjzk (16 characters, no spaces)');
    }
    
    console.error('\n');
    process.exit(1);
  }
}

testEmailSender();

