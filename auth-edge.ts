// Edge-compatible auth export for middleware
// This version does NOT include Prisma adapter or any database dependencies
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Create auth instance without Prisma adapter for Edge Runtime
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // No adapter - JWT strategy works without database in Edge Runtime
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true, // Required for NextAuth.js v5
})
