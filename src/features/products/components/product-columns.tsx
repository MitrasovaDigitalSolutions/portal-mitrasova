"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Layers, KeyRound, CheckCircle2, XCircle, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency } from "@/utils"
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
      size: 130,
      cell: ({ row }) => {
        const product = row.original
        return (
          <button
            type="button"
            onClick={() => actions?.onViewDetail?.(product)}
            className="group flex cursor-pointer items-center gap-2 text-left"
            title="Buka detail produk"
          >
            <span className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold whitespace-nowrap text-primary shadow-2xs transition-colors group-hover:bg-primary/20">
              {product.code}
            </span>
          </button>
        )
      },
    },
    {
      accessorKey: "nama",
      header: "Nama Produk",
      size: 300,
      cell: ({ row }) => {
        const product = row.original
        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex max-w-[290px] items-center gap-2.5">
              <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-2xs">
                <Package size={14} />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => actions?.onViewDetail?.(product)}
                      className="block max-w-full cursor-pointer truncate text-left text-xs font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                    >
                      {product.nama}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    <p className="font-semibold">{product.nama}</p>
                    {product.description && (
                      <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                        {product.description}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>

                {product.description ? (
                  <div className="truncate text-[11px] leading-tight text-muted-foreground">
                    {product.description}
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground/60 italic">
                    Tidak ada deskripsi
                  </div>
                )}
              </div>
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      id: "pricing",
      header: "Harga Pokok",
      enableSorting: false,
      size: 160,
      cell: ({ row }) => {
        const product = row.original
        const bulanan = Number(product.harga_bulanan) || 0
        const tahunan = Number(product.harga_tahunan) || 0

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
              <span className="font-semibold text-primary">
                {tahunan > 0 ? formatCurrency(tahunan) : "Rp 0"}
              </span>
            </div>
          </div>
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
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-sky-700 shadow-2xs transition-colors hover:bg-sky-500/20 dark:border-sky-500/20 dark:text-sky-400"
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
      size: 140,
      cell: ({ row }) => {
        const count = row.original.licenses_count ?? 0
        return (
          <Badge
            variant={count > 0 ? "secondary" : "outline"}
            className="gap-1 px-2 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap"
          >
            <KeyRound size={11} className="text-muted-foreground" />
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
