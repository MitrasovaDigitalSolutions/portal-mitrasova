"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Building2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Client } from "../@types/client"

interface ClientDetailHeaderProps {
  client?: Client
  isFetching?: boolean
  onRefresh?: () => void
  onEdit: () => void
  onDelete: () => void
  onCreateLicense: () => void
}

export function ClientDetailHeader({
  client,
  isFetching = false,
  onRefresh,
  onEdit,
  onDelete,
  onCreateLicense,
}: ClientDetailHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border">
      {/* Left: Back button & Title */}
      <div className="flex items-start sm:items-center gap-3">
        <Link href="/clients">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl cursor-pointer shrink-0"
            title="Kembali ke Daftar Klien"
          >
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground truncate">
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
            className="h-9 px-3 rounded-xl gap-2 cursor-pointer"
            title="Muat ulang data"
          >
            <RefreshCw
              size={13}
              className={isFetching ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline text-xs">Refresh</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-9 px-3 rounded-xl gap-1.5 cursor-pointer text-xs"
        >
          <Pencil size={13} />
          <span>Edit Klien</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="h-9 px-3 rounded-xl gap-1.5 cursor-pointer text-xs text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={13} />
          <span>Hapus</span>
        </Button>

        <Button
          type="button"
          onClick={onCreateLicense}
          className="h-9 px-3.5 rounded-xl gap-1.5 cursor-pointer text-xs font-medium shadow-xs"
        >
          <Plus size={14} />
          <span>Tambah Lisensi</span>
        </Button>
      </div>
    </div>
  )
}
