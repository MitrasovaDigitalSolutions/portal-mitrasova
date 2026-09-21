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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
      {/* Left: Breadcrumbs & Client Identity */}
      <div className="space-y-1.5 min-w-0">
        {/* Breadcrumb back link */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Link
            href="/clients"
            className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft size={12} />
            <span>Kembali ke Daftar Klien</span>
          </Link>
        </div>

        {/* Client Title & Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="truncate text-lg sm:text-xl font-bold tracking-tight text-foreground">
            {client?.nama_pemilik || "Detail Klien"}
          </h1>

          {client?.nama_perusahaan && (
            <Badge
              variant="outline"
              className="gap-1 text-xs font-normal bg-background/50 text-foreground border-border/80"
            >
              <Building2 size={11} className="text-muted-foreground" />
              <span className="truncate max-w-[200px]">
                {client.nama_perusahaan}
              </span>
            </Badge>
          )}

          {client?.created_at && (
            <Badge
              variant="secondary"
              className="gap-1 text-[11px] font-normal text-muted-foreground hidden md:inline-flex"
            >
              <Calendar size={11} className="text-muted-foreground" />
              <span>Sejak {formatDate(client.created_at)}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-8 px-2.5 rounded-lg gap-1.5 cursor-pointer text-xs font-medium"
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
          className="h-8 px-3 rounded-lg gap-1.5 cursor-pointer text-xs font-medium"
        >
          <Pencil size={12} />
          <span>Edit Klien</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="h-8 px-2.5 rounded-lg gap-1.5 cursor-pointer text-xs font-medium text-destructive hover:bg-destructive/10 hover:border-destructive/30"
          title="Hapus data klien"
        >
          <Trash2 size={12} />
          <span>Hapus</span>
        </Button>
      </div>
    </div>
  )
}
