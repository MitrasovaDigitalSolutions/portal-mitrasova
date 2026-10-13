"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  CheckCircle2,
  Cpu,
  HardDrive,
  MemoryStick,
  Server,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency } from "@/utils"
import type { ServerPackage } from "../@types/server-package"

export function getServerPackageColumns(): ColumnDef<ServerPackage>[] {
  return [
    {
      accessorKey: "code",
      header: "Kode Paket",
      size: 130,
      cell: ({ row }) => {
        const pkg = row.original
        return (
          <span className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold whitespace-nowrap text-primary shadow-2xs">
            {pkg.code}
          </span>
        )
      },
    },
    {
      accessorKey: "nama",
      header: "Nama Paket & Deskripsi",
      size: 320,
      cell: ({ row }) => {
        const pkg = row.original
        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex max-w-[310px] items-center gap-2.5">
              <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 shadow-2xs dark:text-indigo-400">
                <Server size={14} />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block max-w-full truncate text-xs font-semibold text-foreground">
                      {pkg.nama}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    <p className="font-semibold">{pkg.nama}</p>
                    {pkg.description && (
                      <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                        {pkg.description}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>

                {pkg.description ? (
                  <div className="truncate text-[11px] leading-tight text-muted-foreground">
                    {pkg.description}
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground/60 italic">
                    Tidak ada catatan tambahan
                  </div>
                )}
              </div>
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      id: "specs",
      header: "Spesifikasi Hardware",
      size: 260,
      cell: ({ row }) => {
        const { cpu, ram, storage } = row.original
        if (!cpu && !ram && !storage) {
          return <span className="text-xs text-muted-foreground italic">—</span>
        }
        return (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {cpu && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-foreground">
                <Cpu size={12} className="text-muted-foreground" />
                {cpu}
              </span>
            )}
            {ram && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-foreground">
                <MemoryStick size={12} className="text-muted-foreground" />
                {ram}
              </span>
            )}
            {storage && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-foreground">
                <HardDrive size={12} className="text-muted-foreground" />
                {storage}
              </span>
            )}
          </div>
        )
      },
    },
    {
      id: "pricing",
      header: "Biaya Sewa",
      size: 160,
      cell: ({ row }) => {
        const pkg = row.original
        const bulanan = Number(pkg.harga_bulanan) || 0
        const tahunan = Number(pkg.harga_tahunan) || 0

        return (
          <div className="space-y-0.5 text-xs">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[10px] text-muted-foreground">Bln:</span>
              <span className="font-semibold text-foreground">
                {bulanan > 0 ? formatCurrency(bulanan) : "Rp 0"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[10px] text-muted-foreground">Thn:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {tahunan > 0 ? formatCurrency(tahunan) : "Rp 0"}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "licenses_count",
      header: "Lisensi Aktif",
      size: 120,
      cell: ({ row }) => {
        const count = row.original.licenses_count ?? 0
        return (
          <Badge
            variant={count > 0 ? "secondary" : "outline"}
            className="gap-1 px-2 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap"
          >
            <span>{count} Lisensi</span>
          </Badge>
        )
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      size: 110,
      cell: ({ row }) => {
        const isActive = row.original.is_active
        return isActive ? (
          <Badge
            variant="success"
            className="gap-1 text-[10px] whitespace-nowrap"
          >
            <CheckCircle2 className="size-3" />
            Aktif
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] whitespace-nowrap text-muted-foreground"
          >
            <XCircle className="size-3" />
            Non-Aktif
          </Badge>
        )
      },
    },
  ]
}
