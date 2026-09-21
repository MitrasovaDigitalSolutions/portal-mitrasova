"use client"

import { LogOut, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUIStore } from "@/stores/ui-store"
import { useAuth } from "../hooks/use-auth"

export function UserNav() {
  const { user, logout, isLoggingOut } = useAuth()
  const { openConfirmDialog } = useUIStore()

  const displayName = user?.name || user?.email?.split("@")[0] || "Admin"
  const displayEmail = user?.email || ""

  const getInitials = (name?: string | null): string => {
    if (!name || !name.trim()) { return "AD" }
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }
    return parts
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  const handleLogoutClick = () => {
    openConfirmDialog({
      title: "Konfirmasi Keluar",
      description:
        "Apakah Anda yakin ingin keluar dari sistem Portal Mitrasova?",
      variant: "destructive",
      onConfirm: async () => {
        await logout()
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/80 bg-background p-1 transition-colors outline-none hover:bg-muted"
        aria-label="Menu Pengguna"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
          {getInitials(displayName)}
        </div>
        <div className="hidden flex-col pr-1.5 text-left md:flex">
          <span className="text-xs leading-tight font-bold text-foreground">
            {displayName}
          </span>
          {displayEmail && (
            <span className="max-w-[140px] truncate text-[10px] leading-tight text-muted-foreground">
              {displayEmail}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
        <DropdownMenuLabel className="px-2 py-1.5 font-normal">
          <div className="flex flex-col space-y-0.5">
            <p className="text-xs leading-none font-bold text-foreground">
              {displayName}
            </p>
            {displayEmail && (
              <p className="truncate text-[10px] leading-none text-muted-foreground">
                {displayEmail}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer gap-2 rounded-xl text-xs">
          <User size={14} className="text-muted-foreground" />
          <span>Profil Akun</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer gap-2 rounded-xl text-xs">
          <Settings size={14} className="text-muted-foreground" />
          <span>Pengaturan</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="cursor-pointer gap-2 rounded-xl text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut size={14} />
          <span>Keluar Sistem</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
