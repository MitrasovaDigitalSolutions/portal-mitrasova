import type { ReactNode } from "react"
import { AppHeader, AppSidebar } from "@/components/layout"

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-screen h-[100dvh] max-h-[100dvh] w-full min-h-0 overflow-hidden bg-background text-foreground">
      {/* Sidebar Navigation */}
      <AppSidebar />

      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col h-full min-h-0 min-w-0 overflow-hidden">
        {/* Top Header */}
        <AppHeader />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 overscroll-y-contain">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
