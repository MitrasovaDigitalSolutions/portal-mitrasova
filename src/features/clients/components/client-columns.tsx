"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Building2, KeyRound, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Client } from "../@types/client"

export interface ClientColumnActions {
  onViewDetail?: (client: Client) => void
}

export function getClientColumns(
  actions?: ClientColumnActions
): ColumnDef<Client>[] {
  return [
    {
      accessorKey: "nama_pemilik",
      header: "Nama Pemilik / Kontak",
      size: 280,
      cell: ({ row }) => {
        const client = row.original
        const initials = client.nama_pemilik
          ? client.nama_pemilik.slice(0, 2).toUpperCase()
          : "CL"

        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-3 max-w-[260px]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                {initials}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => actions?.onViewDetail?.(client)}
                      className="font-semibold text-xs text-foreground hover:text-primary hover:underline text-left cursor-pointer transition-colors block truncate max-w-full"
                    >
                      {client.nama_pemilik}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    <p className="font-semibold">{client.nama_pemilik}</p>
                    <p className="text-zinc-400">{client.email}</p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                  <Mail size={11} className="shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
              </div>
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "nama_perusahaan",
      header: "Perusahaan / Instansi",
      size: 240,
      cell: ({ row }) => {
        const client = row.original
        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-2 max-w-[220px]">
              <Building2 size={13} className="shrink-0 text-muted-foreground" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs font-medium text-foreground truncate cursor-default">
                    {client.nama_perusahaan || "—"}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {client.nama_perusahaan || "—"}
                </TooltipContent>
              </Tooltip>
            </div>
            {client.telepon && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                <Phone size={11} className="shrink-0" />
                <span>{client.telepon}</span>
              </div>
            )}
          </TooltipProvider>
        )
      },
    },
    {
      id: "licenses",
      header: "Total Lisensi",
      size: 150,
      cell: ({ row }) => {
        const client = row.original
        const total =
          client.licenses_count ?? client.licenses?.length ?? 0
        const active = client.active_licenses_count ?? 0

        return (
          <div className="flex items-center gap-1.5">
            <Badge
              variant={total > 0 ? "secondary" : "outline"}
              className="text-[11px] gap-1 font-mono font-medium"
            >
              <KeyRound size={11} />
              <span>{total} Lisensi</span>
            </Badge>
            {active > 0 && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                ({active} Aktif)
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "alamat",
      header: "Alamat",
      size: 280,
      cell: ({ row }) => {
        const alamat = row.original.alamat
        if (!alamat) {
          return <span className="text-muted-foreground text-xs">—</span>
        }
        return (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-muted-foreground line-clamp-1 truncate max-w-[260px] cursor-default">
                  {alamat}
                </p>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm text-xs">
                {alamat}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Terdaftar",
      size: 140,
      cell: ({ row }) => {
        const dateStr = row.original.created_at
        if (!dateStr) {
          return <span className="text-muted-foreground text-xs">—</span>
        }
        const formatted = new Date(dateStr).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        return <span className="text-xs text-muted-foreground font-mono">{formatted}</span>
      },
    },
  ]
}
