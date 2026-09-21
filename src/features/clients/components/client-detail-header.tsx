"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Building2, Pencil, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Back button & Title */}
      <div className="flex items-start gap-3 sm:items-center">
        <Link href="/clients">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 cursor-pointer rounded-xl"
            title="Kembali ke Daftar Klien"
          >
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
              {client?.nama_pemilik || "Detail Klien"}
            </h1>
            {client?.nama_perusahaan && (
              <Badge variant="outline" className="gap-1 text-xs font-normal">
                <Building2 size={11} className="text-muted-foreground" />
                <span>{client.nama_perusahaan}</span>
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Pusat data profil klien dan manajemen lisensi perangkat terpasang.
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 cursor-pointer gap-2 rounded-xl px-3"
            title="Muat ulang data"
          >
            <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
            <span className="hidden text-xs sm:inline">Refresh</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-9 cursor-pointer gap-1.5 rounded-xl px-3 text-xs"
        >
          <Pencil size={13} />
          <span>Edit Klien</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="h-9 cursor-pointer gap-1.5 rounded-xl px-3 text-xs text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={13} />
          <span>Hapus</span>
        </Button>
      </div>
    </div>
  )
}
