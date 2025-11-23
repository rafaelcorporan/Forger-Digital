#!/bin/bash

# 🚀 Forger Digital - Cloudflare Pages Deployment Script
# This script helps you complete the deployment to Cloudflare Pages

set -e

echo "🚀 Forger Digital - Cloudflare Pages Deployment"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found!${NC}"
    echo "Install with: npm install -g wrangler"
    exit 1
fi

# Check if logged in
if ! wrangler whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Cloudflare!${NC}"
    echo "Run: wrangler login"
    exit 1
fi

echo -e "${GREEN}✅ Wrangler CLI ready${NC}"
echo ""

# Project details
PROJECT_NAME="forger-digital"
PROJECT_URL="https://forger-digital.pages.dev"
GITHUB_REPO="https://github.com/rafaelcorporan/Forger-Digital"

echo -e "${BLUE}📦 Project Details:${NC}"
echo "   Name: $PROJECT_NAME"
echo "   URL: $PROJECT_URL"
echo "   GitHub: $GITHUB_REPO"
echo ""

# Check project exists
echo -e "${BLUE}🔍 Checking Cloudflare Pages project...${NC}"
if wrangler pages project list | grep -q "$PROJECT_NAME"; then
    echo -e "${GREEN}✅ Project '$PROJECT_NAME' exists${NC}"
else
    echo -e "${YELLOW}⚠️  Project not found. Creating...${NC}"
    wrangler pages project create "$PROJECT_NAME" --production-branch=main
fi
echo ""

# Instructions for GitHub connection
echo -e "${YELLOW}📋 MANUAL STEP REQUIRED:${NC}"
echo "   To deploy your Next.js app with API routes, you need to:"
echo ""
echo "   1. Open Cloudflare Dashboard:"
echo -e "      ${BLUE}https://dash.cloudflare.com/$(wrangler whoami 2>/dev/null | grep 'Account ID' | awk '{print $NF}')/pages/view/$PROJECT_NAME${NC}"
echo ""
echo "   2. Click 'Settings' → 'Builds & deployments'"
echo ""
echo "   3. Click 'Connect to Git' → 'GitHub'"
echo ""
echo "   4. Select repository: 'rafaelcorporan/Forger-Digital'"
echo ""
echo "   5. Configure build settings:"
echo "      - Framework: Next.js"
echo "      - Build command: npm run build"
echo "      - Output directory: .next"
echo ""
echo "   6. Add environment variables (see below)"
echo ""
echo "   7. Click 'Save and Deploy'"
echo ""

# Environment variables
echo -e "${YELLOW}🔐 ENVIRONMENT VARIABLES TO ADD:${NC}"
echo ""
cat << 'EOF'
# Copy these to Cloudflare Dashboard → Settings → Environment Variables

# Database
DATABASE_URL=your_database_url_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hello@forgerdigital.com
SMTP_PASSWORD=gioytymruerwpjzk
SMTP_FROM_EMAIL=hello@forgerdigital.com

# Authentication
NEXTAUTH_URL=https://forger-digital.pages.dev
NEXTAUTH_SECRET=Tto3sZoHzoddH4/yoJ69AVElDNoeCUwQZPweXrtujQw=

# Environment
NODE_ENV=production

# Optional (add if you use these services)
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_PUBLISHABLE_KEY=pk_live_...
# REDIS_URL=redis://...
# SENTRY_DSN=https://...
EOF

echo ""
echo -e "${GREEN}✅ Pre-deployment checklist complete!${NC}"
echo ""
echo -e "${BLUE}📖 Next steps:${NC}"
echo "   1. Follow the manual steps above to connect GitHub"
echo "   2. Add environment variables in Cloudflare Dashboard"
echo "   3. Deploy!"
echo ""
echo -e "${YELLOW}💡 After deployment:${NC}"
echo "   Every 'git push' will automatically trigger a new deployment!"
echo ""
echo -e "${GREEN}🎉 Your site will be live at: $PROJECT_URL${NC}"
echo ""

