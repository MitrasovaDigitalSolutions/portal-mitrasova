"use client"

import type React from "react"
import { Building2, ChevronRight, KeyRound, Mail, Pencil, Phone, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Client } from "../@types/client"

interface ClientMobileCardProps {
  client: Client
  onViewDetail?: (client: Client) => void
  onEdit?: (client: Client) => void
  onDelete?: (client: Client) => void
}

export function ClientMobileCard({
  client,
  onViewDetail,
  onEdit,
  onDelete,
}: ClientMobileCardProps): React.JSX.Element {
  const total = client.licenses_count ?? client.licenses?.length ?? 0
  const active = client.active_licenses_count ?? 0

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <button
            type="button"
            onClick={() => onViewDetail?.(client)}
            className="font-semibold text-sm text-foreground hover:text-primary transition-colors text-left flex items-center gap-1.5 cursor-pointer"
          >
            <span className="truncate">{client.nama_pemilik}</span>
            <ChevronRight size={14} className="text-muted-foreground shrink-0" />
          </button>
          {client.nama_perusahaan && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 size={12} className="shrink-0" />
              <span className="truncate">{client.nama_perusahaan}</span>
            </div>
          )}
        </div>
        <Badge variant={total > 0 ? "secondary" : "outline"} className="text-[11px] shrink-0 font-mono gap-1">
          <KeyRound size={11} />
          <span>{total} Lisensi</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-1.5 pt-2 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 truncate">
          <Mail size={12} className="shrink-0" />
          <span className="truncate">{client.email}</span>
        </div>
        {client.telepon && (
          <div className="flex items-center gap-1.5">
            <Phone size={12} className="shrink-0" />
            <span>{client.telepon}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <span className="text-[11px] text-muted-foreground">
          {active > 0 ? `${active} lisensi aktif` : "Belum ada lisensi aktif"}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(client)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Edit Klien"
          >
            <Pencil size={13} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(client)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
            title="Hapus Klien"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>
    </div>
  )
}
