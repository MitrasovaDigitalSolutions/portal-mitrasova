"use client"

import type React from "react"
import {
  Boxes,
  CalendarClock,
  Globe,
  KeyRound,
  MoreVertical,
  Pencil,
  Puzzle,
  RefreshCw,
  ShieldAlert,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SUBSCRIPTION_TYPES } from "../constants"
import type { License } from "../@types/license"
import type { LicenseColumnActions } from "./license-columns"

interface LicenseMobileCardProps {
  license: License
  actions: LicenseColumnActions
}

export function LicenseMobileCard({
  license,
  actions,
}: LicenseMobileCardProps): React.JSX.Element {
  const subConfig = SUBSCRIPTION_TYPES[license.subscription_type]
  const count =
    license.licenseAddons?.length ?? license.license_addons?.length ?? 0

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground truncate">
              {license.nama_instance}
            </span>
            <StatusBadge status={license.status} className="text-[10px]" />
          </div>
          <p className="text-xs text-muted-foreground font-mono truncate">
            {license.product?.nama || "Software"} ({license.product?.code || "APP"})
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground"
            >
              <MoreVertical size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 text-xs">
            <DropdownMenuItem onClick={() => actions.onInspectDetail(license)}>
              <KeyRound size={13} className="mr-2 text-primary" />
              <span>Detail & Secret</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onEdit(license)}>
              <Pencil size={13} className="mr-2 text-amber-500" />
              <span>Edit Data Lisensi</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onExtend(license)}>
              <CalendarClock size={13} className="mr-2 text-emerald-500" />
              <span>Perpanjang Masa Aktif</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onSyncAddons(license)}>
              <Boxes size={13} className="mr-2 text-indigo-500" />
              <span>Kelola Modul Addon</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onResetDomain(license)}>
              <RefreshCw size={13} className="mr-2 text-sky-500" />
              <span>Reset Domain Binding</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onRegenerateSecret(license)}>
              <ShieldAlert size={13} className="mr-2 text-amber-500" />
              <span>Regenerate Secret</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => actions.onDelete(license)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 size={13} className="mr-2" />
              <span>Hapus Lisensi</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Globe size={12} className="shrink-0" />
        <span className="font-mono truncate">
          {license.domain_instance || "Domain belum diikat"}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
        <div className="flex items-center gap-1.5">
          <Badge
            variant={subConfig?.badgeVariant ?? "secondary"}
            className="text-[10px]"
          >
            {subConfig?.label.split(" ")[0] ?? license.subscription_type}
          </Badge>
          {count > 0 && (
            <Badge variant="outline" className="text-[10px] gap-1 font-mono">
              <Puzzle size={10} />
              <span>{count} Addon</span>
            </Badge>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => actions.onInspectDetail(license)}
          className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
        >
          <KeyRound size={12} />
          <span>Lihat Key</span>
        </Button>
      </div>
    </div>
  )
}
