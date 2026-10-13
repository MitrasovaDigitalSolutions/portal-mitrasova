"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronsLeft, ChevronsRight, ShieldCheck } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useSidebarStore } from "@/stores/sidebar-store"
import { cn } from "@/lib/utils"
import { SIDEBAR_SECTIONS } from "./sidebar-config"
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          "flex h-[100dvh] h-screen shrink-0 flex-col justify-between border-r border-border bg-card text-foreground transition-all duration-300 select-none",
          // Mobile overlay vs Desktop relative layout
          "fixed inset-y-0 left-0 z-50 lg:relative lg:z-40 lg:translate-x-0",
          mounted && isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Desktop Collapse / Expand Toggle Button Tab (POS-MULTI-STORE style) */}
        <button
          type="button"
          onClick={toggle}
          className="absolute top-2 -right-4 z-50 hidden h-12 w-4 cursor-pointer items-center justify-center rounded-tr-md rounded-br-md border-y border-r border-border bg-card text-muted-foreground shadow-md transition-all outline-none hover:bg-muted hover:text-foreground lg:flex"
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
            collapsed ? "justify-center px-0" : "gap-3 px-4"
          )}
        >
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 overflow-hidden",
              collapsed && "justify-center"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-xs">
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
        <div className="flex-1 space-y-3.5 overflow-y-auto px-3 py-3">
          {SIDEBAR_SECTIONS.map((section, sIdx) => (
            <div key={section.title} className="space-y-1">
              {!collapsed ? (
                <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold tracking-wider text-muted-foreground/70 uppercase">
                  {section.title}
                </div>
              ) : (
                sIdx > 0 && <div className="my-1.5 border-t border-border/50" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item, iIdx) => (
                  <SidebarItem
                    key={item.href ?? `${section.title}-${item.title}-${iIdx}`}
                    item={item}
                    collapsed={collapsed}
                    pathname={pathname}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </div>
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
