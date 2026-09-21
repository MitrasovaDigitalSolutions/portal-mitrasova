"use client"

import { usePathname } from "next/navigation"
import { Calendar, Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useSidebarStore } from "@/stores/sidebar-store"
import { UserNav } from "@/features/auth/components/user-nav"
import { getNavTitle } from "./sidebar-config"

export function AppHeader() {
  const pathname = usePathname()
  const { toggleMobile } = useSidebarStore()
  const { resolvedTheme, setTheme } = useTheme()

  const title = getNavTitle(pathname)

  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date())

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Toggle + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobile}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu size={18} />
        </button>

        <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
          {title}
        </h1>
      </div>

      {/* Right: Date Badge + Theme Toggle + User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Date Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground md:flex">
          <Calendar size={13} className="text-primary" />
          <span suppressHydrationWarning>{todayFormatted}</span>
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
          aria-label="Ganti mode tampilan"
        >
          <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Ganti mode tampilan</span>
        </Button>

        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* User Navigation Dropdown */}
        <UserNav />
      </div>
    </header>
  )
}
