// Email Configuration Verification Script
// Run with: node verify-email-config.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Email Configuration...\n');
console.log('=' .repeat(50));

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
const envVars = {};

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.error('   Please create .env.local in the project root\n');
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

console.log('✅ .env.local file found\n');

// Verify required variables
const requiredVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM_EMAIL'
];

let allValid = true;

console.log('📋 Checking Required Variables:\n');

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = value && value.trim() !== '';
  
  if (isSet) {
    console.log(`✅ ${varName.padEnd(20)} : ${varName.includes('PASSWORD') ? '***' + value.slice(-4) : value}`);
  } else {
    console.log(`❌ ${varName.padEnd(20)} : NOT SET`);
    allValid = false;
  }
});

console.log('\n' + '=' .repeat(50));

// Validate specific configurations
console.log('\n🔍 Validating Configuration:\n');

// Check SMTP Host
if (process.env.SMTP_HOST === 'smtp.gmail.com') {
  console.log('✅ SMTP Host: Correct (smtp.gmail.com)');
} else {
  console.log(`⚠️  SMTP Host: Expected 'smtp.gmail.com', got '${process.env.SMTP_HOST}'`);
  allValid = false;
}

// Check SMTP Port
if (process.env.SMTP_PORT === '587') {
  console.log('✅ SMTP Port: Correct (587 for TLS)');
} else if (process.env.SMTP_PORT === '465') {
  console.log('⚠️  SMTP Port: Using 465 (SSL) - Make sure to set secure:true in transporter');
} else {
  console.log(`❌ SMTP Port: Expected '587', got '${process.env.SMTP_PORT}'`);
  allValid = false;
}

// Check SMTP User (email format)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (emailRegex.test(process.env.SMTP_USER)) {
  console.log('✅ SMTP User: Valid email format');
} else {
  console.log(`❌ SMTP User: Invalid email format '${process.env.SMTP_USER}'`);
  allValid = false;
}

// Check SMTP Password (App Password format - 16 characters)
if (process.env.SMTP_PASSWORD && process.env.SMTP_PASSWORD.length === 16) {
  console.log('✅ SMTP Password: Correct length (16 characters - App Password format)');
} else if (process.env.SMTP_PASSWORD && process.env.SMTP_PASSWORD.includes(' ')) {
  console.log('❌ SMTP Password: Contains spaces - Remove all spaces from App Password');
  allValid = false;
} else if (process.env.SMTP_PASSWORD) {
  console.log(`⚠️  SMTP Password: Length is ${process.env.SMTP_PASSWORD.length} (expected 16 for Google App Password)`);
} else {
  console.log('❌ SMTP Password: Not set');
  allValid = false;
}

// Check From Email matches User
if (process.env.SMTP_FROM_EMAIL === process.env.SMTP_USER) {
  console.log('✅ From Email: Matches SMTP User (recommended)');
} else {
  console.log('⚠️  From Email: Different from SMTP User (may cause issues)');
}

// Check for expected email
if (process.env.SMTP_USER === 'hello@forgerdigital.com') {
  console.log('✅ Email Account: Using hello@forgerdigital.com');
} else {
  console.log(`⚠️  Email Account: Expected 'hello@forgerdigital.com', got '${process.env.SMTP_USER}'`);
}

console.log('\n' + '=' .repeat(50));

// Final verdict
console.log('\n🎯 Configuration Status:\n');

if (allValid) {
  console.log('✅ Configuration is VALID and ready to use!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Run: node test-email.js');
  console.log('   2. Check hello@forgerdigital.com inbox for test email');
  console.log('   3. Test contact forms at http://localhost:3000\n');
} else {
  console.log('❌ Configuration has ERRORS - Please fix the issues above');
  console.log('\n📝 To Fix:');
  console.log('   1. Open .env.local file');
  console.log('   2. Update the incorrect values');
  console.log('   3. Run this script again to verify\n');
  console.log('📖 See QUICK_EMAIL_SETUP.md for correct values\n');
}

console.log('=' .repeat(50) + '\n');

// File location check
console.log('📁 Configuration Files:');
console.log(`   .env.local: ${envPath}`);

const testScriptPath = path.join(__dirname, 'test-email.js');
if (fs.existsSync(testScriptPath)) {
  console.log(`   test-email.js: ${testScriptPath} ✅`);
} else {
  console.log('   test-email.js: NOT FOUND ❌');
}

const guidePath = path.join(__dirname, 'EMAIL_CONFIGURATION_GUIDE.md');
if (fs.existsSync(guidePath)) {
  console.log(`   Documentation: EMAIL_CONFIGURATION_GUIDE.md ✅`);
} else {
  console.log('   Documentation: NOT FOUND ❌');
}

console.log('\n');

process.exit(allValid ? 0 : 1);

