"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, Layers, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency } from "@/utils"
import type { ProductAddon } from "../@types/product"

export const addonColumns: ColumnDef<ProductAddon>[] = [
  {
    accessorKey: "code",
    header: "Kode Addon",
    size: 120,
    cell: ({ row }) => {
      const addon = row.original
      return (
        <span className="rounded-md border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 font-mono text-xs font-bold whitespace-nowrap text-sky-600 shadow-2xs dark:text-sky-400">
          {addon.code}
        </span>
      )
    },
  },
  {
    accessorKey: "nama",
    header: "Nama Modul Addon",
    size: 300,
    cell: ({ row }) => {
      const addon = row.original
      return (
        <TooltipProvider delayDuration={200}>
          <div className="flex max-w-[290px] items-center gap-2.5">
            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 shadow-2xs dark:text-sky-400">
              <Layers size={14} />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block cursor-default truncate text-xs font-semibold text-foreground">
                    {addon.nama}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  <p className="font-semibold">{addon.nama}</p>
                  {addon.description && (
                    <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                      {addon.description}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>

              {addon.description ? (
                <div className="truncate text-[11px] leading-tight text-muted-foreground">
                  {addon.description}
                </div>
              ) : (
                <div className="text-[11px] text-muted-foreground/60 italic">
                  Tanpa deskripsi tambahan
                </div>
              )}
            </div>
          </div>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: "harga_bulanan",
    header: "Harga Bulanan",
    size: 140,
    cell: ({ row }) => {
      const price = row.original.harga_bulanan
      return (
        <div className="font-mono text-xs font-semibold whitespace-nowrap text-foreground">
          {formatCurrency(price)}
          <span className="ml-1 text-[10px] font-normal text-muted-foreground">
            /bln
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "harga_tahunan",
    header: "Harga Tahunan",
    size: 140,
    cell: ({ row }) => {
      const price = row.original.harga_tahunan
      return (
        <div className="font-mono text-xs font-semibold whitespace-nowrap text-foreground">
          {formatCurrency(price)}
          <span className="ml-1 text-[10px] font-normal text-muted-foreground">
            /thn
          </span>
        </div>
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

/**
 * Backward compatibility helper for components requesting getAddonColumns
 */
export function getAddonColumns(): ColumnDef<ProductAddon>[] {
  return addonColumns
}
