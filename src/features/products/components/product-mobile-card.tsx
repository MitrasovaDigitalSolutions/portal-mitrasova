"use client"

import type React from "react"
import { Layers, Pencil, Trash2, KeyRound, CheckCircle2, XCircle, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDetail(product)}
          className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer text-left"
        >
          {product.code}
        </button>
        {product.is_active ? (
          <Badge variant="success" className="gap-1 text-[10px]">
            <CheckCircle2 className="size-3" />
            Aktif
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground">
            <XCircle className="size-3" />
            Non-Aktif
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onViewDetail(product)}
          className="font-semibold text-xs text-foreground hover:text-primary hover:underline text-left cursor-pointer transition-colors block"
        >
          {product.nama}
        </button>
        {product.description ? (
          <div className="text-[11px] text-muted-foreground line-clamp-2">
            {product.description}
          </div>
        ) : (
          <div className="text-[11px] text-muted-foreground/60 italic">
            Tidak ada deskripsi
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/60 pt-2.5">
        <button
          type="button"
          onClick={() => onViewDetail(product)}
          className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-medium hover:underline cursor-pointer"
        >
          <Layers className="size-3.5 shrink-0" />
          <span>{count} Addon</span>
        </button>
        <div className="inline-flex items-center gap-1.5">
          <KeyRound className="size-3.5 text-muted-foreground/70 shrink-0" />
          <span>{licensesCount} Lisensi</span>
        </div>
      </div>

      {/* Mobile Card Action Buttons */}
      <div className="flex items-center justify-end gap-1.5 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[11px] px-2 text-sky-600 dark:text-sky-400 border-sky-500/30 hover:bg-sky-500/10 cursor-pointer"
          onClick={() => onViewDetail(product)}
        >
          <ExternalLink className="size-3 mr-1" />
          Detail
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[11px] px-2 cursor-pointer"
          onClick={() => onEdit(product)}
        >
          <Pencil className="size-3 mr-1" />
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-7 text-[11px] px-2 cursor-pointer"
          onClick={() => onDelete(product)}
        >
          <Trash2 className="size-3 mr-1" />
          Hapus
        </Button>
      </div>
    </div>
  )
}
