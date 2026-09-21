"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, XCircle } from "lucide-react"
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
    size: 130,
    cell: ({ row }) => {
      const addon = row.original
      return (
        <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 whitespace-nowrap">
          {addon.code}
        </span>
      )
    },
  },
  {
    accessorKey: "nama",
    header: "Nama Modul Addon",
    size: 360,
    cell: ({ row }) => {
      const addon = row.original
      return (
        <TooltipProvider delayDuration={200}>
          <div className="space-y-0.5 max-w-[340px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-semibold text-xs text-foreground truncate block cursor-default">
                  {addon.nama}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs p-2.5 space-y-1">
                <div className="font-bold text-xs text-white">
                  {addon.nama}
                </div>
                {addon.description && (
                  <div className="text-[11px] text-zinc-300 leading-relaxed">
                    {addon.description}
                  </div>
                )}
              </TooltipContent>
            </Tooltip>

            {addon.description ? (
              <div className="text-[11px] text-muted-foreground line-clamp-1 truncate">
                {addon.description}
              </div>
            ) : (
              <div className="text-[11px] text-muted-foreground/60 italic">
                Tanpa deskripsi tambahan
              </div>
            )}
          </div>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: "harga_bulanan",
    header: "Harga Bulanan",
    size: 150,
    cell: ({ row }) => {
      const price = row.original.harga_bulanan
      return (
        <div className="font-mono text-xs font-semibold text-foreground whitespace-nowrap">
          {formatCurrency(price)}
          <span className="text-[10px] font-normal text-muted-foreground ml-1">
            /bln
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "harga_tahunan",
    header: "Harga Tahunan",
    size: 150,
    cell: ({ row }) => {
      const price = row.original.harga_tahunan
      return (
        <div className="font-mono text-xs font-semibold text-foreground whitespace-nowrap">
          {formatCurrency(price)}
          <span className="text-[10px] font-normal text-muted-foreground ml-1">
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
        <Badge variant="success" className="gap-1 text-[10px] whitespace-nowrap">
          <CheckCircle2 className="size-3" />
          Aktif
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
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
