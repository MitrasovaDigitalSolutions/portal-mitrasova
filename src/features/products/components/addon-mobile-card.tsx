"use client"

import type React from "react"
import { Pencil, Trash2, CheckCircle2, XCircle, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils"
import type { ProductAddon } from "../@types/product"

export interface AddonMobileCardProps {
  addon: ProductAddon
  onEdit: (addon: ProductAddon) => void
  onDelete: (addon: ProductAddon) => void
}

export function AddonMobileCard({
  addon,
  onEdit,
  onDelete,
}: AddonMobileCardProps): React.JSX.Element {
  return (
    <div className="space-y-2.5 rounded-xl border border-border bg-card p-3 shadow-2xs transition-all hover:border-sky-500/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 shadow-2xs dark:text-sky-400">
            <Layers size={13} />
          </div>
          <span className="truncate font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
            {addon.code}
          </span>
        </div>

        {addon.is_active ? (
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
        <div className="truncate text-xs font-semibold text-foreground">
          {addon.nama}
        </div>
        {addon.description ? (
          <p className="line-clamp-1 text-[11px] leading-tight text-muted-foreground">
            {addon.description}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground/60 italic">
            Tanpa deskripsi tambahan
          </p>
        )}
      </div>

      {/* Pricing Row */}
      <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-2 font-mono text-xs">
        <div>
          <span className="block font-sans text-[10px] text-muted-foreground">
            Bulanan:
          </span>
          <span className="font-semibold text-foreground">
            {formatCurrency(addon.harga_bulanan)}
          </span>
        </div>
        <div>
          <span className="block font-sans text-[10px] text-muted-foreground">
            Tahunan:
          </span>
          <span className="font-semibold text-foreground">
            {formatCurrency(addon.harga_tahunan)}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-1 border-t border-border/60 pt-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(addon)}
          className="h-7 w-7 cursor-pointer rounded-lg p-0 text-muted-foreground hover:text-foreground"
          title="Edit Modul Addon"
        >
          <Pencil size={12} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(addon)}
          className="h-7 w-7 cursor-pointer rounded-lg p-0 text-muted-foreground hover:text-destructive"
          title="Hapus Modul Addon"
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  )
}
