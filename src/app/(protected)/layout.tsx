import type { ReactNode } from "react"
import { AppHeader, AppSidebar } from "@/components/layout"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] h-screen max-h-[100dvh] min-h-0 w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar Navigation */}
      <AppSidebar />

      {/* Main Content Layout */}
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <AppHeader />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overscroll-y-contain p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
