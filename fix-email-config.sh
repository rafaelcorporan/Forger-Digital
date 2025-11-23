#!/bin/bash

# Email Configuration Fix Script
# This script helps you update .env.local with correct Google Workspace credentials

echo "🔧 EMAIL CONFIGURATION FIX SCRIPT"
echo "=================================="
echo ""

ENV_FILE=".env.local"

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: $ENV_FILE not found!"
    echo ""
    echo "Creating $ENV_FILE with Google Workspace configuration..."
    cat > $ENV_FILE << 'EOL'
# ============================================
# GOOGLE WORKSPACE EMAIL CONFIGURATION
# ============================================
# Email: hello@forgerdigital.com
# Last Updated: 2025-11-23
# ============================================

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hello@forgerdigital.com
SMTP_PASSWORD=gioytymruerwpjzk
SMTP_FROM_EMAIL=hello@forgerdigital.com

# ============================================
# OTHER CONFIGURATION
# ============================================
# Add your other environment variables below
EOL
    echo "✅ Created $ENV_FILE with Google Workspace configuration"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Review $ENV_FILE"
    echo "   2. Add any other environment variables you need"
    echo "   3. Run: node check-current-email.js"
    echo "   4. RESTART dev server: npm run dev"
    echo ""
    exit 0
fi

echo "📁 Found existing $ENV_FILE"
echo ""
echo "🔍 Checking for old configuration..."
echo ""

# Check for old email configuration
if grep -q "info@cyberiteck.co" "$ENV_FILE"; then
    echo "⚠️  Found OLD email configuration (info@cyberiteck.co)"
    echo ""
    echo "🔄 Updating to Google Workspace configuration..."
    
    # Backup the old file
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Backup created: $ENV_FILE.backup.*"
    
    # Update SMTP_USER
    sed -i.tmp 's|SMTP_USER=info@cyberiteck.co|SMTP_USER=hello@forgerdigital.com|g' "$ENV_FILE"
    
    # Update SMTP_HOST if it's Office365
    sed -i.tmp 's|SMTP_HOST=smtp.office365.com|SMTP_HOST=smtp.gmail.com|g' "$ENV_FILE"
    
    # Update or add SMTP_FROM_EMAIL
    if grep -q "SMTP_FROM_EMAIL" "$ENV_FILE"; then
        sed -i.tmp 's|SMTP_FROM_EMAIL=.*|SMTP_FROM_EMAIL=hello@forgerdigital.com|g' "$ENV_FILE"
    else
        echo "SMTP_FROM_EMAIL=hello@forgerdigital.com" >> "$ENV_FILE"
    fi
    
    # Update SMTP_PASSWORD (this needs to be done manually for security)
    echo ""
    echo "⚠️  IMPORTANT: You need to manually update SMTP_PASSWORD"
    echo ""
    echo "Open $ENV_FILE and change:"
    echo "  SMTP_PASSWORD=<old-password>"
    echo "To:"
    echo "  SMTP_PASSWORD=gioytymruerwpjzk"
    echo ""
    
    # Clean up temp files
    rm -f "$ENV_FILE.tmp"
    
    echo "✅ Configuration updated!"
    echo ""
else
    echo "✅ No old configuration found"
    echo ""
    echo "🔍 Verifying Google Workspace configuration..."
    
    if grep -q "hello@forgerdigital.com" "$ENV_FILE"; then
        echo "✅ Found Google Workspace email (hello@forgerdigital.com)"
    else
        echo "⚠️  Google Workspace email not found"
        echo ""
        echo "Add these lines to $ENV_FILE:"
        echo ""
        echo "SMTP_HOST=smtp.gmail.com"
        echo "SMTP_PORT=587"
        echo "SMTP_USER=hello@forgerdigital.com"
        echo "SMTP_PASSWORD=gioytymruerwpjzk"
        echo "SMTP_FROM_EMAIL=hello@forgerdigital.com"
        echo ""
    fi
fi

echo "=" >> "="
echo ""
echo "📝 Next steps:"
echo "   1. Verify $ENV_FILE has correct Google Workspace credentials"
echo "   2. Run: node check-current-email.js"
echo "   3. RESTART dev server: npm run dev"
echo "   4. Test: node test-email.js"
echo ""
echo "=" >> "="

