# Authentication System Setup Guide

## Overview

This project now includes a complete authentication and authorization system built with NextAuth.js v5, Prisma, and PostgreSQL. The system supports:

- Email/Password authentication
- OAuth providers (Google, GitHub)
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Secure password hashing (bcrypt)
- JWT session management
- Protected routes via middleware
- Rate limiting for login attempts

---

## Prerequisites

1. **PostgreSQL Database** - You'll need a PostgreSQL database (local or cloud-hosted)
2. **OAuth Credentials** (Optional) - For Google and GitHub login

---

## Installation Steps

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
pnpm install
```

### 2. Set Up Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE quantum_forge;
   ```

#### Option B: Cloud Database (Recommended for Production)

Use services like:
- **Vercel Postgres** (recommended for Vercel deployments)
- **Supabase** (free tier available)
- **Railway** (easy setup)
- **Neon** (serverless PostgreSQL)

### 3. Configure Environment Variables

Create or update `.env.local` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quantum_forge?schema=public"

# NextAuth.js
AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Create First Admin User

You can create an admin user via Prisma Studio or by creating a script:

```typescript
// scripts/create-admin.ts
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('your-secure-password', 12)
  
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  
  console.log('Admin user created!')
}

createAdmin()
```

---

## OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### GitHub OAuth

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set:
   - **Application name:** Forger Digital
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env.local`

---

## Security Features Implemented

### ✅ Password Security
- **Hashing:** bcrypt with 12 rounds (industry standard)
- **Validation:** Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- **Storage:** Passwords never stored in plain text

### ✅ Session Security
- **Strategy:** JWT tokens (stateless, scalable)
- **Expiration:** 30 days
- **Storage:** HttpOnly cookies (prevents XSS)
- **Secure:** SameSite=Lax, Secure flag in production

### ✅ Route Protection
- **Middleware:** Automatic protection of `/dashboard`, `/admin`, `/profile`, `/settings`
- **Role-based:** Admin routes require ADMIN or SUPER_ADMIN role
- **Redirects:** Unauthenticated users redirected to sign-in with callback URL

### ✅ Rate Limiting
- **Login attempts:** 5 attempts per 15 minutes per IP/email
- **Prevention:** Protects against brute force attacks
- **Implementation:** In-memory (development) / Redis (production recommended)

### ✅ Input Validation
- **Client-side:** React Hook Form with Zod validation
- **Server-side:** Zod schema validation on all inputs
- **Sanitization:** Email normalization (lowercase)

---

## User Roles

### USER (Default)
- Access to dashboard
- View own profile
- Basic features

### ADMIN
- All USER permissions
- Access to `/admin` dashboard
- User management
- Form submission review
- Analytics access

### SUPER_ADMIN
- All ADMIN permissions
- System configuration
- Security settings
- Full platform control

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers
- `POST /api/auth/rate-limit` - Check rate limit status

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)
- `/admin` - Admin panel (requires ADMIN role)
- `/profile` - User profile (requires authentication)
- `/settings` - Account settings (requires authentication)

---

## Usage Examples

### Sign Up
```typescript
// User visits /auth/signup
// Fills form → Creates account → Auto signs in → Redirects to /dashboard
```

### Sign In
```typescript
// User visits /auth/signin
// Enters credentials → Validates → Creates session → Redirects to /dashboard
```

### Check Authentication in Component
```typescript
import { useSession } from "next-auth/react"

export default function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <div>Loading...</div>
  if (status === "unauthenticated") return <div>Please sign in</div>
  
  return <div>Welcome, {session?.user?.email}</div>
}
```

### Protect Server-Side Route
```typescript
import { auth } from "@/auth"

export default async function ProtectedPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  return <div>Protected content</div>
}
```

---

## Testing

### Manual Testing Checklist

1. **Sign Up Flow:**
   - [ ] Create account with valid data
   - [ ] Verify password requirements enforced
   - [ ] Confirm email validation works
   - [ ] Check auto sign-in after registration

2. **Sign In Flow:**
   - [ ] Sign in with correct credentials
   - [ ] Verify incorrect password rejection
   - [ ] Test rate limiting (5 failed attempts)
   - [ ] Confirm redirect to dashboard

3. **OAuth Flow:**
   - [ ] Google sign-in works
   - [ ] GitHub sign-in works
   - [ ] OAuth users can access dashboard

4. **Route Protection:**
   - [ ] Unauthenticated users redirected from `/dashboard`
   - [ ] Regular users cannot access `/admin`
   - [ ] Admin users can access `/admin`
   - [ ] Authenticated users redirected from `/auth/signin`

5. **Session Management:**
   - [ ] Sign out works correctly
   - [ ] Session persists across page refreshes
   - [ ] Session expires after 30 days

---

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Ensure database exists
- Run `npx prisma migrate dev` to create tables

### Authentication Not Working
- Verify `AUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure Prisma Client is generated (`npx prisma generate`)

### OAuth Not Working
- Verify client IDs and secrets are correct
- Check redirect URIs match exactly
- Ensure OAuth apps are approved (if in development mode)

### Build Errors
- Run `npx prisma generate` before building
- Ensure all environment variables are set
- Check for TypeScript errors

---

## Production Deployment

### Environment Variables (Production)

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
AUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="production-google-id"
GOOGLE_CLIENT_SECRET="production-google-secret"
GITHUB_CLIENT_ID="production-github-id"
GITHUB_CLIENT_SECRET="production-github-secret"
```

### Security Checklist

- [ ] Use strong `AUTH_SECRET` (32+ characters, random)
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Use production database with SSL
- [ ] Set up Redis for rate limiting (production)
- [ ] Configure CORS properly
- [ ] Enable database backups
- [ ] Set up monitoring and alerting

---

## Next Steps

1. **Create Admin User** - Use Prisma Studio or script
2. **Test Authentication** - Sign up, sign in, test protected routes
3. **Configure OAuth** - Set up Google/GitHub if desired
4. **Deploy Database** - Set up production PostgreSQL
5. **Add Features** - Build on top of authentication system

---

## Support

For issues or questions:
- Check NextAuth.js docs: https://next-auth.js.org
- Prisma docs: https://www.prisma.io/docs
- Review error logs in console

---

**Status:** ✅ Authentication system fully implemented and ready for use

