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
    <div className="rounded-xl border border-border bg-card p-3 shadow-2xs space-y-2.5 transition-all hover:border-primary/25">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onViewDetail?.(client)}
            className="font-semibold text-xs text-foreground hover:text-primary transition-colors text-left flex items-center gap-1 cursor-pointer truncate max-w-full"
          >
            <span className="truncate">{client.nama_pemilik}</span>
            <ChevronRight size={13} className="text-muted-foreground shrink-0" />
          </button>
          {client.nama_perusahaan && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Building2 size={11} className="shrink-0 opacity-70" />
              <span className="truncate">{client.nama_perusahaan}</span>
            </div>
          )}
        </div>

        <Badge
          variant={total > 0 ? "secondary" : "outline"}
          className="text-[10px] shrink-0 font-mono gap-1 px-1.5 py-0.2"
        >
          <KeyRound size={10} />
          <span>{total} Lisensi</span>
        </Badge>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1.5 border-t border-border/60 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5 truncate">
          <Mail size={11} className="shrink-0 opacity-70" />
          <span className="truncate font-mono">{client.email}</span>
        </div>
        {client.telepon && (
          <div className="flex items-center gap-1.5">
            <Phone size={11} className="shrink-0 opacity-70" />
            <span className="font-mono">{client.telepon}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1.5 border-t border-border/60">
        <span className="text-[10px] font-mono text-muted-foreground">
          {active > 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ● {active} lisensi aktif
            </span>
          ) : (
            "0 lisensi aktif"
          )}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(client)}
            className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            title="Edit Klien"
          >
            <Pencil size={12} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(client)}
            className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
            title="Hapus Klien"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
    </div>
  )
}
