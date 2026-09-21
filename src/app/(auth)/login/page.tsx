import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = {
  title: "Masuk ke Akun Admin | Portal Mitrasova",
  description: "Halaman login autentikasi admin Portal Mitrasova.",
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center text-xs text-muted-foreground">
          Memuat form login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
