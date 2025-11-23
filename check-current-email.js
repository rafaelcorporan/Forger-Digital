// Current Email Configuration Checker
// Run with: node check-current-email.js
// This script shows what email address is ACTUALLY configured right now

const fs = require('fs');
const path = require('path');

console.log('🔍 CHECKING CURRENT EMAIL CONFIGURATION\n');
console.log('=' .repeat(60));

// Load .env.local
const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('\n❌ CRITICAL ERROR: .env.local file NOT FOUND!');
  console.error('   Location expected: ' + envPath);
  console.error('\n📝 ACTION REQUIRED:');
  console.error('   Create .env.local file with Google Workspace credentials');
  console.error('   See: QUICK_EMAIL_SETUP.md for instructions\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('\n📧 CURRENT EMAIL CONFIGURATION:\n');

// Check SMTP_USER
if (envVars.SMTP_USER) {
  console.log(`SMTP_USER: ${envVars.SMTP_USER}`);
  
  if (envVars.SMTP_USER === 'hello@forgerdigital.com') {
    console.log('✅ Correct! Using new email address\n');
  } else if (envVars.SMTP_USER === 'info@cyberiteck.co') {
    console.log('❌ WRONG! Still using OLD email address\n');
    console.log('⚠️  THIS IS THE PROBLEM! Your emails are being sent from the old address.\n');
  } else {
    console.log('⚠️  Unexpected email address\n');
  }
} else {
  console.log('❌ SMTP_USER: NOT SET\n');
}

// Check SMTP_FROM_EMAIL
if (envVars.SMTP_FROM_EMAIL) {
  console.log(`SMTP_FROM_EMAIL: ${envVars.SMTP_FROM_EMAIL}`);
  
  if (envVars.SMTP_FROM_EMAIL === 'hello@forgerdigital.com') {
    console.log('✅ Correct! Using new email address\n');
  } else if (envVars.SMTP_FROM_EMAIL === 'info@cyberiteck.co') {
    console.log('❌ WRONG! Still using OLD email address\n');
  } else {
    console.log('⚠️  Unexpected email address\n');
  }
} else {
  console.log('⚠️  SMTP_FROM_EMAIL: NOT SET (will fallback to SMTP_USER)\n');
}

// Check SMTP_HOST
if (envVars.SMTP_HOST) {
  console.log(`SMTP_HOST: ${envVars.SMTP_HOST}`);
  
  if (envVars.SMTP_HOST === 'smtp.gmail.com') {
    console.log('✅ Correct! Using Google Workspace SMTP\n');
  } else if (envVars.SMTP_HOST === 'smtp.office365.com') {
    console.log('⚠️  Using Office365 SMTP (old configuration)\n');
  } else {
    console.log('⚠️  Custom SMTP host\n');
  }
} else {
  console.log('⚠️  SMTP_HOST: NOT SET\n');
}

// Check SMTP_PASSWORD
if (envVars.SMTP_PASSWORD) {
  console.log(`SMTP_PASSWORD: ***${envVars.SMTP_PASSWORD.slice(-4)} (${envVars.SMTP_PASSWORD.length} characters)`);
  
  if (envVars.SMTP_PASSWORD.length === 16) {
    console.log('✅ Correct length for Google App Password\n');
  } else {
    console.log('⚠️  Expected 16 characters for Google App Password\n');
  }
} else {
  console.log('❌ SMTP_PASSWORD: NOT SET\n');
}

console.log('=' .repeat(60));

// Determine status
const isCorrect = 
  envVars.SMTP_USER === 'hello@forgerdigital.com' &&
  envVars.SMTP_HOST === 'smtp.gmail.com';

if (isCorrect) {
  console.log('\n✅ CONFIGURATION IS CORRECT!\n');
  console.log('📝 Next steps:');
  console.log('   1. RESTART your development server: npm run dev');
  console.log('   2. Test email: node test-email.js');
  console.log('   3. Submit test form at http://localhost:3000/get-started\n');
} else {
  console.log('\n❌ CONFIGURATION IS INCORRECT!\n');
  console.log('🔧 FIX REQUIRED:\n');
  console.log('Edit your .env.local file and change:');
  console.log('');
  console.log('FROM (old):');
  if (envVars.SMTP_USER === 'info@cyberiteck.co') {
    console.log('  SMTP_USER=info@cyberiteck.co');
  }
  if (envVars.SMTP_HOST === 'smtp.office365.com') {
    console.log('  SMTP_HOST=smtp.office365.com');
  }
  console.log('');
  console.log('TO (new):');
  console.log('  SMTP_HOST=smtp.gmail.com');
  console.log('  SMTP_PORT=587');
  console.log('  SMTP_USER=hello@forgerdigital.com');
  console.log('  SMTP_PASSWORD=gioytymruerwpjzk');
  console.log('  SMTP_FROM_EMAIL=hello@forgerdigital.com');
  console.log('');
  console.log('Then:');
  console.log('  1. Save the file');
  console.log('  2. RESTART dev server: npm run dev');
  console.log('  3. Run: node check-current-email.js (to verify)');
  console.log('  4. Test: node test-email.js');
  console.log('');
}

console.log('=' .repeat(60));
console.log('\n📁 Configuration file: ' + envPath + '\n');

