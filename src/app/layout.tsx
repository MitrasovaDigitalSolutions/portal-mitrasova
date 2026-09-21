import type { ReactNode } from "react"
import { Suspense } from "react"
import { Geist_Mono, Inter } from "next/font/google"

import { AuthProvider } from "@/components/providers/auth-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { PageLoader } from "@/components/shared/page-loader"
import { PageLoadingTracker } from "@/components/shared/page-loading-tracker"
import { cn } from "@/lib/utils"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors />
              <ConfirmDialog />
              <PageLoader />
              <Suspense fallback={null}>
                <PageLoadingTracker />
              </Suspense>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
