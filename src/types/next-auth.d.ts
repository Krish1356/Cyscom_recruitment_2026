import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "APPLICANT" | "ADMIN" | "SUPER_ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    role: "APPLICANT" | "ADMIN" | "SUPER_ADMIN"
  }
}
