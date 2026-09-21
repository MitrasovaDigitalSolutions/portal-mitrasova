"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Layers, KeyRound, CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Product } from "../@types/product"

export interface ProductColumnActions {
  onViewDetail?: (product: Product) => void
}

export function getProductColumns(
  actions?: ProductColumnActions
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "code",
      header: "Kode Produk",
      size: 140,
      cell: ({ row }) => {
        const product = row.original
        return (
          <button
            type="button"
            onClick={() => actions?.onViewDetail?.(product)}
            className="flex items-center gap-2 cursor-pointer group text-left"
            title="Buka detail produk"
          >
            <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors whitespace-nowrap">
              {product.code}
            </span>
          </button>
        )
      },
    },
    {
      accessorKey: "nama",
      header: "Nama Produk",
      size: 360,
      cell: ({ row }) => {
        const product = row.original
        return (
          <TooltipProvider delayDuration={200}>
            <div className="space-y-0.5 max-w-[340px]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => actions?.onViewDetail?.(product)}
                    className="font-semibold text-xs text-foreground hover:text-primary hover:underline text-left cursor-pointer transition-colors block truncate max-w-full"
                  >
                    {product.nama}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-2.5 space-y-1">
                  <div className="font-bold text-xs text-white">
                    {product.nama}
                  </div>
                  {product.description && (
                    <div className="text-[11px] text-zinc-300 leading-relaxed">
                      {product.description}
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>

              {product.description ? (
                <div className="text-[11px] text-muted-foreground line-clamp-1 truncate">
                  {product.description}
                </div>
              ) : (
                <div className="text-[11px] text-muted-foreground/60 italic">
                  Tidak ada deskripsi
                </div>
              )}
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "addons_count",
      header: "Modul Addon",
      size: 140,
      cell: ({ row }) => {
        const product = row.original
        const count = product.addons_count ?? product.addons?.length ?? 0
        return (
          <button
            type="button"
            onClick={() => actions?.onViewDetail?.(product)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors cursor-pointer whitespace-nowrap"
            title="Buka detail produk dan kelola modul addon"
          >
            <Layers className="size-3.5 shrink-0" />
            <span>{count} Addon</span>
          </button>
        )
      },
    },
    {
      accessorKey: "licenses_count",
      header: "Lisensi Terhubung",
      size: 150,
      cell: ({ row }) => {
        const count = row.original.licenses_count ?? 0
        return (
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium whitespace-nowrap">
            <KeyRound className="size-3.5 text-muted-foreground/70 shrink-0" />
            <span>{count} Lisensi</span>
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
          <Badge variant="success" className="gap-1 whitespace-nowrap">
            <CheckCircle2 className="size-3" />
            Aktif
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-muted-foreground whitespace-nowrap">
            <XCircle className="size-3" />
            Non-Aktif
          </Badge>
        )
      },
    },
  ]
}
