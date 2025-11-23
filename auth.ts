// Node.js runtime auth export for API routes
// This version includes Prisma adapter for database operations
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Login schema validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Override the Credentials provider with Prisma implementation
const credentialsProvider = Credentials({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    try {
      const parsed = loginSchema.safeParse(credentials)
      
      if (!parsed.success) {
        return null
      }

      const { email, password } = parsed.data

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (!user || !user.password) {
        return null
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return null
      }

      // Return user object (without password)
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      }
    } catch (error) {
      console.error("Authentication error:", error)
      return null
    }
  },
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers: [
    credentialsProvider,
    ...(authConfig.providers.filter((p: any) => p.id !== "credentials")),
  ],
  trustHost: true, // Required for NextAuth.js v5
  events: {
    async createUser({ user }) {
      // Set default role for new users
      if (user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: { role: "USER" },
        })
      }
    },
  },
})
