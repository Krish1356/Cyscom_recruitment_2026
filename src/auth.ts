import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email
        if (!email) return false

        // 1. Allow all VIT students
        if (email.endsWith("@vitstudent.ac.in")) {
          return true
        }

        // 2. Check if the user is already an admin in our database
        const existingUser = await prisma.user.findUnique({
          where: { email },
        })
        
        if (existingUser && (existingUser.role === "ADMIN" || existingUser.role === "SUPER_ADMIN")) {
          return true
        }

        // 3. Check if the user is in the predefined ADMIN_EMAILS list (to bootstrap the first admins)
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || []
        
        // Add hardcoded super admins
        const hardcodedAdmins = ["chitwansbagga@gmail.com"];
        const allAdmins = [...adminEmails, ...hardcodedAdmins];

        if (allAdmins.includes(email)) {
          // Auto-upgrade their role in the database to SUPER_ADMIN
          const existing = await prisma.user.findUnique({ where: { email } });
          if (existing && existing.role !== "SUPER_ADMIN") {
            await prisma.user.update({
              where: { email },
              data: { role: "SUPER_ADMIN" }
            });
            await prisma.adminUser.upsert({
              where: { userId: existing.id },
              update: {},
              create: { userId: existing.id }
            });
          }
          return true
        }

        // Deny access otherwise
        return false
      }
      return true
    },
    async session({ session, user }) {
      // Pass the user ID and role to the session
      if (session.user) {
        session.user.id = user.id
        // @ts-ignore
        session.user.role = user.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on error (e.g. denied access)
  },
})
