"use client"

import type { JSX } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarClock,
  ChevronRight,
  CreditCard,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  ShieldAlert,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { License } from "../@types/license"
import { SERVER_TYPES, SUBSCRIPTION_TYPES, formatCodeToTitle } from "../constants"

interface LicenseDetailHeaderProps {
  license: License
  clientId?: string
  clientName?: string
  isFetching?: boolean
  onEdit: () => void
  onOrder?: () => void
  onExtend?: () => void
  onResetDomain: () => void
  onRegenerateSecret: () => void
  onDelete: () => void
}

export function LicenseDetailHeader({
  license,
  clientId,
  clientName,
  isFetching,
  onEdit,
  onOrder,
  onExtend,
  onResetDomain,
  onRegenerateSecret,
  onDelete,
}: LicenseDetailHeaderProps): JSX.Element {
  const subConfig = SUBSCRIPTION_TYPES[license.subscription_type]
  const serverConfig = SERVER_TYPES[license.server_type]
  const effectiveClientId = clientId || license.client_id || license.client?.id
  const effectiveClientName =
    clientName ||
    license.client?.nama_perusahaan ||
    license.client?.nama_pemilik ||
    "Klien"

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <Link
          href="/clients"
          className="hover:text-foreground transition-colors"
        >
          Klien
        </Link>
        <ChevronRight size={12} className="text-muted-foreground/60" />
        {effectiveClientId ? (
          <Link
            href={`/clients/${effectiveClientId}`}
            className="hover:text-foreground transition-colors truncate max-w-[180px]"
          >
            {effectiveClientName}
          </Link>
        ) : (
          <span className="truncate max-w-[180px]">{effectiveClientName}</span>
        )}
        <ChevronRight size={12} className="text-muted-foreground/60" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {license.nama_instance}
        </span>
        {isFetching && (
          <span className="inline-flex items-center gap-1 ml-2 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            <RefreshCw size={10} className="animate-spin" /> Memperbarui...
          </span>
        )}
      </nav>

      {/* Main Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-border">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href={effectiveClientId ? `/clients/${effectiveClientId}` : "/clients"}
            className="inline-flex items-center justify-center size-8 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Kembali ke profil klien"
          >
            <ArrowLeft size={15} />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {license.nama_instance}
              </h1>
              <StatusBadge status={license.status} />
              <Badge variant={subConfig?.badgeVariant ?? "secondary"} className="text-xs">
                {subConfig?.label ?? formatCodeToTitle(license.subscription_type)}
              </Badge>
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {serverConfig?.label ?? formatCodeToTitle(license.server_type)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
          >
            <Pencil size={13} />
            <span>Edit</span>
          </Button>

          {onOrder ? (
            <Button
              type="button"
              size="sm"
              onClick={onOrder}
              className="h-8 px-3 text-xs gap-1.5 cursor-pointer font-medium shadow-xs"
            >
              <CreditCard size={13} />
              <span>Beli / Perpanjang</span>
            </Button>
          ) : onExtend ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onExtend}
              className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
            >
              <CalendarClock size={13} />
              <span>Perpanjang</span>
            </Button>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground"
              >
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuItem onClick={onResetDomain}>
                <RefreshCw size={13} className="mr-2 text-muted-foreground" />
                <span>Reset Domain Binding</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRegenerateSecret}>
                <ShieldAlert size={13} className="mr-2 text-muted-foreground" />
                <span>Regenerate Secret</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 size={13} className="mr-2" />
                <span>Hapus Lisensi</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
