#!/bin/bash

# 🚀 Forger Digital - Deployment Helper Script
# This script guides you through the deployment process

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       🚀 FORGER DIGITAL DEPLOYMENT HELPER 🚀              ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""
echo -e "${GREEN}✅ Code is pushed to GitHub${NC}"
echo -e "${GREEN}✅ Cloudflare project created${NC}"
echo -e "${GREEN}✅ GitHub connected${NC}"
echo ""
echo -e "${YELLOW}⏳ FINAL STEP: Add Environment Variables${NC}"
echo ""

# Function to open URL in browser
open_url() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$1"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$1"
    else
        echo "Please open this URL manually: $1"
    fi
}

echo -e "${BLUE}📋 ENVIRONMENT VARIABLES TO ADD:${NC}"
echo ""
echo "Copy these values (they're also saved to a file):"
echo ""

# Create env vars file
cat > /tmp/cloudflare-env-vars.txt << 'EOF'
DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hello@forgerdigital.com
SMTP_PASSWORD=gioytymruerwpjzk
SMTP_FROM_EMAIL=hello@forgerdigital.com
NEXTAUTH_URL=https://forger-digital.pages.dev
NEXTAUTH_SECRET=Tto3sZoHzoddH4/yoJ69AVElDNoeCUwQZPweXrtujQw=
NODE_ENV=production
EOF

# Display variables
cat /tmp/cloudflare-env-vars.txt | while IFS='=' read -r key value; do
    echo -e "  ${GREEN}$key${NC} = ${YELLOW}$value${NC}"
done

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Copy to clipboard if available
if command -v pbcopy &> /dev/null; then
    cat /tmp/cloudflare-env-vars.txt | pbcopy
    echo -e "${GREEN}✅ Environment variables copied to clipboard!${NC}"
    echo ""
elif command -v xclip &> /dev/null; then
    cat /tmp/cloudflare-env-vars.txt | xclip -selection clipboard
    echo -e "${GREEN}✅ Environment variables copied to clipboard!${NC}"
    echo ""
fi

echo -e "${YELLOW}📝 Instructions:${NC}"
echo ""
echo "  1. I'll open Cloudflare Settings in your browser"
echo "  2. Scroll to 'Environment Variables' section"
echo "  3. Click 'Add variable' for each variable above"
echo "  4. For each variable:"
echo "     - Enter Variable name (left side of =)"
echo "     - Enter Value (right side of =)"
echo "     - Select 'Production' AND 'Preview'"
echo "     - Click 'Add'"
echo "  5. After adding all 9 variables, click 'Save'"
echo "  6. Go to 'Deployments' tab and click 'Retry deployment'"
echo ""
echo -e "${GREEN}💡 TIP: Variables are in your clipboard - just paste!${NC}"
echo ""

read -p "Press ENTER to open Cloudflare Settings..." 

# Open Cloudflare settings
echo ""
echo -e "${BLUE}🌐 Opening Cloudflare Dashboard...${NC}"
open_url "https://dash.cloudflare.com/a313f914a3caf00d68b03de5eadc54cc/pages/view/forger-digital/settings"

sleep 2

echo ""
echo -e "${YELLOW}⏳ Waiting for you to add variables...${NC}"
echo ""
echo "After adding all variables, return here and press ENTER to continue..."
read -p ""

clear

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            🎉 ALMOST DONE! FINAL STEP! 🎉                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Environment variables added${NC}"
echo ""
echo -e "${YELLOW}📍 FINAL STEP: Retry Deployment${NC}"
echo ""
echo "  1. I'll open the Deployments page"
echo "  2. Find the failed deployment"
echo "  3. Click 'Retry deployment' button"
echo "  4. Watch it build (5-10 minutes)"
echo "  5. ✅ YOUR SITE GOES LIVE!"
echo ""

read -p "Press ENTER to open Deployments page..." 

echo ""
echo -e "${BLUE}🌐 Opening Deployments...${NC}"
open_url "https://dash.cloudflare.com/a313f914a3caf00d68b03de5eadc54cc/pages/view/forger-digital"

sleep 2

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DEPLOYMENT INITIATED!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📊 Your Site:${NC}"
echo "   https://forger-digital.pages.dev"
echo ""
echo -e "${BLUE}📈 Monitor Progress:${NC}"
echo "   https://dash.cloudflare.com/a313f914a3caf00d68b03de5eadc54cc/pages/view/forger-digital"
echo ""
echo -e "${YELLOW}⏱️  Build Time: ~5-10 minutes${NC}"
echo ""
echo -e "${GREEN}🎉 After deployment, your website will be LIVE!${NC}"
echo ""
echo -e "${BLUE}🔄 Future Deployments:${NC}"
echo "   Every 'git push' will automatically deploy!"
echo ""
echo "   git add ."
echo "   git commit -m \"Update\""
echo "   git push origin main"
echo "   # ✅ Auto-deploys!"
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}💡 Environment variables are saved in:${NC}"
echo "   /tmp/cloudflare-env-vars.txt"
echo ""
echo -e "${GREEN}✨ Thank you for using Forger Digital Deployment Helper! ✨${NC}"
echo ""

