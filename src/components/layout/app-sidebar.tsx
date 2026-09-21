"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronsLeft, ChevronsRight, ShieldCheck } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useSidebarStore } from "@/stores/sidebar-store"
import { cn } from "@/lib/utils"
import { SIDEBAR_NAV_ITEMS } from "./sidebar-config"
import { SidebarItem } from "./sidebar-item"

export function AppSidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggle, isMobileOpen, setMobileOpen } = useSidebarStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  const collapsed = mounted ? isCollapsed : false

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Backdrop Overlay */}
      {mounted && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          "flex flex-col justify-between border-r border-border bg-card text-foreground transition-all duration-300 select-none h-screen h-[100dvh] shrink-0",
          // Mobile overlay vs Desktop relative layout
          "fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 lg:z-40",
          mounted && isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Desktop Collapse / Expand Toggle Button Tab (POS-MULTI-STORE style) */}
        <button
          type="button"
          onClick={toggle}
          className="absolute top-2 -right-4 z-50 hidden h-12 w-4 items-center justify-center rounded-tr-md rounded-br-md border-y border-r border-border bg-card text-muted-foreground shadow-md transition-all outline-none hover:bg-muted hover:text-foreground cursor-pointer lg:flex"
          title={collapsed ? "Perluas Menu" : "Sembunyikan Menu"}
          aria-label={collapsed ? "Perluas Menu" : "Sembunyikan Menu"}
        >
          {collapsed ? (
            <ChevronsRight size={13} className="stroke-[3]" />
          ) : (
            <ChevronsLeft size={13} className="stroke-[3]" />
          )}
        </button>

        {/* Top: Brand Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-border transition-all",
            collapsed ? "justify-center px-0" : "px-4 gap-3"
          )}
        >
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 overflow-hidden",
              collapsed && "justify-center"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
              <ShieldCheck size={18} />
            </div>

            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  Portal Mitrasova
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Admin System
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Center: Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {SIDEBAR_NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </div>

        {/* Bottom: Footer Info */}
        <div className="border-t border-border p-3 text-center">
          {!collapsed && (
            <div className="text-[11px] text-muted-foreground/70">
              Mitrasova &copy; 2026
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
