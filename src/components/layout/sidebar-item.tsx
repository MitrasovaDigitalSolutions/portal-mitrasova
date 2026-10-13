"use client"

import { useState, type JSX } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { type NavItem, hasActiveChild, isNavItemActive } from "./sidebar-config"

interface SidebarItemProps {
  item: NavItem
  collapsed: boolean
  pathname: string
  onClick?: () => void
}

export function SidebarItem({
  item,
  collapsed,
  pathname,
  onClick,
}: SidebarItemProps): JSX.Element {
  const isChildActive = hasActiveChild(item, pathname)
  const isSelfActive = isNavItemActive(item, pathname)
  const isActive = isSelfActive || isChildActive

  const hasChildren = Boolean(item.children && item.children.length > 0)

  // Otomatis terbuka jika salah satu child sedang aktif, tapi user bisa toggle manual
  const [isManualExpanded, setIsManualExpanded] = useState<boolean | null>(null)
  const isOpen = isManualExpanded !== null ? isManualExpanded : isChildActive

  const Icon = item.icon

  // ─── 1. MODE COLLAPSED (Mini Sidebar: Ikon Saja) ───────────────────
  if (collapsed) {
    // A. Item Tunggal tanpa anak
    if (!hasChildren && item.href) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              onClick={onClick}
              className={cn(
                "group mx-auto flex size-10 items-center justify-center rounded-xl transition-all select-none",
                isActive
                  ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs font-semibold">
            {item.title}
          </TooltipContent>
        </Tooltip>
      )
    }

    // B. Item Parent dengan anak -> Menggunakan DropdownMenu melayang ke kanan
    return (
      <DropdownMenu>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "group mx-auto flex size-10 cursor-pointer items-center justify-center rounded-xl transition-all outline-none select-none",
                  isActive
                    ? "border border-primary/30 bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-label={item.title}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs font-semibold">
            {item.title}
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={8}
          className="w-48 rounded-xl border border-border bg-popover p-1 shadow-lg"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-bold tracking-tight text-foreground">
            {item.title}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border/60" />
          {item.children?.map((child) => {
            const isChildItemActive = pathname.startsWith(child.href)
            const ChildIcon = child.icon
            return (
              <DropdownMenuItem key={child.href} asChild>
                <Link
                  href={child.href}
                  onClick={onClick}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                    isChildItemActive
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {ChildIcon && <ChildIcon size={14} className="shrink-0" />}
                  <span className="truncate">{child.title}</span>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // ─── 2. MODE EXPANDED (Sidebar Penuh) ──────────────────────────────
  // A. Item Tunggal tanpa anak
  if (!hasChildren && item.href) {
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "group relative flex h-9 items-center gap-2.5 rounded-xl px-2.5 text-xs font-medium transition-all select-none",
          isActive
            ? "bg-primary font-semibold text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon
          size={16}
          className={cn(
            "shrink-0 transition-transform duration-200 group-hover:scale-105",
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        <span className="truncate">{item.title}</span>
        {item.badge && (
          <span
            className={cn(
              "py-0.2 ml-auto rounded-full px-1.5 text-[9px] font-bold",
              isActive
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  // B. Parent Item dengan Accordion Collapsible
  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => setIsManualExpanded(!isOpen)}
        className={cn(
          "group flex h-9 w-full cursor-pointer items-center justify-between rounded-xl px-2.5 text-xs font-medium transition-all select-none",
          isActive
            ? "bg-primary/10 font-semibold text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Icon
            size={16}
            className={cn(
              "shrink-0 transition-transform duration-200 group-hover:scale-105",
              isActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          <span className="truncate">{item.title}</span>
        </div>
        <ChevronRight
          size={13}
          className={cn(
            "shrink-0 transition-transform duration-200",
            isOpen ? "rotate-90 text-foreground" : "text-muted-foreground/70"
          )}
        />
      </button>

      {/* Children list with indentation */}
      {isOpen && (
        <div className="relative my-0.5 space-y-0.5 pl-4">
          {/* Vertical guideline */}
          <div className="absolute top-1 bottom-1 left-2.5 w-px bg-border/70" />
          {item.children?.map((child) => {
            const isChildItemActive = pathname.startsWith(child.href)
            const ChildIcon = child.icon
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClick}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-lg px-2 text-[11px] font-medium transition-colors select-none",
                  isChildItemActive
                    ? "bg-primary font-semibold text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {ChildIcon ? (
                  <ChildIcon size={13} className="shrink-0" />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                )}
                <span className="truncate">{child.title}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
