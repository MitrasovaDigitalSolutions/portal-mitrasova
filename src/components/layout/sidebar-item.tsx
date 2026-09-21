"use client"

import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { NavItem } from "./sidebar-config"

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
}: SidebarItemProps) {
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href)

  const Icon = item.icon

  const content = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-xs font-medium transition-all select-none",
        isActive
          ? "bg-primary text-primary-foreground shadow-xs font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-0 w-10 mx-auto"
      )}
    >
      <Icon
        size={18}
        className={cn(
          "shrink-0 transition-transform duration-200 group-hover:scale-105",
          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}
      />

      {!collapsed && (
        <span className="truncate">{item.title}</span>
      )}

      {!collapsed && item.badge && (
        <span
          className={cn(
            "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold",
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

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-semibold text-xs">
          {item.title}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
