"use client"

import type React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils"
import type { Client } from "../@types/client"

interface ClientDetailHeaderProps {
  client?: Client
  isFetching?: boolean
  onRefresh?: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ClientDetailHeader({
  client,
  isFetching = false,
  onRefresh,
  onEdit,
  onDelete,
}: ClientDetailHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Breadcrumbs & Client Identity */}
      <div className="min-w-0 space-y-1.5">
        {/* Breadcrumb back link */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Link
            href="/clients"
            className="flex items-center gap-1 font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft size={12} />
            <span>Kembali ke Daftar Klien</span>
          </Link>
        </div>

        {/* Client Title & Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {client?.nama_pemilik || "Detail Klien"}
          </h1>

          {client?.nama_perusahaan && (
            <Badge
              variant="outline"
              className="gap-1 border-border/80 bg-background/50 text-xs font-normal text-foreground"
            >
              <Building2 size={11} className="text-muted-foreground" />
              <span className="max-w-[200px] truncate">
                {client.nama_perusahaan}
              </span>
            </Badge>
          )}

          {client?.created_at && (
            <Badge
              variant="secondary"
              className="hidden gap-1 text-[11px] font-normal text-muted-foreground md:inline-flex"
            >
              <Calendar size={11} className="text-muted-foreground" />
              <span>Sejak {formatDate(client.created_at)}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-1.5 self-start sm:self-auto">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-8 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-medium"
            title="Muat ulang data klien"
          >
            <RefreshCw
              size={12}
              className={isFetching ? "animate-spin text-primary" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-8 cursor-pointer gap-1.5 rounded-lg px-3 text-xs font-medium"
        >
          <Pencil size={12} />
          <span>Edit Klien</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="h-8 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-medium text-destructive hover:border-destructive/30 hover:bg-destructive/10"
          title="Hapus data klien"
        >
          <Trash2 size={12} />
          <span>Hapus</span>
        </Button>
      </div>
    </div>
  )
}
