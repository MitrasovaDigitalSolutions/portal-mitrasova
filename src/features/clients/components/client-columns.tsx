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
            <div className="flex max-w-[240px] items-center gap-2.5">
              <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary shadow-2xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => actions?.onViewDetail?.(client)}
                      className="block max-w-full cursor-pointer truncate text-left text-xs font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                    >
                      {client.nama_pemilik}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    <p className="font-semibold">{client.nama_pemilik}</p>
                    <p className="font-mono text-[11px] text-zinc-400">
                      {client.email}
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex items-center gap-1 truncate font-mono text-[11px] text-muted-foreground">
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
            <div className="max-w-[200px] space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Building2
                  size={12}
                  className="shrink-0 text-muted-foreground opacity-80"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block cursor-default truncate text-xs font-medium text-foreground">
                      {client.nama_perusahaan || "—"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    {client.nama_perusahaan || "—"}
                  </TooltipContent>
                </Tooltip>
              </div>
              {client.telepon && (
                <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
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
      enableSorting: false,
      size: 160,
      cell: ({ row }) => {
        const client = row.original
        const total = client.licenses_count ?? client.licenses?.length ?? 0
        const active = client.active_licenses_count ?? 0

        if (total === 0) {
          return (
            <Badge
              variant="outline"
              className="px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              Belum Ada
            </Badge>
          )
        }

        return (
          <div className="flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className="gap-1 px-2 py-0.5 font-mono text-[10px] font-medium"
            >
              <KeyRound size={11} className="text-muted-foreground" />
              <span>{total} Lisensi</span>
            </Badge>
            {active > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-700 dark:border-emerald-500/20 dark:text-emerald-400">
                <span className="size-1 rounded-full bg-emerald-500" />
                <span>{active} Aktif</span>
              </span>
            ) : (
              <span className="font-mono text-[9px] text-muted-foreground">
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
          return <span className="text-xs text-muted-foreground">—</span>
        }
        return (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="line-clamp-1 max-w-[200px] cursor-default truncate text-xs text-muted-foreground">
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
          return <span className="text-xs text-muted-foreground">—</span>
        }
        const formatted = new Date(dateStr).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        return (
          <span className="font-mono text-[11px] text-muted-foreground">
            {formatted}
          </span>
        )
      },
    },
  ]
}
