"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"

import { AppButton } from "@/components/shared/app-button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormInput } from "@/components/forms"
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes"
import { usePageLoadingStore } from "@/stores/page-loading-store"
import type { LoginFormValues } from "../validations/auth.schema"
import { loginSchema } from "../validations/auth.schema"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT
  const startLoading = usePageLoadingStore((state) => state.startLoading)

  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  const { handleSubmit, setValue, control } = methods
  const rememberValue = useWatch({ control, name: "remember" })

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (!result || result.error) {
        const errorText =
          result?.error ||
          "Kredensial yang Anda masukkan salah atau akun tidak ditemukan."
        setErrorMessage(errorText)
        toast.error(errorText)
        return
      }

      toast.success("Login berhasil! Mengalihkan...")
      startLoading()
      router.push(callbackUrl)
      router.refresh()
    } catch {
      const fallbackError = "Terjadi kesalahan saat menghubungi server."
      setErrorMessage(fallbackError)
      toast.error(fallbackError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-full max-w-[400px] overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-7 sm:p-8 shadow-2xl backdrop-blur-xl transition-all before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/40 before:to-transparent">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent text-primary shadow-sm shadow-primary/20 ring-1 ring-primary/20">
          <ShieldCheck size={22} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Portal Mitrasova
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Masuk ke akun Anda untuk mengelola portal
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 flex animate-in items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-xs text-destructive duration-200 fade-in">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span className="leading-snug font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormInput<LoginFormValues>
            name="email"
            label="Email"
            type="email"
            placeholder="Masukkan Email Anda..."
            autoComplete="email"
            startIcon={<Mail size={16} />}
            className="h-10.5 rounded-xl bg-background/60"
          />

          {/* Password Field */}
          <FormInput<LoginFormValues>
            name="password"
            label="Kata Sandi"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            startIcon={<Lock size={16} />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            className="h-10.5 rounded-xl bg-background/60"
          />

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-0.5">
            <Checkbox
              id="remember"
              checked={rememberValue}
              onCheckedChange={(checked) =>
                setValue("remember", Boolean(checked))
              }
              className="h-4 w-4 rounded-md cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="cursor-pointer text-xs font-medium text-muted-foreground select-none"
            >
              Ingat saya
            </label>
          </div>

          {/* Submit Button */}
          <AppButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Memverifikasi..."
            className="mt-2 h-11 w-full rounded-xl text-xs font-bold tracking-wider uppercase shadow-md shadow-primary/15 transition-all hover:shadow-lg hover:shadow-primary/25"
          >
            Masuk ke Portal
          </AppButton>
        </form>
      </FormProvider>
    </div>
  )
}
