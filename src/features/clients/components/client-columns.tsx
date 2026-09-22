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
      size: 260,
      cell: ({ row }) => {
        const client = row.original
        const initials = client.nama_pemilik
          ? client.nama_pemilik
              .trim()
              .split(/\s+/)
              .map((w) => w[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase()
          : "CL"

        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-2.5 max-w-[240px]">
              <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-[11px] border border-primary/20 shadow-2xs">
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
                    <p className="text-zinc-400 font-mono text-[11px]">{client.email}</p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono truncate">
                  <Mail size={11} className="shrink-0 opacity-70" />
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
      header: "Perusahaan / Kontak",
      size: 220,
      cell: ({ row }) => {
        const client = row.original
        return (
          <TooltipProvider delayDuration={200}>
            <div className="space-y-0.5 max-w-[200px]">
              <div className="flex items-center gap-1.5">
                <Building2 size={12} className="shrink-0 text-muted-foreground opacity-80" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs font-medium text-foreground truncate cursor-default block">
                      {client.nama_perusahaan || "—"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    {client.nama_perusahaan || "—"}
                  </TooltipContent>
                </Tooltip>
              </div>
              {client.telepon && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                  <Phone size={11} className="shrink-0 opacity-70" />
                  <span className="truncate">{client.telepon}</span>
                </div>
              )}
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      id: "licenses",
      header: "Lisensi",
      size: 160,
      cell: ({ row }) => {
        const client = row.original
        const total = client.licenses_count ?? client.licenses?.length ?? 0
        const active = client.active_licenses_count ?? 0

        if (total === 0) {
          return (
            <Badge
              variant="outline"
              className="text-[10px] font-mono text-muted-foreground px-2 py-0.5"
            >
              Belum Ada
            </Badge>
          )
        }

        return (
          <div className="flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className="text-[10px] gap-1 font-mono font-medium px-2 py-0.5"
            >
              <KeyRound size={11} className="text-muted-foreground" />
              <span>{total} Lisensi</span>
            </Badge>
            {active > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/20 font-mono">
                <span className="size-1 rounded-full bg-emerald-500" />
                <span>{active} Aktif</span>
              </span>
            ) : (
              <span className="text-[9px] text-muted-foreground font-mono">
                (0 Aktif)
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "alamat",
      header: "Alamat",
      size: 220,
      cell: ({ row }) => {
        const alamat = row.original.alamat
        if (!alamat) {
          return <span className="text-muted-foreground text-xs">—</span>
        }
        return (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-muted-foreground line-clamp-1 truncate max-w-[200px] cursor-default">
                  {alamat}
                </p>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
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
      size: 110,
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
        return <span className="text-[11px] text-muted-foreground font-mono">{formatted}</span>
      },
    },
  ]
}
