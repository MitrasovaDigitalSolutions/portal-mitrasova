import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ROUTES } from "@/constants/routes"
import type { LoginResponse } from "@/features/auth/@types/auth"

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const rawBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://portal.mitrasovapos.my.id"
        const baseUrl = rawBaseUrl
          .replace(/\/+$/, "")
          .replace(
            /^http:\/\/portal\.mitrasovapos\.my\.id/,
            "https://portal.mitrasovapos.my.id"
          )

        try {
          const res = await fetch(`${baseUrl}/api/v1/admin/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = (await res.json()) as LoginResponse & {
            errors?: Record<string, string[]>
          }

          // Extract token from root or nested data payload
          const token =
            data.token ||
            data.access_token ||
            data.data?.token ||
            data.data?.access_token

          // Extract user from root or nested data payload
          const user = data.user || data.data?.user

          if (!res.ok || !token) {
            const errorMessage =
              data.errors?.email?.[0] ||
              (data.message && data.message !== "Login berhasil"
                ? data.message
                : undefined) ||
              "Kredensial yang diberikan tidak valid atau token autentikasi tidak ditemukan."
            throw new Error(errorMessage)
          }

          const emailStr = String(credentials.email)

          return {
            id: String(user?.id ?? "1"),
            name: user?.name || emailStr.split("@")[0] || "Admin",
            email: user?.email || emailStr,
            accessToken: token,
          }
        } catch (error) {
          if (error instanceof Error) {
            throw error
          }
          throw new Error("Gagal terhubung ke server backend.")
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: ROUTES.LOGIN,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name ?? ""
        token.email = user.email ?? ""
        token.accessToken = user.accessToken
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id
        } else if (typeof token.sub === "string") {
          session.user.id = token.sub
        }
        if (typeof token.name === "string") {
          session.user.name = token.name
        }
        if (typeof token.email === "string") {
          session.user.email = token.email
        }
      }
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken
      }
      return session
    },
  },

  trustHost: true,
} satisfies NextAuthConfig

export default authConfig
