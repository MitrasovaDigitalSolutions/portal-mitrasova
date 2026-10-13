"use client"

import type React from "react"
import {
  Layers,
  Pencil,
  Trash2,
  KeyRound,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Package,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils"
import type { Product } from "../@types/product"

export interface ProductMobileCardProps {
  product: Product
  onViewDetail: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductMobileCard({
  product,
  onViewDetail,
  onEdit,
  onDelete,
}: ProductMobileCardProps): React.JSX.Element {
  const count = product.addons_count ?? product.addons?.length ?? 0
  const licensesCount = product.licenses_count ?? 0

  return (
    <div className="space-y-2.5 rounded-xl border border-border bg-card p-3 shadow-2xs transition-all hover:border-primary/25">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-2xs">
            <Package size={13} />
          </div>
          <button
            type="button"
            onClick={() => onViewDetail(product)}
            className="cursor-pointer truncate font-mono text-xs font-bold text-primary hover:underline"
          >
            {product.code}
          </button>
        </div>

        {product.is_active ? (
          <Badge
            variant="success"
            className="shrink-0 gap-1 text-[10px] font-medium"
          >
            <CheckCircle2 className="size-2.5" />
            Aktif
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="shrink-0 gap-1 text-[10px] font-medium text-muted-foreground"
          >
            <XCircle className="size-2.5" />
            Non-Aktif
          </Badge>
        )}
      </div>

      {/* Name and Description */}
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => onViewDetail(product)}
          className="flex max-w-full cursor-pointer items-center gap-1 truncate text-left text-xs font-semibold text-foreground transition-colors hover:text-primary"
        >
          <span className="truncate">{product.nama}</span>
          <ChevronRight size={13} className="shrink-0 text-muted-foreground" />
        </button>
        {product.description ? (
          <p className="line-clamp-1 text-[11px] leading-tight text-muted-foreground">
            {product.description}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground/60 italic">
            Tidak ada deskripsi
          </p>
        )}
      </div>

      {/* Pricing Row */}
      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-2 py-1 font-mono text-[11px]">
        <span className="text-muted-foreground">
          Bln:{" "}
          <span className="font-semibold text-foreground">
            {product.harga_bulanan
              ? formatCurrency(product.harga_bulanan)
              : "Rp 0"}
          </span>
        </span>
        <span className="text-muted-foreground">
          Thn:{" "}
          <span className="font-semibold text-primary">
            {product.harga_tahunan
              ? formatCurrency(product.harga_tahunan)
              : "Rp 0"}
          </span>
        </span>
      </div>

      {/* Badges / Metrics Row */}
      <div className="flex items-center gap-2 border-t border-border/60 pt-1.5 text-[11px]">
        <button
          type="button"
          onClick={() => onViewDetail(product)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
        >
          <Layers size={11} />
          <span>{count} Addon</span>
        </button>

        <Badge
          variant={licensesCount > 0 ? "secondary" : "outline"}
          className="py-0.2 gap-1 px-1.5 font-mono text-[10px]"
        >
          <KeyRound size={10} />
          <span>{licensesCount} Lisensi</span>
        </Badge>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-1 border-t border-border/60 pt-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(product)}
          className="h-7 w-7 cursor-pointer rounded-lg p-0 text-muted-foreground hover:text-foreground"
          title="Edit Produk"
        >
          <Pencil size={12} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(product)}
          className="h-7 w-7 cursor-pointer rounded-lg p-0 text-muted-foreground hover:text-destructive"
          title="Hapus Produk"
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  )
}
