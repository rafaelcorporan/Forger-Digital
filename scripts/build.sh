#!/bin/bash

# Build script for Cloudflare Pages
# Provides dummy DATABASE_URL if not present (for build-time only)

if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set, using dummy URL for build"
  export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
fi

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Build Next.js
echo "🏗️  Building Next.js..."
npm run build:nextjs

